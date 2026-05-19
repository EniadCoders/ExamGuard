/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ROUTES DU PROFESSEUR - ExamGuard
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Ce fichier contient TOUTES les routes que le professeur peut utiliser:
 * - Créer, modifier, lancer des examens
 * - Surveiller les examens en direct
 * - Gérer les étudiants
 * - Consulter les statistiques
 * 
 * PROTECTION: Tous les endpoints exigent:
 * 1. Un JWT valide (requireAuth)
 * 2. Le rôle "teacher" (requireRole("teacher"))
 */

import { Router, type Request, type Response } from "express";
import mongoose from "mongoose";
import { ExamModel } from "../models/Exam.js";
import { ExamAttemptModel } from "../models/ExamAttempt.js";
import { UserModel } from "../models/User.js";
import { NotificationModel } from "../models/Notification.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { finalizeAttempt } from "../services/examGrading.js";
import { remainingSecondsFrom } from "../services/examTiming.js";
import { rewriteTextWithLlmApi, type RewriteKind } from "../services/llmRewrite.js";
import { sendCompletedExamReport } from "../services/examReportAutomation.js";

const router = Router();

// ✅ PROTECTION: Toutes les routes dessous exigent authentification + rôle "teacher"
// Si l'utilisateur n'a pas le rôle "teacher", il reçoit une erreur 403 Forbidden
router.use(requireAuth, requireRole("teacher"));

// ─── Helpers ───────────────────────────────────────────────────────────────
// 📝 Utilitaires pour formater, valider et convertir les données

// 🌍 Mois en français pour afficher les dates au professeur
const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

// 🔤 Lettres A-Z pour identifier les options MCQ (A, B, C, D, ...)
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// ⏰ Fonction pour ajouter des zéros: 9 → "09"
const pad = (n: number) => n.toString().padStart(2, "0");

/**
 * 📅 PARSER DE DATES
 * 
 * Convertit "2026-05-18T14:00" (format du HTML5 datetime-local)
 * en objet Date JavaScript UTC
 * 
 * Exemple:
 *   parseExamDate("2026-05-18T14:00") → Date(2026-05-18 14:00 UTC)
 *   parseExamDate("") → undefined
 */
function parseExamDate(input?: string): Date | undefined {
  if (!input) return undefined;
  const m = String(input).match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/);
  if (!m) {
    const d = new Date(input);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] ?? 0), +(m[5] ?? 0)));
}

/**
 * 📅 FORMATER DATES - Format long
 * 
 * Retourne: "9 Avril 2026 à 09:00"
 * Utilisé: Afficher l'horaire de l'examen au professeur
 */
