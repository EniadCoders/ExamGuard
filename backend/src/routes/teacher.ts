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

const MONTHS_FR_SHORT = [
  "Janv", "Févr", "Mars", "Avr", "Mai", "Juin",
  "Juil", "Août", "Sept", "Oct", "Nov", "Déc",
];

/** Formate une date courte : "9 Avr 2026". */
function formatDateShort(d: Date): string {
  return `${d.getUTCDate()} ${MONTHS_FR_SHORT[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Formate un délai relatif en français : "Il y a 5 min", "Actif maintenant". */
function relativeFr(d?: Date | null): string {
  if (!d) return "Jamais connecté";
  const diffMs = Date.now() - new Date(d).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "Actif maintenant";
  if (min < 60) return `Il y a ${min} min`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days} j`;
  return formatDateShort(new Date(d));
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

/** Sérialise un étudiant avec ses statistiques sur les examens du professeur. */
function mapStudent(user: any, attempts: any[], examCount: number) {
  const graded = attempts.filter((a) => a.score != null);
  const avg = graded.length
    ? Math.round(
        (graded.reduce((sum, a) => sum + (a.score ?? 0), 0) / graded.length) * 10,
      ) / 10
    : 0;
  return {
    id: String(user._id),
    name: user.fullName,
    email: user.email,
    exams: examCount,
    avg,
    status: user.status === "active" ? "active" : "inactive",
    lastActive: relativeFr(user.lastLoginAt),
    department: user.department ?? "",
    year: "",
    studentId: user.studentIdentifier ?? "",
  };
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

// ─── Suivi en direct d'un examen ───────────────────────────────────────────

const ALERT_LABELS: Record<string, string> = {
  "tab-blur": "Changement d'onglet",
  "tab-switch": "Changement d'onglet",
  "fullscreen-exit": "Sortie du mode plein écran",
  "fullscreen-exited": "Sortie du mode plein écran",
  paste: "Tentative de collage",
  copy: "Tentative de copie",
  "face-lost": "Visage non détecté",
  "multiple-faces": "Plusieurs visages détectés",
  "window-blur": "Fenêtre quittée",
};

/** Initiales (max 2 lettres) à partir d'un nom complet. */
function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/** Déduit une sévérité à partir du type d'évènement anti-triche. */
function alertSeverity(type: string): "high" | "medium" | "low" {
  const t = type.toLowerCase();
  if (/face|multiple|phone|screenshot|capture/.test(t)) return "high";
  if (/tab|blur|fullscreen|focus|shortcut|switch/.test(t)) return "medium";
  return "low";
}

router.get("/exams/:id/monitor", async (req, res) => {
  const teacherId = req.auth!.userId;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ error: "exam not found" });
  }
  const exam = await ExamModel.findOne({
    _id: req.params.id,
    createdBy: teacherId,
  }).lean();
  if (!exam) return res.status(404).json({ error: "exam not found" });

  const totalQuestions = exam.questions?.length ?? 0;
  const enrolledIds = (exam.enrolledStudents ?? []).map((id) => String(id));
  const [students, attempts] = await Promise.all([
    UserModel.find({ _id: { $in: enrolledIds } }).lean(),
    ExamAttemptModel.find({ examId: exam._id }).lean(),
  ]);
  const studentById = new Map(students.map((s) => [String(s._id), s]));
  const attemptByStudent = new Map(
    attempts.map((a) => [String(a.studentId), a]),
  );

  const participants = (exam.enrolledStudents ?? []).map((sid) => {
    const id = String(sid);
    const student = studentById.get(id);
    const attempt = attemptByStudent.get(id);
    const answered = attempt?.answers?.length ?? 0;
    const submitted =
      attempt?.status === "submitted" || attempt?.status === "graded";
    const flagged =
      !submitted && (attempt?.antiCheatEvents?.length ?? 0) > 0;
    const state = submitted ? "submitted" : flagged ? "flagged" : "active";
    return {
      id,
      name: student?.fullName ?? "Étudiant",
      totalQuestions,
      answered,
      progress: submitted
        ? 100
        : totalQuestions
          ? Math.round((answered / totalQuestions) * 100)
          : 0,
      state,
      score: attempt?.score ?? 0,
    };
  });

  let alertSeq = 0;
  const alerts = attempts.flatMap((a) => {
    const student = studentById.get(String(a.studentId));
    return (a.antiCheatEvents ?? []).map((ev: any) => ({
      id: ++alertSeq,
      studentId: String(a.studentId),
      name: student?.fullName ?? "Étudiant",
      type: ALERT_LABELS[ev.type] ?? ev.type,
      severity: alertSeverity(ev.type ?? ""),
      time: relativeFr(ev.timestamp),
      ts: new Date(ev.timestamp ?? Date.now()).getTime(),
    }));
  });
  alerts.sort((x, y) => y.ts - x.ts);

  res.json({
    participants,
    alerts: alerts.map(({ ts, ...rest }) => rest),
  });
});

