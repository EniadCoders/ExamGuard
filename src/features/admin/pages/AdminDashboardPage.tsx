import { useState, useEffect } from "react";
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
  Send,
  Play,
  PauseCircle,
  StopCircle,
  ArrowLeft,
  Wifi,
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
type DraftQuestion =
  | { id: number; type: "mcq"; text: string; points: number; options: string[]; multiple: boolean; correct: number[] }
  | { id: number; type: "text"; text: string; points: number }
  | { id: number; type: "code"; text: string; points: number; language: string; starterCode: string };

const CODE_TEMPLATES: Record<string, string> = {
  java: `public class Main {
    public static void main(String[] args) {
        // Votre code ici
    }
}`,
  python: `def main():
    # Votre code ici
    pass

if __name__ == "__main__":
    main()`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Votre code ici
    return 0;
}`,
  javascript: `function main() {
    // Votre code ici
}

main();`,
  c: `#include <stdio.h>

int main() {
    // Votre code ici
    return 0;
}`,
};

interface Exam {
  id: number;
  title: string;
  subject: string;
  duration: number;
  date: string;
  students: number;
  status: "scheduled" | "draft" | "completed" | "live";
  questions: number;
  description?: string;
  passingScore?: number;
  selectedStudentIds?: number[];
  importedFileName?: string;
  draftQuestions?: DraftQuestion[];
  launchMode?: "auto" | "manual";
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
  { id: 1, title: "Architecture Java EE", subject: "Génie logiciel", duration: 90, date: "09 Avril à 18:00", students: 45, status: "scheduled", questions: 12, description: "Examen couvrant les architectures d'entreprise Java, les patterns JEE, et les frameworks Spring/Hibernate.", passingScore: 12 },
  { id: 2, title: "Base de données avancées", subject: "Systèmes d'information", duration: 120, date: "10 Avril à 14:00", students: 38, status: "scheduled", questions: 15, description: "Examen sur les bases de données relationnelles avancées, SQL, NoSQL et optimisation.", passingScore: 11 },
  { id: 3, title: "Sécurité informatique", subject: "Cybersécurité", duration: 90, date: "12 Avril à 10:00", students: 52, status: "draft", questions: 8, description: "Introduction à la sécurité des systèmes d'information et protection des données.", passingScore: 12 },
];

const allExamsData: Exam[] = [
  { id: 1, title: "Architecture Java EE", subject: "Génie logiciel", duration: 90, date: "09 Avril 2026", students: 45, status: "scheduled", questions: 12, description: "Examen couvrant les architectures d'entreprise Java.", passingScore: 12 },
  { id: 2, title: "Base de données avancées", subject: "Systèmes d'information", duration: 120, date: "10 Avril 2026", students: 38, status: "scheduled", questions: 15, description: "Examen sur les bases de données.", passingScore: 11 },
  { id: 3, title: "Sécurité informatique", subject: "Cybersécurité", duration: 90, date: "12 Avril 2026", students: 52, status: "draft", questions: 8, description: "Introduction à la sécurité informatique.", passingScore: 12 },
  { id: 4, title: "Programmation Web", subject: "Développement", duration: 60, date: "15 Avril 2026", students: 31, status: "draft", questions: 10, description: "HTML, CSS, JavaScript et frameworks modernes.", passingScore: 10 },
  { id: 5, title: "Intelligence Artificielle", subject: "IA & ML", duration: 150, date: "18 Avril 2026", students: 28, status: "scheduled", questions: 20, description: "Machine learning, réseaux de neurones et IA appliquée.", passingScore: 13 },
  { id: 6, title: "Algorithmique Avancée", subject: "Informatique", duration: 120, date: "02 Avril 2026 à 09:00", students: 42, status: "completed", questions: 18, description: "Structures de données, complexité et algorithmes de graphes.", passingScore: 12 },
];

const defaultModules = ["Génie logiciel", "Systèmes d'information", "Cybersécurité", "Développement", "IA & ML", "Réseaux"];
const teacherModules = Array.from(new Set([...defaultModules, ...allExamsData.map(e => e.subject)]));

const allStudentsData: Student[] = [
  { id: 1, name: "Marie Dubois", email: "marie.dubois@univ.fr", exams: 12, avg: 17.4, status: "active", lastActive: "Actif maintenant", department: "Informatique", year: "M2", studentId: "ETU-2024-001" },
  { id: 2, name: "Thomas Martin", email: "thomas.martin@univ.fr", exams: 10, avg: 18.4, status: "active", lastActive: "Il y a 5 min", department: "Génie logiciel", year: "M1", studentId: "ETU-2024-002" },
  { id: 3, name: "Sophie Bernard", email: "sophie.bernard@univ.fr", exams: 15, avg: 15.6, status: "inactive", lastActive: "Il y a 2 jours", department: "Cybersécurité", year: "M2", studentId: "ETU-2024-003" },
  { id: 4, name: "Lucas Petit", email: "lucas.petit@univ.fr", exams: 8, avg: 17.0, status: "active", lastActive: "Il y a 1 heure", department: "IA & Data", year: "L3", studentId: "ETU-2024-004" },
  { id: 5, name: "Emma Rousseau", email: "emma.rousseau@univ.fr", exams: 11, avg: 18.2, status: "active", lastActive: "Il y a 30 min", department: "Réseaux", year: "M1", studentId: "ETU-2024-005" },
  { id: 6, name: "Hugo Lefebvre", email: "hugo.lefebvre@univ.fr", exams: 7, avg: 14.6, status: "inactive", lastActive: "Il y a 5 jours", department: "Informatique", year: "L3", studentId: "ETU-2024-006" },
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
  { subject: "Java EE", avg: 16.4, passing: 15.6, students: 45 },
  { subject: "BDD", avg: 15.2, passing: 13.6, students: 38 },
  { subject: "Sécurité", avg: 17.6, passing: 17.0, students: 52 },
  { subject: "Web", avg: 18.2, passing: 17.8, students: 31 },
  { subject: "IA", avg: 15.8, passing: 14.2, students: 28 },
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
      data-ui="switch"
      onClick={() => setOn(!on)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ${
        on
          ? "bg-[var(--cyber-accent-strong)] border-[var(--cyber-accent-strong)] shadow-[0_0_0_1px_rgba(123,241,255,0.35),0_0_8px_rgba(123,241,255,0.4)]"
          : "bg-[#E5E7EB] border-[#9CA3AF]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.5)] transition duration-200 ${
          on ? "translate-x-4 bg-white" : "translate-x-0 bg-[#1F2937]"
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
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 backdrop-blur-sm sm:items-center sm:p-4"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
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
  const rosterCount = Math.min(exam.students, allStudentsData.length);
  const roster = allStudentsData.slice(0, rosterCount).map(s => ({ name: s.name, score: s.avg }));

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
            exam.status === "live" ? "bg-red-600 text-white animate-pulse"
            : exam.status === "scheduled" ? "bg-black text-white"
            : exam.status === "completed" ? "bg-[#F5F5F5] text-black border border-[#CCCCCC]"
            : "bg-[#F5F5F5] text-[#666666] border border-[#E5E5E5]"
          }`}>
            {exam.status === "live" ? "En cours" : exam.status === "scheduled" ? "Planifié" : exam.status === "completed" ? "Terminé" : "Brouillon"}
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
            { icon: CheckSquare, label: "Note min.", value: `${exam.passingScore ?? 12}/20` },
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

        {/* Roster — invitees for scheduled, participants with scores for completed, hidden for draft */}
        {exam.status === "scheduled" && (
          <div>
            <h4 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Étudiants invités
            </h4>
            <div className="divide-y divide-[#E5E5E5] border border-[#E5E5E5] rounded-xl overflow-hidden">
              {roster.map((p, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-[#FAFAFA] transition-colors">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{p.name.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <span className="text-sm text-black">{p.name}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#F5F5F5] text-[#666666] border border-[#E5E5E5]">
                    Invitation envoyée
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {exam.status === "completed" && (
          <div>
            <h4 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Participants ({roster.length})
            </h4>
            <div className="divide-y divide-[#E5E5E5] border border-[#E5E5E5] rounded-xl overflow-hidden">
              {roster.map((p, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-[#FAFAFA] transition-colors">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{p.name.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <span className="text-sm text-black">{p.name}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-bold text-black">{p.score}/20</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      p.score >= (exam.passingScore ?? 12)
                        ? "bg-black text-white"
                        : "bg-[#F5F5F5] text-[#666666] border border-[#E5E5E5]"
                    }`}>
                      {p.score >= (exam.passingScore ?? 12) ? "Admis" : "Refusé"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3 rounded-b-2xl border-t border-[#E5E5E5] bg-[#FAFAFA] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <button onClick={onClose} className="px-4 py-2 rounded-xl border border-[#E5E5E5] text-sm font-medium text-black hover:bg-[#F5F5F5] transition-colors">
          Fermer
        </button>
        <div className="flex gap-3">
          {exam.status !== "completed" && (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-black text-sm font-medium text-black hover:bg-[#F5F5F5] transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Éditer
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black hover:bg-[#222222] text-sm font-medium text-white transition-colors">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>
    </ModalBase>
  );
}

// ─── Fraud Alert Details Modal ────────────────────────────────────────────────
type FraudAlert = {
  id: number;
  student: string;
  initials: string;
  exam: string;
  type: string;
  time: string;
  severity: string;
};

function FraudAlertDetailsModal({ alert, onClose, onAction }: { alert: FraudAlert; onClose: () => void; onAction: (action: string) => void }) {
  const isHigh = alert.severity === "high";
  const [escalated, setEscalated] = useState(false);

  const handleEscalate = () => {
    setEscalated(true);
    setTimeout(() => onAction("escalated"), 1400);
  };

  return (
    <ModalBase title="Détails de l'alerte" onClose={onClose}>
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(11,27,38,0.72)] border border-[rgba(123,241,255,0.25)]">
              <span className="text-sm font-bold text-[var(--cyber-text)]">{alert.initials}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--cyber-text)]">{alert.student}</h3>
              <p className="text-sm text-[var(--cyber-muted-text)]">{alert.exam}</p>
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 ${
            isHigh
              ? "bg-[rgba(255,123,130,0.14)] text-[#FFB3B8] border border-[rgba(255,123,130,0.4)]"
              : "bg-[rgba(252,211,77,0.12)] text-[#FCD34D] border border-[rgba(252,211,77,0.4)]"
          }`}>
            {isHigh ? "Sévérité élevée" : "Sévérité moyenne"}
          </span>
        </div>

        <div className="rounded-xl p-4 bg-[rgba(11,27,38,0.5)] border border-[rgba(117,195,214,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--cyber-subtle-text)] mb-2">Anomalie détectée</p>
          <p className="text-sm text-[var(--cyber-text)] leading-relaxed">{alert.type}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[rgba(11,27,38,0.5)] border border-[rgba(117,195,214,0.14)]">
            <Clock className="w-4 h-4 text-[var(--cyber-accent-strong)]" />
            <div>
              <p className="text-xs text-[var(--cyber-subtle-text)]">Détectée</p>
              <p className="text-sm font-medium text-[var(--cyber-text)]">{alert.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[rgba(11,27,38,0.5)] border border-[rgba(117,195,214,0.14)]">
            <Shield className="w-4 h-4 text-[var(--cyber-accent-strong)]" />
            <div>
              <p className="text-xs text-[var(--cyber-subtle-text)]">Examen concerné</p>
              <p className="text-sm font-medium text-[var(--cyber-text)]">{alert.exam}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-[var(--cyber-text)] mb-2">Actions recommandées</h4>
          <ul className="space-y-2 text-sm text-[var(--cyber-muted-text)]">
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--cyber-accent-strong)] mt-0.5 flex-shrink-0" /> Vérifier l'enregistrement vidéo de la session.</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--cyber-accent-strong)] mt-0.5 flex-shrink-0" /> Contacter l'étudiant pour clarification.</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--cyber-accent-strong)] mt-0.5 flex-shrink-0" /> Documenter la décision prise.</li>
          </ul>
        </div>

        {escalated && (
          <div className="rounded-xl px-4 py-3 bg-[rgba(255,123,130,0.12)] border border-[rgba(255,123,130,0.4)] text-sm text-[#FFB3B8]">
            Cas escaladé. Le responsable pédagogique et l'équipe sécurité ont été notifiés ; la session de l'étudiant a été marquée pour révision formelle.
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3 rounded-b-2xl border-t border-[rgba(117,195,214,0.14)] bg-[rgba(11,27,38,0.5)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <button onClick={onClose} className="px-4 py-2 rounded-xl border border-[rgba(117,195,214,0.25)] text-sm font-medium text-[var(--cyber-text)] hover:bg-[rgba(11,27,38,0.7)] transition-colors">
          Fermer
        </button>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onAction("dismissed")}
            className="px-4 py-2 rounded-xl border border-[rgba(117,195,214,0.35)] text-sm font-medium text-[var(--cyber-text)] hover:bg-[rgba(11,27,38,0.7)] transition-colors"
          >
            Ignorer
          </button>
          <button
            onClick={handleEscalate}
            disabled={escalated}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors bg-[#B91C1C] hover:bg-[#991B1B] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {escalated ? "Escaladé" : "Escalader le cas"}
          </button>
        </div>
      </div>
    </ModalBase>
  );
}

// ─── Edit Exam Modal ──────────────────────────────────────────────────────────
const FR_MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

function frDateToIso(input: string): string {
  if (!input) return "";
  const m = input.match(/^\s*(\d{1,2})\s+([A-Za-zÀ-ÿ]+)(?:\s+(\d{4}))?(?:\s*(?:à\s*)?(\d{1,2}):(\d{2}))?/);
  if (!m) return "";
  const day = m[1].padStart(2, "0");
  const monthIdx = FR_MONTHS.findIndex(name => name.toLowerCase() === m[2].toLowerCase());
  if (monthIdx < 0) return "";
  const year = m[3] ?? String(new Date().getFullYear());
  const hours = (m[4] ?? "00").padStart(2, "0");
  const minutes = m[5] ?? "00";
  return `${year}-${String(monthIdx + 1).padStart(2, "0")}-${day}T${hours}:${minutes}`;
}

function isoToFrDate(iso: string): string {
  if (!iso) return "";
  const [datePart, timePart] = iso.split("T");
  const [y, mo, d] = datePart.split("-");
  if (!y || !mo || !d) return iso;
  const base = `${d} ${FR_MONTHS[Number(mo) - 1]} ${y}`;
  return timePart ? `${base} à ${timePart.slice(0, 5)}` : base;
}

// ─── Create Exam Modal ─────────────────────────────────────────────────────────
function CreateExamModal({ onClose, onCreated, initialExam }: { onClose: () => void; onCreated?: (exam: Exam) => void; initialExam?: Exam }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [examTitle, setExamTitle] = useState(initialExam?.title ?? "");
  const [examSubject, setExamSubject] = useState(initialExam?.subject ?? "");
  const [examDuration, setExamDuration] = useState(initialExam?.duration ?? 90);
  const [examDate, setExamDate] = useState(initialExam ? frDateToIso(initialExam.date) : "");
  const [examDesc, setExamDesc] = useState(initialExam?.description ?? "");
  const [passingScore, setPassingScore] = useState(initialExam?.passingScore ?? 12);
  const [selectedStudents, setSelectedStudents] = useState<number[]>(initialExam?.selectedStudentIds ?? []);
  const [launchMode, setLaunchMode] = useState<"auto" | "manual">(initialExam?.launchMode ?? "auto");
  const [studentSearch, setStudentSearch] = useState("");
  const [importedFileName, setImportedFileName] = useState(initialExam?.importedFileName ?? "");
  const [questions, setQuestions] = useState<DraftQuestion[]>(initialExam?.draftQuestions ?? []);

  const step1Complete = examTitle.trim() !== "" && examSubject.trim() !== "" && examDuration > 0 && examDate !== "";
  const filteredStudents = allStudentsData.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );
  const toggleStudent = (id: number) =>
    setSelectedStudents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const addQuestion = (type: DraftQuestion["type"]) => {
    const id = Date.now();
    if (type === "mcq") setQuestions(prev => [...prev, { id, type, text: "", points: 1, options: ["", ""], multiple: false, correct: [] }]);
    else if (type === "text") setQuestions(prev => [...prev, { id, type, text: "", points: 1 }]);
    else setQuestions(prev => [...prev, { id, type, text: "", points: 1, language: "java", starterCode: CODE_TEMPLATES.java }]);
  };
  const updateQuestion = (id: number, patch: Partial<DraftQuestion>) =>
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...patch } as DraftQuestion : q));
  const removeQuestion = (id: number) => setQuestions(prev => prev.filter(q => q.id !== id));

  const buildExam = (status: "draft" | "scheduled"): Exam => ({
    id: initialExam?.id ?? Date.now(),
    title: examTitle.trim() || "Examen sans titre",
    subject: examSubject.trim() || "Non spécifié",
    duration: examDuration,
    date: examDate ? isoToFrDate(examDate) : "",
    students: selectedStudents.length,
    status,
    questions: questions.length,
    description: examDesc,
    passingScore,
    selectedStudentIds: selectedStudents,
    importedFileName,
    draftQuestions: questions,
    launchMode,
  });
  const saveAsDraft = () => { onCreated?.(buildExam("draft")); onClose(); };
  const schedule = () => { onCreated?.(buildExam("scheduled")); onClose(); };

  return (
    <ModalBase title={
      step === 1 ? `${initialExam ? "Éditer" : "Créer"} un examen — 1/3 Détails`
      : step === 2 ? `${initialExam ? "Éditer" : "Créer"} un examen — 2/3 Étudiants`
      : `${initialExam ? "Éditer" : "Créer"} un examen — 3/3 Questions`
    } onClose={onClose} wide>
      {step === 1 && (
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
              <label className="block text-sm font-medium text-black mb-2">Module *</label>
              <input
                list="exam-modules"
                value={examSubject}
                onChange={e => setExamSubject(e.target.value)}
                placeholder="Sélectionner ou créer un module"
                className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-black transition-all" />
              <datalist id="exam-modules">
                {teacherModules.map(m => <option key={m} value={m} />)}
              </datalist>
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
              <label className="block text-sm font-medium text-black mb-2">Date et heure *</label>
              <input type="datetime-local" value={examDate} onChange={e => setExamDate(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-black transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Note de passage (/20)</label>
              <input type="number" value={passingScore} onChange={e => setPassingScore(Number(e.target.value))} min={0} max={20} step={0.5}
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
              {step1Complete
                ? "Tous les champs sont remplis — passez à l'étape suivante pour inviter les étudiants."
                : "Champs incomplets : l'examen sera enregistré comme brouillon."}
            </p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Importer une liste (JSON ou Excel)</label>
            <label className="flex items-center gap-3 px-4 py-3 bg-white border border-dashed border-[#CCCCCC] rounded-xl cursor-pointer hover:border-black transition-colors">
              <Upload className="w-4 h-4 text-[#666666]" />
              <span className="text-sm text-[#666666] flex-1 truncate">
                {importedFileName || "Glissez un fichier .json / .xlsx ou cliquez pour sélectionner"}
              </span>
              <input
                type="file"
                accept=".json,.xlsx,.xls,.csv"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) setImportedFileName(file.name);
                }}
              />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E5E5E5]" />
            <span className="text-xs text-[#888888] uppercase tracking-wide">ou sélectionnez manuellement</span>
            <div className="flex-1 h-px bg-[#E5E5E5]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Étudiants à inviter ({selectedStudents.length})</label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
              <input
                type="text"
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                placeholder="Rechercher un étudiant..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E5E5] rounded-xl text-sm text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-black transition-all"
              />
            </div>
            <div className="max-h-64 overflow-y-auto rounded-xl border border-[#E5E5E5] divide-y divide-[#E5E5E5]">
              {filteredStudents.map(s => {
                const checked = selectedStudents.includes(s.id);
                return (
                  <label key={s.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#FAFAFA] cursor-pointer">
                    <input type="checkbox" checked={checked} onChange={() => toggleStudent(s.id)} className="w-4 h-4 accent-black" />
                    <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">{s.name.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black truncate">{s.name}</p>
                      <p className="text-xs text-[#666666] truncate">{s.email}</p>
                    </div>
                  </label>
                );
              })}
              {filteredStudents.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-[#666666]">Aucun étudiant trouvé.</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Mode de lancement</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {([
                { key: "auto", label: "Lancement automatique", desc: "L'examen démarre à la date prévue." },
                { key: "manual", label: "Lancement manuel", desc: "Vous démarrez l'examen via un clic le jour J." },
              ] as const).map(({ key, label, desc }) => (
                <button
                  key={key}
                  onClick={() => setLaunchMode(key)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    launchMode === key ? "bg-black border-black text-white" : "bg-white border-[#E5E5E5] hover:border-[#CCCCCC]"
                  }`}
                >
                  <p className={`text-sm font-medium ${launchMode === key ? "text-white" : "text-black"}`}>{label}</p>
                  <p className={`text-xs mt-1 ${launchMode === key ? "text-white/80" : "text-[#666666]"}`}>{desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl p-4">
            <p className="text-xs text-[#666666] flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-[#888888] flex-shrink-0" />
              {selectedStudents.length > 0 || importedFileName
                ? `Étape suivante : créer les questions de l'examen.`
                : "Sélectionnez au moins un étudiant ou importez un fichier."}
            </p>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Ajouter une question</label>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => addQuestion("mcq")} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-[#E5E5E5] hover:border-black text-sm font-medium text-black transition-colors">
                <Plus className="w-4 h-4" /> QCM
              </button>
              <button onClick={() => addQuestion("text")} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-[#E5E5E5] hover:border-black text-sm font-medium text-black transition-colors">
                <Plus className="w-4 h-4" /> Texte
              </button>
              <button onClick={() => addQuestion("code")} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-[#E5E5E5] hover:border-black text-sm font-medium text-black transition-colors">
                <Plus className="w-4 h-4" /> Code
              </button>
            </div>
          </div>

          {questions.length === 0 && (
            <div className="bg-[#F8F8F8] border border-dashed border-[#CCCCCC] rounded-xl p-6 text-center">
              <p className="text-sm text-[#666666]">Aucune question ajoutée pour le moment.</p>
            </div>
          )}

          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={q.id} className="border border-[#E5E5E5] rounded-xl p-4 space-y-3 bg-white">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-black text-white uppercase">{q.type === "mcq" ? "QCM" : q.type === "text" ? "Texte" : "Code"}</span>
                    <span className="text-sm font-medium text-black">Question {idx + 1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={q.points}
                      onChange={e => updateQuestion(q.id, { points: Number(e.target.value) })}
                      min={0}
                      step={0.5}
                      className="w-20 px-2 py-1 text-sm bg-white border border-[#E5E5E5] rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <span className="text-xs text-[#666666]">pts</span>
                    <button onClick={() => removeQuestion(q.id)} className="p-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors" title="Supprimer">
                      <X className="w-4 h-4 text-[#666666]" />
                    </button>
                  </div>
                </div>
                <textarea
                  value={q.text}
                  onChange={e => updateQuestion(q.id, { text: e.target.value })}
                  rows={2}
                  placeholder="Énoncé de la question..."
                  className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-lg text-sm text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
                {q.type === "mcq" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        { key: false, label: "Choix unique" },
                        { key: true, label: "Choix multiple" },
                      ] as const).map(({ key, label }) => (
                        <button
                          key={String(key)}
                          onClick={() => updateQuestion(q.id, { multiple: key, correct: [] })}
                          className={`px-3 py-2 rounded-lg text-xs font-medium border-2 transition-colors ${
                            q.multiple === key ? "bg-black border-black text-white" : "bg-white border-[#E5E5E5] text-black hover:border-[#CCCCCC]"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {q.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type={q.multiple ? "checkbox" : "radio"}
                            checked={q.correct.includes(i)}
                            onChange={() => {
                              const next = q.multiple
                                ? (q.correct.includes(i) ? q.correct.filter(c => c !== i) : [...q.correct, i])
                                : [i];
                              updateQuestion(q.id, { correct: next });
                            }}
                            className="w-4 h-4 accent-black"
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={e => {
                              const next = [...q.options];
                              next[i] = e.target.value;
                              updateQuestion(q.id, { options: next });
                            }}
                            placeholder={`Option ${i + 1}`}
                            className="flex-1 px-3 py-2 bg-white border border-[#E5E5E5] rounded-lg text-sm text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-black"
                          />
                          {q.options.length > 2 && (
                            <button
                              onClick={() => {
                                const nextOptions = q.options.filter((_, idx) => idx !== i);
                                const nextCorrect = q.correct.filter(c => c !== i).map(c => c > i ? c - 1 : c);
                                updateQuestion(q.id, { options: nextOptions, correct: nextCorrect });
                              }}
                              className="p-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors"
                              title="Supprimer cette option"
                            >
                              <X className="w-3.5 h-3.5 text-[#666666]" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {q.options.length < 4 && (
                      <button
                        onClick={() => updateQuestion(q.id, { options: [...q.options, ""] })}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed border-[#CCCCCC] text-xs font-medium text-[#666666] hover:border-black hover:text-black transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Ajouter une option
                      </button>
                    )}
                    <p className="text-xs text-[#888888]">
                      {q.multiple
                        ? "Cochez les bonnes réponses (2 à 4 options)."
                        : "Sélectionnez la bonne réponse (2 à 4 options)."}
                    </p>
                  </div>
                )}
                {q.type === "code" && (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-[#666666] mb-1">Langage</label>
                      <select
                        value={q.language}
                        onChange={e => {
                          const newLang = e.target.value;
                          const isTemplate = Object.values(CODE_TEMPLATES).includes(q.starterCode);
                          updateQuestion(q.id, {
                            language: newLang,
                            starterCode: q.starterCode === "" || isTemplate ? CODE_TEMPLATES[newLang] : q.starterCode,
                          });
                        }}
                        className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                        <option value="javascript">JavaScript</option>
                        <option value="c">C</option>
                      </select>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs text-[#666666]">Code par défaut (visible par l'étudiant)</label>
                        <button
                          onClick={() => updateQuestion(q.id, { starterCode: CODE_TEMPLATES[q.language] })}
                          className="text-xs font-medium text-black hover:underline"
                        >
                          Réinitialiser
                        </button>
                      </div>
                      <textarea
                        value={q.starterCode}
                        onChange={e => updateQuestion(q.id, { starterCode: e.target.value })}
                        rows={8}
                        spellCheck={false}
                        className="w-full px-3 py-2 bg-[#0B1B26] border border-[#E5E5E5] rounded-lg text-xs text-[#E5F4FF] font-mono focus:outline-none focus:ring-2 focus:ring-black resize-y"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl p-4">
            <p className="text-xs text-[#666666] flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-[#888888] flex-shrink-0" />
              {questions.length === 0
                ? "Vous pouvez enregistrer comme brouillon et créer les questions plus tard."
                : `${questions.length} question(s) — total : ${questions.reduce((s, q) => s + q.points, 0)} pts.`}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-b-2xl border-t border-[#E5E5E5] bg-[#FAFAFA] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <button
          onClick={step === 1 ? onClose : () => setStep((step - 1) as 1 | 2)}
          className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-sm font-medium text-black hover:bg-[#F5F5F5] transition-colors"
        >
          {step === 1 ? "Annuler" : "Retour"}
        </button>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={saveAsDraft}
            className="px-4 py-2.5 rounded-xl border border-[#E5E5E5] text-sm font-medium text-black hover:bg-[#F5F5F5] transition-colors"
          >
            Enregistrer comme brouillon
          </button>
          {step === 1 && (
            <button
              onClick={() => setStep(2)}
              disabled={!step1Complete}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-[#222222] text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          {step === 2 && (
            <button
              onClick={() => setStep(3)}
              disabled={selectedStudents.length === 0 && !importedFileName}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-[#222222] text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          {step === 3 && (
            <button
              onClick={schedule}
              disabled={selectedStudents.length === 0 && !importedFileName}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-[#222222] text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
            >
              {initialExam?.status === "scheduled" ? (
                <>
                  <Save className="w-4 h-4" />
                  Enregistrer les modifications
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Planifier et envoyer invitations
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </ModalBase>
  );
}


// ─── Student Details Modal ─────────────────────────────────────────────────────
function StudentDetailsModal({ student, onClose }: { student: Student; onClose: () => void }) {
  const examHistory = [
    { exam: "Architecture Java EE", date: "09 Avr", score: 17.4, status: "passed" },
    { exam: "Base de données", date: "15 Mar", score: 18.4, status: "passed" },
    { exam: "Sécurité informatique", date: "20 Fév", score: 15.6, status: "passed" },
    { exam: "Algorithmique", date: "05 Fév", score: 13.0, status: "passed" },
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
            { label: "Moyenne générale", value: `${student.avg}/20`, icon: TrendingUp },
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
                  <span className="text-sm font-bold text-black">{e.score}/20</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    e.score >= 10 ? "bg-black text-white" : "bg-[#F5F5F5] text-[#666666] border border-[#E5E5E5]"
                  }`}>
                    {e.score >= 10 ? "Admis" : "Refusé"}
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
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black hover:bg-[#222222] text-sm font-medium text-white transition-colors">
            <Download className="w-4 h-4" />
            Rapport
          </button>
        </div>
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
  onGoToAnalytics,
  onExamDetails,
  onAlertReview,
  onCreateExam,
  onImportData,
}: {
  onGoToExams: () => void;
  onGoToAnalytics: () => void;
  onExamDetails: (exam: Exam) => void;
  onAlertReview: (alert: FraudAlert) => void;
  onCreateExam: () => void;
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
              <QuickActionButton icon={FileText} label="Consulter les examens" onClick={onGoToExams} />
              <QuickActionButton icon={BarChart3} label="Voir les analytiques" onClick={onGoToAnalytics} />
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
        action={<ViewAllButton onClick={onGoToAnalytics} />}
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
              <button
                onClick={() => onAlertReview(alert)}
                className="cyber-button-secondary rounded-xl px-4 py-2 text-xs font-medium"
              >
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
function ExamsTab({ onCreateExam, exams, setExams, onMonitor }: { onCreateExam: () => void; exams: Exam[]; setExams: React.Dispatch<React.SetStateAction<Exam[]>>; onMonitor: (exam: Exam) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
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
        <CreateExamModal
          initialExam={editingExam}
          onClose={() => setShowEdit(false)}
          onCreated={(updated) => setExams(prev => prev.map(e => e.id === updated.id ? updated : e))}
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
            <option value="live">En cours</option>
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
                    {exam.status === "live" ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-red-600 text-white animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        En cours
                      </span>
                    ) : (
                      <DashboardStatusBadge
                        status={exam.status as "scheduled" | "completed" | "draft"}
                      />
                    )}
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
                {exam.status === "scheduled" && (
                  <button
                    onClick={() => {
                      setExams(prev => prev.map(e => e.id === exam.id ? { ...e, status: "live" } : e));
                      onMonitor({ ...exam, status: "live" });
                    }}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Lancer
                  </button>
                )}
                {exam.status === "live" && (
                  <button
                    onClick={() => onMonitor(exam)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    Voir en direct
                  </button>
                )}
                {exam.status !== "completed" && exam.status !== "live" && (
                  <button
                    onClick={() => { setEditingExam(exam); setShowEdit(true); }}
                    className="cyber-button-secondary inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Éditer
                  </button>
                )}
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
  const students = allStudentsData;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDetails, setShowDetails] = useState(false);

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
                      <span className="text-sm font-bold text-black">{student.avg}/20</span>
                      <div className="w-16 h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full" style={{ width: `${(student.avg / 20) * 100}%` }} />
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
        title="Performance par module"
        subtitle="Comparaison de la moyenne et de la note de passage"
        icon={BarChart3}
      >
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={analyticsData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(117, 195, 214, 0.12)" vertical={false} />
            <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "#888888" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#888888" }} axisLine={false} tickLine={false} domain={[10, 20]} />
            <Tooltip
              contentStyle={{ background: "rgba(11, 27, 38, 0.95)", border: "1px solid rgba(123, 241, 255, 0.25)", borderRadius: "12px", fontSize: 12, color: "#E5F4FF", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)" }}
                labelStyle={{ color: "#E5F4FF" }}
                itemStyle={{ color: "#8BF3FF" }}
              cursor={{ fill: "rgba(123, 241, 255, 0.08)" }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
            <Bar dataKey="avg" name="Moyenne" fill="#3DD8E9" radius={[4, 4, 0, 0]} />
            <Bar dataKey="passing" name="Note de passage" fill="#F4A261" radius={[4, 4, 0, 0]} />
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
                contentStyle={{ background: "rgba(11, 27, 38, 0.95)", border: "1px solid rgba(123, 241, 255, 0.25)", borderRadius: "12px", fontSize: 12, color: "#E5F4FF", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)" }}
                labelStyle={{ color: "#E5F4FF" }}
                itemStyle={{ color: "#8BF3FF" }}
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
                contentStyle={{ background: "rgba(11, 27, 38, 0.95)", border: "1px solid rgba(123, 241, 255, 0.25)", borderRadius: "12px", fontSize: 12, color: "#E5F4FF", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)" }}
                labelStyle={{ color: "#E5F4FF" }}
                itemStyle={{ color: "#8BF3FF" }}
                cursor={{ fill: "rgba(123, 241, 255, 0.08)" }}
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
                <p className="text-sm font-bold text-black">{student.avg}/20</p>
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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
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
            <label className="block text-sm font-medium text-black mb-2">Note de passage par défaut (/20)</label>
            <input type="number" defaultValue={12} min={0} max={20} step={0.5}
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

      {/* Right sidebar */}
      <aside className="space-y-6 lg:col-span-1">
        <DashboardSectionCard title="État du système" icon={Activity}>
          <div className="space-y-3">
            {[
              { label: "API ExamGuard", status: "ok", value: "Opérationnel" },
              { label: "Service de surveillance", status: "ok", value: "Opérationnel" },
              { label: "Stockage vidéo", status: "warn", value: "78% utilisé" },
              { label: "Détection IA", status: "ok", value: "Opérationnel" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg bg-[rgba(11,27,38,0.5)] border border-[rgba(117,195,214,0.14)] px-3 py-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`h-2 w-2 rounded-full flex-shrink-0 ${item.status === "ok" ? "bg-[#4ADE80] shadow-[0_0_6px_rgba(74,222,128,0.6)]" : "bg-[#FCD34D] shadow-[0_0_6px_rgba(252,211,77,0.6)]"}`} />
                  <span className="text-sm text-[var(--cyber-text)] truncate">{item.label}</span>
                </div>
                <span className="text-xs text-[var(--cyber-muted-text)] flex-shrink-0">{item.value}</span>
              </div>
            ))}
          </div>
        </DashboardSectionCard>

        <DashboardSectionCard title="Activité récente" icon={Clock}>
          <ul className="space-y-3">
            {[
              { icon: UserPlus, text: "12 étudiants ajoutés cette semaine", time: "Il y a 2 h" },
              { icon: FileText, text: "3 examens planifiés", time: "Hier" },
              { icon: Shield, text: "Politique de surveillance mise à jour", time: "Il y a 3 j" },
              { icon: Download, text: "Export du rapport mensuel", time: "Il y a 5 j" },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(11,27,38,0.7)] border border-[rgba(117,195,214,0.18)] flex-shrink-0">
                  <item.icon className="h-4 w-4 text-[var(--cyber-accent-strong)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[var(--cyber-text)] leading-snug">{item.text}</p>
                  <p className="text-xs text-[var(--cyber-subtle-text)] mt-0.5">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </DashboardSectionCard>

        <DashboardSectionCard title="Conseils de sécurité" icon={AlertCircle}>
          <ul className="space-y-2.5 text-sm text-[var(--cyber-muted-text)]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--cyber-accent-strong)] mt-0.5 flex-shrink-0" />
              Activez la détection faciale pour les examens à fort enjeu.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--cyber-accent-strong)] mt-0.5 flex-shrink-0" />
              Vérifiez les sessions actives au moins une fois par mois.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--cyber-accent-strong)] mt-0.5 flex-shrink-0" />
              Renouvelez votre mot de passe tous les 90 jours.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--cyber-accent-strong)] mt-0.5 flex-shrink-0" />
              Restreignez les IP aux réseaux institutionnels en période d'examen.
            </li>
          </ul>
        </DashboardSectionCard>

        <DashboardSectionCard title="Support" icon={Info}>
          <div className="space-y-3">
            <div className="rounded-lg bg-[rgba(11,27,38,0.5)] border border-[rgba(117,195,214,0.14)] px-3 py-2.5">
              <p className="text-xs text-[var(--cyber-subtle-text)]">Version</p>
              <p className="text-sm font-medium text-[var(--cyber-text)]">ExamGuard v2.4.1</p>
            </div>
            <div className="rounded-lg bg-[rgba(11,27,38,0.5)] border border-[rgba(117,195,214,0.14)] px-3 py-2.5">
              <p className="text-xs text-[var(--cyber-subtle-text)]">Contact</p>
              <p className="text-sm font-medium text-[var(--cyber-text)]">support@examguard.io</p>
            </div>
            <button className="cyber-button-secondary w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium">
              <BookOpen className="w-4 h-4" />
              Centre d'aide
            </button>
          </div>
        </DashboardSectionCard>
      </aside>
    </div>
  );
}

// ─── Live Exam Monitor ────────────────────────────────────────────────────────
function LiveExamMonitor({ exam, onBack, onEnd }: { exam: Exam; onBack: () => void; onEnd: () => void }) {
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [extraMinutes, setExtraMinutes] = useState(0);
  const [locked, setLocked] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageDraft, setMessageDraft] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [paused]);

  useEffect(() => {
    if (!confirmEnd && !messageOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [confirmEnd, messageOpen]);

  const handleExtend = () => {
    setExtraMinutes(m => m + 5);
    setToast("Durée prolongée de 5 minutes.");
  };
  const handleLock = () => {
    setLocked(l => !l);
    setToast(locked ? "Soumissions déverrouillées." : "Soumissions verrouillées.");
  };
  const handleSendMessage = () => {
    if (!messageDraft.trim()) return;
    setMessageOpen(false);
    setToast(`Message envoyé à ${liveParticipants.length} étudiant(s).`);
    setMessageDraft("");
  };
  const handleExport = () => {
    const payload = {
      exam: { id: exam.id, title: exam.title, subject: exam.subject, exportedAt: new Date().toISOString() },
      participants: liveParticipants,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `exam-${exam.id}-soumissions.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setToast("Soumissions exportées.");
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const liveParticipants = allStudentsData.slice(0, Math.min(exam.students || 5, allStudentsData.length)).map((s, i) => ({
    id: s.id,
    name: s.name,
    progress: Math.min(100, 12 + i * 17 + (elapsed % 11) * 2),
    state: i % 5 === 0 ? "flagged" : i % 4 === 0 ? "submitted" : "active",
    score: Math.round((10 + (i * 1.7) % 9) * 10) / 10,
  }));

  const liveAlerts = [
    { id: 1, name: liveParticipants[0]?.name ?? "—", type: "Changement d'onglet (3x)", severity: "high",   time: "Il y a 12s" },
    { id: 2, name: liveParticipants[2]?.name ?? "—", type: "Détection de visage perdue", severity: "medium", time: "Il y a 45s" },
    { id: 3, name: liveParticipants[1]?.name ?? "—", type: "Tentative copier-coller",     severity: "low",    time: "Il y a 1m 20s" },
  ];

  const total = liveParticipants.length;
  const active = liveParticipants.filter(p => p.state === "active").length;
  const submitted = liveParticipants.filter(p => p.state === "submitted").length;
  const flagged = liveParticipants.filter(p => p.state === "flagged").length;

  return (
    <div className="cyber-dashboard-page fixed inset-0 z-40 flex flex-col bg-[#FAFAFA] overflow-y-auto">
      <GridBackground variant="dashboard" />
      <div className="relative z-10 flex flex-col min-h-full">
        {/* Header */}
        <div className="border-b border-[rgba(123,241,255,0.18)] bg-[rgba(11,27,38,0.8)] backdrop-blur-md sticky top-0 z-10">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-4 min-w-0">
              <button onClick={onBack} className="p-2 rounded-lg hover:bg-[rgba(123,241,255,0.08)] transition-colors">
                <ArrowLeft className="w-5 h-5 text-[var(--cyber-text)]" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-red-600 text-white animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    En direct
                  </span>
                  <h1 className="text-base font-bold text-[var(--cyber-text)] truncate">{exam.title}</h1>
                </div>
                <p className="text-xs text-[var(--cyber-muted-text)] truncate">
                  {exam.subject} · {exam.duration + extraMinutes} min{extraMinutes > 0 && <span className="text-[var(--cyber-accent-strong)]"> (+{extraMinutes})</span>}
                  {locked && <span className="ml-2 text-amber-300">· Verrouillé</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {(() => {
                const totalSeconds = (exam.duration + extraMinutes) * 60;
                const remaining = Math.max(0, totalSeconds - elapsed);
                const lowTime = remaining > 0 && remaining <= 300; // < 5 min
                return (
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs text-[var(--cyber-subtle-text)] uppercase tracking-wide">Temps restant</span>
                    <span className={`text-base font-mono font-bold tabular-nums ${
                      remaining === 0 ? "text-red-400" : lowTime ? "text-amber-300" : "text-[var(--cyber-text)]"
                    }`}>
                      {formatTime(remaining)}
                    </span>
                  </div>
                );
              })()}
              <button
                onClick={() => setPaused(p => !p)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[rgba(123,241,255,0.25)] text-sm font-medium text-[var(--cyber-text)] hover:bg-[rgba(123,241,255,0.08)] transition-colors"
              >
                <PauseCircle className="w-4 h-4" />
                {paused ? "Reprendre" : "Suspendre"}
              </button>
              <button
                onClick={() => setConfirmEnd(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium text-white transition-colors"
              >
                <StopCircle className="w-4 h-4" />
                Terminer
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Étudiants connectés", value: `${active + submitted + flagged}/${total}`, icon: Wifi, color: "text-[var(--cyber-accent-strong)]" },
              { label: "En cours",            value: active,    icon: Activity,        color: "text-[var(--cyber-accent-strong)]" },
              { label: "Soumis",              value: submitted, icon: CheckCircle2,    color: "text-emerald-400" },
              { label: "Alertes",             value: flagged,   icon: AlertTriangle,   color: "text-red-400" },
            ].map(s => (
              <div key={s.label} className="rounded-2xl border border-[rgba(123,241,255,0.18)] bg-[rgba(11,27,38,0.5)] p-4">
                <div className="flex items-center justify-between mb-2">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <p className="text-2xl font-bold text-[var(--cyber-text)]">{s.value}</p>
                <p className="text-xs text-[var(--cyber-muted-text)] mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Participants */}
            <div className="lg:col-span-2 rounded-2xl border border-[rgba(123,241,255,0.18)] bg-[rgba(11,27,38,0.5)] p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-[var(--cyber-text)]">Participants en direct</h2>
                  <p className="text-xs text-[var(--cyber-muted-text)]">Progression et état des étudiants</p>
                </div>
              </div>
              <div className="space-y-2 max-h-[480px] overflow-y-auto">
                {liveParticipants.map(p => (
                  <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[rgba(123,241,255,0.1)] bg-[rgba(7,17,25,0.5)] hover:bg-[rgba(11,27,38,0.7)] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-white">{p.name.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[var(--cyber-text)] truncate">{p.name}</p>
                        {p.state === "flagged" && <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
                        {p.state === "submitted" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[rgba(123,241,255,0.08)] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              p.state === "flagged" ? "bg-red-500" : p.state === "submitted" ? "bg-emerald-500" : "bg-[var(--cyber-accent-strong)]"
                            }`}
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-[var(--cyber-muted-text)] tabular-nums">{p.progress}%</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[var(--cyber-text)] tabular-nums">{p.score}/20</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts + Actions */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-[rgba(255,80,80,0.25)] bg-[rgba(60,12,12,0.45)] p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-red-400" />
                    <h2 className="text-base font-bold text-[var(--cyber-text)]">Alertes de fraude</h2>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">{liveAlerts.length}</span>
                </div>
                <div className="space-y-2">
                  {liveAlerts.map(a => (
                    <div key={a.id} className="rounded-xl border border-[rgba(255,80,80,0.18)] bg-[rgba(11,27,38,0.5)] p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[var(--cyber-text)] truncate">{a.name}</p>
                          <p className="text-xs text-[var(--cyber-muted-text)] mt-0.5">{a.type}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          a.severity === "high" ? "bg-red-600 text-white" : a.severity === "medium" ? "bg-amber-500 text-black" : "bg-[rgba(123,241,255,0.18)] text-[var(--cyber-text)]"
                        }`}>{a.severity}</span>
                      </div>
                      <p className="text-[10px] text-[var(--cyber-subtle-text)] mt-1">{a.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[rgba(123,241,255,0.18)] bg-[rgba(11,27,38,0.5)] p-5">
                <h2 className="text-base font-bold text-[var(--cyber-text)] mb-4">Actions rapides</h2>
                <div className="space-y-2">
                  <button onClick={() => setMessageOpen(true)} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[rgba(123,241,255,0.25)] text-sm font-medium text-[var(--cyber-text)] hover:bg-[rgba(123,241,255,0.08)] transition-colors">
                    <Send className="w-4 h-4" />
                    Envoyer un message à tous
                  </button>
                  <button onClick={handleExtend} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[rgba(123,241,255,0.25)] text-sm font-medium text-[var(--cyber-text)] hover:bg-[rgba(123,241,255,0.08)] transition-colors">
                    <Clock className="w-4 h-4" />
                    Prolonger la durée (+5 min)
                    {extraMinutes > 0 && <span className="ml-auto text-xs text-[var(--cyber-accent-strong)]">+{extraMinutes} min</span>}
                  </button>
                  <button onClick={handleLock} className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    locked
                      ? "border-amber-400/40 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20"
                      : "border-[rgba(123,241,255,0.25)] text-[var(--cyber-text)] hover:bg-[rgba(123,241,255,0.08)]"
                  }`}>
                    <Shield className="w-4 h-4" />
                    {locked ? "Déverrouiller les soumissions" : "Verrouiller les soumissions"}
                  </button>
                  <button onClick={handleExport} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[rgba(123,241,255,0.25)] text-sm font-medium text-[var(--cyber-text)] hover:bg-[rgba(123,241,255,0.08)] transition-colors">
                    <Download className="w-4 h-4" />
                    Exporter les soumissions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* End confirm */}
        {confirmEnd && (() => {
          const notFinished = liveParticipants.filter(p => p.state !== "submitted");
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="w-full max-w-md rounded-2xl border border-[rgba(123,241,255,0.25)] bg-[rgba(11,27,38,0.95)] p-6 shadow-2xl">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--cyber-text)]">Terminer l'examen ?</h3>
                    <p className="text-sm text-[var(--cyber-muted-text)] mt-1">
                      {notFinished.length === 0
                        ? "Tous les étudiants ont soumis. L'examen passera en statut « Terminé »."
                        : `${notFinished.length} étudiant${notFinished.length > 1 ? "s n'ont" : " n'a"} pas encore soumis.`}
                    </p>
                  </div>
                </div>

                {notFinished.length > 0 && (
                  <div className="rounded-xl border border-[rgba(255,80,80,0.25)] bg-[rgba(60,12,12,0.35)] p-3 mb-4 max-h-44 overflow-y-auto">
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-300 mb-2">Étudiants non soumis</p>
                    <ul className="space-y-1.5">
                      {notFinished.map(p => (
                        <li key={p.id} className="flex items-center justify-between text-sm">
                          <span className="text-[var(--cyber-text)] truncate">{p.name}</span>
                          <span className="text-xs text-[var(--cyber-muted-text)] tabular-nums ml-2">{p.progress}%</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-[var(--cyber-muted-text)] mt-3">
                      Leurs réponses actuelles seront soumises automatiquement et l'examen sera verrouillé.
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <button onClick={() => setConfirmEnd(false)} className="px-4 py-2 rounded-xl border border-[rgba(123,241,255,0.25)] text-sm font-medium text-[var(--cyber-text)] hover:bg-[rgba(123,241,255,0.08)] transition-colors">
                    Annuler
                  </button>
                  <button onClick={() => { setConfirmEnd(false); onEnd(); }} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-sm font-medium text-white transition-colors">
                    Confirmer et terminer
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Send-message modal */}
        {messageOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-[rgba(123,241,255,0.25)] bg-[rgba(11,27,38,0.95)] p-6 shadow-2xl">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[rgba(123,241,255,0.12)] flex items-center justify-center flex-shrink-0">
                  <Send className="w-5 h-5 text-[var(--cyber-accent-strong)]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--cyber-text)]">Envoyer un message</h3>
                  <p className="text-sm text-[var(--cyber-muted-text)] mt-1">Visible immédiatement par les {liveParticipants.length} étudiant(s) en cours.</p>
                </div>
              </div>
              <textarea
                value={messageDraft}
                onChange={e => setMessageDraft(e.target.value)}
                rows={4}
                placeholder="Votre message..."
                className="w-full px-3 py-2 bg-[rgba(7,17,25,0.6)] border border-[rgba(123,241,255,0.25)] rounded-xl text-sm text-[var(--cyber-text)] placeholder:text-[var(--cyber-subtle-text)] focus:outline-none focus:ring-2 focus:ring-[var(--cyber-accent-strong)] resize-none"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => { setMessageOpen(false); setMessageDraft(""); }} className="px-4 py-2 rounded-xl border border-[rgba(123,241,255,0.25)] text-sm font-medium text-[var(--cyber-text)] hover:bg-[rgba(123,241,255,0.08)] transition-colors">
                  Annuler
                </button>
                <button onClick={handleSendMessage} disabled={!messageDraft.trim()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--cyber-accent-strong)] hover:opacity-90 text-sm font-medium text-black transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send className="w-4 h-4" />
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4 py-3 rounded-xl bg-[rgba(11,27,38,0.95)] border border-[rgba(123,241,255,0.25)] shadow-2xl text-sm text-[var(--cyber-text)] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--cyber-accent-strong)]" />
            {toast}
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
  const [showImport, setShowImport] = useState(false);
  const [overviewExamDetails, setOverviewExamDetails] = useState<Exam | null>(null);
  const [reviewAlert, setReviewAlert] = useState<FraudAlert | null>(null);
  const [exams, setExams] = useState<Exam[]>(allExamsData);
  const [liveExamId, setLiveExamId] = useState<number | null>(null);
  const liveExam = liveExamId !== null ? exams.find(e => e.id === liveExamId) ?? null : null;

  const handleLogoClick = () => {
    setActiveTab("overview");
    setShowCreateExam(false);
    setShowImport(false);
    setOverviewExamDetails(null);
    setReviewAlert(null);
  };

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: "exams", label: "Examens", icon: FileText },
    { id: "students", label: "Étudiants", icon: Users },
    { id: "analytics", label: "Analytiques", icon: BarChart3 },
    { id: "settings", label: "Paramètres", icon: Settings },
  ];

  if (liveExam) {
    return (
      <LiveExamMonitor
        exam={liveExam}
        onBack={() => setLiveExamId(null)}
        onEnd={() => {
          setExams(prev => prev.map(e => e.id === liveExam.id ? { ...e, status: "completed" } : e));
          setLiveExamId(null);
        }}
      />
    );
  }

  return (
    <div className="cyber-dashboard-page relative min-h-screen overflow-hidden bg-[#FAFAFA]">
      <GridBackground variant="dashboard" />
      <div className="relative z-10">
      {/* Global modals */}
      {showCreateExam && (
        <CreateExamModal
          onClose={() => setShowCreateExam(false)}
          onCreated={(newExam) => { setExams(prev => [newExam, ...prev]); setActiveTab("exams"); }}
        />
      )}
      {showImport && <ImportDataModal onClose={() => setShowImport(false)} />}
      {overviewExamDetails && (
        <ExamDetailsModal
          exam={overviewExamDetails}
          onClose={() => setOverviewExamDetails(null)}
          onEdit={() => { setOverviewExamDetails(null); setActiveTab("exams"); }}
        />
      )}
      {reviewAlert && (
        <FraudAlertDetailsModal
          alert={reviewAlert}
          onClose={() => setReviewAlert(null)}
          onAction={() => setReviewAlert(null)}
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
            onGoToAnalytics={() => setActiveTab("analytics")}
            onExamDetails={(exam) => setOverviewExamDetails(exam)}
            onAlertReview={(alert) => setReviewAlert(alert)}
            onCreateExam={() => setShowCreateExam(true)}
            onImportData={() => setShowImport(true)}
          />
        )}
        {activeTab === "exams" && <ExamsTab onCreateExam={() => setShowCreateExam(true)} exams={exams} setExams={setExams} onMonitor={(exam) => setLiveExamId(exam.id)} />}
        {activeTab === "students" && <StudentsTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
        {activeTab === "settings" && <SettingsTab onGoToProfile={() => navigate("/admin/profile")} />}
      </main>
      </div>
    </div>
  );
}