function formatExamDateFr(d: Date): string {
  const base = `${d.getUTCDate()} ${MONTHS_FR[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  return `${base} à ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

// 🗓️ Noms de mois abrégés
const MONTHS_FR_SHORT = [
  "Janv", "Févr", "Mars", "Avr", "Mai", "Juin",
  "Juil", "Août", "Sept", "Oct", "Nov", "Déc",
];

/**
 * 📅 FORMATER DATES - Format court
 * 
 * Retourne: "9 Avr 2026"
 * Utilisé: Lister les examens compactement
 */
function formatDateShort(d: Date): string {
  return `${d.getUTCDate()} ${MONTHS_FR_SHORT[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/**
 * ⏱️ FORMAT TEMPS RELATIF
 * 
 * Convertit un timestamp en phrase lisible:
 *   "Actif maintenant" (< 1 min)
 *   "Il y a 5 min" (< 1 heure)
 *   "Il y a 2 h" (< 1 jour)
 *   "Il y a 3 j" (< 1 semaine)
 *   "9 Avr 2026" (> 1 semaine)
 * 
 * Utilisé: Afficher "Dernière connexion: Il y a 5 min"
 */
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

/**
 * 🔢 GÉNÉRER CODE UNIQUE DE REJOINTE
 * 
 * Crée un code aléatoire unique de 6 caractères (A-Z + 2-9)
 * Exemple: "A3K9R2"
 * 
 * Processus:
 * 1. Génère un code aléatoire
 * 2. Vérifie que ce code n'existe pas déjà en DB
 * 3. Si existe déjà, recommence (jusqu'à 20 fois)
 * 4. Retourne le code unique
 * 
 * Utilisé: Quand le professeur crée un examen
 *   Les étudiants utilisent ce code pour rejoindre l'examen
 */
async function generateJoinCode(): Promise<string> {
  // Alphabet sans 0, 1, I, O pour éviter les confusions (0 vs O, 1 vs I)
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  
  // Essayer jusqu'à 20 fois (normalement trouvé à la 1ère tentative)
  for (let attempt = 0; attempt < 20; attempt++) {
    let code = "";
    
    // Générer 6 caractères aléatoires
    for (let i = 0; i < 6; i++) {
      code += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    
    // Vérifier que ce code n'existe pas déjà dans la base de données
    const exists = await ExamModel.exists({ joinCode: code });
    if (!exists) return code;  // ✅ Code unique trouvé!
  }
  
  throw new Error("could not generate a unique join code");
}

/**
 * ✅ VALIDER QUESTIONS
 * 
 * Vérifie que toutes les questions ont un énoncé non-vide
 * Retourne: Liste des numéros de questions vides (1-indexées)
 * 
 * Exemple:
 *   Entrée: [{ text: "Q1" }, { text: "" }, { text: "Q3" }]
 *   Sortie: [2]  ← La question 2 est vide
 */
function findEmptyQuestionTexts(draft: any[]): number[] {
  return (Array.isArray(draft) ? draft : [])
    .map((q, i) => (String(q?.text ?? "").trim() ? -1 : i + 1))  // -1 si ok, i+1 si vide
    .filter((i) => i > 0);  // Garder seulement les numéros
}

/**
 * 🔄 CONVERTIR QUESTIONS: Format EDITEUR → Format STOCKÉ
 * 
 * Le frontend envoie les questions dans un format facile à éditer:
 *   - Options: tableau de strings ["Option A", "Option B"]
 *   - Correctes: indices [0, 2]
 * 
 * Le backend les convertit au format stocké en DB:
 *   - Options: objets {id: "A", text: "Option A"}
 *   - Correctes: IDs ["A", "C"]
 * 
 * Exemple:
 *   AVANT (frontend):
 *   {
 *     type: "mcq",
 *     options: ["Java", "Python", "C++"],
 *     correct: [0, 2]
 *   }
 *   
 *   APRÈS (DB):
 *   {
 *     type: "mcq",
 *     options: [{id: "A", text: "Java"}, {id: "B", text: "Python"}, {id: "C", text: "C++"}],
 *     correctOptionIds: ["A", "C"]
 *   }
 */
function draftToStored(draft: any[]): any[] {
  return (Array.isArray(draft) ? draft : []).map((q, index) => {
    const id = typeof q.id === "number" ? q.id : index + 1;
    const points = Number(q.points) || 0;
    
    // ═════ MCQ ═════
    if (q.type === "mcq") {
      // Convertir options simples → objets {id, text}
      const options = (q.options ?? []).map((text: string, i: number) => ({
        id: LETTERS[i] ?? `O${i}`,  // A, B, C, ... ou O0, O1, ...
        text: String(text ?? ""),
      }));
      
      // Convertir indices → IDs
      const correctIds = (q.correct ?? [])
        .map((i: number) => options[i]?.id)
        .filter(Boolean);
      
      return {
        id, type: "mcq", text: String(q.text ?? ""), points,
        options,
        correctOptionIds: correctIds,        // Pour multi-réponses
        correctOptionId: correctIds[0],      // Pour simple réponse
        multiple: !!q.multiple,
      };
    }
    
    // ═════ CODE ═════
    if (q.type === "code") {
      return {
        id, type: "code", text: String(q.text ?? ""), points,
        language: q.language ?? "java",
        starterCode: q.starterCode ?? "",
      };
    }
    
    // ═════ TEXTE ═════
    return { id, type: "text", text: String(q.text ?? ""), points };
  });
}

/**
 * 🔄 CONVERTIR QUESTIONS: Format STOCKÉ → Format EDITEUR
 * 
 * Inverse la conversion précédente pour renvoyer les questions
 * dans le format que le frontend attend
 */
function storedToDraft(questions: any[]): any[] {
  return (questions ?? []).map((q) => {
    if (q.type === "mcq") {
      const options = (q.options ?? []).map((o: any) => o.text);
      
      // Récupérer les IDs des bonnes réponses
      const ids = q.correctOptionIds?.length
        ? q.correctOptionIds
        : q.correctOptionId
          ? [q.correctOptionId]
          : [];
      
      // Convertir IDs → indices
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

/**
 * 📊 SÉRIALISER EXAMEN
 * 
 * Convertit le document MongoDB en format JSON pour le frontend
 * Applique les transformations et calculs nécessaires
 */
function mapExam(exam: any) {
  return {
    id: String(exam._id),                                           // Convertir ObjectId en string
    title: exam.title,
    subject: exam.subject,
    duration: exam.durationMinutes,
    date: exam.scheduledAt ? formatExamDateFr(new Date(exam.scheduledAt)) : "",
    students: exam.enrolledStudents?.length ?? 0,                   // Nombre d'étudiants inscrits
    status: exam.status,
    questions: exam.questions?.length ?? 0,                         // Nombre de questions
    description: exam.description ?? "",
    passingScore: exam.passingScore ?? 12,
    selectedStudentIds: (exam.enrolledStudents ?? []).map((id: any) => String(id)),  // IDs des étudiants
    importedFileName: exam.importedFileName ?? "",
    draftQuestions: storedToDraft(exam.questions ?? []),             // Convertir au format éditeur
    launchMode: exam.launchMode ?? "auto",
    previousStatus: exam.previousStatus ?? undefined,
    rules: exam.rules ?? undefined,
    joinCode: exam.joinCode,                                        // Code de rejointe (ex: A3K9R2)
  };
}

/**
 * 📬 CRÉER NOTIFICATIONS POUR LES ÉTUDIANTS
 * 
 * Crée une notification in-app pour chaque étudiant inscrit
 * 
 * Exemple:
 *   notifyStudents(
 *     ["id1", "id2"],
 *     "exam-launched",
 *     "Examen démarré!",
 *     "Vous pouvez le rejoindre maintenant"
 *   )
 * 
 * Résultat: Deux notifications créées en DB
 */
async function notifyStudents(
  studentIds: readonly (string | mongoose.Types.ObjectId)[],
  type: string,
  title: string,
  message: string,
) {
  if (!studentIds.length) return;  // Rien à faire si pas d'étudiants
  
  // Créer une notification pour chaque étudiant
  await NotificationModel.insertMany(
    studentIds.map((userId) => ({ userId, type, title, message })),
  );
}

/**
 * 🔐 CONVERTIR EN OBJECTIDS MONGODB
 * 
 * Reçoit une liste d'IDs (strings ou ObjectIds)
 * Retourne seulement les IDs valides convertis en ObjectId MongoDB
 * 
 * Utilisé: Pour les listes d'étudiants inscrits à un examen
 */
function toObjectIds(ids: unknown): mongoose.Types.ObjectId[] {
  if (!Array.isArray(ids)) return [];
  const uniqueIds = new Set<string>();
  return ids
    .map((id) => String(id).trim())
    .filter((id) => id && mongoose.isValidObjectId(id))
    .filter((id) => {
      if (uniqueIds.has(id)) return false;
      uniqueIds.add(id);
      return true;
    })
    .map((id) => new mongoose.Types.ObjectId(id));
}

/**
 * 👤 SÉRIALISER ÉTUDIANT
 * 
 * Convertit un utilisateur en objet d'affichage pour le dashboard du professeur
 * Calcule les statistiques de l'étudiant (moyenne, nombre exams, etc.)
 */
function mapStudent(user: any, attempts: any[], examCount: number) {
  // Filtrer les tentatives qui ont un score (les corrigées)
  const graded = attempts.filter((a) => a.score != null);
  
  // Calculer la moyenne (arrondir à 1 décimale)
  const avg = graded.length
    ? Math.round(
        (graded.reduce((sum, a) => sum + (a.score ?? 0), 0) / graded.length) * 10,
      ) / 10
    : 0;
  
  return {
    id: String(user._id),
    name: user.fullName,
    email: user.email,
    exams: examCount,                              // Nombre d'exams du prof auxquels inscrit
    avg,                                           // Moyenne des scores
    status: user.status === "active" ? "active" : "inactive",
    lastActive: relativeFr(user.lastLoginAt),     // "Il y a 5 min", "Jamais"
    department: user.department ?? "",
    year: "",
    studentId: user.studentIdentifier ?? "",      // APO ou CNE
  };
}

// ─── Examens — liste ───────────────────────────────────────────────────────

function isRewriteKind(value: unknown): value is RewriteKind {
  return value === "title" || value === "description" || value === "question" || value === "answer";
}

router.post("/ai/rewrite", async (req, res) => {
  const body = req.body ?? {};
  if (!isRewriteKind(body.kind)) {
    return res.status(400).json({ error: "invalid rewrite kind" });
  }

  try {
    const text = await rewriteTextWithLlmApi({
      kind: body.kind,
      text: String(body.text ?? ""),
      subject: typeof body.subject === "string" ? body.subject : undefined,
      title: typeof body.title === "string" ? body.title : undefined,
    });
    res.json({ text });
  } catch (err) {
    const status = (err as Error & { status?: number }).status;
    res.status(status && status >= 400 && status < 600 ? status : 502).json({
      error: err instanceof Error ? err.message : "rewrite failed",
    });
  }
});

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
  const emptyTextPositions = findEmptyQuestionTexts(body.questions);
  if (emptyTextPositions.length) {
    return res.status(400).json({
      error: `l'énoncé est obligatoire pour la/les question(s) ${emptyTextPositions.join(", ")}`,
    });
  }
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

  // Examen publié : prévenir les étudiants inscrits.
  if (exam.status === "scheduled" && exam.enrolledStudents.length) {
    await notifyStudents(
      exam.enrolledStudents.map(String),
      "exam-scheduled",
      `Nouvel examen — ${exam.title}`,
      `Vous êtes inscrit à l'examen « ${exam.title} » (${exam.subject}).`,
    );
  }

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
  let newlyEnrolled: mongoose.Types.ObjectId[] = [];
  if (body.studentIds !== undefined) {
    const before = new Set((exam.enrolledStudents ?? []).map((id) => String(id)));
    const next = toObjectIds(body.studentIds);
    newlyEnrolled = next.filter((id) => !before.has(String(id)));
    exam.enrolledStudents = next as any;
  }
  if (body.questions !== undefined) {
    const emptyTextPositions = findEmptyQuestionTexts(body.questions);
    if (emptyTextPositions.length) {
      return res.status(400).json({
        error: `l'énoncé est obligatoire pour la/les question(s) ${emptyTextPositions.join(", ")}`,
      });
    }
    const questions = draftToStored(body.questions);
    exam.questions = questions as any;
    exam.totalPoints = questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);
  }
  if (body.status === "draft" || body.status === "scheduled") exam.status = body.status;

  await exam.save();

  // Étudiants ajoutés à un examen visible : les en prévenir.
  if (newlyEnrolled.length && exam.status !== "draft" && exam.status !== "archived") {
    await notifyStudents(
      newlyEnrolled.map(String),
      "exam-scheduled",
      `Nouvel examen — ${exam.title}`,
      `Vous êtes inscrit à l'examen « ${exam.title} » (${exam.subject}).`,
    );
  }

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

  // Examen lancé : prévenir les étudiants inscrits qu'ils peuvent le rejoindre.
  if (exam.enrolledStudents.length) {
    await notifyStudents(
      exam.enrolledStudents.map(String),
      "exam-live",
      `Examen démarré — ${exam.title}`,
      `L'examen « ${exam.title} » a démarré. Vous pouvez le rejoindre dès maintenant.`,
    );
  }

  res.json({ exam: mapExam(exam.toObject()) });
});