// ─── Alertes de fraude (tous examens du professeur) ───────────────────────

router.get("/fraud-alerts", async (req, res) => {
  const teacherId = req.auth!.userId;
  const exams = await ExamModel.find({ createdBy: teacherId }).lean();
  const examIds = exams.map((e) => e._id);
  const examById = new Map(exams.map((e) => [String(e._id), e]));
  const attempts = await ExamAttemptModel.find({ examId: { $in: examIds } }).lean();

  const studentIds = [...new Set(attempts.map((a) => String(a.studentId)))];
  const students = await UserModel.find({ _id: { $in: studentIds } }).lean();
  const studentById = new Map(students.map((s) => [String(s._id), s]));

  let seq = 0;
  const alerts = attempts.flatMap((a) => {
    const student = studentById.get(String(a.studentId));
    const exam = examById.get(String(a.examId));
    const name = student?.fullName ?? "Étudiant";
    return (a.antiCheatEvents ?? []).map((ev: any) => ({
      id: `${a._id}-${seq++}`,
      student: name,
      initials: initialsOf(name),
      exam: exam?.title ?? "Examen",
      type: ALERT_LABELS[ev.type] ?? ev.type,
      severity: alertSeverity(ev.type ?? ""),
      time: relativeFr(ev.timestamp),
      ts: new Date(ev.timestamp ?? Date.now()).getTime(),
    }));
  });
  alerts.sort((x, y) => y.ts - x.ts);

  res.json({ alerts: alerts.slice(0, 20).map(({ ts, ...rest }) => rest) });
});

// ─── Vue d'ensemble du dashboard ───────────────────────────────────────────

