import { Router } from "express";
import { ExamModel } from "../models/Exam.js";
import { ExamAttemptModel } from "../models/ExamAttempt.js";
import { UserModel } from "../models/User.js";
import { NotificationModel } from "../models/Notification.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const pad = (n: number) => n.toString().padStart(2, "0");

function formatDateFr(d: Date) {
  return `${d.getUTCDate()} ${MONTHS_FR[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
function formatTimeFr(d: Date) {
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

function statusFromAttempt(
  attempt: { status?: string } | undefined,
): "completed" | "ongoing" | "upcoming" {
  if (!attempt) return "upcoming";
  if (attempt.status === "graded" || attempt.status === "submitted") return "completed";
  if (attempt.status === "in-progress") return "ongoing";
  return "upcoming";
}

function stripCorrectAnswers(questions: any[]) {
  return questions.map((q) => {
    const { correctOptionId, ...rest } = q;
    return rest;
  });
}

// ─── Dashboard ─────────────────────────────────────────────────────────────

router.get("/dashboard", async (req, res) => {
  const studentId = req.auth!.userId;

  const [exams, attempts, user] = await Promise.all([
    ExamModel.find({ enrolledStudents: studentId })
      .sort({ scheduledAt: 1 })
      .lean(),
    ExamAttemptModel.find({ studentId }).lean(),
    UserModel.findById(studentId).lean(),
  ]);
  if (!user) return res.status(404).json({ error: "user not found" });

  const attemptByExam = new Map(attempts.map((a) => [String(a.examId), a]));

  const enriched = exams.map((exam) => {
    const attempt = attemptByExam.get(String(exam._id));
    const date = exam.scheduledAt ? new Date(exam.scheduledAt) : null;
    const status = statusFromAttempt(attempt);
    const questionTypes = Array.from(
      new Set((exam.questions ?? []).map((q: any) => q.type)),
    );
    return {
      id: String(exam._id),
      title: exam.title,
      subject: exam.subject,
      status,
      date: date ? formatDateFr(date) : "",
      time: date ? formatTimeFr(date) : "",
      duration: exam.durationMinutes,
      types: questionTypes,
      attemptId: attempt ? String(attempt._id) : null,
      ...(attempt?.score != null
        ? { score: attempt.score, maxScore: attempt.maxScore }
        : {}),
    };
  });

  const completedAttempts = attempts.filter(
    (a) => a.status === "graded" || a.status === "submitted",
  );
  const scoredAttempts = completedAttempts.filter((a) => a.score != null);
  const avgScore =
    scoredAttempts.length > 0
      ? scoredAttempts.reduce((sum, a) => sum + (a.score ?? 0), 0) /
        scoredAttempts.length
      : 0;
  const upcomingCount = enriched.filter((e) => e.status === "upcoming").length;
  const validatedCount = scoredAttempts.filter((a) => (a.score ?? 0) >= 10).length;

  const stats = [
    { label: "Examens à venir", value: String(upcomingCount), change: "" },
    { label: "Examens complétés", value: String(completedAttempts.length), change: "" },
    {
      label: "Note moyenne",
      value: scoredAttempts.length ? `${avgScore.toFixed(1)}/20` : "—",
      change: "",
    },
    { label: "Validations", value: String(validatedCount), change: "" },
  ];

  const calendarEvents = enriched
    .filter((e) => e.date)
    .map((e) => {
      const date = new Date(exams.find((x) => String(x._id) === e.id)!.scheduledAt!);
      return {
        id: e.id,
        title: e.title,
        date: String(date.getUTCDate()),
        month: MONTHS_FR[date.getUTCMonth()],
        time: e.time,
        status: e.status,
      };
    });

  const nameParts = (user.fullName ?? "").trim().split(/\s+/);
  res.json({
    user: {
      id: String(user._id),
      email: user.email,
      fullName: user.fullName,
      firstName: nameParts[0] ?? "",
      lastName: nameParts.slice(1).join(" "),
      department: user.department,
      school: user.school,
      program: user.program,
    },
    stats,
    exams: enriched,
    calendarEvents,
  });
});

// ─── Détail d'un examen (pour l'interface de passage) ──────────────────────

router.get("/exams/:id", async (req, res) => {
  const studentId = req.auth!.userId;
  const exam = await ExamModel.findOne({
    _id: req.params.id,
    enrolledStudents: studentId,
  }).lean();
  if (!exam) return res.status(404).json({ error: "exam not found" });
  res.json({
    exam: {
      id: String(exam._id),
      title: exam.title,
      subject: exam.subject,
      description: exam.description,
      durationMinutes: exam.durationMinutes,
      totalPoints: exam.totalPoints,
      questions: stripCorrectAnswers(exam.questions ?? []),
    },
  });
});

// ─── Rejoindre un examen par code ──────────────────────────────────────────

router.post("/exams/join", async (req, res) => {
  const studentId = req.auth!.userId;
  const code = String(req.body?.code ?? "").trim().toUpperCase();
  if (!code) return res.status(400).json({ error: "code required" });

  const exam = await ExamModel.findOne({ joinCode: code });
  if (!exam) return res.status(404).json({ error: "invalid code" });

  const already = exam.enrolledStudents.some((id) => String(id) === studentId);
  if (!already) {
    exam.enrolledStudents.push(studentId as any);
    await exam.save();
  }

  res.json({
    exam: {
      id: String(exam._id),
      title: exam.title,
      subject: exam.subject,
    },
    alreadyEnrolled: already,
  });
});

// ─── Démarrer / reprendre un attempt ───────────────────────────────────────

router.post("/exams/:id/start", async (req, res) => {
  const studentId = req.auth!.userId;
  const exam = await ExamModel.findOne({
    _id: req.params.id,
    enrolledStudents: studentId,
  });
  if (!exam) return res.status(404).json({ error: "exam not found" });

  let attempt = await ExamAttemptModel.findOne({ examId: exam._id, studentId });
  if (!attempt) {
    attempt = await ExamAttemptModel.create({
      examId: exam._id,
      studentId,
      status: "in-progress",
      startedAt: new Date(),
      maxScore: exam.totalPoints,
      answers: [],
      antiCheatEvents: [],
    });
  } else if (attempt.status !== "in-progress") {
    return res.status(409).json({ error: "exam already submitted" });
  }

  const elapsedMs = Date.now() - new Date(attempt.startedAt).getTime();
  const remainingSeconds = Math.max(
    0,
    exam.durationMinutes * 60 - Math.floor(elapsedMs / 1000),
  );

  res.json({
    attempt: {
      id: String(attempt._id),
      examId: String(exam._id),
      status: attempt.status,
      startedAt: attempt.startedAt,
      remainingSeconds,
      answers: attempt.answers,
    },
    exam: {
      id: String(exam._id),
      title: exam.title,
      subject: exam.subject,
      durationMinutes: exam.durationMinutes,
      totalPoints: exam.totalPoints,
      questions: stripCorrectAnswers(exam.questions ?? []),
    },
  });
});

// ─── Autosave des réponses ─────────────────────────────────────────────────

router.patch("/attempts/:id", async (req, res) => {
  const studentId = req.auth!.userId;
  const attempt = await ExamAttemptModel.findOne({ _id: req.params.id, studentId });
  if (!attempt) return res.status(404).json({ error: "attempt not found" });
  if (attempt.status !== "in-progress") {
    return res.status(409).json({ error: "attempt already submitted" });
  }
  const answers = Array.isArray(req.body?.answers) ? req.body.answers : null;
  if (!answers) return res.status(400).json({ error: "answers array required" });

  attempt.answers = answers;
  await attempt.save();
  res.json({ ok: true, savedAt: new Date() });
});

// ─── Évènement anti-triche ─────────────────────────────────────────────────

router.post("/attempts/:id/anti-cheat", async (req, res) => {
  const studentId = req.auth!.userId;
  const attempt = await ExamAttemptModel.findOne({ _id: req.params.id, studentId });
  if (!attempt) return res.status(404).json({ error: "attempt not found" });
  if (attempt.status !== "in-progress") return res.status(409).json({ error: "closed" });

  const type = String(req.body?.type ?? "").trim();
  if (!type) return res.status(400).json({ error: "type required" });

  attempt.antiCheatEvents.push({
    type,
    timestamp: new Date(),
    details: req.body?.details,
  } as any);
  await attempt.save();
  res.json({ ok: true, count: attempt.antiCheatEvents.length });
});

// ─── Soumission ────────────────────────────────────────────────────────────

router.post("/attempts/:id/submit", async (req, res) => {
  const studentId = req.auth!.userId;
  const attempt = await ExamAttemptModel.findOne({ _id: req.params.id, studentId });
  if (!attempt) return res.status(404).json({ error: "attempt not found" });
  if (attempt.status !== "in-progress") {
    return res.status(409).json({ error: "attempt already submitted" });
  }

  const exam = await ExamModel.findById(attempt.examId).lean();
  if (!exam) return res.status(404).json({ error: "exam not found" });

  if (Array.isArray(req.body?.answers)) {
    attempt.answers = req.body.answers;
  }

  // Auto-correction MCQ uniquement
  const answerByQuestion = new Map<number, any>(
    (attempt.answers ?? []).map((a: any) => [a.questionId, a.value]),
  );
  let mcqScore = 0;
  let mcqMax = 0;
  let hasOpenQuestions = false;
  for (const q of exam.questions ?? []) {
    if (q.type === "mcq") {
      mcqMax += q.points;
      if (answerByQuestion.get(q.id) === (q as any).correctOptionId) {
        mcqScore += q.points;
      }
    } else {
      hasOpenQuestions = true;
    }
  }

  attempt.submittedAt = new Date();
  attempt.status = hasOpenQuestions ? "submitted" : "graded";
  attempt.score = mcqScore;
  attempt.maxScore = exam.totalPoints;
  await attempt.save();

  // Notification "examen terminé"
  await NotificationModel.create({
    userId: studentId,
    type: hasOpenQuestions ? "exam-submitted" : "exam-graded",
    title: hasOpenQuestions ? "Examen soumis" : "Examen corrigé",
    message: hasOpenQuestions
      ? `${exam.title} : en attente de correction par le professeur.`
      : `${exam.title} : ${mcqScore}/${exam.totalPoints}`,
  });

  res.json({
    attempt: {
      id: String(attempt._id),
      status: attempt.status,
      score: attempt.score,
      maxScore: attempt.maxScore,
      submittedAt: attempt.submittedAt,
    },
  });
});

// ─── Détail d'un résultat ──────────────────────────────────────────────────

router.get("/attempts/:id", async (req, res) => {
  const studentId = req.auth!.userId;
  const attempt = await ExamAttemptModel.findOne({
    _id: req.params.id,
    studentId,
  }).lean();
  if (!attempt) return res.status(404).json({ error: "attempt not found" });

  const exam = await ExamModel.findById(attempt.examId).lean();
  if (!exam) return res.status(404).json({ error: "exam not found" });

  const answerByQuestion = new Map<number, any>(
    (attempt.answers ?? []).map((a: any) => [a.questionId, a.value]),
  );

  const questions = (exam.questions ?? []).map((q: any) => {
    const yourAnswer = answerByQuestion.get(q.id);
    let isCorrect: boolean | null = null;
    if (q.type === "mcq" && attempt.status !== "in-progress") {
      isCorrect = yourAnswer === q.correctOptionId;
    }
    const { correctOptionId, ...safeQ } = q;
    return {
      ...safeQ,
      yourAnswer,
      isCorrect,
      // Pour les MCQ on révèle la bonne réponse une fois soumis
      correctOptionId: attempt.status === "in-progress" ? undefined : correctOptionId,
    };
  });

  res.json({
    attempt: {
      id: String(attempt._id),
      status: attempt.status,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      score: attempt.score,
      maxScore: attempt.maxScore,
      antiCheatEventsCount: attempt.antiCheatEvents?.length ?? 0,
    },
    exam: {
      id: String(exam._id),
      title: exam.title,
      subject: exam.subject,
      durationMinutes: exam.durationMinutes,
      totalPoints: exam.totalPoints,
    },
    questions,
  });
});

// ─── Notifications ─────────────────────────────────────────────────────────

router.get("/notifications", async (req, res) => {
  const userId = req.auth!.userId;
  const items = await NotificationModel.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  res.json({
    notifications: items.map((n) => ({
      id: String(n._id),
      type: n.type,
      title: n.title,
      message: n.message,
      read: n.read,
      createdAt: n.createdAt,
    })),
    unreadCount: items.filter((n) => !n.read).length,
  });
});

router.patch("/notifications/:id/read", async (req, res) => {
  const userId = req.auth!.userId;
  const n = await NotificationModel.findOneAndUpdate(
    { _id: req.params.id, userId },
    { read: true },
    { new: true },
  );
  if (!n) return res.status(404).json({ error: "notification not found" });
  res.json({ ok: true });
});

export default router;
