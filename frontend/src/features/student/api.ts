import { api } from "@/shared/lib/api";
import type { Question, Answer } from "@/shared/types/exam";

export type DashboardStat = {
  label: string;
  value: string;
  change: string;
};

export type DashboardExam = {
  id: string;
  title: string;
  subject: string;
  status: "completed" | "ongoing" | "upcoming";
  date: string;
  time: string;
  duration: number;
  types: string[];
  attemptId: string | null;
  score?: number;
  maxScore?: number;
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  month: string;
  time: string;
  status: "completed" | "ongoing" | "upcoming";
};

export type DashboardUser = {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  department?: string;
  school?: string;
  program?: string;
  phone?: string;
};

export type DashboardPayload = {
  user: DashboardUser;
  stats: DashboardStat[];
  exams: DashboardExam[];
  calendarEvents: CalendarEvent[];
};

export function fetchDashboard(): Promise<DashboardPayload> {
  return api<DashboardPayload>("/student/dashboard");
}

export type ExamRules = {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  allowBacktrack: boolean;
  showResultsImmediately: boolean;
  requireFullscreen: boolean;
  blockTabSwitch: boolean;
  preventCopyPaste: boolean;
  showTimer: boolean;
  warnBeforeEnd: boolean;
  attempts: number;
};

export type ExamDetail = {
  id: string;
  title: string;
  subject: string;
  description: string;
  durationMinutes: number;
  totalPoints: number;
  passingScore?: number;
  rules?: ExamRules;
  questions: Question[];
};

export async function fetchExam(id: string): Promise<ExamDetail> {
  const data = await api<{ exam: ExamDetail }>(`/student/exams/${id}`);
  return data.exam;
}

// ─── Join by code ──────────────────────────────────────────────────────────

export type JoinResult = {
  exam: { id: string; title: string; subject: string };
  alreadyEnrolled: boolean;
};

export function joinExamByCode(code: string): Promise<JoinResult> {
  return api<JoinResult>("/student/exams/join", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

// ─── Exam-taking flow ──────────────────────────────────────────────────────

export type AttemptAnswer = { questionId: number; value: unknown };

export type StartResponse = {
  attempt: {
    id: string;
    examId: string;
    status: "in-progress" | "submitted" | "graded";
    startedAt: string;
    remainingSeconds: number;
    answers: AttemptAnswer[];
  };
  exam: ExamDetail;
};

export function startExam(examId: string): Promise<StartResponse> {
  return api<StartResponse>(`/student/exams/${examId}/start`, { method: "POST" });
}

export function saveAttemptAnswers(
  attemptId: string,
  answers: AttemptAnswer[],
): Promise<{ ok: true; savedAt: string }> {
  return api(`/student/attempts/${attemptId}`, {
    method: "PATCH",
    body: JSON.stringify({ answers }),
  });
}

export function logAntiCheatEvent(
  attemptId: string,
  type: string,
  details?: Record<string, unknown>,
): Promise<{ ok: true; count: number }> {
  return api(`/student/attempts/${attemptId}/anti-cheat`, {
    method: "POST",
    body: JSON.stringify({ type, details }),
  });
}

export type SubmitResponse = {
  attempt: {
    id: string;
    status: "submitted" | "graded";
    score: number;
    maxScore: number;
    passingScore?: number;
    passed?: boolean;
    submittedAt: string;
  };
};

export function submitAttempt(
  attemptId: string,
  answers: AttemptAnswer[],
): Promise<SubmitResponse> {
  return api(`/student/attempts/${attemptId}/submit`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
}

// ─── Result detail ─────────────────────────────────────────────────────────

export type AttemptResult = {
  attempt: {
    id: string;
    status: "in-progress" | "submitted" | "graded";
    startedAt: string;
    submittedAt?: string;
    score?: number;
    maxScore?: number;
    passingScore?: number;
    passed?: boolean | null;
    autoSubmitted?: boolean;
    antiCheatEventsCount: number;
  };
  exam: {
    id: string;
    title: string;
    subject: string;
    durationMinutes: number;
    totalPoints: number;
    passingScore?: number;
  };
  questions: Array<
    Question & {
      yourAnswer?: unknown;
      isCorrect?: boolean | null;
      correctOptionId?: string;
      correctOptionIds?: string[];
    }
  >;
};

export function fetchAttempt(attemptId: string): Promise<AttemptResult> {
  return api<AttemptResult>(`/student/attempts/${attemptId}`);
}

// ─── Notifications ─────────────────────────────────────────────────────────

export type StudentNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export function fetchNotifications(): Promise<{
  notifications: StudentNotification[];
  unreadCount: number;
}> {
  return api("/student/notifications");
}

export function markNotificationRead(id: string): Promise<{ ok: true }> {
  return api(`/student/notifications/${id}/read`, { method: "PATCH" });
}

// Re-export Answer type so other modules can use it
export type { Answer };
