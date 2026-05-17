import { Router } from "express";
import mongoose from "mongoose";
import { ExamModel } from "../models/Exam.js";
import { ExamAttemptModel } from "../models/ExamAttempt.js";
import { UserModel } from "../models/User.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// Toutes les routes professeur exigent un compte authentifié avec le rôle "teacher".
router.use(requireAuth, requireRole("teacher"));

// ─── Helpers ───────────────────────────────────────────────────────────────

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const pad = (n: number) => n.toString().padStart(2, "0");

/** Parse une chaîne `datetime-local` (yyyy-MM-ddTHH:mm) comme une date UTC. */
function parseExamDate(input?: string): Date | undefined {
  if (!input) return undefined;
  const m = String(input).match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/);
  if (!m) {
    const d = new Date(input);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] ?? 0), +(m[5] ?? 0)));
}

/** Formate une date en chaîne française avec heure : "9 Avril 2026 à 09:00". */
function formatExamDateFr(d: Date): string {
  const base = `${d.getUTCDate()} ${MONTHS_FR[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  return `${base} à ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

/** Génère un code de session unique à 6 caractères. */
async function generateJoinCode(): Promise<string> {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 20; attempt++) {
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    const exists = await ExamModel.exists({ joinCode: code });
    if (!exists) return code;
  }
  throw new Error("could not generate a unique join code");
}

/** Convertit les questions du format éditeur (frontend) vers le format stocké. */
function draftToStored(draft: any[]): any[] {
  return (Array.isArray(draft) ? draft : []).map((q, index) => {
    const id = typeof q.id === "number" ? q.id : index + 1;
    const points = Number(q.points) || 0;
    if (q.type === "mcq") {
      const options = (q.options ?? []).map((text: string, i: number) => ({
        id: LETTERS[i] ?? `O${i}`,
        text: String(text ?? ""),
      }));
      const correctIds = (q.correct ?? [])
        .map((i: number) => options[i]?.id)
        .filter(Boolean);
      return {
        id, type: "mcq", text: String(q.text ?? ""), points,
        options,
        correctOptionIds: correctIds,
        correctOptionId: correctIds[0],
        multiple: !!q.multiple,
      };
    }
    if (q.type === "code") {
      return {
        id, type: "code", text: String(q.text ?? ""), points,
        language: q.language ?? "java",
        starterCode: q.starterCode ?? "",
      };
    }
    return { id, type: "text", text: String(q.text ?? ""), points };
  });
}

/** Convertit les questions stockées vers le format éditeur attendu par le frontend. */
function storedToDraft(questions: any[]): any[] {
  return (questions ?? []).map((q) => {
    if (q.type === "mcq") {
      const options = (q.options ?? []).map((o: any) => o.text);
      const ids = q.correctOptionIds?.length
        ? q.correctOptionIds
        : q.correctOptionId
          ? [q.correctOptionId]
          : [];
      const correct = ids
        .map((id: string) => (q.options ?? []).findIndex((o: any) => o.id === id))
        .filter((i: number) => i >= 0);
      return {
        id: q.id, type: "mcq", text: q.text, points: q.points,
        options, multiple: !!q.multiple, correct,
      };
    }
    if (q.type === "code") {
      return {
        id: q.id, type: "code", text: q.text, points: q.points,
        language: q.language ?? "java", starterCode: q.starterCode ?? "",
      };
    }
    return { id: q.id, type: "text", text: q.text, points: q.points };
  });
}

/** Sérialise un examen au format attendu par le dashboard professeur. */
function mapExam(exam: any) {
  return {
    id: String(exam._id),
    title: exam.title,
    subject: exam.subject,
    duration: exam.durationMinutes,
    date: exam.scheduledAt ? formatExamDateFr(new Date(exam.scheduledAt)) : "",
    students: exam.enrolledStudents?.length ?? 0,
    status: exam.status,
    questions: exam.questions?.length ?? 0,
    description: exam.description ?? "",
    passingScore: exam.passingScore ?? 12,
    selectedStudentIds: (exam.enrolledStudents ?? []).map((id: any) => String(id)),
    importedFileName: exam.importedFileName ?? "",
    draftQuestions: storedToDraft(exam.questions ?? []),
    launchMode: exam.launchMode ?? "auto",
    previousStatus: exam.previousStatus ?? undefined,
    rules: exam.rules ?? undefined,
    joinCode: exam.joinCode,
  };
}

/** Garde uniquement les ObjectId valides parmi une liste d'identifiants. */
function toObjectIds(ids: unknown): mongoose.Types.ObjectId[] {
  if (!Array.isArray(ids)) return [];
  return ids
    .filter((id) => mongoose.isValidObjectId(id))
    .map((id) => new mongoose.Types.ObjectId(String(id)));
}

// ─── Examens — liste ───────────────────────────────────────────────────────

router.get("/exams", async (req, res) => {
  const teacherId = req.auth!.userId;
  const exams = await ExamModel.find({ createdBy: teacherId })
    .sort({ createdAt: -1 })
    .lean();
  res.json({ exams: exams.map(mapExam) });
});

// ─── Examens — détail ──────────────────────────────────────────────────────

router.get("/exams/:id", async (req, res) => {
  const teacherId = req.auth!.userId;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ error: "exam not found" });
  }
  const exam = await ExamModel.findOne({ _id: req.params.id, createdBy: teacherId }).lean();
  if (!exam) return res.status(404).json({ error: "exam not found" });
  res.json({ exam: mapExam(exam) });
});

// ─── Examens — création ────────────────────────────────────────────────────

