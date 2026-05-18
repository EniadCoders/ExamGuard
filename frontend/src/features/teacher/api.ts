import { api } from "@/shared/lib/api";

// ─── Types ─────────────────────────────────────────────────────────────────

export type DraftQuestion =
  | { id: number; type: "mcq"; text: string; points: number; options: string[]; multiple: boolean; correct: number[] }
  | { id: number; type: "text"; text: string; points: number }
  | { id: number; type: "code"; text: string; points: number; language: string; starterCode: string };

export interface ExamRules {
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
}

export type ExamStatus = "scheduled" | "draft" | "completed" | "live" | "archived";

export interface TeacherExam {
  id: string;
  title: string;
  subject: string;
  duration: number;
  date: string;
  students: number;
  status: ExamStatus;
  questions: number;
  description?: string;
  passingScore?: number;
  selectedStudentIds?: string[];
  importedFileName?: string;
  draftQuestions?: DraftQuestion[];
  launchMode?: "auto" | "manual";
  previousStatus?: "scheduled" | "draft" | "completed";
  rules?: ExamRules;
  joinCode?: string;
}

export interface StudentLite {
  id: string;
  name: string;
  email: string;
  program: string;
  department: string;
  status: "active" | "suspended" | "pending";
}

export interface ExamPayload {
  title: string;
  subject: string;
  duration: number;
  date: string;
  description: string;
  passingScore: number;
  studentIds: string[];
  launchMode: "auto" | "manual";
  importedFileName: string;
  questions: DraftQuestion[];
  rules: ExamRules;
  status: "draft" | "scheduled";
}

// ─── Exams ─────────────────────────────────────────────────────────────────

export type RewriteKind = "title" | "description" | "question" | "answer";