router.get("/dashboard", async (req, res) => {
  const teacherId = req.auth!.userId;

  const exams = await ExamModel.find({ createdBy: teacherId }).lean();
  const examIds = exams.map((e) => e._id);
  const examById = new Map(exams.map((e) => [String(e._id), e]));

  const attempts = await ExamAttemptModel.find({ examId: { $in: examIds } })
    .sort({ updatedAt: -1 })
    .lean();

  // Statistiques
  const activeExams = exams.filter(
    (e) => e.status === "live" || e.status === "scheduled",
  ).length;
  const studentsOnline = new Set(
    attempts
      .filter((a) => a.status === "in-progress")
      .map((a) => String(a.studentId)),
  ).size;
  const fraudAlerts = attempts.reduce(
    (sum, a) => sum + (a.antiCheatEvents?.length ?? 0),
    0,
  );
  const gradedAttempts = attempts.filter(
    (a) => a.status === "graded" && a.score != null,
  );
  const passedCount = gradedAttempts.filter((a) => {
    const exam = examById.get(String(a.examId));
    return (a.score ?? 0) >= (exam?.passingScore ?? 12);
  }).length;
  const successRate = gradedAttempts.length
    ? Math.round((passedCount / gradedAttempts.length) * 100)
    : 0;

  // Flux d'activité
  const events: { id: string; text: string; ts: Date; type: "info" | "alert" }[] = [];
  for (const e of exams) {
    if (e.createdAt) {
      events.push({
        id: `exam-${e._id}`,
        text: `Examen « ${e.title} » créé`,
        ts: new Date(e.createdAt),
        type: "info",
      });
    }
  }
  for (const a of attempts) {
    const exam = examById.get(String(a.examId));
    if (!exam) continue;
    if (a.submittedAt) {
      events.push({
        id: `sub-${a._id}`,
        text: `${exam.title} — copie rendue`,
        ts: new Date(a.submittedAt),
        type: "info",
      });
    }
    if ((a.antiCheatEvents?.length ?? 0) > 0) {
      const last = a.antiCheatEvents[a.antiCheatEvents.length - 1];
      events.push({
        id: `ac-${a._id}`,
        text: `${exam.title} — alerte anti-triche`,
        ts: new Date(last?.timestamp ?? a.updatedAt ?? Date.now()),
        type: "alert",
      });
    }
  }
  const activity = events
    .sort((x, y) => y.ts.getTime() - x.ts.getTime())
    .slice(0, 6)
    .map((e) => ({
      id: e.id,
      text: e.text,
      time: `${pad(e.ts.getUTCHours())}:${pad(e.ts.getUTCMinutes())}`,
      type: e.type,
    }));

  res.json({
    stats: { activeExams, studentsOnline, fraudAlerts, successRate },
    activity,
  });
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

// ─── Étudiants — liste avec statistiques (onglet Étudiants) ────────────────

router.get("/students/roster", async (req, res) => {
  const teacherId = req.auth!.userId;
  const exams = await ExamModel.find({ createdBy: teacherId }).lean();
  const examIds = exams.map((e) => e._id);

  const studentIdSet = new Set<string>();
  const examCountByStudent = new Map<string, number>();
  for (const e of exams) {
    for (const sid of e.enrolledStudents ?? []) {
      const key = String(sid);
      studentIdSet.add(key);
      examCountByStudent.set(key, (examCountByStudent.get(key) ?? 0) + 1);
    }
  }

  const [students, attempts] = await Promise.all([
    UserModel.find({ _id: { $in: [...studentIdSet] }, role: "student" })
      .sort({ fullName: 1 })
      .lean(),
    ExamAttemptModel.find({ examId: { $in: examIds } }).lean(),
  ]);

  const attemptsByStudent = new Map<string, any[]>();
  for (const a of attempts) {
    const key = String(a.studentId);
    const list = attemptsByStudent.get(key) ?? [];
    list.push(a);
    attemptsByStudent.set(key, list);
  }

  res.json({
    students: students.map((s) =>
      mapStudent(
        s,
        attemptsByStudent.get(String(s._id)) ?? [],
        examCountByStudent.get(String(s._id)) ?? 0,
      ),
    ),
  });
});

// ─── Étudiants — détail (modale profil étudiant) ───────────────────────────

router.get("/students/:id", async (req, res) => {
  const teacherId = req.auth!.userId;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ error: "student not found" });
  }
  const user = await UserModel.findOne({ _id: req.params.id, role: "student" }).lean();
  if (!user) return res.status(404).json({ error: "student not found" });

  const exams = await ExamModel.find({ createdBy: teacherId }).lean();
  const examIds = exams.map((e) => e._id);
  const examById = new Map(exams.map((e) => [String(e._id), e]));
  const attempts = await ExamAttemptModel.find({
    examId: { $in: examIds },
    studentId: user._id,
  }).lean();
  const examCount = exams.filter((e) =>
    (e.enrolledStudents ?? []).some((sid) => String(sid) === String(user._id)),
  ).length;

  const examHistory = attempts
    .filter((a) => a.submittedAt)
    .sort(
      (x, y) =>
        new Date(y.submittedAt!).getTime() - new Date(x.submittedAt!).getTime(),
    )
    .map((a) => {
      const exam = examById.get(String(a.examId));
      return {
        exam: exam?.title ?? "Examen",
        date: formatDateShort(new Date(a.submittedAt!)),
        score: a.score ?? 0,
        status:
          (a.score ?? 0) >= (exam?.passingScore ?? 12) ? "passed" : "failed",
      };
    });

  res.json({
    student: mapStudent(user, attempts, examCount),
    examHistory,
  });
});

// ─── Analytiques ───────────────────────────────────────────────────────────

