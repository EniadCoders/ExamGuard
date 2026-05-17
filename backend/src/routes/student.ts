import { Router } from "express";
import { ExamModel } from "../models/Exam.js";
import { ExamAttemptModel } from "../models/ExamAttempt.js";
import { UserModel } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

router.get("/dashboard", async (req, res) => {
  const studentId = req.auth!.userId;

  const [exams, attempts, user] = await Promise.all([
    ExamModel.find({}).sort({ scheduledAt: 1 }).lean(),
    ExamAttemptModel.find({ studentId }).lean(),
    UserModel.findById(studentId).lean(),
  ]);
  if (!user) return res.status(404).json({ error: "user not found" });
  const attemptByExam = new Map(
    attempts.map((a) => [String(a.examId), a]),
  );

  const enriched = exams.map((exam) => {
    const attempt = attemptByExam.get(String(exam._id));
    const date = exam.scheduledAt ? new Date(exam.scheduledAt) : null;
    const status: "completed" | "ongoing" | "upcoming" =
      attempt?.status === "graded" || attempt?.status === "submitted"
        ? "completed"
        : attempt?.status === "in-progress"
          ? "ongoing"
          : "upcoming";

    const questionTypes = Array.from(
      new Set((exam.questions ?? []).map((q: any) => q.type)),
    );

    return {
      id: String(exam._id),
      title: exam.title,
      subject: exam.subject,
      status,
      date: date ? `${date.getUTCDate()} ${MONTHS_FR[date.getUTCMonth()]} ${date.getUTCFullYear()}` : "",
      time: date ? `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}` : "",
      duration: exam.durationMinutes,
      types: questionTypes,
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
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ");

  res.json({
    user: {
      id: String(user._id),
      email: user.email,
      fullName: user.fullName,
      firstName,
      lastName,
      department: user.department,
      school: user.school,
      program: user.program,
    },
    stats,
    exams: enriched,
    calendarEvents,
  });
});

router.get("/exams/:id", async (req, res) => {
  const exam = await ExamModel.findById(req.params.id).lean();
  if (!exam) return res.status(404).json({ error: "exam not found" });
  // Hide correctOptionId from the student view.
  const safeQuestions = (exam.questions ?? []).map((q: any) => {
    const { correctOptionId, ...rest } = q;
    return rest;
  });
  res.json({
    exam: {
      id: String(exam._id),
      title: exam.title,
      subject: exam.subject,
      description: exam.description,
      durationMinutes: exam.durationMinutes,
      totalPoints: exam.totalPoints,
      questions: safeQuestions,
    },
  });
});

export default router;
