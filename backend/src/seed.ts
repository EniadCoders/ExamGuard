/**
 * Seed de démonstration : crée le professeur Prof. Dupont, une classe
 * d'étudiants, plusieurs examens de statuts variés et des tentatives
 * (notes, évènements anti-triche) afin que le dashboard professeur ET
 * le dashboard étudiant s'affichent sur des données réelles.
 *
 * Run:  npx tsx backend/src/seed.ts
 */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { connectToDatabase } from "./db.js";
import { UserModel } from "./models/User.js";
import { ExamModel } from "./models/Exam.js";
import { ExamAttemptModel } from "./models/ExamAttempt.js";
import { NotificationModel } from "./models/Notification.js";

const TEACHER = {
  email: "prof.dupont@univ.fr",
  password: "teacher123",
  fullName: "Prof. Dupont",
  department: "Informatique",
};

// Étudiants de l'ENIAD (Université Mohammed Premier) — filières IA, ROC, GINF, IRSI.
const STUDENTS = [
  { email: "zakariatest@gmail.com", password: "zakariaTest123", fullName: "Zakaria Test", program: "IA", department: "IA", identifier: "ZT2026" },
  { email: "yassine.elamrani@ump.ac.ma", password: "student123", fullName: "Yassine El Amrani", program: "IA", department: "IA", identifier: "EN24001" },
  { email: "salma.benali@ump.ac.ma", password: "student123", fullName: "Salma Benali", program: "IA", department: "IA", identifier: "EN24002" },
  { email: "mehdi.tazi@ump.ac.ma", password: "student123", fullName: "Mehdi Tazi", program: "ROC", department: "ROC", identifier: "EN24003" },
  { email: "imane.chraibi@ump.ac.ma", password: "student123", fullName: "Imane Chraibi", program: "ROC", department: "ROC", identifier: "EN24004" },
  { email: "anas.elfassi@ump.ac.ma", password: "student123", fullName: "Anas El Fassi", program: "GINF", department: "GINF", identifier: "EN24005" },
  { email: "hajar.bouazza@ump.ac.ma", password: "student123", fullName: "Hajar Bouazza", program: "GINF", department: "GINF", identifier: "EN24006" },
  { email: "othmane.idrissi@ump.ac.ma", password: "student123", fullName: "Othmane Idrissi", program: "IRSI", department: "IRSI", identifier: "EN24007" },
  { email: "khadija.alaoui@ump.ac.ma", password: "student123", fullName: "Khadija Alaoui", program: "IRSI", department: "IRSI", identifier: "EN24008" },
];

const mockQuestions = [
  {
    id: 1,
    type: "mcq" as const,
    text: "Quel principe garantit la compatibilite des modules lors d'un examen securise en Java?",
    points: 2,
    options: [
      { id: "A", text: "Le principe d'encapsulation garantit l'isolation des modules" },
      { id: "B", text: "La JVM assure la portabilite via le bytecode independant de la plateforme" },
      { id: "C", text: "Les interfaces definissent des contrats stricts entre modules" },
      { id: "D", text: "Le garbage collector gere la compatibilite memoire" },
    ],
    correctOptionId: "B",
  },
  {
    id: 2,
    type: "mcq" as const,
    text: "Quelle est la difference fondamentale entre une ArrayList et une LinkedList en Java?",
    points: 2,
    options: [
      { id: "A", text: "ArrayList utilise un tableau dynamique, acces O(1) indexe" },
      { id: "B", text: "LinkedList utilise des noeuds doublement chaines, insertion O(1)" },
      { id: "C", text: "Les deux ont la meme complexite temporelle pour toutes les operations" },
      { id: "D", text: "ArrayList est synchronisee contrairement a LinkedList" },
    ],
    correctOptionId: "A",
  },
  {
    id: 3,
    type: "text" as const,
    text: "Expliquez le concept de polymorphisme en programmation orientee objet.",
    points: 5,
    placeholder: "Redigez votre reponse ici...",
  },
  {
    id: 4,
    type: "code" as const,
    text: "Ecrivez une fonction Java qui retourne le second plus grand element d'un tableau.",
    points: 8,
    language: "java" as const,
    starterCode:
      "public class Main {\n    public static int secondLargest(int[] arr) {\n        // Votre code ici\n    }\n}\n",
  },
  {
    id: 5,
    type: "mcq" as const,
    text: "Quel patron de conception permet de creer des objets sans specifier leur classe concrete?",
    points: 2,
    options: [
      { id: "A", text: "Singleton" },
      { id: "B", text: "Factory Method" },
      { id: "C", text: "Observer" },
      { id: "D", text: "Decorator" },
    ],
    correctOptionId: "B",
  },
  {
    id: 6,
    type: "text" as const,
    text: "Decrivez les differences entre les exceptions verifiees et non verifiees en Java.",
    points: 4,
    placeholder: "Expliquez avec des exemples...",
    minWords: 50,
  },
  {
    id: 7,
    type: "code" as const,
    text: "Implementez un algorithme QuickSort en Python.",
    points: 10,
    language: "python" as const,
    starterCode:
      "def quicksort(arr):\n    # Votre code ici\n    pass\n\nprint(quicksort([3, 6, 8, 10, 1, 2, 1]))\n",
  },
  {
    id: 8,
    type: "mcq" as const,
    text: "Quelle instruction SQL retourne exactement les doublons dans une colonne 'email'?",
    points: 3,
    options: [
      { id: "A", text: "SELECT email FROM users WHERE COUNT(email) > 1" },
      { id: "B", text: "SELECT email FROM users GROUP BY email HAVING COUNT(*) > 1" },
      { id: "C", text: "SELECT DISTINCT email FROM users WHERE email IS DUPLICATE" },
      { id: "D", text: "SELECT email, COUNT(*) FROM users HAVING COUNT(*) > 1" },
    ],
    correctOptionId: "B",
  },
];
const totalPoints = mockQuestions.reduce((sum, q) => sum + q.points, 0);

