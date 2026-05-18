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

/** Formate une date au format "28 Mars 2026". */
function formatDateFr(d: Date) {
  return `${d.getUTCDate()} ${MONTHS_FR[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
/** Formate une heure au format "10:00". */
function formatTimeFr(d: Date) {
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

/** Dérive le statut affiché à l'étudiant (à venir / en cours / terminé) depuis la tentative. */
function statusFromAttempt(
  attempt: { status?: string } | undefined,
): "completed" | "ongoing" | "upcoming" {
  if (!attempt) return "upcoming";
  if (attempt.status === "graded" || attempt.status === "submitted") return "completed";
  if (attempt.status === "in-progress") return "ongoing";
  return "upcoming";
}

/** Supprime les bonnes réponses MCQ avant envoi à l'étudiant. */
function stripCorrectAnswers(questions: any[]) {
  return questions.map((q) => {
    const { correctOptionId, correctOptionIds, ...rest } = q;
    return rest;
  });
}

/** Mélange un tableau en place (algorithme de Fisher-Yates). */
function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Tri MCQ multi : compare deux ensembles d'options sans tenir compte de l'ordre. */
function sameOptionSet(a: unknown, b: unknown): boolean {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  const sa = [...a].map(String).sort();
  const sb = [...b].map(String).sort();
  return sa.every((v, i) => v === sb[i]);
}

/** Auto-correction MCQ : retourne le score gagné et indique s'il reste des questions ouvertes. */
function autoGrade(
  questions: any[],
  answersById: Map<number, any>,
): { score: number; hasOpen: boolean } {
  let score = 0;
  let hasOpen = false;
  for (const q of questions) {
    if (q.type !== "mcq") {
      hasOpen = true;
      continue;
    }
    const given = answersById.get(q.id);
    if (q.multiple && Array.isArray(q.correctOptionIds)) {
      if (sameOptionSet(given, q.correctOptionIds)) score += q.points;
    } else if (given === q.correctOptionId) {
      score += q.points;
    }
  }
  return { score, hasOpen };
}

/** Finalise une tentative : auto-corrige les MCQ, écrit le score, crée la notification. */
async function finalizeAttempt(
  attempt: any,
  exam: any,
  options: { autoSubmitted?: boolean } = {},
) {
  const answersById = new Map<number, any>(
    (attempt.answers ?? []).map((a: any) => [a.questionId, a.value]),
  );
  const { score, hasOpen } = autoGrade(exam.questions ?? [], answersById);

  attempt.submittedAt = new Date();
  attempt.status = hasOpen ? "submitted" : "graded";
  attempt.score = score;
  attempt.maxScore = exam.totalPoints;
  if (options.autoSubmitted) attempt.autoSubmitted = true;
  await attempt.save();

  await NotificationModel.create({
    userId: attempt.studentId,
    type: hasOpen ? "exam-submitted" : "exam-graded",
    title: options.autoSubmitted
      ? "Temps écoulé — examen soumis"
      : hasOpen
        ? "Examen soumis"
        : "Examen corrigé",
    message: hasOpen
      ? `${exam.title} : en attente de correction par le professeur.`
      : `${exam.title} : ${score}/${exam.totalPoints}`,
  });

  return { score, hasOpen };
}

/** Soumet automatiquement une tentative dont la durée est dépassée. */
async function autoSubmitIfExpired(attempt: any, exam: any): Promise<boolean> {
  if (attempt.status !== "in-progress") return false;
  const elapsed = Date.now() - new Date(attempt.startedAt).getTime();
  const durationMs = exam.durationMinutes * 60 * 1000;
  if (elapsed >= durationMs) {
    await finalizeAttempt(attempt, exam, { autoSubmitted: true });
    return true;
  }
  return false;
}

/** Indique si un examen peut être démarré (statut + heure planifiée). */
function isExamLaunchable(exam: any): { ok: boolean; reason?: string } {
  const status = exam.status;
  if (status === "draft") return { ok: false, reason: "exam not published" };
  if (status === "archived") return { ok: false, reason: "exam archived" };
  if (status === "completed") return { ok: false, reason: "exam closed" };
  // scheduled vs live : autoriser dès l'heure planifiée
  if (exam.scheduledAt && new Date(exam.scheduledAt).getTime() > Date.now()) {
    return { ok: false, reason: "exam not started yet" };
  }
  return { ok: true };
}

// ─── Dashboard ─────────────────────────────────────────────────────────────

// GET /dashboard : renvoie en un seul appel utilisateur, stats, examens et calendrier.
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
    // L'étudiant peut démarrer si l'examen est lançable et qu'il n'a pas déjà rendu sa copie.
    const attemptDone =
      attempt?.status === "submitted" || attempt?.status === "graded";
    const canStart = !attemptDone && isExamLaunchable(exam).ok;
    return {
      id: String(exam._id),
      title: exam.title,
      subject: exam.subject,
      status,
      examStatus: exam.status,
      canStart,
      date: date ? formatDateFr(date) : "",
      time: date ? formatTimeFr(date) : "",
      duration: exam.durationMinutes,
      types: questionTypes,
      attemptId: attempt ? String(attempt._id) : null,
      passingScore: exam.passingScore ?? 12,
      ...(attempt?.score != null
        ? { score: attempt.score, maxScore: attempt.maxScore }
        : {}),
    };
  });

  const completedAttempts = attempts.filter(
    (a) => a.status === "graded" || a.status === "submitted",
  );
  const scoredAttempts = completedAttempts.filter((a) => a.score != null);

  // Moyenne normalisée sur 20 : chaque examen pèse pareil quel que soit son barème.
  const normalizedScores = scoredAttempts.map((a) => {
    const max = a.maxScore ?? 0;
    if (max <= 0) return a.score ?? 0;
    return ((a.score ?? 0) / max) * 20;
  });
  const avgOutOf20 =
    normalizedScores.length > 0
      ? normalizedScores.reduce((s, n) => s + n, 0) / normalizedScores.length
      : 0;

  const upcomingCount = enriched.filter((e) => e.status === "upcoming").length;
  const validatedCount = normalizedScores.filter((n) => n >= 10).length;

  const stats = [
    { label: "Examens à venir", value: String(upcomingCount), change: "" },
    { label: "Examens complétés", value: String(completedAttempts.length), change: "" },
    {
      label: "Note moyenne",
      value: normalizedScores.length ? `${avgOutOf20.toFixed(1)}/20` : "—",
      change: "",
    },
    { label: "Validations", value: String(validatedCount), change: "" },
  ];

  // Données dédiées au ScoreRing côté front.
  const performance = {
    averageScore: normalizedScores.length ? Number(avgOutOf20.toFixed(1)) : null,
    completedCount: completedAttempts.length,
    validatedCount,
  };

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
      phone: user.phone,
    },
    stats,
    performance,
    exams: enriched,
    calendarEvents,
  });
});

// ─── Détail d'un examen (lecture seule, hors session) ──────────────────────

// GET /exams/:id : détail lecture seule d'un examen (hors session de passage).
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
      passingScore: exam.passingScore,
      status: exam.status,
      scheduledAt: exam.scheduledAt,
      rules: exam.rules,
      questions: stripCorrectAnswers(exam.questions ?? []),
    },
  });
});

// ─── Rejoindre un examen par code ──────────────────────────────────────────

// POST /exams/join : inscrit l'étudiant à un examen via son code de partage.
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

// POST /exams/:id/start : crée ou reprend la tentative de l'étudiant.
router.post("/exams/:id/start", async (req, res) => {
  const studentId = req.auth!.userId;
  const exam = await ExamModel.findOne({
    _id: req.params.id,
    enrolledStudents: studentId,
  });
  if (!exam) return res.status(404).json({ error: "exam not found" });

  const launchable = isExamLaunchable(exam);

  let attempt = await ExamAttemptModel.findOne({ examId: exam._id, studentId });

  if (!attempt) {
    // Création initiale — refuse si l'examen n'est pas lançable
    if (!launchable.ok) return res.status(409).json({ error: launchable.reason });

    // Ordre des questions (shuffle si activé)
    const ids = (exam.questions ?? []).map((q: any) => q.id);
    const order = exam.rules?.shuffleQuestions ? shuffleInPlace([...ids]) : ids;

    attempt = await ExamAttemptModel.create({
      examId: exam._id,
      studentId,
      status: "in-progress",
      startedAt: new Date(),
      maxScore: exam.totalPoints,
      answers: [],
      antiCheatEvents: [],
      questionOrder: order,
    });
  } else if (attempt.status !== "in-progress") {
    return res.status(409).json({ error: "exam already submitted" });
  } else {
    // Reprise : auto-submit si déjà expiré
    const expired = await autoSubmitIfExpired(attempt, exam.toObject());
    if (expired) return res.status(409).json({ error: "time expired" });
  }

  // Réordonne les questions selon l'ordre persisté
  const byId = new Map<number, any>(
    (exam.questions ?? []).map((q: any) => [q.id, q]),
  );
  const orderedQuestions = (attempt.questionOrder ?? [])
    .map((id) => byId.get(id))
    .filter(Boolean);
  // Fallback si l'ordre est vide ou questions ajoutées depuis
  const finalQuestions =
    orderedQuestions.length === (exam.questions ?? []).length
      ? orderedQuestions
      : exam.questions ?? [];

  // Shuffle des options MCQ (en mémoire seulement, non persisté côté étudiant
  // pour rester simple — le mapping est stable car les ids d'options sont stockés
  // dans la réponse).
  const renderQuestions = finalQuestions.map((q: any) => {
    const { correctOptionId, correctOptionIds, ...rest } = q;
    if (q.type === "mcq" && exam.rules?.shuffleOptions && Array.isArray(rest.options)) {
      return { ...rest, options: shuffleInPlace([...rest.options]) };
    }
    return rest;
  });

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
      passingScore: exam.passingScore,
      rules: exam.rules,
      questions: renderQuestions,
    },
  });
});

// ─── Autosave des réponses ─────────────────────────────────────────────────

// PATCH /attempts/:id : sauvegarde automatique des réponses en cours.
router.patch("/attempts/:id", async (req, res) => {
  const studentId = req.auth!.userId;
  const attempt = await ExamAttemptModel.findOne({ _id: req.params.id, studentId });
  if (!attempt) return res.status(404).json({ error: "attempt not found" });
  if (attempt.status !== "in-progress") {
    return res.status(409).json({ error: "attempt already submitted" });
  }

  // Vérifie l'expiration : si oui, on finalise et on refuse la sauvegarde.
  const exam = await ExamModel.findById(attempt.examId).lean();
  if (exam) {
    const expired = await autoSubmitIfExpired(attempt, exam);
    if (expired) return res.status(409).json({ error: "time expired" });
  }

  const answers = Array.isArray(req.body?.answers) ? req.body.answers : null;
  if (!answers) return res.status(400).json({ error: "answers array required" });

  attempt.answers = answers;
  await attempt.save();
  res.json({ ok: true, savedAt: new Date() });
});

// ─── Évènement anti-triche ─────────────────────────────────────────────────

// POST /attempts/:id/anti-cheat : journalise un évènement suspect (plein écran, blur…).
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

// POST /attempts/:id/submit : soumission finale + auto-correction MCQ.
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

  await finalizeAttempt(attempt, exam);

  res.json({
    attempt: {
      id: String(attempt._id),
      status: attempt.status,
      score: attempt.score,
      maxScore: attempt.maxScore,
      passingScore: exam.passingScore,
      passed: (attempt.score ?? 0) >= (exam.passingScore ?? 0),
      submittedAt: attempt.submittedAt,
    },
  });
});

// ─── Détail d'un résultat ──────────────────────────────────────────────────

// GET /attempts/:id : détail d'un résultat (score, validation, breakdown par question).
router.get("/attempts/:id", async (req, res) => {
  const studentId = req.auth!.userId;
  const attempt = await ExamAttemptModel.findOne({
    _id: req.params.id,
    studentId,
  });
  if (!attempt) return res.status(404).json({ error: "attempt not found" });

  const exam = await ExamModel.findById(attempt.examId).lean();
  if (!exam) return res.status(404).json({ error: "exam not found" });

  // Auto-submit silencieux si l'attempt est expiré (on lit puis renvoie l'état final)
  await autoSubmitIfExpired(attempt, exam);

  const attemptLean = attempt.toObject();

  const answerByQuestion = new Map<number, any>(
    (attemptLean.answers ?? []).map((a: any) => [a.questionId, a.value]),
  );

  const questions = (exam.questions ?? []).map((q: any) => {
    const yourAnswer = answerByQuestion.get(q.id);
    let isCorrect: boolean | null = null;
    if (q.type === "mcq" && attemptLean.status !== "in-progress") {
      if (q.multiple && Array.isArray(q.correctOptionIds)) {
        isCorrect = sameOptionSet(yourAnswer, q.correctOptionIds);
      } else {
        isCorrect = yourAnswer === q.correctOptionId;
      }
    }
    const { correctOptionId, correctOptionIds, ...safeQ } = q;
    return {
      ...safeQ,
      yourAnswer,
      isCorrect,
      // Pour les MCQ, on révèle la / les bonne(s) réponse(s) une fois soumis
      correctOptionId: attemptLean.status === "in-progress" ? undefined : correctOptionId,
      correctOptionIds: attemptLean.status === "in-progress" ? undefined : correctOptionIds,
    };
  });

  res.json({
    attempt: {
      id: String(attemptLean._id),
      status: attemptLean.status,
      startedAt: attemptLean.startedAt,
      submittedAt: attemptLean.submittedAt,
      score: attemptLean.score,
      maxScore: attemptLean.maxScore,
      passingScore: exam.passingScore,
      passed:
        attemptLean.status !== "in-progress" && attemptLean.score != null
          ? attemptLean.score >= (exam.passingScore ?? 0)
          : null,
      autoSubmitted: attemptLean.autoSubmitted ?? false,
      antiCheatEventsCount: attemptLean.antiCheatEvents?.length ?? 0,
    },
    exam: {
      id: String(exam._id),
      title: exam.title,
      subject: exam.subject,
      durationMinutes: exam.durationMinutes,
      totalPoints: exam.totalPoints,
      passingScore: exam.passingScore,
    },
    questions,
  });
});

// ─── Notifications ─────────────────────────────────────────────────────────

// GET /notifications : 50 dernières notifications de l'utilisateur + nombre non lues.
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

// PATCH /notifications/:id/read : marque une notification comme lue.
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