router.post("/exams", async (req, res) => {
  const teacherId = req.auth!.userId;
  const body = req.body ?? {};

  const title = String(body.title ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const duration = Number(body.duration);
  if (!title || !subject) {
    return res.status(400).json({ error: "title and subject are required" });
  }
  if (!Number.isFinite(duration) || duration <= 0) {
    return res.status(400).json({ error: "duration must be a positive number" });
  }

  const status = body.status === "scheduled" ? "scheduled" : "draft";
  const questions = draftToStored(body.questions);
  const totalPoints = questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);

  const exam = await ExamModel.create({
    title,
    subject,
    joinCode: await generateJoinCode(),
    description: String(body.description ?? ""),
    durationMinutes: duration,
    scheduledAt: parseExamDate(body.date),
    status,
    passingScore: Number(body.passingScore) || 12,
    launchMode: body.launchMode === "manual" ? "manual" : "auto",
    importedFileName: String(body.importedFileName ?? ""),
    rules: body.rules ?? undefined,
    createdBy: teacherId,
    enrolledStudents: toObjectIds(body.studentIds),
    totalPoints,
    questions,
  });

  res.status(201).json({ exam: mapExam(exam.toObject()) });
});

// ─── Examens — modification ────────────────────────────────────────────────

router.patch("/exams/:id", async (req, res) => {
  const teacherId = req.auth!.userId;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ error: "exam not found" });
  }
  const exam = await ExamModel.findOne({ _id: req.params.id, createdBy: teacherId });
  if (!exam) return res.status(404).json({ error: "exam not found" });
  if (exam.status === "completed" || exam.status === "live") {
    return res.status(409).json({ error: "a live or completed exam cannot be edited" });
  }

  const body = req.body ?? {};
  if (typeof body.title === "string" && body.title.trim()) exam.title = body.title.trim();
  if (typeof body.subject === "string" && body.subject.trim()) exam.subject = body.subject.trim();
  if (body.duration != null && Number(body.duration) > 0) {
    exam.durationMinutes = Number(body.duration);
  }
  if (typeof body.description === "string") exam.description = body.description;
  if (body.date !== undefined) exam.scheduledAt = parseExamDate(body.date);
  if (body.passingScore != null) exam.passingScore = Number(body.passingScore) || 12;
  if (body.launchMode === "auto" || body.launchMode === "manual") {
    exam.launchMode = body.launchMode;
  }
  if (typeof body.importedFileName === "string") exam.importedFileName = body.importedFileName;
  if (body.rules) exam.set("rules", body.rules);
  if (body.studentIds !== undefined) {
    exam.enrolledStudents = toObjectIds(body.studentIds) as any;
  }
  if (body.questions !== undefined) {
    const questions = draftToStored(body.questions);
    exam.questions = questions as any;
    exam.totalPoints = questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);
  }
  if (body.status === "draft" || body.status === "scheduled") exam.status = body.status;

  await exam.save();
  res.json({ exam: mapExam(exam.toObject()) });
});

// ─── Examens — archiver / désarchiver ──────────────────────────────────────

router.post("/exams/:id/archive", async (req, res) => {
  const teacherId = req.auth!.userId;
  const exam = await ExamModel.findOne({ _id: req.params.id, createdBy: teacherId });
  if (!exam) return res.status(404).json({ error: "exam not found" });
  if (exam.status === "archived" || exam.status === "live") {
    return res.status(409).json({ error: "exam cannot be archived in its current state" });
  }
  exam.previousStatus = exam.status as any;
  exam.status = "archived";
  await exam.save();
  res.json({ exam: mapExam(exam.toObject()) });
});

router.post("/exams/:id/unarchive", async (req, res) => {
  const teacherId = req.auth!.userId;
  const exam = await ExamModel.findOne({ _id: req.params.id, createdBy: teacherId });
  if (!exam) return res.status(404).json({ error: "exam not found" });
  if (exam.status !== "archived") {
    return res.status(409).json({ error: "exam is not archived" });
  }
  exam.status = (exam.previousStatus ?? "completed") as any;
  exam.previousStatus = undefined;
  await exam.save();
  res.json({ exam: mapExam(exam.toObject()) });
});

// ─── Examens — lancer (statut "live") ──────────────────────────────────────

router.post("/exams/:id/launch", async (req, res) => {
  const teacherId = req.auth!.userId;
  const exam = await ExamModel.findOne({ _id: req.params.id, createdBy: teacherId });
  if (!exam) return res.status(404).json({ error: "exam not found" });
  if (exam.status !== "scheduled" && exam.status !== "draft") {
    return res.status(409).json({ error: "only a scheduled or draft exam can be launched" });
  }
  exam.status = "live";
  await exam.save();
  res.json({ exam: mapExam(exam.toObject()) });
});

// ─── Examens — suppression ─────────────────────────────────────────────────

router.delete("/exams/:id", async (req, res) => {
  const teacherId = req.auth!.userId;
  const exam = await ExamModel.findOneAndDelete({
    _id: req.params.id,
    createdBy: teacherId,
  });
  if (!exam) return res.status(404).json({ error: "exam not found" });
  await ExamAttemptModel.deleteMany({ examId: exam._id });
  res.json({ ok: true });
});

// ─── Étudiants — liste légère (pour l'inscription à un examen) ─────────────

router.get("/students", async (_req, res) => {
  const students = await UserModel.find({ role: "student" })
    .sort({ fullName: 1 })
    .lean();
  res.json({
    students: students.map((s) => ({
      id: String(s._id),
      name: s.fullName,
      email: s.email,
      program: s.program ?? "",
      department: s.department ?? "",
      status: s.status,
    })),
  });
});

export default router;