type ExamTemplate = {
  title: string;
  subject: string;
  joinCode: string;
  durationMinutes: number;
  scheduledAt: Date;
  status: "draft" | "scheduled" | "live" | "completed" | "archived";
  /** Nombre d'étudiants ayant une tentative ; les autres sont seulement inscrits. */
  attemptCount: number;
};

const examTemplates: ExamTemplate[] = [
  { title: "Architecture Java EE", subject: "Génie Logiciel", joinCode: "JAVAEE", durationMinutes: 90, scheduledAt: new Date("2026-04-08T10:00:00Z"), status: "completed", attemptCount: 7 },
  { title: "Introduction au Cloud", subject: "Infrastructure", joinCode: "CLOUD1", durationMinutes: 120, scheduledAt: new Date("2026-04-22T14:30:00Z"), status: "completed", attemptCount: 6 },
  { title: "Bases de données NoSQL", subject: "Data Engineering", joinCode: "NOSQL1", durationMinutes: 75, scheduledAt: new Date("2026-05-17T09:00:00Z"), status: "live", attemptCount: 5 },
  { title: "Sécurité des Applications Web", subject: "Cybersécurité", joinCode: "WEBSEC", durationMinutes: 90, scheduledAt: new Date("2026-06-05T11:00:00Z"), status: "scheduled", attemptCount: 0 },
  { title: "Machine Learning Avancé", subject: "IA & Data Science", joinCode: "MLADV1", durationMinutes: 150, scheduledAt: new Date("2026-04-30T13:00:00Z"), status: "completed", attemptCount: 8 },
  { title: "Programmation Web", subject: "Développement", joinCode: "WEBDEV", durationMinutes: 60, scheduledAt: new Date("2026-06-12T09:00:00Z"), status: "draft", attemptCount: 0 },
  { title: "Algorithmique Avancée", subject: "Informatique", joinCode: "ALGOAV", durationMinutes: 120, scheduledAt: new Date("2026-03-18T09:00:00Z"), status: "archived", attemptCount: 6 },
];

