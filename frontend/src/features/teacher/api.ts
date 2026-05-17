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