// ─── Examens — clôturer (statut "completed") ───────────────────────────────

// POST /exams/:id/complete : clôt un examen en cours.
// L'examen passe en "completed" (plus aucun étudiant ne peut le rejoindre) et
// les tentatives encore ouvertes sont soumises automatiquement avec leurs
// réponses actuelles.
router.post("/exams/:id/complete", async (req, res) => {
  const teacherId = req.auth!.userId;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ error: "exam not found" });
  }
  const exam = await ExamModel.findOne({ _id: req.params.id, createdBy: teacherId });
  if (!exam) return res.status(404).json({ error: "exam not found" });
  if (exam.status === "completed") {
    let reportSent = false;
    try {
      await sendCompletedExamReport(exam._id);
      reportSent = true;
    } catch (err) {
      console.error("[n8n] failed to send completed exam report:", err);
    }
    return res.json({ exam: mapExam(exam.toObject()), reportSent });
  }
  if (exam.status !== "live") {
    return res.status(409).json({ error: "only a live exam can be completed" });
  }

  // Soumettre les tentatives encore en cours avec leurs reponses actuelles.
  const openAttempts = await ExamAttemptModel.find({
    examId: exam._id,
    status: "in-progress",
  });
  const examData = exam.toObject();
  for (const attempt of openAttempts) {
    await finalizeAttempt(attempt, examData, {
      autoSubmitted: true,
      autoSubmitTitle: "Examen cloture par l'enseignant",
    });
  }

  exam.status = "completed";
  await exam.save();

  let reportSent = false;
  try {
    await sendCompletedExamReport(exam._id);
    reportSent = true;
  } catch (err) {
    console.error("[n8n] failed to send completed exam report:", err);
  }

  res.json({ exam: mapExam(exam.toObject()), reportSent });
});

