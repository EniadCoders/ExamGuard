/**
 * Client API du dashboard étudiant : dashboard agrégé, jonction d'examens par
 * code, démarrage / autosave / soumission de tentatives, signalement anti-triche,
 * détail d'un résultat et notifications.
 */
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
  /** Statut réel de l'examen côté professeur (draft, scheduled, live…). */
  examStatus: string;
  /** Vrai si l'étudiant peut démarrer/reprendre l'examen maintenant. */
  canStart: boolean;
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

export type DashboardPerformance = {
  averageScore: number | null;
  completedCount: number;
  validatedCount: number;
};

export type DashboardPayload = {
  user: DashboardUser;
  stats: DashboardStat[];
  performance: DashboardPerformance;
  exams: DashboardExam[];
  calendarEvents: CalendarEvent[];
};

/** Charge la totalité du dashboard étudiant en un seul appel. */
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

/** Récupère le détail (lecture seule) d'un examen. */
export async function fetchExam(id: string): Promise<ExamDetail> {
  const data = await api<{ exam: ExamDetail }>(`/student/exams/${id}`);
  return data.exam;
}

// ─── Live exam state (teacher-controlled) ──────────────────────────────────

export type ExamMessage = {
  id: string;
  text: string;
  sentAt: string;
};

export type ExamLiveState = {
  /** Statut de l'examen côté professeur (live, completed, archived…). */
  examStatus: string;
  /** Examen suspendu par le professeur. */
  paused: boolean;
  /** Soumissions verrouillées par le professeur. */
  submissionsLocked: boolean;
  /** Étudiant exclu de l'examen. */
  kicked: boolean;
  kickReason: string;
  attemptStatus: "in-progress" | "submitted" | "graded" | null;
  /** Temps restant faisant autorité (temps additionnel + pauses pris en compte). */
  remainingSeconds: number | null;
  messages: ExamMessage[];
};

/** Interroge l'état temps réel de l'examen (pause, verrouillage, messages, exclusion). */
export function fetchExamLiveState(examId: string): Promise<ExamLiveState> {
  return api<ExamLiveState>(`/student/exams/${examId}/live-state`);
}

// ─── Join by code ──────────────────────────────────────────────────────────

export type JoinResult = {
  exam: { id: string; title: string; subject: string };
  alreadyEnrolled: boolean;
};

/** Rejoint un examen via le code 6 lettres fourni par le professeur. */
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

/** Démarre (ou reprend) une tentative ; renvoie attempt + questions sans bonnes réponses. */
export function startExam(examId: string): Promise<StartResponse> {
  return api<StartResponse>(`/student/exams/${examId}/start`, { method: "POST" });
}

/** Autosave : envoie l'état actuel des réponses au serveur. */
export function saveAttemptAnswers(
  attemptId: string,
  answers: AttemptAnswer[],
): Promise<{ ok: true; savedAt: string }> {
  return api(`/student/attempts/${attemptId}`, {
    method: "PATCH",
    body: JSON.stringify({ answers }),
  });
}

/** Signale un évènement anti-triche (sortie plein écran, blur, copier-coller…). */
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

/** Soumet définitivement la tentative ; le serveur auto-corrige les MCQ. */
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

/** Charge le détail d'un résultat d'examen pour l'affichage Résultats. */
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

/** Liste les notifications + compteur non lues pour la cloche. */
export function fetchNotifications(): Promise<{
  notifications: StudentNotification[];
  unreadCount: number;
}> {
  return api("/student/notifications");
}

/** Marque une notification comme lue côté serveur. */
export function markNotificationRead(id: string): Promise<{ ok: true }> {
  return api(`/student/notifications/${id}/read`, { method: "PATCH" });
}

// Re-export Answer type so other modules can use it
export type { Answer };
