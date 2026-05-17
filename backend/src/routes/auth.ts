import { Router } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User.js";
import { requireAuth, signToken } from "../middleware/auth.js";

const router = Router();

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

  const token = signToken({ userId: user.id, role: user.role });
  res.status(201).json({ token, user: publicUser(user) });
});

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

  const token = signToken({ userId: user.id, role: user.role });
  res.json({ token, user: publicUser(user) });
});

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
] as const;

router.patch("/me", requireAuth, async (req, res) => {
  const user = await UserModel.findById(req.auth!.userId);
  if (!user) return res.status(404).json({ error: "user not found" });

  const updates = req.body ?? {};
  for (const key of PROFILE_FIELDS) {
    if (typeof updates[key] === "string") {
      (user as any)[key] = updates[key];
    }
  }
  await user.save();
  res.json({ user: publicUser(user) });
});

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
    status: user.status,
  };
}

export default router;