// Examens - suppression
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
    // Pas de tentative = l'étudiant n'a pas encore rejoint l'examen.
    const state = !attempt
      ? "not-joined"
      : attempt.kicked
        ? "kicked"
        : submitted
          ? "submitted"
          : flagged
            ? "flagged"
            : "active";
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

  const lc = (exam.liveControl ?? {}) as any;
  // Chrono de l'examen : ancré sur la première tentative démarrée, pour que le
  // moniteur affiche exactement le même temps restant que les étudiants.
  const startTimes = attempts
    .map((a) => a.startedAt)
    .filter(Boolean)
    .map((d) => new Date(d as any).getTime());
  const remainingSeconds = startTimes.length
    ? remainingSecondsFrom(exam, new Date(Math.min(...startTimes)))
    : (exam.durationMinutes + (lc.extraMinutes ?? 0)) * 60;
  res.json({
    participants,
    alerts: alerts.map(({ ts, ...rest }) => rest),
    remainingSeconds,
    liveControl: {
      paused: !!lc.paused,
      extraMinutes: lc.extraMinutes ?? 0,
      submissionsLocked: !!lc.submissionsLocked,
    },
  });
});

// ─── Pilotage en direct (pause / durée / verrouillage / message / exclusion) ──

/** Charge un examen "live" appartenant au professeur, ou renvoie une erreur HTTP. */
async function loadLiveExam(req: Request, res: Response) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).json({ error: "exam not found" });
    return null;
  }
  const exam = await ExamModel.findOne({
    _id: req.params.id,
    createdBy: req.auth!.userId,
  });
  if (!exam) {
    res.status(404).json({ error: "exam not found" });
    return null;
  }
  if (exam.status !== "live") {
    res.status(409).json({ error: "exam is not live" });
    return null;
  }
  // Examens créés avant l'ajout du pilotage en direct : initialise le sous-document.
  if (!exam.liveControl) exam.set("liveControl", {});
  return exam;
}

