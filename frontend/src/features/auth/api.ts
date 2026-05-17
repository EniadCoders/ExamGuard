import { api, setToken } from "@/shared/lib/api";

export type TeacherPreferences = {
  emailFraudCritical: boolean;
  emailDailyDigest: boolean;
  emailExamSubmissions: boolean;
  realtimeFraud: boolean;
  realtimeStudentActivity: boolean;
  realtimeTechnical: boolean;
  defaultExamDuration: number;
  defaultPassingScore: number;
  examLanguage: string;
  timezone: string;
};

export type AuthUser = {
  id: string;
  email: string;
  role: "student" | "teacher" | "superadmin";
  fullName: string;
  department?: string;
  school?: string;
  program?: string;
  phone?: string;
  title?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  preferences?: TeacherPreferences;
  status: "active" | "suspended" | "pending";
};

type AuthResponse = { token: string; user: AuthUser };

export async function login(email: string, password: string): Promise<AuthUser> {
  const data = await api<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data.user;
}

export async function signupStudent(payload: {
  email: string;
  password: string;
  fullName: string;
  school: string;
  program: string;
  department: string;
  studentIdentifierType: "apogee" | "cne";
  studentIdentifier: string;
}): Promise<AuthUser> {
  const data = await api<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setToken(data.token);
  return data.user;
}

export async function fetchMe(): Promise<AuthUser> {
  const data = await api<{ user: AuthUser }>("/auth/me");
  return data.user;
}

export function logout() {
  setToken(null);
}

export async function updateProfile(updates: {
  fullName?: string;
  department?: string;
  school?: string;
  program?: string;
  phone?: string;
  email?: string;
  title?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  preferences?: Partial<TeacherPreferences>;
}): Promise<AuthUser> {
  const data = await api<{ user: AuthUser }>("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  return data.user;
}

export function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: true }> {
  return api("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export type ActiveSession = {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
};

export async function fetchSessions(): Promise<ActiveSession[]> {
  const data = await api<{ sessions: ActiveSession[] }>("/auth/sessions");
  return data.sessions;
}

export function revokeSession(id: string): Promise<{ ok: true }> {
  return api(`/auth/sessions/${id}`, { method: "DELETE" });
}

export function revokeOtherSessions(): Promise<{ ok: true }> {
  return api("/auth/sessions", { method: "DELETE" });
}

export function routeForRole(role: AuthUser["role"]): string {
  if (role === "student") return "/student";
  if (role === "teacher") return "/teacher";
  return "/superadmin";
}