export async function rewriteExamText(payload: {
  kind: RewriteKind;
  text: string;
  subject?: string;
  title?: string;
}): Promise<string> {
  const data = await api<{ text: string }>("/teacher/ai/rewrite", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.text;
}

export async function fetchExams(): Promise<TeacherExam[]> {
  const data = await api<{ exams: TeacherExam[] }>("/teacher/exams");
  return data.exams;
}

export async function fetchExam(id: string): Promise<TeacherExam> {
  const data = await api<{ exam: TeacherExam }>(`/teacher/exams/${id}`);
  return data.exam;
}

export async function createExam(payload: ExamPayload): Promise<TeacherExam> {
  const data = await api<{ exam: TeacherExam }>("/teacher/exams", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.exam;
}

export async function updateExam(
  id: string,
  payload: Partial<ExamPayload>,
): Promise<TeacherExam> {
  const data = await api<{ exam: TeacherExam }>(`/teacher/exams/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return data.exam;
}

export async function archiveExam(id: string): Promise<TeacherExam> {
  const data = await api<{ exam: TeacherExam }>(`/teacher/exams/${id}/archive`, {
    method: "POST",
  });
  return data.exam;
}

export async function unarchiveExam(id: string): Promise<TeacherExam> {
  const data = await api<{ exam: TeacherExam }>(`/teacher/exams/${id}/unarchive`, {
    method: "POST",
  });
  return data.exam;
}

export async function launchExam(id: string): Promise<TeacherExam> {
  const data = await api<{ exam: TeacherExam }>(`/teacher/exams/${id}/launch`, {
    method: "POST",
  });
  return data.exam;
}

/** Clôt un examen en cours : passe en "completed" et soumet les tentatives ouvertes. */
export async function completeExam(id: string): Promise<TeacherExam> {
  const data = await api<{ exam: TeacherExam }>(`/teacher/exams/${id}/complete`, {
    method: "POST",
  });
  return data.exam;
}

export async function deleteExam(id: string): Promise<void> {
  await api(`/teacher/exams/${id}`, { method: "DELETE" });
}

// ─── Dashboard overview ────────────────────────────────────────────────────

export interface DashboardStats {
  activeExams: number;
  studentsOnline: number;
  fraudAlerts: number;
  successRate: number;
}

export interface ActivityItem {
  id: string;
  text: string;
  time: string;
  type: "info" | "alert";
}

export interface TeacherDashboardData {
  stats: DashboardStats;
  activity: ActivityItem[];
}

export function fetchTeacherDashboard(): Promise<TeacherDashboardData> {
  return api<TeacherDashboardData>("/teacher/dashboard");
}

// ─── Students ──────────────────────────────────────────────────────────────

export async function fetchTeacherStudents(): Promise<StudentLite[]> {
  const data = await api<{ students: StudentLite[] }>("/teacher/students");
  return data.students;
}

export interface TeacherStudent {
  id: string;
  name: string;
  email: string;
  exams: number;
  avg: number;
  status: "active" | "inactive";
  lastActive: string;
  department?: string;
  year?: string;
  studentId?: string;
}

export interface ExamHistoryItem {
  exam: string;
  date: string;
  score: number;
  status: string;
}

export interface StudentDetail {
  student: TeacherStudent;
  examHistory: ExamHistoryItem[];
}

export async function fetchTeacherRoster(): Promise<TeacherStudent[]> {
  const data = await api<{ students: TeacherStudent[] }>("/teacher/students/roster");
  return data.students;
}

export function fetchTeacherStudentDetail(id: string): Promise<StudentDetail> {
  return api<StudentDetail>(`/teacher/students/${id}`);
}

// ─── Analytics ─────────────────────────────────────────────────────────────

export interface AnalyticsSummary {
  successRate: number;
  totalStudents: number;
  examsCompleted: number;
}

export interface ModulePerformance {
  subject: string;
  avg: number;
  passing: number;
  best: number;
  worst: number;
  students: number;
}

export interface TrendPoint {
  month: string;
  exams: number;
  fraud: number;
  success: number;
}

export interface RankingEntry {
  id: string;
  name: string;
  department: string;
  score: number;
}

export interface TeacherAnalytics {
  summary: AnalyticsSummary;
  byModule: ModulePerformance[];
  trend: TrendPoint[];
  ranking: RankingEntry[];
}

export function fetchTeacherAnalytics(examId?: string): Promise<TeacherAnalytics> {
  const query = examId && examId !== "all" ? `?examId=${encodeURIComponent(examId)}` : "";
  return api<TeacherAnalytics>(`/teacher/analytics${query}`);
}

// ─── Live exam monitoring ──────────────────────────────────────────────────

export interface MonitorParticipant {
  id: string;
  name: string;
  totalQuestions: number;
  answered: number;
  progress: number;
  state: "active" | "flagged" | "submitted" | "kicked" | "not-joined";
  score: number;
}

export interface MonitorAlert {
  id: number;
  studentId: string;
  name: string;
  type: string;
  severity: "high" | "medium" | "low";
  time: string;
}

/** État de pilotage en direct contrôlé par le professeur. */
export interface ExamLiveControl {
  paused: boolean;
  extraMinutes: number;
  submissionsLocked: boolean;
}

export interface ExamMonitor {
  participants: MonitorParticipant[];
  alerts: MonitorAlert[];
  /** Temps restant de l'examen en secondes (chrono partagé avec les étudiants). */
  remainingSeconds: number;
  liveControl: ExamLiveControl;
}

export function fetchExamMonitor(examId: string): Promise<ExamMonitor> {
  return api<ExamMonitor>(`/teacher/exams/${examId}/monitor`);
}

/** Ajoute du temps à la durée d'un examen en cours. */
export function extendExam(
  examId: string,
  minutes: number,
): Promise<{ liveControl: ExamLiveControl }> {
  return api(`/teacher/exams/${examId}/extend`, {
    method: "POST",
    body: JSON.stringify({ minutes }),
  });
}

/** Suspend ou reprend un examen en cours pour tous les étudiants. */
export function pauseExam(
  examId: string,
  paused: boolean,
): Promise<{ liveControl: ExamLiveControl }> {
  return api(`/teacher/exams/${examId}/pause`, {
    method: "POST",
    body: JSON.stringify({ paused }),
  });
}

/** Verrouille ou déverrouille les soumissions d'un examen en cours. */
export function lockExamSubmissions(
  examId: string,
  locked: boolean,
): Promise<{ liveControl: ExamLiveControl }> {
  return api(`/teacher/exams/${examId}/lock`, {
    method: "POST",
    body: JSON.stringify({ locked }),
  });
}

/** Envoie un message à un étudiant (studentId fourni) ou à tous les participants. */
export function messageExamStudents(
  examId: string,
  text: string,
  studentId?: string,
): Promise<{ ok: true; delivered: number }> {
  return api(`/teacher/exams/${examId}/message`, {
    method: "POST",
    body: JSON.stringify({ text, studentId }),
  });
}

/** Exclut un étudiant d'un examen en cours. */
export function kickExamStudent(
  examId: string,
  studentId: string,
  reason?: string,
): Promise<{ ok: true }> {
  return api(`/teacher/exams/${examId}/kick`, {
    method: "POST",
    body: JSON.stringify({ studentId, reason }),
  });
}

// ─── Fraud alerts ──────────────────────────────────────────────────────────

export interface FraudAlert {
  id: string;
  student: string;
  initials: string;
  exam: string;
  type: string;
  time: string;
  severity: string;
}

export async function fetchFraudAlerts(): Promise<FraudAlert[]> {
  const data = await api<{ alerts: FraudAlert[] }>("/teacher/fraud-alerts");
  return data.alerts;
}
