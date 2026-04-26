import { useState } from "react";
import type { ReactNode } from "react";
import {
  Bell,
  LogOut,
  LayoutDashboard,
  FileText,
  AlertTriangle,
  BarChart3,
  Users,
  Plus,
  Calendar,
  Eye,
  TrendingUp,
  Shield,
  Clock,
  ChevronRight,
  Activity,
  X,
  Settings,
  Zap,
  CheckCircle2,
  Trash2,
  Info,
  Save,
  Search,
  Edit3,
  PieChart,
  Upload,
  UserPlus,
  Hash,
  Download,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  CheckSquare,
  AlertCircle,
  User,
} from "lucide-react";
import { useNavigate } from "react-router";
import { NotificationPanel } from "@/shared/components/NotificationPanel";
import { GridBackground } from "@/shared/components/GridBackground";
import { Logo } from "@/shared/components/BrandLogo";
import { ViewAllButton } from "@/shared/components/ViewAllButton";
import {
  DashboardCard,
  DashboardMetricCard,
  DashboardMetaItem,
  DashboardSectionCard,
  DashboardStatusBadge,
} from "@/shared/components/dashboard/DashboardCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

// ─── Shared Types ─────────────────────────────────────────────────────────────
interface Exam {
  id: number;
  title: string;
  subject: string;
  duration: number;
  date: string;
  students: number;
  status: "scheduled" | "draft" | "completed";
  questions: number;
  description?: string;
  passingScore?: number;
}

interface Student {
  id: number;
  name: string;
  email: string;
  exams: number;
  avg: number;
  status: "active" | "inactive";
  lastActive: string;
  department?: string;
  year?: string;
  studentId?: string;
}

// ─── Dashboard data ──────────────────────────────────────────────────────────
const stats = [
  { label: "Examens actifs", value: "12", change: "+3", trend: "up" as const, icon: FileText, desc: "vs. semaine dernière" },
  { label: "Étudiants en ligne", value: "247", change: "+18", trend: "up" as const, icon: Users, desc: "en ce moment" },
  { label: "Alertes fraude", value: "8", change: "+2", trend: "alert" as const, icon: AlertTriangle, desc: "dernières 24h" },
  { label: "Taux de réussite", value: "87%", change: "+5%", trend: "up" as const, icon: TrendingUp, desc: "ce semestre" },
];

const recentExams: Exam[] = [
  { id: 1, title: "Architecture Java EE", subject: "Génie logiciel", duration: 90, date: "09 Avril à 18:00", students: 45, status: "scheduled", questions: 12, description: "Examen couvrant les architectures d'entreprise Java, les patterns JEE, et les frameworks Spring/Hibernate.", passingScore: 60 },
  { id: 2, title: "Base de données avancées", subject: "Systèmes d'information", duration: 120, date: "10 Avril à 14:00", students: 38, status: "scheduled", questions: 15, description: "Examen sur les bases de données relationnelles avancées, SQL, NoSQL et optimisation.", passingScore: 55 },
  { id: 3, title: "Sécurité informatique", subject: "Cybersécurité", duration: 90, date: "12 Avril à 10:00", students: 52, status: "draft", questions: 8, description: "Introduction à la sécurité des systèmes d'information et protection des données.", passingScore: 60 },
];

const allExamsData: Exam[] = [
  { id: 1, title: "Architecture Java EE", subject: "Génie logiciel", duration: 90, date: "09 Avril 2026", students: 45, status: "scheduled", questions: 12, description: "Examen couvrant les architectures d'entreprise Java.", passingScore: 60 },
  { id: 2, title: "Base de données avancées", subject: "Systèmes d'information", duration: 120, date: "10 Avril 2026", students: 38, status: "scheduled", questions: 15, description: "Examen sur les bases de données.", passingScore: 55 },
  { id: 3, title: "Sécurité informatique", subject: "Cybersécurité", duration: 90, date: "12 Avril 2026", students: 52, status: "draft", questions: 8, description: "Introduction à la sécurité informatique.", passingScore: 60 },
  { id: 4, title: "Programmation Web", subject: "Développement", duration: 60, date: "15 Avril 2026", students: 31, status: "draft", questions: 10, description: "HTML, CSS, JavaScript et frameworks modernes.", passingScore: 50 },
  { id: 5, title: "Intelligence Artificielle", subject: "IA & ML", duration: 150, date: "18 Avril 2026", students: 28, status: "scheduled", questions: 20, description: "Machine learning, réseaux de neurones et IA appliquée.", passingScore: 65 },
];

const allStudentsData: Student[] = [
  { id: 1, name: "Marie Dubois", email: "marie.dubois@univ.fr", exams: 12, avg: 87, status: "active", lastActive: "Actif maintenant", department: "Informatique", year: "M2", studentId: "ETU-2024-001" },
  { id: 2, name: "Thomas Martin", email: "thomas.martin@univ.fr", exams: 10, avg: 92, status: "active", lastActive: "Il y a 5 min", department: "Génie logiciel", year: "M1", studentId: "ETU-2024-002" },
  { id: 3, name: "Sophie Bernard", email: "sophie.bernard@univ.fr", exams: 15, avg: 78, status: "inactive", lastActive: "Il y a 2 jours", department: "Cybersécurité", year: "M2", studentId: "ETU-2024-003" },
  { id: 4, name: "Lucas Petit", email: "lucas.petit@univ.fr", exams: 8, avg: 85, status: "active", lastActive: "Il y a 1 heure", department: "IA & Data", year: "L3", studentId: "ETU-2024-004" },
  { id: 5, name: "Emma Rousseau", email: "emma.rousseau@univ.fr", exams: 11, avg: 91, status: "active", lastActive: "Il y a 30 min", department: "Réseaux", year: "M1", studentId: "ETU-2024-005" },
  { id: 6, name: "Hugo Lefebvre", email: "hugo.lefebvre@univ.fr", exams: 7, avg: 73, status: "inactive", lastActive: "Il y a 5 jours", department: "Informatique", year: "L3", studentId: "ETU-2024-006" },
];