router.get("/analytics", async (req, res) => {
  const teacherId = req.auth!.userId;
  const examIdFilter = typeof req.query.examId === "string" ? req.query.examId : "";

  const exams = await ExamModel.find({ createdBy: teacherId }).lean();
  const examIds = exams.map((e) => e._id);
  const examById = new Map(exams.map((e) => [String(e._id), e]));
  const attempts = await ExamAttemptModel.find({ examId: { $in: examIds } }).lean();
  const gradedAll = attempts.filter((a) => a.score != null && a.submittedAt);

  const passed = (a: any) => {
    const exam = examById.get(String(a.examId));
    return (a.score ?? 0) >= (exam?.passingScore ?? 12);
  };

  // Synthèse
  const enrolledIds = new Set<string>();
  for (const e of exams) {
    for (const sid of e.enrolledStudents ?? []) enrolledIds.add(String(sid));
  }
  const summary = {
    successRate: gradedAll.length
      ? Math.round((gradedAll.filter(passed).length / gradedAll.length) * 100)
      : 0,
    totalStudents: enrolledIds.size,
    examsCompleted: exams.filter((e) => e.status === "completed").length,
  };

  // Performance par module
  const moduleMap = new Map<string, { scores: number[]; passing: number[]; students: Set<string> }>();
  for (const e of exams) {
    if (!moduleMap.has(e.subject)) {
      moduleMap.set(e.subject, { scores: [], passing: [], students: new Set() });
    }
    moduleMap.get(e.subject)!.passing.push(e.passingScore ?? 12);
  }
  for (const a of gradedAll) {
    const exam = examById.get(String(a.examId));
    if (!exam) continue;
    const entry = moduleMap.get(exam.subject);
    if (!entry) continue;
    entry.scores.push(a.score ?? 0);
    entry.students.add(String(a.studentId));
  }
  const byModule = [...moduleMap.entries()].map(([subject, e]) => {
    const avg = e.scores.length
      ? e.scores.reduce((s, v) => s + v, 0) / e.scores.length
      : 0;
    const passing = e.passing.length
      ? e.passing.reduce((s, v) => s + v, 0) / e.passing.length
      : 12;
    return {
      subject,
      avg: Math.round(avg * 10) / 10,
      passing: Math.round(passing * 10) / 10,
      best: e.scores.length ? Math.max(...e.scores) : 0,
      worst: e.scores.length ? Math.min(...e.scores) : 0,
      students: e.students.size,
    };
  });

  // Tendance — 6 derniers mois
  const now = new Date();
  const buckets = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (5 - i), 1));
    return {
      year: d.getUTCFullYear(),
      month: d.getUTCMonth(),
      label: MONTHS_FR_SHORT[d.getUTCMonth()],
      exams: 0,
      fraud: 0,
      gradedTotal: 0,
      gradedPassed: 0,
    };
  });
  const bucketFor = (date: Date) =>
    buckets.find(
      (b) => b.year === date.getUTCFullYear() && b.month === date.getUTCMonth(),
    );
  for (const e of exams) {
    if (!e.createdAt) continue;
    const b = bucketFor(new Date(e.createdAt));
    if (b) b.exams += 1;
  }
  for (const a of attempts) {
    for (const ev of a.antiCheatEvents ?? []) {
      const b = bucketFor(new Date(ev.timestamp ?? a.updatedAt ?? Date.now()));
      if (b) b.fraud += 1;
    }
    if (a.score != null && a.submittedAt) {
      const b = bucketFor(new Date(a.submittedAt));
      if (b) {
        b.gradedTotal += 1;
        if (passed(a)) b.gradedPassed += 1;
      }
    }
  }
  const trend = buckets.map((b) => ({
    month: b.label,
    exams: b.exams,
    fraud: b.fraud,
    success: b.gradedTotal
      ? Math.round((b.gradedPassed / b.gradedTotal) * 100)
      : 0,
  }));

  // Classement — top 5
  let rankingRows: { studentId: string; score: number }[];
  if (examIdFilter && mongoose.isValidObjectId(examIdFilter)) {
    rankingRows = gradedAll
      .filter((a) => String(a.examId) === examIdFilter)
      .map((a) => ({ studentId: String(a.studentId), score: a.score ?? 0 }));
  } else {
    const byStudent = new Map<string, number[]>();
    for (const a of gradedAll) {
      const key = String(a.studentId);
      (byStudent.get(key) ?? byStudent.set(key, []).get(key)!).push(a.score ?? 0);
    }
    rankingRows = [...byStudent.entries()].map(([studentId, scores]) => ({
      studentId,
      score:
        Math.round((scores.reduce((s, v) => s + v, 0) / scores.length) * 10) / 10,
    }));
  }
  rankingRows.sort((a, b) => b.score - a.score);
  const topRows = rankingRows.slice(0, 5);
  const rankUsers = await UserModel.find({
    _id: { $in: topRows.map((r) => r.studentId) },
  }).lean();
  const userById = new Map(rankUsers.map((u) => [String(u._id), u]));
  const ranking = topRows.map((r) => {
    const u = userById.get(r.studentId);
    return {
      id: r.studentId,
      name: u?.fullName ?? "Étudiant",
      department: u?.department ?? "",
      score: r.score,
    };
  });

  res.json({ summary, byModule, trend, ranking });
});

export default router;
