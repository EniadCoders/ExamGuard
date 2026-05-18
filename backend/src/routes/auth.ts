import { Router, type Request } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User.js";
import { ActiveSessionModel } from "../models/ActiveSession.js";
import { requireAuth, signToken } from "../middleware/auth.js";

const router = Router();

// ─── Sessions ──────────────────────────────────────────────────────────────

/** Déduit un libellé d'appareil lisible depuis l'en-tête User-Agent. */
function parseDevice(ua?: string): string {
  if (!ua) return "Appareil inconnu";
  const browser = /Edg/.test(ua)
    ? "Edge"
    : /OPR|Opera/.test(ua)
      ? "Opera"
      : /Chrome/.test(ua)
        ? "Chrome"
        : /Firefox/.test(ua)
          ? "Firefox"
          : /Safari/.test(ua)
            ? "Safari"
            : "Navigateur";
  const os = /Windows/.test(ua)
    ? "Windows"
    : /Mac OS/.test(ua)
      ? "macOS"
      : /Android/.test(ua)
        ? "Android"
        : /iPhone|iPad|iOS/.test(ua)
          ? "iOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "";
  return os ? `${browser} — ${os}` : browser;
}

/** Délai relatif en français : "Actif maintenant", "Il y a 5 min". */
function relativeFr(d?: Date | null): string {
  if (!d) return "—";
  const min = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (min < 1) return "Actif maintenant";
  if (min < 60) return `Il y a ${min} min`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  return `Il y a ${Math.floor(hours / 24)} j`;
}

/** Crée un enregistrement de session active pour une connexion. */
async function createSession(req: Request, userId: string) {
  return ActiveSessionModel.create({
    userId,
    device: parseDevice(req.headers["user-agent"]),
    ip: req.ip ?? "",
    location: "",
    current: true,
  });
}

// POST /signup : inscription d'un nouvel étudiant (hash bcrypt, JWT).
router.post("/signup", async (req, res) => {
  const {
    email,
    password,
    fullName,
    school,
    program,
    department,
    studentIdentifierType,
    studentIdentifier,
  } = req.body ?? {};

  if (!email || !password || !fullName) {
    return res.status(400).json({ error: "email, password, fullName are required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "password must be at least 8 characters" });
  }

  const existing = await UserModel.findOne({ email: String(email).toLowerCase() });
  if (existing) {
    return res.status(409).json({ error: "email already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await UserModel.create({
    email,
    passwordHash,
    role: "student",
    fullName,
    school,
    program,
    department,
    studentIdentifierType,
    studentIdentifier,
    status: "active",
  });

  const session = await createSession(req, user.id);
  const token = signToken({ userId: user.id, role: user.role, sessionId: session.id });
  res.status(201).json({ token, user: publicUser(user) });
});

// POST /login : connexion email + mot de passe.
router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const user = await UserModel.findOne({ email: String(email).toLowerCase() });
  if (!user) return res.status(401).json({ error: "invalid credentials" });
  if (user.status === "suspended") {
    return res.status(403).json({ error: "account suspended" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "invalid credentials" });

  user.lastLoginAt = new Date();
  await user.save();

  const session = await createSession(req, user.id);
  const token = signToken({ userId: user.id, role: user.role, sessionId: session.id });
  res.json({ token, user: publicUser(user) });
});

// GET /me : retourne l'utilisateur courant à partir du JWT.
router.get("/me", requireAuth, async (req, res) => {
  const user = await UserModel.findById(req.auth!.userId);
  if (!user) return res.status(404).json({ error: "user not found" });
  res.json({ user: publicUser(user) });
});

const PROFILE_FIELDS = [
  "fullName",
  "department",
  "school",
  "program",
  "studentIdentifierType",
  "studentIdentifier",
  "phone",
  "title",
  "location",
  "bio",
  "avatarUrl",
] as const;

// PATCH /me : met à jour les champs de profil autorisés.
router.patch("/me", requireAuth, async (req, res) => {
  const user = await UserModel.findById(req.auth!.userId);
  if (!user) return res.status(404).json({ error: "user not found" });

  const updates = req.body ?? {};

  // L'email est l'identifiant de connexion : changement vérifié pour l'unicité.
  if (typeof updates.email === "string") {
    const nextEmail = updates.email.trim().toLowerCase();
    if (nextEmail && nextEmail !== user.email) {
      const taken = await UserModel.findOne({ email: nextEmail });
      if (taken) return res.status(409).json({ error: "email already registered" });
      user.email = nextEmail;
    }
  }

  for (const key of PROFILE_FIELDS) {
    if (typeof updates[key] === "string") {
      (user as any)[key] = updates[key];
    }
  }

  if (updates.preferences && typeof updates.preferences === "object") {
    const current = (user.preferences as any)?.toObject
      ? (user.preferences as any).toObject()
      : { ...(user.preferences ?? {}) };
    user.set("preferences", { ...current, ...updates.preferences });
  }

  await user.save();
  res.json({ user: publicUser(user) });
});

// POST /change-password : remplace le mot de passe après vérification de l'ancien.
router.post("/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body ?? {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "currentPassword and newPassword required" });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: "newPassword must be at least 8 characters" });
  }

  const user = await UserModel.findById(req.auth!.userId);
  if (!user) return res.status(404).json({ error: "user not found" });

  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "current password is incorrect" });

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ ok: true });
});

// ─── Sessions actives ──────────────────────────────────────────────────────

// GET /sessions : liste les sessions actives de l'utilisateur courant.
router.get("/sessions", requireAuth, async (req, res) => {
  const sessions = await ActiveSessionModel.find({ userId: req.auth!.userId })
    .sort({ createdAt: -1 })
    .lean();
  res.json({
    sessions: sessions.map((s) => ({
      id: String(s._id),
      device: s.device,
      location: s.location || "",
      lastActive: relativeFr(s.lastActiveAt),
      current: String(s._id) === req.auth!.sessionId,
    })),
  });
});

// DELETE /sessions/:id : révoque une session particulière (déconnexion ciblée).
router.delete("/sessions/:id", requireAuth, async (req, res) => {
  if (req.params.id === req.auth!.sessionId) {
    return res.status(400).json({ error: "cannot revoke the current session" });
  }
  await ActiveSessionModel.deleteOne({
    _id: req.params.id,
    userId: req.auth!.userId,
  });
  res.json({ ok: true });
});

// DELETE /sessions : révoque toutes les autres sessions (sauf la courante).
router.delete("/sessions", requireAuth, async (req, res) => {
  const filter: Record<string, unknown> = { userId: req.auth!.userId };
  if (req.auth!.sessionId) filter._id = { $ne: req.auth!.sessionId };
  await ActiveSessionModel.deleteMany(filter);
  res.json({ ok: true });
});

/** Projection publique de l'utilisateur (sans hash de mot de passe). */
function publicUser(user: any) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
    department: user.department,
    school: user.school,
    program: user.program,
    phone: user.phone,
    title: user.title,
    location: user.location,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    preferences: user.preferences,
    status: user.status,
  };
}

export default router;