/** Projection de l'état de pilotage renvoyée après chaque action. */
function liveControlView(exam: any) {
  const lc = exam.liveControl ?? {};
  return {
    paused: !!lc.paused,
    extraMinutes: lc.extraMinutes ?? 0,
    submissionsLocked: !!lc.submissionsLocked,
  };
}

// POST /exams/:id/extend : ajoute du temps à la durée de l'examen.
router.post("/exams/:id/extend", async (req, res) => {
  const exam = await loadLiveExam(req, res);
  if (!exam) return;
  const minutes = Number(req.body?.minutes);
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return res.status(400).json({ error: "minutes must be a positive number" });
  }
  exam.liveControl.extraMinutes = (exam.liveControl.extraMinutes ?? 0) + Math.round(minutes);
  await exam.save();
  res.json({ liveControl: liveControlView(exam) });
});

// POST /exams/:id/pause : suspend ou reprend l'examen pour tous les étudiants.
router.post("/exams/:id/pause", async (req, res) => {
  const exam = await loadLiveExam(req, res);
  if (!exam) return;
  const paused = !!req.body?.paused;
  const lc = exam.liveControl;
  if (paused && !lc.paused) {
    lc.paused = true;
    lc.pausedAt = new Date();
  } else if (!paused && lc.paused) {
    // Fin de pause : on cumule la durée écoulée pour décaler les échéances.
    const since = lc.pausedAt ? Date.now() - new Date(lc.pausedAt).getTime() : 0;
    lc.totalPausedMs = (lc.totalPausedMs ?? 0) + Math.max(0, since);
    lc.paused = false;
    lc.pausedAt = null;
  }
  await exam.save();
  res.json({ liveControl: liveControlView(exam) });
});