const fraudAlerts = [
  { id: 1, student: "Marie Dubois", initials: "MD", exam: "Réseaux & Sécurité", type: "Changement d'onglet multiple", time: "Il y a 2 min", severity: "high" },
  { id: 2, student: "Thomas Martin", initials: "TM", exam: "Algorithmique Avancée", type: "Détection de mouvement suspect", time: "Il y a 5 min", severity: "medium" },
  { id: 3, student: "Sophie Bernard", initials: "SB", exam: "Réseaux & Sécurité", type: "Comportement suspect détecté", time: "Il y a 8 min", severity: "high" },
  { id: 4, student: "Lucas Petit", initials: "LP", exam: "Architecture Java EE", type: "Tentative de copier-coller", time: "Il y a 12 min", severity: "medium" },
];

const activityFeed = [
  { id: 1, text: "Examen 'Java EE' démarré", time: "10:02", type: "start" },
  { id: 2, text: "Marie Dubois — alerte fraude", time: "10:05", type: "alert" },
  { id: 3, text: "47 étudiants connectés", time: "10:08", type: "info" },
  { id: 4, text: "Thomas Martin — avertissement", time: "10:11", type: "warn" },
  { id: 5, text: "Examen 'BDD' planifié", time: "10:15", type: "info" },
];

const analyticsData = [
  { subject: "Java EE", avg: 82, passing: 78, students: 45 },
  { subject: "BDD", avg: 76, passing: 68, students: 38 },
  { subject: "Sécurité", avg: 88, passing: 85, students: 52 },
  { subject: "Web", avg: 91, passing: 89, students: 31 },
  { subject: "IA", avg: 79, passing: 71, students: 28 },
];

