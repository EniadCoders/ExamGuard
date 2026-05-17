import { api, setToken } from "@/shared/lib/api";

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

export function routeForRole(role: AuthUser["role"]): string {
  if (role === "student") return "/student";
  if (role === "teacher") return "/teacher";
  return "/superadmin";
}
