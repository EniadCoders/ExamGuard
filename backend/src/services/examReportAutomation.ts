import { ExamAttemptModel } from "../models/ExamAttempt.js";
import { ExamModel } from "../models/Exam.js";
import { UserModel } from "../models/User.js";

type ReportStudent = {
  name: string;
  email: string;
  status: "submitted" | "absent";
  score: number | null;
  passed: boolean;
  submittedAt: string | null;
  fraudAlerts: number;
};

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function normalizeScore(score: unknown): number | null {
  const value = Number(score);
  return Number.isFinite(value) ? round1(value) : null;
}

async function postWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export async function sendCompletedExamReport(examId: unknown): Promise<void> {
  const webhookUrl = process.env.N8N_EXAM_REPORT_WEBHOOK_URL;
  const secret = process.env.N8N_EXAM_REPORT_SECRET;
  if (!webhookUrl || !secret) {
    console.warn("[n8n] exam report webhook is not configured; skipping report automation");
    return;
  }

  const exam = await ExamModel.findById(examId).lean();
  if (!exam) throw new Error("exam not found for report automation");

  const [teacher, enrolledStudents, attempts] = await Promise.all([
    UserModel.findById(exam.createdBy).lean(),
    UserModel.find({ _id: { $in: exam.enrolledStudents ?? [] } }).lean(),
    ExamAttemptModel.find({ examId: exam._id }).lean(),
  ]);

  const enrolledStudentIds = new Set(enrolledStudents.map((student) => String(student._id)));
  const relevantAttempts = attempts.filter((attempt) => enrolledStudentIds.has(String(attempt.studentId)));
  const attemptByStudentId = new Map(
    relevantAttempts.map((attempt) => [String(attempt.studentId), attempt]),
  );
  const submittedAttempts = relevantAttempts.filter((attempt) => !!attempt.submittedAt);
  const fraudAlertsCount = relevantAttempts.reduce(
    (sum, attempt) => sum + (attempt.antiCheatEvents?.length ?? 0),
    0,
  );
  const scores = submittedAttempts
    .map((attempt) => normalizeScore(attempt.score))
    .filter((score): score is number => score !== null);
  const passingScore = Number(exam.passingScore ?? 12);
  const passedCount = scores.filter((score) => score >= passingScore).length;

  const students: ReportStudent[] = enrolledStudents.map((student) => {
    const attempt = attemptByStudentId.get(String(student._id));
    const score = normalizeScore(attempt?.score);
    const submittedAt = attempt?.submittedAt ? new Date(attempt.submittedAt).toISOString() : null;
    return {
      name: student.fullName,
      email: student.email,
      status: submittedAt ? "submitted" : "absent",
      score,
      passed: score !== null && score >= passingScore,
      submittedAt,
      fraudAlerts: attempt?.antiCheatEvents?.length ?? 0,
    };
  });

  const payload = {
    event: "exam.completed",
    exam: {
      id: String(exam._id),
      title: exam.title,
      subject: exam.subject,
      completedAt: new Date().toISOString(),
      passingScore,
    },
    teacher: {
      name: teacher?.fullName ?? "Professeur",
      email: teacher?.email ?? "",
    },
    summary: {
      registeredStudents: enrolledStudents.length,
      submittedCount: submittedAttempts.length,
      absentCount: Math.max(0, enrolledStudents.length - submittedAttempts.length),
      averageScore: scores.length ? round1(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0,
      successRate: scores.length ? Math.round((passedCount / scores.length) * 100) : 0,
      fraudAlertsCount,
    },
    students,
  };

  const response = await postWithTimeout(
    webhookUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-examguard-secret": secret,
      },
      body: JSON.stringify(payload),
    },
    10000,
  );

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`n8n report webhook failed (${response.status}) ${message}`.trim());
  }
}
