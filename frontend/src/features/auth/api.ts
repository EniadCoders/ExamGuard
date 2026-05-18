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
  twoFactorEnabled?: boolean;
  status: "active" | "suspended" | "pending";
};

type AuthResponse = { token: string; user: AuthUser };

export type LoginResult =
  | { twoFactorRequired: false; user: AuthUser }
  | { twoFactorRequired: true; challengeToken: string };

/** Étape 1 du login : email + mot de passe. Renvoie soit l'utilisateur, soit un défi 2FA. */
export async function login(email: string, password: string): Promise<LoginResult> {
  const data = await api<
    AuthResponse & { twoFactorRequired?: boolean; challengeToken?: string }
  >("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (data.twoFactorRequired && data.challengeToken) {
    return { twoFactorRequired: true, challengeToken: data.challengeToken };
  }
  setToken(data.token);
  return { twoFactorRequired: false, user: data.user };
}

/** Étape 2 de la connexion : valide le code 2FA et établit la session. */
export async function verifyLoginTwoFactor(
  challengeToken: string,
  code: string,
): Promise<AuthUser> {
  const data = await api<AuthResponse>("/auth/login/2fa", {
    method: "POST",
    body: JSON.stringify({ challengeToken, code }),
  });
  setToken(data.token);
  return data.user;
}

/** Inscription d'un étudiant ; persiste immédiatement le JWT retourné. */
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

/** Récupère l'utilisateur courant depuis le JWT stocké. */
export async function fetchMe(): Promise<AuthUser> {
  const data = await api<{ user: AuthUser }>("/auth/me");
  return data.user;
}

/** Déconnecte localement (efface le JWT du localStorage). */
export function logout() {
  setToken(null);
}

/** Met à jour les champs de profil de l'utilisateur courant. */
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

/** Change le mot de passe ; le backend vérifie d'abord l'ancien. */
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

// ─── 2FA (TOTP) ────────────────────────────────────────────────────────────

export type TwoFactorSetup = {
  secret: string;
  otpauthUrl: string;
  qrCode: string;
};

export function setupTwoFactor(): Promise<TwoFactorSetup> {
  return api<TwoFactorSetup>("/auth/2fa/setup", { method: "POST" });
}

export async function enableTwoFactor(code: string): Promise<string[]> {
  const data = await api<{ ok: true; backupCodes: string[] }>("/auth/2fa/enable", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
  return data.backupCodes;
}

export function disableTwoFactor(code: string): Promise<{ ok: true }> {
  return api("/auth/2fa/disable", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

/** Donne la route post-login en fonction du rôle utilisateur. */
export function routeForRole(role: AuthUser["role"]): string {
  if (role === "student") return "/student";
  if (role === "teacher") return "/teacher";
  return "/superadmin";
}
