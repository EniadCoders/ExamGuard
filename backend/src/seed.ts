/**
 * One-off seed: creates Zakaria Test (student), a teacher, the 5 mock exams,
 * and matching attempts so the student dashboard renders against real data.
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

const STUDENT_EMAIL = "zakariatest@gmail.com";
const STUDENT_PASSWORD = "zakariaTest123";
const TEACHER_EMAIL = "prof.dupont@univ.fr";
const TEACHER_PASSWORD = "teacher123";

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

const examTemplates = [
  {
    title: "Architecture Java EE",
    subject: "Genie Logiciel",
    durationMinutes: 90,
    scheduledAt: new Date("2026-03-28T10:00:00Z"),
    studentAttempt: { status: "graded" as const, score: 17.4, maxScore: 20 },
  },
  {
    title: "Introduction au Cloud",
    subject: "Infrastructure",
    durationMinutes: 120,
    scheduledAt: new Date("2026-04-04T14:30:00Z"),
    studentAttempt: { status: "in-progress" as const, progress: 0.65 },
  },
  {
    title: "Bases de donnees NoSQL",
    subject: "Data Engineering",
    durationMinutes: 75,
    scheduledAt: new Date("2026-04-10T09:00:00Z"),
    studentAttempt: null,
  },
  {
    title: "Securite des Applications Web",
    subject: "Cybersecurite",
    durationMinutes: 90,
    scheduledAt: new Date("2026-04-15T11:00:00Z"),
    studentAttempt: null,
  },
  {
    title: "Machine Learning Avance",
    subject: "IA & Data Science",
    durationMinutes: 150,
    scheduledAt: new Date("2026-03-20T13:00:00Z"),
    studentAttempt: { status: "graded" as const, score: 18.4, maxScore: 20 },
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing");
  await connectToDatabase(uri);

  const existingStudent = await UserModel.findOne({ email: STUDENT_EMAIL });
  if (existingStudent) {
    console.log(`[seed] ${STUDENT_EMAIL} already exists — nothing to do.`);
    await mongoose.disconnect();
    return;
  }

  console.log("[seed] creating teacher…");
  const teacher = await UserModel.create({
    email: TEACHER_EMAIL,
    passwordHash: await bcrypt.hash(TEACHER_PASSWORD, 10),
    role: "teacher",
    fullName: "Prof. Dupont",
    department: "Informatique",
    status: "active",
  });

  console.log("[seed] creating Zakaria Test…");
  const student = await UserModel.create({
    email: STUDENT_EMAIL,
    passwordHash: await bcrypt.hash(STUDENT_PASSWORD, 10),
    role: "student",
    fullName: "Zakaria Test",
    school: "Faculté des Sciences d'Oujda (FSO)",
    program: "Informatique",
    department: "Informatique",
    studentIdentifierType: "apogee",
    studentIdentifier: "ZT2026",
    status: "active",
  });

  console.log("[seed] creating exams…");
  for (const tpl of examTemplates) {
    const exam = await ExamModel.create({
      title: tpl.title,
      subject: tpl.subject,
      description: "",
      durationMinutes: tpl.durationMinutes,
      scheduledAt: tpl.scheduledAt,
      status: "scheduled",
      createdBy: teacher._id,
      totalPoints,
      questions: mockQuestions,
    });

    if (tpl.studentAttempt) {
      const a = tpl.studentAttempt;
      await ExamAttemptModel.create({
        examId: exam._id,
        studentId: student._id,
        status: a.status,
        startedAt: tpl.scheduledAt,
        submittedAt: a.status === "graded" ? tpl.scheduledAt : undefined,
        score: a.status === "graded" ? a.score : undefined,
        maxScore: a.status === "graded" ? a.maxScore : undefined,
        answers: [],
        antiCheatEvents: [],
      });
    }
  }

  console.log("[seed] done.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