/** Note déterministe (sur 20) pour une paire étudiant / examen. */
function scoreFor(studentIndex: number, examIndex: number): number {
  const base = 8 + ((studentIndex * 7 + examIndex * 5) % 12);
  return Math.min(20, base + (studentIndex % 2 === 0 ? 0.5 : 0));
}

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing");
  await connectToDatabase(uri);

  console.log("[seed] wiping previous seed data…");
  // Réinitialisation : on supprime le professeur Dupont et TOUS les étudiants
  // (peu importe leur email), ainsi que leurs examens / tentatives / notifications.
  const prevTeacher = await UserModel.findOne({ email: TEACHER.email });
  const prevStudents = await UserModel.find({ role: "student" }).select("_id");
  const prevStudentIds = prevStudents.map((u) => u._id);
  const prevIds = [...prevStudentIds, ...(prevTeacher ? [prevTeacher._id] : [])];
  const prevExams = await ExamModel.find({ createdBy: { $in: prevIds } }).select("_id");
  await ExamAttemptModel.deleteMany({
    $or: [
      { studentId: { $in: prevStudentIds } },
      { examId: { $in: prevExams.map((e) => e._id) } },
    ],
  });
  await NotificationModel.deleteMany({ userId: { $in: prevIds } });
  await ExamModel.deleteMany({ createdBy: { $in: prevIds } });
  await UserModel.deleteMany({ _id: { $in: prevIds } });

  console.log("[seed] creating teacher…");
  const teacher = await UserModel.create({
    email: TEACHER.email,
    passwordHash: await bcrypt.hash(TEACHER.password, 10),
    role: "teacher",
    fullName: TEACHER.fullName,
    department: TEACHER.department,
    status: "active",
    lastLoginAt: new Date(),
  });

  console.log(`[seed] creating ${STUDENTS.length} students…`);
  const students = await Promise.all(
    STUDENTS.map(async (s, i) =>
      UserModel.create({
        email: s.email,
        passwordHash: await bcrypt.hash(s.password, 10),
        role: "student",
        fullName: s.fullName,
        school: "ENIAD — Université Mohammed Premier",
        program: s.program,
        department: s.department,
        studentIdentifierType: "apogee",
        studentIdentifier: s.identifier,
        status: "active",
        // Connexions échelonnées pour varier "Dernière activité".
        lastLoginAt: new Date(Date.now() - i * 37 * 60 * 1000),
      }),
    ),
  );

  console.log("[seed] creating exams and attempts…");
  for (let ei = 0; ei < examTemplates.length; ei++) {
    const tpl = examTemplates[ei];
    const enrolled = tpl.status === "draft" ? [] : students.map((s) => s._id);
    const exam = await ExamModel.create({
      title: tpl.title,
      subject: tpl.subject,
      description: `Examen de ${tpl.subject}.`,
      durationMinutes: tpl.durationMinutes,
      scheduledAt: tpl.scheduledAt,
      status: tpl.status,
      passingScore: 12,
      launchMode: "auto",
      createdBy: teacher._id,
      enrolledStudents: enrolled,
      joinCode: tpl.joinCode,
      totalPoints,
      questions: mockQuestions,
    });

    const live = tpl.status === "live";
    for (let si = 0; si < tpl.attemptCount && si < students.length; si++) {
      const student = students[si];
      if (live) {
        // Tentative en cours : réponses partielles, parfois une alerte.
        const answered = 2 + (si % 4);
        await ExamAttemptModel.create({
          examId: exam._id,
          studentId: student._id,
          status: "in-progress",
          startedAt: new Date(Date.now() - 25 * 60 * 1000),
          maxScore: 20,
          answers: mockQuestions.slice(0, answered).map((q) => ({
            questionId: q.id,
            value: q.type === "mcq" ? "A" : "Réponse en cours…",
          })),
          antiCheatEvents:
            si % 2 === 0
              ? [
                  { type: "tab-blur", timestamp: new Date(Date.now() - 12 * 60 * 1000) },
                  { type: "fullscreen-exit", timestamp: new Date(Date.now() - 4 * 60 * 1000) },
                ]
              : [],
        });
      } else {
        // Tentative corrigée.
        const score = scoreFor(si, ei);
        await ExamAttemptModel.create({
          examId: exam._id,
          studentId: student._id,
          status: "graded",
          startedAt: tpl.scheduledAt,
          submittedAt: new Date(tpl.scheduledAt.getTime() + tpl.durationMinutes * 60 * 1000),
          score,
          maxScore: 20,
          answers: mockQuestions.map((q) => ({
            questionId: q.id,
            value: q.type === "mcq" ? q.correctOptionId : "Réponse rédigée.",
          })),
          antiCheatEvents:
            si === 1
              ? [{ type: "fullscreen-exit", timestamp: tpl.scheduledAt }]
              : [],
        });
      }
    }
  }

  console.log("[seed] creating notifications…");
  await NotificationModel.insertMany([
    {
      userId: students[0]._id,
      type: "exam-graded",
      title: "Note publiée",
      message: "Machine Learning Avancé : votre copie a été corrigée.",
      read: false,
    },
    {
      userId: students[0]._id,
      type: "exam-scheduled",
      title: "Nouvel examen programmé",
      message: "Sécurité des Applications Web — 5 Juin 11:00",
      read: false,
    },
    {
      userId: students[0]._id,
      type: "system",
      title: "Bienvenue sur ExamGuard",
      message: "Votre compte est prêt à l'emploi.",
      read: true,
    },
  ]);

  console.log("[seed] done.");
  console.log(`[seed] teacher: ${TEACHER.email} / ${TEACHER.password}`);
  console.log(`[seed] students ENIAD (${STUDENTS.length}) — mot de passe "student123" :`);
  for (const s of STUDENTS) console.log(`  - ${s.email} (${s.program})`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
