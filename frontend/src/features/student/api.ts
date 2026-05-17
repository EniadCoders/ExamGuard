import { api } from "@/shared/lib/api";
import type { Question } from "@/shared/types/exam";

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

export type ExamDetail = {
  id: string;
  title: string;
  subject: string;
  description: string;
  durationMinutes: number;
  totalPoints: number;
  questions: Question[];
};

export async function fetchExam(id: string): Promise<ExamDetail> {
  const data = await api<{ exam: ExamDetail }>(`/student/exams/${id}`);
  return data.exam;
}