// POST /exams/:id/lock : verrouille ou déverrouille les soumissions.
router.post("/exams/:id/lock", async (req, res) => {
  const exam = await loadLiveExam(req, res);
  if (!exam) return;
  exam.liveControl.submissionsLocked = !!req.body?.locked;
  await exam.save();
  res.json({ liveControl: liveControlView(exam) });
});

// POST /exams/:id/message : envoie un message à un étudiant ou à tous les participants.
router.post("/exams/:id/message", async (req, res) => {
  const exam = await loadLiveExam(req, res);
  if (!exam) return;
  const text = String(req.body?.text ?? "").trim();
  if (!text) return res.status(400).json({ error: "text required" });
  const studentId = req.body?.studentId;

  const filter: Record<string, unknown> = { examId: exam._id, status: "in-progress" };
  if (studentId) {
    if (!mongoose.isValidObjectId(studentId)) {
      return res.status(400).json({ error: "invalid studentId" });
    }
    filter.studentId = studentId;
  }
  const attempts = await ExamAttemptModel.find(filter);
  for (const attempt of attempts) {
    if (!attempt.messages) attempt.messages = [] as any;
    attempt.messages.push({ text, sentAt: new Date() } as any);
    await attempt.save();
  }
  res.json({ ok: true, delivered: attempts.length });
});

// POST /exams/:id/kick : exclut un étudiant de l'examen.
router.post("/exams/:id/kick", async (req, res) => {
  const exam = await loadLiveExam(req, res);
  if (!exam) return;
  const studentId = req.body?.studentId;
  if (!mongoose.isValidObjectId(studentId)) {
    return res.status(400).json({ error: "invalid studentId" });
  }
  const attempt = await ExamAttemptModel.findOne({ examId: exam._id, studentId });
  if (!attempt) return res.status(404).json({ error: "student has not joined" });

  attempt.kicked = true;
  attempt.kickReason = String(req.body?.reason ?? "").trim();
  // Clôture la tentative avec les réponses actuelles si elle est encore ouverte.
  if (attempt.status === "in-progress") {
    await finalizeAttempt(attempt, exam.toObject(), {
      autoSubmitted: true,
      autoSubmitTitle: "Exclu de l'examen par l'enseignant",
    });
  } else {
    await attempt.save();
  }
  res.json({ ok: true });
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