const trendData = [
  { month: "Nov", exams: 18, fraud: 4, success: 84 },
  { month: "Déc", exams: 22, fraud: 6, success: 81 },
  { month: "Jan", exams: 15, fraud: 3, success: 86 },
  { month: "Fév", exams: 28, fraud: 7, success: 83 },
  { month: "Mar", exams: 32, fraud: 9, success: 85 },
  { month: "Avr", exams: 26, fraud: 8, success: 87 },
];

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
function ToggleSwitch({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      type="button"
      onClick={() => setOn(!on)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ${
        on ? "bg-black border-black" : "bg-[#E5E5E5] border-[#CCCCCC]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ${
          on ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ─── Stat Card ──────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "alert";
  icon: any;
  desc: string;
}
function StatCard({ label, value, change, trend, icon: Icon, desc }: StatCardProps) {
  return (
    <DashboardMetricCard
      icon={Icon}
      label={label}
      value={value}
      change={change}
      description={desc}
      iconTone={trend === "alert" ? "danger" : "default"}
      changeTone={trend === "alert" ? "danger" : "info"}
    />
  );
}

// ─── Quick Action Button ────────────────────────────────────────────────────────
function QuickActionButton({ icon: Icon, label, onClick }: { icon: any; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="dashboard-card dashboard-card-interactive flex w-full items-center gap-3 px-4 py-3 text-left group"
    >
      <div className="dashboard-icon-badge dashboard-icon-badge-neutral">
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm font-medium text-[var(--cyber-text)]">{label}</span>
      <ChevronRight className="ml-auto h-4 w-4 text-[var(--cyber-subtle-text)] transition-transform group-hover:translate-x-1" />
    </button>
  );
}

// ─── Modal Base ────────────────────────────────────────────────────────────────
function ModalBase({ children, onClose, title, wide = false }: {
  children: ReactNode;
  onClose: () => void;
  title: string;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 backdrop-blur-sm sm:items-center sm:p-4">
      <div className={`relative flex max-h-[92vh] w-full flex-col rounded-2xl border border-[#E5E5E5] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.18)] ${wide ? "max-w-3xl" : "max-w-2xl"}`}>
        <div className="flex items-center justify-between gap-3 rounded-t-2xl border-b border-[#E5E5E5] bg-[#FAFAFA] px-4 py-3 sm:px-6 sm:py-4">
          <h2 className="text-base font-bold text-black">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#EEEEEE] rounded-lg transition-colors">
            <X className="w-5 h-5 text-black" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

// ─── Exam Details Modal ────────────────────────────────────────────────────────
function ExamDetailsModal({ exam, onClose, onEdit }: { exam: Exam; onClose: () => void; onEdit: () => void }) {
  const participants = [
    { name: "Marie Dubois", score: 87, status: "completed" },
    { name: "Thomas Martin", score: 92, status: "completed" },
    { name: "Sophie Bernard", score: 78, status: "completed" },
    { name: "Lucas Petit", score: 85, status: "completed" },
    { name: "Emma Rousseau", score: 91, status: "completed" },
  ];

  return (
    <ModalBase title="Détails de l'examen" onClose={onClose} wide>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-black mb-1">{exam.title}</h3>
            <p className="text-sm text-[#666666]">{exam.subject}</p>
          </div>
          <span className={`px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 ${
            exam.status === "scheduled" ? "bg-black text-white"
            : exam.status === "completed" ? "bg-[#F5F5F5] text-black border border-[#CCCCCC]"
            : "bg-[#F5F5F5] text-[#666666] border border-[#E5E5E5]"
          }`}>
            {exam.status === "scheduled" ? "Planifié" : exam.status === "completed" ? "Terminé" : "Brouillon"}
          </span>
        </div>

        {/* Description */}
        {exam.description && (
          <div className="bg-[#F8F8F8] rounded-xl p-4 border border-[#E5E5E5]">
            <p className="text-sm text-[#444444] leading-relaxed">{exam.description}</p>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Clock, label: "Durée", value: `${exam.duration} min` },
            { icon: Users, label: "Étudiants", value: `${exam.students}` },
            { icon: Hash, label: "Questions", value: `${exam.questions}` },
            { icon: CheckSquare, label: "Score min.", value: `${exam.passingScore ?? 60}%` },
          ].map((item) => (
            <div key={item.label} className="bg-white border border-[#E5E5E5] rounded-xl p-4 text-center">
              <item.icon className="w-5 h-5 text-[#888888] mx-auto mb-2" />
              <p className="text-lg font-bold text-black">{item.value}</p>
              <p className="text-xs text-[#888888] mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Date */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#F5F5F5] rounded-xl">
          <Calendar className="w-4 h-4 text-[#666666]" />
          <div>
            <p className="text-xs text-[#888888]">Date planifiée</p>
            <p className="text-sm font-medium text-black">{exam.date}</p>
          </div>
        </div>

        {/* Participants */}
        <div>
          <h4 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Derniers participants
          </h4>
          <div className="divide-y divide-[#E5E5E5] border border-[#E5E5E5] rounded-xl overflow-hidden">
            {participants.map((p, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-[#FAFAFA] transition-colors">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{p.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <span className="text-sm text-black">{p.name}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-bold text-black">{p.score}/100</span>
                  <CheckCircle2 className="w-4 h-4 text-[#888888]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-b-2xl border-t border-[#E5E5E5] bg-[#FAFAFA] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <button onClick={onClose} className="px-4 py-2 rounded-xl border border-[#E5E5E5] text-sm font-medium text-black hover:bg-[#F5F5F5] transition-colors">
          Fermer
        </button>
        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-black text-sm font-medium text-black hover:bg-[#F5F5F5] transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Éditer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black hover:bg-[#222222] text-sm font-medium text-white transition-colors">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>
    </ModalBase>
  );
}

// ─── Edit Exam Modal ──────────────────────────────────────────────────────────
function EditExamModal({ exam, onClose, onSave }: { exam: Exam; onClose: () => void; onSave: (e: Exam) => void }) {
  const [title, setTitle] = useState(exam.title);
  const [subject, setSubject] = useState(exam.subject);
  const [duration, setDuration] = useState(exam.duration);
  const [date, setDate] = useState(exam.date);
  const [status, setStatus] = useState(exam.status);
  const [description, setDescription] = useState(exam.description ?? "");
  const [passingScore, setPassingScore] = useState(exam.passingScore ?? 60);

  return (
    <ModalBase title={`Éditer — ${exam.title}`} onClose={onClose}>
      <div className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-black mb-2">Titre de l'examen</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Matière</label>
            <select value={subject} onChange={e => setSubject(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all">
              <option>Génie logiciel</option>
              <option>Systèmes d'information</option>
              <option>Cybersécurité</option>
              <option>Développement</option>
              <option>IA & ML</option>
              <option>Réseaux</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Statut</label>
            <select value={status} onChange={e => setStatus(e.target.value as any)}
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all">
              <option value="draft">Brouillon</option>
              <option value="scheduled">Planifié</option>
              <option value="completed">Terminé</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Durée (min)</label>
            <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Score de passage (%)</label>
            <input type="number" value={passingScore} onChange={e => setPassingScore(Number(e.target.value))} min={0} max={100}
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-2">Date planifiée</label>
          <input value={date} onChange={e => setDate(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-2">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
            className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none" />
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-b-2xl border-t border-[#E5E5E5] bg-[#FAFAFA] px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
        <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-sm font-medium text-black hover:bg-[#F5F5F5] transition-colors">
          Annuler
        </button>
        <button
          onClick={() => { onSave({ ...exam, title, subject, duration, date, status, description, passingScore }); onClose(); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-[#222222] text-sm font-medium text-white transition-colors"
        >
          <Save className="w-4 h-4" />
          Enregistrer
        </button>
      </div>
    </ModalBase>
  );
}

// ─── Create Exam Modal ─────────────────────────────────────────────────────────
function CreateExamModal({ onClose, onCreated }: { onClose: () => void; onCreated?: () => void }) {
  const [examTitle, setExamTitle] = useState("");
  const [examSubject, setExamSubject] = useState("Génie logiciel");
  const [examDuration, setExamDuration] = useState(90);
  const [examDate, setExamDate] = useState("");
  const [examDesc, setExamDesc] = useState("");
  const [passingScore, setPassingScore] = useState(60);

  return (
    <ModalBase title="Créer un nouvel examen" onClose={onClose}>
      <div className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-black mb-2">Titre de l'examen *</label>
          <input
            type="text"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            placeholder="Ex: Architecture Java EE"
            className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-black transition-all"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Matière *</label>
            <select value={examSubject} onChange={e => setExamSubject(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all">
              <option>Génie logiciel</option>
              <option>Systèmes d'information</option>
              <option>Cybersécurité</option>
              <option>Développement</option>
              <option>IA & ML</option>
              <option>Réseaux</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Durée (min) *</label>
            <input
              type="number"
              value={examDuration}
              onChange={(e) => setExamDuration(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Date et heure</label>
            <input type="datetime-local" value={examDate} onChange={e => setExamDate(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Score de passage (%)</label>
            <input type="number" value={passingScore} onChange={e => setPassingScore(Number(e.target.value))} min={0} max={100}
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-2">Description</label>
          <textarea value={examDesc} onChange={e => setExamDesc(e.target.value)} rows={3}
            placeholder="Description de l'examen, objectifs pédagogiques..."
            className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none" />
        </div>

        <div className="bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl p-4">
          <p className="text-xs text-[#666666] flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#888888] flex-shrink-0" />
            L'examen sera créé en mode brouillon. Vous pourrez ajouter des questions et planifier l'examen par la suite.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-b-2xl border-t border-[#E5E5E5] bg-[#FAFAFA] px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
        <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-sm font-medium text-black hover:bg-[#F5F5F5] transition-colors">
          Annuler
        </button>
        <button
          onClick={() => { onCreated?.(); onClose(); }}
          disabled={!examTitle.trim()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-[#222222] text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
        >
          <Plus className="w-4 h-4" />
          Créer l'examen
        </button>
      </div>
    </ModalBase>
  );
}

// ─── Add Student Modal ─────────────────────────────────────────────────────────
function AddStudentModal({ onClose, onAdded }: { onClose: () => void; onAdded?: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("Informatique");
  const [year, setYear] = useState("L3");

  return (
    <ModalBase title="Ajouter un étudiant" onClose={onClose}>
      <div className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-black mb-2">Nom complet *</label>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="Ex: Marie Dubois"
            className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-black transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-2">Adresse email *</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="marie.dubois@univ.fr"
            className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-black transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-2">Numéro étudiant</label>
          <input value={studentId} onChange={e => setStudentId(e.target.value)}
            placeholder="ETU-2024-XXX"
            className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-black transition-all" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Département</label>
            <select value={department} onChange={e => setDepartment(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all">
              <option>Informatique</option>
              <option>Génie logiciel</option>
              <option>Cybersécurité</option>
              <option>IA & Data</option>
              <option>Réseaux</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Année</label>
            <select value={year} onChange={e => setYear(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all">
              <option>L1</option>
              <option>L2</option>
              <option>L3</option>
              <option>M1</option>
              <option>M2</option>
            </select>
          </div>
        </div>
        <div className="bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl p-4">
          <p className="text-xs text-[#666666] flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-[#888888] flex-shrink-0 mt-0.5" />
            Un email d'activation sera envoyé automatiquement à l'étudiant avec ses identifiants de connexion.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-b-2xl border-t border-[#E5E5E5] bg-[#FAFAFA] px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
        <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-sm font-medium text-black hover:bg-[#F5F5F5] transition-colors">
          Annuler
        </button>
        <button
          onClick={() => { onAdded?.(); onClose(); }}
          disabled={!name.trim() || !email.trim()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-[#222222] text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
        >
          <UserPlus className="w-4 h-4" />
          Ajouter l'étudiant
        </button>
      </div>
    </ModalBase>
  );
}

// ─── Student Details Modal ─────────────────────────────────────────────────────
function StudentDetailsModal({ student, onClose, onEdit }: { student: Student; onClose: () => void; onEdit: () => void }) {
  const examHistory = [
    { exam: "Architecture Java EE", date: "09 Avr", score: 87, status: "passed" },
    { exam: "Base de données", date: "15 Mar", score: 92, status: "passed" },
    { exam: "Sécurité informatique", date: "20 Fév", score: 78, status: "passed" },
    { exam: "Algorithmique", date: "05 Fév", score: 65, status: "passed" },
  ];

  return (
    <ModalBase title="Profil étudiant" onClose={onClose} wide>
      <div className="p-6 space-y-6">
        {/* Profile header */}
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-white">{student.name.split(" ").map(n => n[0]).join("")}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-black mb-1">{student.name}</h3>
            <div className="flex flex-wrap items-center gap-3 text-sm text-[#666666]">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{student.email}</span>
              {student.department && <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />{student.department}</span>}
              {student.year && <span className="flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" />{student.year}</span>}
            </div>
            {student.studentId && (
              <p className="text-xs text-[#888888] mt-1">{student.studentId}</p>
            )}
          </div>
          <span className={`px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 ${
            student.status === "active" ? "bg-black text-white" : "bg-[#F5F5F5] text-[#666666] border border-[#E5E5E5]"
          }`}>
            {student.status === "active" ? "Actif" : "Inactif"}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Examens passés", value: student.exams.toString(), icon: FileText },
            { label: "Moyenne générale", value: `${student.avg}%`, icon: TrendingUp },
            { label: "Dernière activité", value: student.lastActive, icon: Clock },
          ].map((item) => (
            <div key={item.label} className="bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl p-4">
              <item.icon className="w-4 h-4 text-[#888888] mb-2" />
              <p className="text-lg font-bold text-black">{item.value}</p>
              <p className="text-xs text-[#888888] mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Exam history */}
        <div>
          <h4 className="text-sm font-bold text-black mb-3">Historique des examens</h4>
          <div className="divide-y divide-[#E5E5E5] border border-[#E5E5E5] rounded-xl overflow-hidden">
            {examHistory.map((e, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-[#FAFAFA] transition-colors">
                <div>
                  <p className="text-sm font-medium text-black">{e.exam}</p>
                  <p className="text-xs text-[#888888]">{e.date}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-bold text-black">{e.score}/100</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    e.score >= 60 ? "bg-black text-white" : "bg-[#F5F5F5] text-[#666666] border border-[#E5E5E5]"
                  }`}>
                    {e.score >= 60 ? "Admis" : "Refusé"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-b-2xl border-t border-[#E5E5E5] bg-[#FAFAFA] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <button onClick={onClose} className="px-4 py-2 rounded-xl border border-[#E5E5E5] text-sm font-medium text-black hover:bg-[#F5F5F5] transition-colors">
          Fermer
        </button>
        <div className="flex gap-3">
          <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-black text-sm font-medium text-black hover:bg-[#F5F5F5] transition-colors">
            <Edit3 className="w-4 h-4" />
            Modifier
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black hover:bg-[#222222] text-sm font-medium text-white transition-colors">
            <Download className="w-4 h-4" />
            Rapport
          </button>
        </div>
      </div>
    </ModalBase>
  );
}

// ─── Edit Student Modal ─────────────────────────────────────────────────────────
function EditStudentModal({ student, onClose, onSave }: { student: Student; onClose: () => void; onSave: (s: Student) => void }) {
  const [name, setName] = useState(student.name);
  const [email, setEmail] = useState(student.email);
  const [department, setDepartment] = useState(student.department ?? "Informatique");
  const [year, setYear] = useState(student.year ?? "L3");
  const [status, setStatus] = useState(student.status);

  return (
    <ModalBase title={`Modifier — ${student.name}`} onClose={onClose}>
      <div className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-black mb-2">Nom complet</label>
          <input value={name} onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-2">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Département</label>
            <select value={department} onChange={e => setDepartment(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all">
              <option>Informatique</option>
              <option>Génie logiciel</option>
              <option>Cybersécurité</option>
              <option>IA & Data</option>
              <option>Réseaux</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Année</label>
            <select value={year} onChange={e => setYear(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all">
              <option>L1</option><option>L2</option><option>L3</option><option>M1</option><option>M2</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-2">Statut</label>
          <div className="flex gap-3">
            {(["active", "inactive"] as const).map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                  status === s ? "bg-black border-black text-white" : "bg-white border-[#E5E5E5] text-[#666666] hover:border-[#CCCCCC]"
                }`}>
                {s === "active" ? "Actif" : "Inactif"}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-b-2xl border-t border-[#E5E5E5] bg-[#FAFAFA] px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
        <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-sm font-medium text-black hover:bg-[#F5F5F5] transition-colors">
          Annuler
        </button>
        <button
          onClick={() => { onSave({ ...student, name, email, department, year, status }); onClose(); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-[#222222] text-sm font-medium text-white transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
        >
          <Save className="w-4 h-4" />
          Enregistrer
        </button>
      </div>
    </ModalBase>
  );
}

// ─── Import Data Modal ────────────────────────────────────────────────────────
function ImportDataModal({ onClose }: { onClose: () => void }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<"students" | "exams" | "results">("students");

  return (
    <ModalBase title="Importer des données" onClose={onClose}>
      <div className="p-6 space-y-6">
        {/* Import type */}
        <div>
          <label className="block text-sm font-medium text-black mb-3">Type de données</label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {([
              { key: "students", label: "Étudiants", icon: Users },
              { key: "exams", label: "Examens", icon: FileText },
              { key: "results", label: "Résultats", icon: BarChart3 },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setImportType(key)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  importType === key ? "bg-black border-black text-white" : "bg-white border-[#E5E5E5] text-[#666666] hover:border-[#CCCCCC]"
                }`}>
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragOver ? "border-black bg-[#F5F5F5]" : file ? "border-black bg-[#FAFAFA]" : "border-[#CCCCCC] bg-[#FAFAFA] hover:border-[#888888]"
          }`}
        >
          {file ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-black">{file.name}</p>
                <p className="text-xs text-[#888888] mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={() => setFile(null)} className="text-xs text-[#666666] hover:text-black underline">
                Supprimer
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EEEEEE] flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#888888]" />
              </div>
              <div>
                <p className="text-sm font-medium text-black">Glisser-déposer votre fichier</p>
                <p className="text-xs text-[#888888] mt-1">ou</p>
              </div>
              <label className="cursor-pointer px-4 py-2 rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#F5F5F5] text-sm font-medium text-black transition-colors">
                Parcourir les fichiers
                <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} />
              </label>
              <p className="text-xs text-[#888888]">Formats acceptés : CSV, XLSX (max 10 MB)</p>
            </div>
          )}
        </div>

        {/* Template download */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl">
          <div>
            <p className="text-sm font-medium text-black">Télécharger le modèle</p>
            <p className="text-xs text-[#888888]">Template CSV pour les {importType === "students" ? "étudiants" : importType === "exams" ? "examens" : "résultats"}</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E5E5] bg-white hover:bg-[#F5F5F5] text-xs font-medium text-black transition-colors">
            <Download className="w-3.5 h-3.5" />
            Modèle
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-b-2xl border-t border-[#E5E5E5] bg-[#FAFAFA] px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
        <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-sm font-medium text-black hover:bg-[#F5F5F5] transition-colors">
          Annuler
        </button>
        <button
          onClick={onClose}
          disabled={!file}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-[#222222] text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
        >
          <Upload className="w-4 h-4" />
          Importer
        </button>
      </div>
    </ModalBase>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({
  onGoToExams,
  onExamDetails,
  onCreateExam,
  onAddStudent,
  onImportData,
}: {
  onGoToExams: () => void;
  onExamDetails: (exam: Exam) => void;
  onCreateExam: () => void;
  onAddStudent: () => void;
  onImportData: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Exams */}
        <DashboardSectionCard
          className="xl:col-span-2"
          title="Examens récents"
          subtitle="Sessions planifiées, brouillons et dernières activités"
          icon={FileText}
          action={<ViewAllButton onClick={onGoToExams} />}
          bodyClassName="p-0"
        >
          <div>
            {recentExams.map((exam) => (
              <div
                key={exam.id}
                onClick={() => onExamDetails(exam)}
                className="dashboard-list-row dashboard-list-row-interactive group"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <DashboardStatusBadge
                      status={exam.status as "scheduled" | "draft" | "completed"}
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--cyber-text)]">
                    {exam.title}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--cyber-muted-text)]">{exam.subject}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                    <DashboardMetaItem icon={Clock}>{exam.duration} min</DashboardMetaItem>
                    <DashboardMetaItem icon={Users}>{exam.students} étudiants</DashboardMetaItem>
                    <DashboardMetaItem icon={Calendar}>{exam.date}</DashboardMetaItem>
                  </div>
                </div>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[var(--cyber-subtle-text)] transition-transform group-hover:translate-x-1" />
              </div>
            ))}
          </div>
        </DashboardSectionCard>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <DashboardSectionCard
            title="Actions rapides"
            subtitle="Accès direct aux opérations courantes"
            icon={Zap}
          >
            <div className="space-y-2">
              <QuickActionButton icon={Plus} label="Créer un examen" onClick={onCreateExam} />
              <QuickActionButton icon={UserPlus} label="Ajouter un étudiant" onClick={onAddStudent} />
              <QuickActionButton icon={Upload} label="Importer données" onClick={onImportData} />
            </div>
          </DashboardSectionCard>

          {/* Activity Feed */}
          <DashboardSectionCard
            title="Activité récente"
            subtitle="Événements importants de la plateforme"
            icon={Activity}
          >
            <div className="space-y-3">
              {activityFeed.map((item) => (
                <div key={item.id} className="rounded-2xl border border-[rgba(117,195,214,0.1)] bg-[rgba(11,27,38,0.5)] p-3">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                      item.type === "alert" ? "bg-[var(--cyber-danger)]" : "bg-[var(--cyber-accent)]"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--cyber-text)]">{item.text}</p>
                      <p className="mt-1 text-xs text-[var(--cyber-subtle-text)]">{item.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardSectionCard>
        </div>
      </div>

      {/* Fraud Alerts */}
      <DashboardSectionCard
        title="Alertes de fraude récentes"
        subtitle="Signalements à examiner en priorité"
        icon={Shield}
        action={<ViewAllButton />}
        bodyClassName="p-0"
      >
        <div>
          {fraudAlerts.map((alert) => (
            <div key={alert.id} className="dashboard-list-row">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(117,195,214,0.14)] bg-[rgba(11,27,38,0.72)]">
                <span className="text-xs font-semibold text-[var(--cyber-text)]">{alert.initials}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-semibold text-[var(--cyber-text)]">{alert.student}</h4>
                  <DashboardStatusBadge
                    status={alert.severity as "high" | "medium"}
                    label={alert.severity === "high" ? "Élevée" : "Moyenne"}
                  />
                </div>
                <p className="text-sm text-[var(--cyber-muted-text)]">{alert.exam} • {alert.type}</p>
                <p className="mt-1 text-xs text-[var(--cyber-subtle-text)]">{alert.time}</p>
              </div>
              <button className="cyber-button-secondary rounded-xl px-4 py-2 text-xs font-medium">
                Examiner
              </button>
            </div>
          ))}
        </div>
      </DashboardSectionCard>
    </div>
  );
}

// ─── Exams Tab ─────────────────────────────────────────────────────────────────
function ExamsTab({ onCreateExam }: { onCreateExam: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [exams, setExams] = useState<Exam[]>(allExamsData);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const filtered = exams.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {showDetails && selectedExam && (
        <ExamDetailsModal
          exam={selectedExam}
          onClose={() => setShowDetails(false)}
          onEdit={() => { setShowDetails(false); setEditingExam(selectedExam); setShowEdit(true); }}
        />
      )}
      {showEdit && editingExam && (
        <EditExamModal
          exam={editingExam}
          onClose={() => setShowEdit(false)}
          onSave={(updated) => setExams(prev => prev.map(e => e.id === updated.id ? updated : e))}
        />
      )}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
            <input
              type="text"
              placeholder="Rechercher un examen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all"
          >
            <option value="all">Tous les statuts</option>
            <option value="scheduled">Planifiés</option>
            <option value="draft">Brouillons</option>
            <option value="completed">Terminés</option>
          </select>
          <button
            onClick={onCreateExam}
            className="flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-[#222222] rounded-xl text-sm font-medium text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
          >
            <Plus className="w-4 h-4" />
            Nouvel examen
          </button>
        </div>
      </div>

      {/* Exams Grid */}
      {filtered.length === 0 ? (
        <DashboardCard className="p-12 flex flex-col items-center gap-3">
          <FileText className="w-10 h-10 text-[#CCCCCC]" />
          <p className="text-sm text-[#666666]">Aucun examen trouvé</p>
        </DashboardCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((exam) => (
            <DashboardCard key={exam.id} interactive className="p-5 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <DashboardStatusBadge
                      status={exam.status as "scheduled" | "completed" | "draft"}
                    />
                  </div>
                  <h3 className="truncate text-base font-semibold text-[var(--cyber-text)]">{exam.title}</h3>
                  <p className="mt-1 text-xs text-[var(--cyber-muted-text)]">{exam.subject}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <DashboardMetaItem icon={Clock}>{exam.duration} min</DashboardMetaItem>
                <DashboardMetaItem icon={Users}>{exam.students} étudiants</DashboardMetaItem>
                <DashboardMetaItem icon={Calendar}>{exam.date}</DashboardMetaItem>
                <DashboardMetaItem icon={Hash}>{exam.questions} questions</DashboardMetaItem>
              </div>
              <div className="dashboard-divider mb-4" />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setEditingExam(exam); setShowEdit(true); }}
                  className="cyber-button-secondary inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Éditer
                </button>
                <button
                  onClick={() => { setSelectedExam(exam); setShowDetails(true); }}
                  className="cyber-button-primary inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Voir détails
                </button>
              </div>
            </DashboardCard>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Students Tab ─────────────────────────────────────────────────────────────
function StudentsTab() {
  const [students, setStudents] = useState<Student[]>(allStudentsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {showDetails && selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => setShowDetails(false)}
          onEdit={() => { setShowDetails(false); setEditingStudent(selectedStudent); setShowEdit(true); }}
        />
      )}
      {showEdit && editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onClose={() => setShowEdit(false)}
          onSave={(updated) => setStudents(prev => prev.map(s => s.id === updated.id ? updated : s))}
        />
      )}
      {showAdd && (
        <AddStudentModal
          onClose={() => setShowAdd(false)}
          onAdded={() => {}}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
            <input
              type="text"
              placeholder="Rechercher un étudiant..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-[#222222] rounded-xl text-sm font-medium text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
        >
          <UserPlus className="w-4 h-4" />
          Ajouter étudiant
        </button>
      </div>

      {/* Students Table */}
      <div className="dashboard-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA]">
                <th className="px-6 py-3 text-left text-xs font-bold text-[#666666] uppercase tracking-wider">Étudiant</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#666666] uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#666666] uppercase tracking-wider hidden lg:table-cell">Département</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#666666] uppercase tracking-wider">Examens</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#666666] uppercase tracking-wider">Moyenne</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#666666] uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#666666] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filtered.map((student) => (
                <tr key={student.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">{student.name.split(" ").map(n => n[0]).join("")}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-black block">{student.name}</span>
                        {student.studentId && <span className="text-xs text-[#888888]">{student.studentId}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-sm text-[#666666]">{student.email}</span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm text-black">{student.department}</span>
                      <span className="text-xs text-[#888888]">{student.year}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-black font-medium">{student.exams}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-black">{student.avg}%</span>
                      <div className="w-16 h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full" style={{ width: `${student.avg}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <DashboardStatusBadge
                        status={student.status as "active" | "inactive"}
                      />
                      <span className="text-xs text-[#888888]">{student.lastActive}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setSelectedStudent(student); setShowDetails(true); }}
                        className="p-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4 text-[#666666]" />
                      </button>
                      <button
                        onClick={() => { setEditingStudent(student); setShowEdit(true); }}
                        className="p-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors"
                        title="Modifier"
                      >
                        <Edit3 className="w-4 h-4 text-[#666666]" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors" title="Supprimer">
                        <Trash2 className="w-4 h-4 text-[#CCCCCC] hover:text-black transition-colors" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-6 py-10 text-center">
            <Users className="w-8 h-8 text-[#CCCCCC] mx-auto mb-2" />
            <p className="text-sm text-[#666666]">Aucun étudiant trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Analytics Tab ─────────────────────────────────────────────────────────────
function AnalyticsTab() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: PieChart, label: "Taux de réussite global", value: "87%", sub: "+5% vs. dernier semestre" },
          { icon: Users, label: "Total étudiants", value: "1,247", sub: "+124 ce mois" },
          { icon: FileText, label: "Examens menés", value: "342", sub: "Ce semestre" },
        ].map(({ icon: Icon, label, value, sub }) => (
          <DashboardMetricCard
            key={label}
            icon={Icon}
            label={label}
            value={value}
            description={sub}
            change="Analyse"
          />
        ))}
      </div>

      {/* Performance by Subject */}
      <DashboardSectionCard
        title="Performance par matière"
        subtitle="Comparaison de la moyenne et du score de passage"
        icon={BarChart3}
      >
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={analyticsData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(117, 195, 214, 0.12)" vertical={false} />
            <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "#888888" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#888888" }} axisLine={false} tickLine={false} domain={[50, 100]} />
            <Tooltip
              contentStyle={{ background: "white", border: "1px solid #E5E5E5", borderRadius: "12px", fontSize: 12 }}
              cursor={{ fill: "#F5F5F5" }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
            <Bar dataKey="avg" name="Moyenne" fill="#3DD8E9" radius={[4, 4, 0, 0]} />
            <Bar dataKey="passing" name="Score de passage" fill="#1D4556" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </DashboardSectionCard>

      {/* Trend charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardSectionCard
          title="Taux de réussite — 6 derniers mois"
          subtitle="Évolution mensuelle des résultats"
          icon={TrendingUp}
        >
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(117, 195, 214, 0.12)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#888888" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#888888" }} axisLine={false} tickLine={false} domain={[75, 95]} />
              <Tooltip
                contentStyle={{ background: "white", border: "1px solid #E5E5E5", borderRadius: "12px", fontSize: 12 }}
              />
              <Line type="monotone" dataKey="success" name="Réussite %" stroke="#8BF3FF" strokeWidth={2} dot={{ fill: "#8BF3FF", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </DashboardSectionCard>

        <DashboardSectionCard
          title="Examens & alertes fraude"
          subtitle="Volume d'activité et signalements"
          icon={AlertTriangle}
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trendData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(117, 195, 214, 0.12)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#888888" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#888888" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "white", border: "1px solid #E5E5E5", borderRadius: "12px", fontSize: 12 }}
                cursor={{ fill: "#F5F5F5" }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
              <Bar dataKey="exams" name="Examens" fill="#3DD8E9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fraud" name="Alertes fraude" fill="#FF7B82" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </DashboardSectionCard>
      </div>

      {/* Ranking table */}
      <DashboardSectionCard
        title="Classement des étudiants (Top 5)"
        subtitle="Meilleures moyennes sur la période"
        icon={Activity}
        bodyClassName="p-0"
      >
        <div className="divide-y divide-[#E5E5E5]">
          {allStudentsData.sort((a, b) => b.avg - a.avg).slice(0, 5).map((student, i) => (
            <div key={student.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#FAFAFA] transition-colors">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                i === 0 ? "bg-black text-white" : "bg-[#F5F5F5] text-[#666666]"
              }`}>
                {i + 1}
              </span>
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-white">{student.name.split(" ").map(n => n[0]).join("")}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-black">{student.name}</p>
                <p className="text-xs text-[#888888]">{student.department} · {student.exams} examens</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-black">{student.avg}%</p>
                <p className="text-xs text-[#888888]">Moyenne</p>
              </div>
            </div>
          ))}
        </div>
      </DashboardSectionCard>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function SettingsTab({ onGoToProfile }: { onGoToProfile: () => void }) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Profile card CTA */}
      <DashboardCard tone="accent" className="p-6">
        <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="dashboard-icon-badge">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--cyber-text)]">Paramètres du profil</h3>
            <p className="text-sm text-[var(--cyber-muted-text)]">Modifiez vos informations personnelles, photo et mot de passe</p>
          </div>
        </div>
        <button
          onClick={onGoToProfile}
          className="cyber-button-secondary flex-shrink-0 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
        >
          Accéder
          <ChevronRight className="w-4 h-4" />
        </button>
        </div>
      </DashboardCard>

      {/* Surveillance settings */}
      <DashboardSectionCard title="Surveillance & Sécurité" icon={Shield}>
        <div className="space-y-0 divide-y divide-[#E5E5E5]">
          {[
            { key: "strict", title: "Mode de surveillance strict", desc: "Désactive le copier-coller et les changements d'onglet", default: true },
            { key: "facial", title: "Détection faciale", desc: "Vérifie l'identité via webcam pendant l'examen", default: false },
            { key: "screen", title: "Surveillance d'écran", desc: "Enregistre les activités écran suspectes", default: true },
            { key: "ip", title: "Restriction IP", desc: "Limite l'accès aux réseaux institutionnels uniquement", default: false },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-4">
              <div>
                <h3 className="text-sm font-medium text-black mb-0.5">{item.title}</h3>
                <p className="text-xs text-[#666666]">{item.desc}</p>
              </div>
              <ToggleSwitch defaultChecked={item.default} />
            </div>
          ))}
        </div>
      </DashboardSectionCard>

      {/* Notification settings */}
      <DashboardSectionCard title="Notifications" icon={Bell}>
        <div className="space-y-0 divide-y divide-[#E5E5E5]">
          {[
            { key: "email", title: "Notifications par email", desc: "Recevoir des alertes pour les événements importants", default: true },
            { key: "fraud_alert", title: "Alertes fraude en temps réel", desc: "Notifications instantanées lors de détection d'anomalies", default: true },
            { key: "exam_start", title: "Démarrage d'examen", desc: "Notification quand un examen commence", default: false },
            { key: "autosave", title: "Auto-sauvegarde", desc: "Sauvegarde automatique toutes les 30 secondes", default: true },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-4">
              <div>
                <h3 className="text-sm font-medium text-black mb-0.5">{item.title}</h3>
                <p className="text-xs text-[#666666]">{item.desc}</p>
              </div>
              <ToggleSwitch defaultChecked={item.default} />
            </div>
          ))}
        </div>
      </DashboardSectionCard>

      {/* Exam defaults */}
      <DashboardSectionCard title="Paramètres par défaut des examens" icon={FileText}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Durée par défaut (min)</label>
            <input type="number" defaultValue={90}
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Score de passage par défaut (%)</label>
            <input type="number" defaultValue={60} min={0} max={100}
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Langue des examens</label>
            <select defaultValue="fr"
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all">
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Fuseau horaire</label>
            <select defaultValue="europe/paris"
              className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all">
              <option value="europe/paris">Europe/Paris (UTC+1)</option>
              <option value="utc">UTC</option>
              <option value="africa/algiers">Africa/Algiers (UTC+1)</option>
            </select>
          </div>
        </div>
      </DashboardSectionCard>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-medium text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:bg-[#222222] sm:w-auto"
        >
          <Save className="w-4 h-4" />
          Enregistrer les paramètres
        </button>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F0F0F0] border border-[#E5E5E5]">
            <CheckCircle2 className="w-4 h-4 text-black" />
            <span className="text-sm font-medium text-black">Paramètres sauvegardés</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [overviewExamDetails, setOverviewExamDetails] = useState<Exam | null>(null);

  const handleLogoClick = () => {
    setActiveTab("overview");
    setShowCreateExam(false);
    setShowAddStudent(false);
    setShowImport(false);
    setOverviewExamDetails(null);
  };

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: "exams", label: "Examens", icon: FileText },
    { id: "students", label: "Étudiants", icon: Users },
    { id: "analytics", label: "Analytiques", icon: BarChart3 },
    { id: "settings", label: "Paramètres", icon: Settings },
  ];

  return (
    <div className="cyber-dashboard-page relative min-h-screen overflow-hidden bg-[#FAFAFA]">
      <GridBackground variant="dashboard" />
      <div className="relative z-10">
      {/* Global modals */}
      {showCreateExam && <CreateExamModal onClose={() => setShowCreateExam(false)} />}
      {showAddStudent && <AddStudentModal onClose={() => setShowAddStudent(false)} />}
      {showImport && <ImportDataModal onClose={() => setShowImport(false)} />}
      {overviewExamDetails && (
        <ExamDetailsModal
          exam={overviewExamDetails}
          onClose={() => setOverviewExamDetails(null)}
          onEdit={() => { setOverviewExamDetails(null); setActiveTab("exams"); }}
        />
      )}

      {/* Header */}
      <header className="cyber-topbar sticky top-0 z-40 border-b border-[#E5E5E5] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:min-h-16 sm:px-6 sm:py-0">
          <div className="flex items-center gap-6">
            <Logo size="md" to="/admin" onClick={handleLogoClick} />
            <div className="hidden sm:block w-px h-6 bg-[#E5E5E5]" />
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-black">Dashboard Administrateur</h1>
              <p className="text-xs text-[#666666]">ExamGuard Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Self-contained NotificationPanel with its own bell button */}
            <NotificationPanel role="admin" />

            {/* Profile — clickable → Teacher Profile Page */}
            <button
              onClick={() => navigate("/admin/profile")}
              className="hidden sm:flex items-center gap-3 pl-3 border-l border-[#E5E5E5] hover:bg-[#F5F5F5] rounded-xl px-3 py-2 transition-colors group"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-black group-hover:underline">Prof. Dupont</p>
                <p className="text-xs text-[#666666]">Administrateur</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-white">PD</span>
              </div>
            </button>

            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors ml-1"
              title="Se déconnecter"
            >
              <LogOut className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="cyber-tabbar border-b border-[#E5E5E5] bg-white sticky top-16 z-30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
                    isActive
                      ? "text-black border-black"
                      : "text-[#666666] border-transparent hover:text-black hover:bg-[#F5F5F5]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {activeTab === "overview" && (
          <OverviewTab
            onGoToExams={() => setActiveTab("exams")}
            onExamDetails={(exam) => setOverviewExamDetails(exam)}
            onCreateExam={() => setShowCreateExam(true)}
            onAddStudent={() => setShowAddStudent(true)}
            onImportData={() => setShowImport(true)}
          />
        )}
        {activeTab === "exams" && <ExamsTab onCreateExam={() => setShowCreateExam(true)} />}
        {activeTab === "students" && <StudentsTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
        {activeTab === "settings" && <SettingsTab onGoToProfile={() => navigate("/admin/profile")} />}
      </main>
      </div>
    </div>
  );
}
