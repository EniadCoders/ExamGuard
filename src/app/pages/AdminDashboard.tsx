import { useState, useRef } from "react";
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
  Lock,
  ArrowUpRight,
  Eye,
  TrendingUp,
  Shield,
  Clock,
  ChevronRight,
  Activity,
  X,
  Check,
  Settings,
  Zap,
  Code2,
  AlignLeft,
  CheckCircle2,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Copy,
  Info,
  Save,
  Send,
  Search,
  Edit3,
  Download,
  Ban,
  CheckSquare,
  PieChart,
  Upload,
  RefreshCw,
  UserPlus,
  Hash,
} from "lucide-react";
import { NotificationPanel } from "../components/NotificationPanel";
import { useNavigate } from "react-router";
import { GridBackground } from "../components/GridBackground";
import { Logo } from "../components/Logo";
import { CodeEditorPanel } from "../components/CodeEditorPanel";
import type { Question, Language, QuestionType } from "../types/exam";
import {
  LANGUAGE_LABELS,
  TYPE_LABELS,
  TYPE_COLORS,
} from "../types/exam";

// ─── Dashboard data ──────────────────────────────────────────────────────────
const stats = [
  { label: "Examens actifs", value: "12", change: "+3", trend: "up", icon: FileText, color: "blue", desc: "vs. semaine dernière" },
  { label: "Étudiants en ligne", value: "247", change: "+18", trend: "up", icon: Users, color: "cyan", desc: "en ce moment" },
  { label: "Alertes fraude", value: "8", change: "+2", trend: "alert", icon: AlertTriangle, color: "red", desc: "dernières 24h" },
  { label: "Taux de réussite", value: "87%", change: "+5%", trend: "up", icon: TrendingUp, color: "green", desc: "ce semestre" },
];

const recentExams = [
  { id: 1, title: "Architecture Java EE", subject: "Génie logiciel", duration: 90, date: "09 Avril à 18:00", students: 45, status: "scheduled" },
  { id: 2, title: "Base de données avancées", subject: "Systèmes d'information", duration: 120, date: "10 Avril à 14:00", students: 38, status: "scheduled" },
  { id: 3, title: "Sécurité informatique", subject: "Cybersécurité", duration: 90, date: "12 Avril à 10:00", students: 52, status: "draft" },
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

const colorMap: Record<string, string> = {
  blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  red: "text-red-400 bg-red-500/10 border-red-500/20",
  green: "text-green-400 bg-green-500/10 border-green-500/20",
};

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function ToggleSwitch({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      type="button"
      onClick={() => setOn(!on)}
      className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 ${on ? "bg-gradient-to-r from-blue-500 to-cyan-500 shadow-md shadow-blue-500/20" : "bg-slate-700/60"}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? "left-5" : "left-0.5"}`} />
    </button>
  );
}

// ─── Question type icon ───────────────────────────────────────────────────────
function QTypeIcon({ type, className = "w-4 h-4" }: { type: string; className?: string }) {
  if (type === "mcq") return <CheckCircle2 className={className} />;
  if (type === "text") return <AlignLeft className={className} />;
  return <Code2 className={className} />;
}

// ─── Question Builder ─────────────────────────────────────────────────────────
interface EditableQuestion extends Omit<Question, "id"> {
  id: number;
  collapsed?: boolean;
}

interface QuestionEditorProps {
  q: EditableQuestion;
  index: number;
  total: number;
  onChange: (updated: EditableQuestion) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function QuestionEditor({ q, index, total, onChange, onDelete, onDuplicate, onMoveUp, onMoveDown }: QuestionEditorProps) {
  const toggleCollapse = () => onChange({ ...q, collapsed: !q.collapsed });

  const addOption = () => {
    if (q.type !== "mcq") return;
    const ids = ["A", "B", "C", "D", "E", "F"];
    const existing = q.options.map((o) => o.id);
    const nextId = ids.find((id) => !existing.includes(id));
    if (!nextId) return;
    onChange({ ...q, options: [...q.options, { id: nextId, text: "" }] });
  };

  const removeOption = (optId: string) => {
    if (q.type !== "mcq") return;
    onChange({ ...q, options: q.options.filter((o) => o.id !== optId) });
  };

  const updateOption = (optId: string, text: string) => {
    if (q.type !== "mcq") return;
    onChange({ ...q, options: q.options.map((o) => (o.id === optId ? { ...o, text } : o)) });
  };

  const setCorrect = (optId: string) => {
    if (q.type !== "mcq") return;
    onChange({ ...q, correctAnswer: optId } as any);
  };

  return (
    <div className={`bg-slate-900/60 border rounded-2xl overflow-hidden transition-all ${q.collapsed ? "border-slate-800/60" : "border-slate-700/50"}`}>
      {/* Header */}
      <div
        className={`flex items-center gap-3 px-5 py-4 cursor-pointer ${q.collapsed ? "hover:bg-slate-800/20" : "border-b border-slate-800/50"}`}
        onClick={toggleCollapse}
      >
        <div className="flex-shrink-0 text-slate-600 cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4" />
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-slate-800/60 text-xs text-slate-400 flex items-center justify-center">
            {index + 1}
          </span>
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs flex-shrink-0 ${TYPE_COLORS[q.type]}`}>
            <QTypeIcon type={q.type} className="w-3 h-3" />
            {TYPE_LABELS[q.type]}
          </div>
          <p className="text-sm text-slate-300 truncate min-w-0">
            {q.text || <span className="text-slate-600 italic">Question sans titre…</span>}
          </p>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/40 text-xs text-slate-500">
            {q.points}pt{q.points > 1 ? "s" : ""}
          </div>
          <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} disabled={index === 0} className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-slate-800/50 disabled:opacity-30 transition-all" title="Monter">
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} disabled={index === total - 1} className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-slate-800/50 disabled:opacity-30 transition-all" title="Descendre">
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-slate-800/50 transition-all" title="Dupliquer">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Supprimer">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-slate-700/50 mx-1" />
          {q.collapsed ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronUp className="w-4 h-4 text-slate-500" />}
        </div>
      </div>

      {/* Body */}
      {!q.collapsed && (
        <div className="p-5 space-y-5">
          {/* Question text */}
          <div>
            <label className="block text-xs text-slate-400 mb-2">Énoncé de la question</label>
            <textarea
              value={q.text}
              onChange={(e) => onChange({ ...q, text: e.target.value })}
              placeholder="Saisissez l'énoncé de la question..."
              rows={3}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all resize-none"
            />
          </div>

          {/* Points */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-xs text-slate-400 mb-2">Barème (points)</label>
              <input
                type="number"
                min={1}
                max={20}
                value={q.points}
                onChange={(e) => onChange({ ...q, points: Number(e.target.value) })}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
              />
            </div>
          </div>

          {/* MCQ specific */}
          {q.type === "mcq" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs text-slate-400">
                  Choix de réponses
                  <span className="ml-2 text-slate-600">(cochez la bonne réponse)</span>
                </label>
              </div>
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isCorrect = (q as any).correctAnswer === opt.id;
                  return (
                    <div key={opt.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCorrect(opt.id)}
                        title="Marquer comme correcte"
                        className={`flex-shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center text-xs transition-all ${
                          isCorrect
                            ? "bg-green-500/20 border-green-500/40 text-green-400"
                            : "bg-slate-800/50 border-slate-700/40 text-slate-500 hover:border-slate-600"
                        }`}
                      >
                        {opt.id}
                      </button>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => updateOption(opt.id, e.target.value)}
                        placeholder={`Option ${opt.id}...`}
                        className={`flex-1 bg-slate-800/50 border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all ${
                          isCorrect ? "border-green-500/30" : "border-slate-700/50"
                        }`}
                      />
                      {isCorrect && (
                        <span className="flex-shrink-0 flex items-center gap-1 text-xs text-green-400 px-2">
                          <Check className="w-3 h-3" />
                          Correcte
                        </span>
                      )}
                      {q.options.length > 2 && (
                        <button
                          onClick={() => removeOption(opt.id)}
                          className="flex-shrink-0 p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              {q.options.length < 6 && (
                <button
                  onClick={addOption}
                  className="mt-3 flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors px-2 py-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Ajouter un choix
                </button>
              )}
            </div>
          )}

          {/* Text specific */}
          {q.type === "text" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-2">Placeholder (aide)</label>
                <input
                  type="text"
                  value={(q as any).placeholder ?? ""}
                  onChange={(e) => onChange({ ...q, placeholder: e.target.value } as any)}
                  placeholder="Indication pour l'étudiant..."
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-2">Nombre de mots min.</label>
                <input
                  type="number"
                  min={0}
                  value={(q as any).minWords ?? ""}
                  onChange={(e) => onChange({ ...q, minWords: Number(e.target.value) } as any)}
                  placeholder="ex: 80"
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                />
              </div>
              <div className="col-span-full">
                <label className="block text-xs text-slate-400 mb-2">Corrigé type (non visible par l'étudiant)</label>
                <textarea
                  placeholder="Éléments attendus dans la réponse..."
                  rows={3}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all resize-none"
                />
              </div>
            </div>
          )}

          {/* Code specific */}
          {q.type === "code" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-2">Langage de programmation</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => {
                    const isActive = (q as any).language === lang;
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => onChange({ ...q, language: lang } as any)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                          isActive
                            ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
                            : "bg-slate-800/40 border-slate-700/40 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                        }`}
                      >
                        <Code2 className="w-3 h-3" />
                        {LANGUAGE_LABELS[lang]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">Code de départ (fourni à l'étudiant)</label>
                <CodeEditorPanel
                  language={(q as any).language ?? "java"}
                  value={{
                    code: (q as any).starterCode ?? "",
                    output: "",
                    hasRun: false,
                    isRunning: false,
                  }}
                  onChange={(ans) => onChange({ ...q, starterCode: ans.code } as any)}
                  allowLanguageChange={false}
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">Sortie attendue (référence)</label>
                <input
                  type="text"
                  placeholder="ex: 6, [1, 1, 2, 3, 6, 8, 10]..."
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── AddQuestionButton ────────────────────────────────────────────────────────
function AddQuestionButton({ onAdd }: { onAdd: (type: QuestionType) => void }) {
  const [open, setOpen] = useState(false);
  const types: { type: QuestionType; label: string; desc: string; icon: React.ElementType; color: string }[] = [
    { type: "mcq", label: "Choix multiple (QCM)", desc: "Options A/B/C/D avec une bonne réponse", icon: CheckCircle2, color: "text-blue-400" },
    { type: "text", label: "Réponse textuelle", desc: "Zone de texte libre pour l'étudiant", icon: AlignLeft, color: "text-purple-400" },
    { type: "code", label: "Question de code", desc: "Éditeur de code + compilateur en ligne", icon: Code2, color: "text-cyan-400" },
  ];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl text-sm text-white transition-all shadow-lg shadow-blue-500/20"
      >
        <Plus className="w-4 h-4" />
        Ajouter une question
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl z-20 py-2 overflow-hidden">
          {types.map((t) => (
            <button
              key={t.type}
              onClick={() => { onAdd(t.type); setOpen(false); }}
              className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-800/50 transition-colors text-left"
            >
              <div className={`mt-0.5 flex-shrink-0 ${t.color}`}>
                <t.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm text-slate-200">{t.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Create Exam wizard (steps) ───────────────────────────────────────────────
const STEPS = ["Informations", "Questions", "Sécurité", "Participants", "Aperçu"];

function CreateExamView() {
  const [step, setStep] = useState(0);
  const [questions, setQuestions] = useState<EditableQuestion[]>([
    {
      id: 1, type: "mcq", text: "Quelle est la différence entre ArrayList et LinkedList?", points: 2,
      options: [
        { id: "A", text: "ArrayList utilise un tableau dynamique" },
        { id: "B", text: "LinkedList utilise des nœuds chaînés" },
        { id: "C", text: "Les deux sont identiques" },
        { id: "D", text: "Aucune différence" },
      ],
      correctAnswer: "A",
    } as any,
  ]);
  const [examInfo, setExamInfo] = useState({
    title: "",
    subject: "",
    duration: "90",
    date: "",
    description: "",
  });
  const [maxWarnings, setMaxWarnings] = useState(3);

  const addQuestion = (type: QuestionType) => {
    const id = Date.now();
    const base = { id, type, text: "", points: 2 };
    let q: EditableQuestion;
    if (type === "mcq") {
      q = { ...base, type: "mcq", options: [{ id: "A", text: "" }, { id: "B", text: "" }, { id: "C", text: "" }, { id: "D", text: "" }] } as any;
    } else if (type === "text") {
      q = { ...base, type: "text", placeholder: "", minWords: 50 } as any;
    } else {
      q = { ...base, type: "code", language: "java", starterCode: "public class Solution {\n    public static void main(String[] args) {\n        // Votre code ici\n    }\n}" } as any;
    }
    setQuestions((prev) => [...prev, q]);
  };

  const removeQuestion = (idx: number) => setQuestions((prev) => prev.filter((_, i) => i !== idx));
  const duplicateQuestion = (idx: number) => {
    const q = { ...questions[idx], id: Date.now() };
    setQuestions((prev) => [...prev.slice(0, idx + 1), q, ...prev.slice(idx + 1)]);
  };
  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setQuestions((prev) => { const a = [...prev]; [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]; return a; });
  };
  const moveDown = (idx: number) => {
    if (idx === questions.length - 1) return;
    setQuestions((prev) => { const a = [...prev]; [a[idx], a[idx + 1]] = [a[idx + 1], a[idx]]; return a; });
  };
  const updateQuestion = (idx: number, updated: EditableQuestion) => {
    setQuestions((prev) => prev.map((q, i) => (i === idx ? updated : q)));
  };

  const totalPoints = questions.reduce((s, q) => s + (q.points || 0), 0);
  const typeCounts = questions.reduce((acc, q) => { acc[q.type] = (acc[q.type] || 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Step indicator */}
      <div className="flex items-center gap-1">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-1">
            <button
              onClick={() => setStep(i)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                i === step
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : i < step
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-600"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  i < step
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : i === step
                    ? "bg-blue-500 text-white"
                    : "bg-slate-800 text-slate-600 border border-slate-700/40"
                }`}
              >
                {i < step ? <Check className="w-3 h-3" /> : i + 1}
              </span>
              {label}
            </button>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-px ${i < step ? "bg-green-500/40" : "bg-slate-700/50"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0: Info */}
      {step === 0 && (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl overflow-hidden">
          <div className="px-7 py-5 border-b border-slate-800/50 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <h3 className="text-base text-slate-100">Informations générales</h3>
          </div>
          <div className="p-7 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-slate-400 mb-2">Titre de l'examen *</label>
                <input type="text" value={examInfo.title} onChange={(e) => setExamInfo({ ...examInfo, title: e.target.value })} placeholder="ex: Architecture Java EE" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-2">Matière *</label>
                <select value={examInfo.subject} onChange={(e) => setExamInfo({ ...examInfo, subject: e.target.value })} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all">
                  <option value="">Sélectionner…</option>
                  <option>Génie logiciel</option>
                  <option>Base de données</option>
                  <option>Cybersécurité</option>
                  <option>Algorithmique</option>
                  <option>Réseaux</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-2">Durée (minutes) *</label>
                <input type="number" value={examInfo.duration} onChange={(e) => setExamInfo({ ...examInfo, duration: e.target.value })} placeholder="90" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-2">Date et heure de début *</label>
                <input type="datetime-local" value={examInfo.date} onChange={(e) => setExamInfo({ ...examInfo, date: e.target.value })} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-2">Description (optionnel)</label>
              <textarea value={examInfo.description} onChange={(e) => setExamInfo({ ...examInfo, description: e.target.value })} placeholder="Instructions générales pour les étudiants..." rows={3} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all resize-none" />
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Questions */}
      {step === 1 && (
        <div className="space-y-4">
          {/* Summary bar */}
          <div className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800/50 rounded-2xl">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>{questions.length} question{questions.length > 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-200">{totalPoints}</span>
                <span>points au total</span>
              </div>
              {(["mcq", "text", "code"] as const).map((type) =>
                typeCounts[type] ? (
                  <div key={type} className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border ${TYPE_COLORS[type]}`}>
                    <QTypeIcon type={type} className="w-3 h-3" />
                    {typeCounts[type]} {TYPE_LABELS[type]}
                  </div>
                ) : null
              )}
            </div>
            <AddQuestionButton onAdd={addQuestion} />
          </div>

          {/* Question list */}
          {questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-slate-900/40 border border-slate-800/50 border-dashed rounded-2xl text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/50 border border-slate-700/40 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-slate-600" />
              </div>
              <p className="text-sm text-slate-400 mb-1">Aucune question ajoutée</p>
              <p className="text-xs text-slate-600 mb-5">Commencez par ajouter une question QCM, texte ou code</p>
              <AddQuestionButton onAdd={addQuestion} />
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <QuestionEditor
                  key={q.id}
                  q={q}
                  index={idx}
                  total={questions.length}
                  onChange={(updated) => updateQuestion(idx, updated)}
                  onDelete={() => removeQuestion(idx)}
                  onDuplicate={() => duplicateQuestion(idx)}
                  onMoveUp={() => moveUp(idx)}
                  onMoveDown={() => moveDown(idx)}
                />
              ))}
              <div className="pt-2">
                <AddQuestionButton onAdd={addQuestion} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Security */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl overflow-hidden">
            <div className="px-7 py-5 border-b border-slate-800/50 flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <div>
                <h3 className="text-base text-slate-100">Paramètres de sécurité</h3>
                <p className="text-xs text-slate-500 mt-0.5">Configurez la surveillance et la protection anti-fraude</p>
              </div>
            </div>
            <div className="p-7 space-y-3">
              {[
                { icon: Eye, title: "Mode plein écran obligatoire", desc: "Force l'étudiant à rester en plein écran pendant l'examen", default: true, color: "text-blue-400", badge: "Recommandé" },
                { icon: Zap, title: "Détection perte de focus", desc: "Détecte et enregistre les changements d'onglet ou d'application", default: true, color: "text-cyan-400", badge: "Recommandé" },
                { icon: AlertTriangle, title: "Soumission automatique", desc: "Termine l'examen automatiquement après dépassement du quota d'avertissements", default: false, color: "text-amber-400", badge: "Strict" },
                { icon: Code2, title: "Bloquer copier-coller", desc: "Désactive les raccourcis copier/coller dans l'interface", default: true, color: "text-red-400", badge: null },
                { icon: Info, title: "Afficher les avertissements", desc: "Informe l'étudiant du nombre d'avertissements restants", default: true, color: "text-slate-400", badge: null },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-800/25 hover:bg-slate-800/40 border border-slate-800/50 rounded-xl transition-all group">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-slate-700/40 border border-slate-700/40 flex items-center justify-center ${item.color}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-slate-200">{item.title}</p>
                        {item.badge && (
                          <span className={`text-xs px-1.5 py-0.5 rounded-md border ${item.badge === "Strict" ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-green-400 bg-green-500/10 border-green-500/20"}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <ToggleSwitch defaultChecked={item.default} />
                </div>
              ))}

              {/* Warnings count */}
              <div className="p-4 bg-slate-800/25 border border-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-700/40 border border-slate-700/40 flex items-center justify-center text-red-400">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-slate-200">Nombre d'avertissements autorisés</p>
                      <span className="text-xs px-1.5 py-0.5 rounded-md border text-amber-400 bg-amber-500/10 border-amber-500/20">Configurable</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Seuil de déclenchement avant sanction automatique (1–5)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-12">
                  <button onClick={() => setMaxWarnings((p) => Math.max(1, p - 1))} className="w-7 h-7 rounded-lg bg-slate-700/60 border border-slate-600/50 text-slate-300 hover:bg-slate-600/60 flex items-center justify-center transition-all text-lg leading-none">−</button>
                  <div className="flex-1 flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} onClick={() => setMaxWarnings(n)} className={`flex-1 py-1.5 rounded-lg text-sm transition-all border ${maxWarnings === n ? "bg-red-500/20 border-red-500/30 text-red-300" : "bg-slate-800/40 border-slate-700/30 text-slate-500 hover:text-slate-300"}`}>{n}</button>
                    ))}
                  </div>
                  <button onClick={() => setMaxWarnings((p) => Math.min(5, p + 1))} className="w-7 h-7 rounded-lg bg-slate-700/60 border border-slate-600/50 text-slate-300 hover:bg-slate-600/60 flex items-center justify-center transition-all text-lg leading-none">+</button>
                </div>
                <p className="text-xs text-slate-600 mt-2 pl-12">
                  Actuellement : <span className="text-red-400">{maxWarnings} avertissement{maxWarnings > 1 ? "s" : ""}</span> maximum par étudiant
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Participants */}
      {step === 3 && <StudentManagementPanel />}

      {/* Step 4: Preview */}
      {step === 4 && (
        <div className="space-y-5">
          <div className="p-6 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/15 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg text-slate-100 mb-1">
                  {examInfo.title || "Sans titre"}
                </h3>
                <p className="text-sm text-slate-400 mb-3">
                  {examInfo.subject || "Matière non définie"} · {examInfo.duration} min · {examInfo.date || "Date non définie"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(["mcq", "text", "code"] as const).map((type) =>
                    typeCounts[type] ? (
                      <span key={type} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs ${TYPE_COLORS[type]}`}>
                        <QTypeIcon type={type} className="w-3 h-3" />
                        {typeCounts[type]} {TYPE_LABELS[type]}
                      </span>
                    ) : null
                  )}
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/40 text-xs text-slate-400">
                    {totalPoints} points
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Questions preview */}
          <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800/50">
              <h4 className="text-sm text-slate-200">Questions ({questions.length})</h4>
            </div>
            <div className="divide-y divide-slate-800/40">
              {questions.map((q, i) => (
                <div key={q.id} className="flex items-center gap-4 px-6 py-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-800/60 text-xs text-slate-500 flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs flex-shrink-0 ${TYPE_COLORS[q.type]}`}>
                    <QTypeIcon type={q.type} className="w-3 h-3" />
                    {TYPE_LABELS[q.type]}
                  </div>
                  <p className="text-sm text-slate-300 flex-1 truncate">{q.text || <span className="text-slate-600 italic">Énoncé vide</span>}</p>
                  <span className="text-xs text-slate-500 flex-shrink-0">{q.points}pt{q.points > 1 ? "s" : ""}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 bg-green-500/5 border border-green-500/15 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
            <p className="text-xs text-slate-300">
              Votre examen est prêt à être publié. Les étudiants pourront y accéder à la date programmée.
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="flex items-center gap-2 px-5 py-2.5 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl border border-slate-800/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Retour
        </button>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-slate-200 rounded-xl text-sm transition-all">
            <Save className="w-4 h-4" />
            Brouillon
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20"
            >
              Étape suivante
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl text-sm transition-all shadow-lg shadow-green-500/20">
              <Send className="w-4 h-4" />
              Publier l'examen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Exams List View ──────────────────────────────────────────────────────────
const allExamsData = [
  { id: 1, title: "Architecture Java EE", subject: "Génie logiciel", duration: 90, date: "09 Avr 2026", time: "18:00", students: 45, submitted: 0, status: "scheduled", types: ["mcq", "code"], questions: 8, points: 36 },
  { id: 2, title: "Base de données avancées", subject: "Systèmes d'info", duration: 120, date: "10 Avr 2026", time: "14:00", students: 38, submitted: 0, status: "scheduled", types: ["mcq", "text"], questions: 6, points: 28 },
  { id: 3, title: "Sécurité informatique", subject: "Cybersécurité", duration: 90, date: "12 Avr 2026", time: "10:00", students: 52, submitted: 0, status: "draft", types: ["mcq", "text", "code"], questions: 10, points: 44 },
  { id: 4, title: "Réseaux & Protocoles", subject: "Télécoms", duration: 60, date: "08 Mar 2026", time: "10:00", students: 38, submitted: 38, status: "completed", types: ["mcq"], questions: 5, points: 20, avgScore: 74 },
  { id: 5, title: "Algorithmique Avancée", subject: "Mathématiques", duration: 120, date: "29 Mar 2026", time: "14:00", students: 33, submitted: 33, status: "completed", types: ["code"], questions: 4, points: 40, avgScore: 68 },
  { id: 6, title: "Systèmes d'Exploitation", subject: "Informatique", duration: 90, date: "31 Mar 2026", time: "14:00", students: 43, submitted: 18, status: "ongoing", types: ["mcq", "text", "code"], questions: 8, points: 36, activeStudents: 25 },
];

// ─── Exam Action Modals ───────────────────────────────────────────────────────
function ExamPreviewModal({ exam, onClose, onEdit }: { exam: typeof allExamsData[0]; onClose: () => void; onEdit: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl">
        <div className="absolute -inset-px bg-gradient-to-br from-blue-500/20 via-transparent to-cyan-500/15 rounded-2xl blur-sm" />
        <div className="relative bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"><FileText className="w-4 h-4 text-blue-400" /></div>
              <div><h3 className="text-base text-white">{exam.title}</h3><p className="text-xs text-slate-500">{exam.subject}</p></div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 transition-all"><X className="w-4 h-4" /></button>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Date & heure", value: `${exam.date} · ${exam.time}`, icon: Calendar },
                { label: "Durée", value: `${exam.duration} minutes`, icon: Clock },
                { label: "Participants", value: `${exam.students} étudiants`, icon: Users },
                { label: "Questions", value: `${exam.questions}Q · ${exam.points} pts`, icon: FileText },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 bg-slate-800/30 border border-slate-800/50 rounded-xl">
                  <item.icon className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <div><p className="text-xs text-slate-500">{item.label}</p><p className="text-xs text-slate-200 mt-0.5">{item.value}</p></div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {exam.types.map((t) => (
                <span key={t} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs ${TYPE_COLORS[t as keyof typeof TYPE_COLORS]}`}>
                  {TYPE_LABELS[t as keyof typeof TYPE_LABELS]}
                </span>
              ))}
            </div>
            {exam.status === "completed" && (exam as any).avgScore !== undefined && (
              <div className="p-4 bg-slate-800/30 border border-slate-800/50 rounded-xl">
                <p className="text-xs text-slate-400 mb-2">Score moyen de la classe</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-700/60 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${(exam as any).avgScore}%` }} />
                  </div>
                  <span className="text-sm text-cyan-400 flex-shrink-0">{(exam as any).avgScore}%</span>
                </div>
              </div>
            )}
            {exam.status === "ongoing" && (exam as any).activeStudents !== undefined && (
              <div className="flex items-center gap-2 p-3 bg-blue-500/8 border border-blue-500/15 rounded-xl text-xs text-blue-400">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse flex-shrink-0" />
                <span>{(exam as any).activeStudents} étudiants actifs sur {exam.students} inscrits</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800/60 bg-slate-900/50">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-700/50 text-slate-300 hover:bg-slate-800/50 transition-all text-sm">Fermer</button>
            {exam.status !== "ongoing" && (
              <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl text-sm text-white transition-all shadow-lg shadow-blue-500/20">
                <Edit3 className="w-3.5 h-3.5" />Modifier
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExamEditModal({ exam, onClose, onSave }: { exam: typeof allExamsData[0]; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({ title: exam.title, subject: exam.subject, duration: String(exam.duration) });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false); setSaved(true);
    setTimeout(() => { setSaved(false); onSave(); }, 1200);
  };
  const subjects = ["Génie logiciel","Base de données","Cybersécurité","Algorithmique","Réseaux","Télécoms","Mathématiques","Informatique","Systèmes d'info"];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg">
        <div className="absolute -inset-px bg-gradient-to-br from-blue-500/20 via-transparent to-cyan-500/15 rounded-2xl blur-sm" />
        <div className="relative bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/60">
            <div className="flex items-center gap-2"><Edit3 className="w-4 h-4 text-blue-400" /><h3 className="text-base text-white">Modifier l'examen</h3></div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 transition-all"><X className="w-4 h-4" /></button>
          </div>
          {saved ? (
            <div className="p-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="w-7 h-7 text-green-400" /></div>
              <p className="text-sm text-green-400">Examen mis à jour avec succès !</p>
            </div>
          ) : (
            <>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Titre de l'examen *</label>
                  <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-2">Matière</label>
                    <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all">
                      {subjects.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-2">Durée (min)</label>
                    <input type="number" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Nouvelle date et heure</label>
                  <input type="datetime-local" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Description (optionnel)</label>
                  <textarea rows={2} placeholder="Instructions ou notes pour les étudiants..." className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all resize-none" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800/60 bg-slate-900/50">
                <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-700/50 text-slate-300 hover:bg-slate-800/50 transition-all text-sm">Annuler</button>
                <button onClick={handleSave} disabled={saving || !form.title.trim()} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 rounded-xl text-sm text-white transition-all shadow-lg shadow-blue-500/20">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Sauvegarder
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ExamRelaunchModal({ exam, onClose }: { exam: typeof allExamsData[0]; onClose: () => void }) {
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleLaunch = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false); setSuccess(true);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg">
        <div className="absolute -inset-px bg-gradient-to-br from-blue-500/20 via-transparent to-cyan-500/15 rounded-2xl blur-sm" />
        <div className="relative bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
          {success ? (
            <div className="p-8 text-center">
              <div className="relative flex justify-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center"><CheckCircle2 className="w-8 h-8 text-green-400" /></div>
                <div className="absolute inset-0 rounded-2xl bg-green-500/10 animate-ping opacity-30" />
              </div>
              <h3 className="text-lg text-white mb-2">Relance planifiée !</h3>
              <p className="text-sm text-slate-400 mb-1">«{exam.title}» est reprogrammé.</p>
              <p className="text-xs text-slate-500 mb-6">Les participants seront notifiés par e-mail automatiquement.</p>
              <button onClick={onClose} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl text-sm text-white transition-all shadow-lg shadow-blue-500/20">Fermer</button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/60">
                <div className="flex items-center gap-2"><RefreshCw className="w-4 h-4 text-blue-400" /><h3 className="text-base text-white">Relancer l'examen</h3></div>
                <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 transition-all"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-4 bg-blue-500/5 border border-blue-500/15 rounded-xl">
                  <p className="text-sm text-slate-200">{exam.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{exam.questions} questions · {exam.points} pts · {exam.duration} min · {exam.students} participants</p>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Nouvelle date et heure *</label>
                  <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Message aux participants (optionnel)</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="ex: Examen reconduit pour les étudiants absents lors de la première session…" rows={3} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all resize-none" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800/60 bg-slate-900/50">
                <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-700/50 text-slate-300 hover:bg-slate-800/50 transition-all text-sm">Annuler</button>
                <button onClick={handleLaunch} disabled={!date || loading} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 rounded-xl text-sm text-white transition-all shadow-lg shadow-blue-500/20">
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  Planifier la relance
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ExamDownloadModal({ exam, onClose }: { exam: typeof allExamsData[0]; onClose: () => void }) {
  const [format, setFormat] = useState<"pdf" | "csv" | "json">("pdf");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const handleDownload = async () => {
    setState("loading");
    await new Promise(r => setTimeout(r, 1200));
    setState("done");
  };
  const formats = [
    { id: "pdf" as const, label: "Rapport PDF", desc: "Résumé complet avec statistiques et graphiques", icon: FileText },
    { id: "csv" as const, label: "Résultats CSV", desc: "Tableau de scores par étudiant, exportable Excel", icon: ArrowUpRight },
    { id: "json" as const, label: "Export JSON", desc: "Données brutes structurées pour intégration externe", icon: Code2 },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-px bg-gradient-to-br from-green-500/20 via-transparent to-blue-500/15 rounded-2xl blur-sm" />
        <div className="relative bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
          {state === "done" ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5"><CheckCircle2 className="w-8 h-8 text-green-400" /></div>
              <h3 className="text-lg text-white mb-2">Prêt à télécharger</h3>
              <p className="text-sm text-slate-400 mb-6">Rapport «{exam.title}» exporté en {format.toUpperCase()}.</p>
              <button onClick={onClose} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl text-sm text-white transition-all">Fermer</button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/60">
                <div className="flex items-center gap-2"><Download className="w-4 h-4 text-green-400" /><h3 className="text-base text-white">Télécharger le rapport</h3></div>
                <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 transition-all"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-3 bg-slate-800/30 border border-slate-800/50 rounded-xl flex items-center gap-3">
                  <FileText className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span className="text-xs text-slate-300">{exam.title} · {exam.students} participants · {exam.date}</span>
                </div>
                <div className="space-y-2">
                  {formats.map((f) => (
                    <button key={f.id} onClick={() => setFormat(f.id)} className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${format === f.id ? "bg-blue-500/10 border-blue-500/30" : "bg-slate-800/30 border-slate-700/40 hover:border-slate-600"}`}>
                      <f.icon className={`w-4 h-4 flex-shrink-0 ${format === f.id ? "text-blue-400" : "text-slate-500"}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${format === f.id ? "text-blue-200" : "text-slate-300"}`}>{f.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
                      </div>
                      <div className={`flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center ${format === f.id ? "bg-blue-500 border-blue-500" : "border-slate-600"}`}>
                        {format === f.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800/60 bg-slate-900/50">
                <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-700/50 text-slate-300 hover:bg-slate-800/50 transition-all text-sm">Annuler</button>
                <button onClick={handleDownload} disabled={state === "loading"} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-70 rounded-xl text-sm text-white transition-all shadow-lg shadow-green-500/20">
                  {state === "loading" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  Télécharger {format.toUpperCase()}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ExamsListView({ onCreateExam }: { onCreateExam: () => void }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "scheduled" | "ongoing" | "completed" | "draft">("all");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [exams, setExams] = useState(allExamsData);
  const [previewExam, setPreviewExam] = useState<typeof allExamsData[0] | null>(null);
  const [editExam, setEditExam] = useState<typeof allExamsData[0] | null>(null);
  const [relaunchExam, setRelaunchExam] = useState<typeof allExamsData[0] | null>(null);
  const [downloadExam, setDownloadExam] = useState<typeof allExamsData[0] | null>(null);

  const filtered = exams.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const deleteExam = (id: number) => { setExams((prev) => prev.filter((e) => e.id !== id)); setConfirmDelete(null); };

  const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
    scheduled: { label: "Planifié", color: "text-green-400 bg-green-500/10 border-green-500/20", dot: "bg-green-400" },
    ongoing: { label: "En cours", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", dot: "bg-blue-400 animate-pulse" },
    completed: { label: "Terminé", color: "text-slate-400 bg-slate-700/20 border-slate-700/30", dot: "bg-slate-400" },
    draft: { label: "Brouillon", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", dot: "bg-amber-400" },
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un examen…" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all" />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["all", "ongoing", "scheduled", "completed", "draft"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-xl text-xs transition-all border ${statusFilter === s ? "bg-blue-500/20 border-blue-500/30 text-blue-300" : "bg-slate-800/40 border-slate-700/30 text-slate-400 hover:text-slate-200"}`}>
              {s === "all" ? "Tous" : statusConfig[s]?.label ?? s}
            </button>
          ))}
        </div>
        <button onClick={onCreateExam} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl text-sm text-white transition-all shadow-lg shadow-blue-500/20 flex-shrink-0">
          <Plus className="w-4 h-4" />Nouvel examen
        </button>
      </div>
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/60">
                <th className="text-left px-5 py-3.5 text-xs text-slate-500">Examen</th>
                <th className="text-left px-4 py-3.5 text-xs text-slate-500 hidden md:table-cell">Types</th>
                <th className="text-left px-4 py-3.5 text-xs text-slate-500 hidden lg:table-cell">Date</th>
                <th className="text-left px-4 py-3.5 text-xs text-slate-500 hidden lg:table-cell">Étudiants</th>
                <th className="text-left px-4 py-3.5 text-xs text-slate-500">Statut</th>
                <th className="text-right px-5 py-3.5 text-xs text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center"><Search className="w-10 h-10 text-slate-700 mx-auto mb-3" /><p className="text-slate-500 text-sm">Aucun examen trouvé</p></td></tr>
              ) : filtered.map((exam) => {
                const sc = statusConfig[exam.status];
                return (
                  <tr key={exam.id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-5 py-4"><div><p className="text-slate-200 group-hover:text-white transition-colors">{exam.title}</p><p className="text-xs text-slate-500 mt-0.5">{exam.subject} · {exam.questions}Q · {exam.points}pts</p></div></td>
                    <td className="px-4 py-4 hidden md:table-cell"><div className="flex items-center gap-1 flex-wrap">{exam.types.map((t) => (<span key={t} className={`text-xs px-1.5 py-0.5 rounded border ${TYPE_COLORS[t as keyof typeof TYPE_COLORS]}`}>{TYPE_LABELS[t as keyof typeof TYPE_LABELS]}</span>))}</div></td>
                    <td className="px-4 py-4 hidden lg:table-cell"><p className="text-xs text-slate-300">{exam.date}</p><p className="text-xs text-slate-500">{exam.time} · {exam.duration}min</p></td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      {exam.status === "ongoing" ? (<div><p className="text-xs text-blue-400">{(exam as any).activeStudents} actifs</p><p className="text-xs text-slate-500">{exam.students} inscrits</p></div>)
                      : exam.status === "completed" ? (<div><p className="text-xs text-slate-300">{exam.submitted}/{exam.students}</p><p className="text-xs text-slate-500">Moy. {(exam as any).avgScore}%</p></div>)
                      : (<p className="text-xs text-slate-500">{exam.students} inscrits</p>)}
                    </td>
                    <td className="px-4 py-4"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${sc.color}`}><div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {confirmDelete === exam.id ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-400">Supprimer?</span>
                            <button onClick={() => deleteExam(exam.id)} className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-xs hover:bg-red-500/30 transition-all">Oui</button>
                            <button onClick={() => setConfirmDelete(null)} className="px-2.5 py-1 rounded-lg bg-slate-700/40 text-slate-400 text-xs hover:bg-slate-700/60 transition-all">Non</button>
                          </div>
                        ) : (
                          <>
                            <button onClick={() => setEditExam(exam)} className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all" title="Modifier"><Edit3 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setPreviewExam(exam)} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-700/40 transition-all" title="Aperçu"><Eye className="w-3.5 h-3.5" /></button>
                            {exam.status === "completed" && <>
                              <button onClick={() => setDownloadExam(exam)} className="p-1.5 rounded-lg text-slate-500 hover:text-green-400 hover:bg-green-500/10 transition-all" title="Exporter rapport"><Download className="w-3.5 h-3.5" /></button>
                              <button onClick={() => setRelaunchExam(exam)} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-all" title="Relancer">
                                <RefreshCw className="w-3 h-3" />Relancer
                              </button>
                            </>}
                            {exam.status !== "ongoing" && <button onClick={() => setConfirmDelete(exam.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Supprimer"><Trash2 className="w-3.5 h-3.5" /></button>}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-800/40 flex items-center justify-between text-xs text-slate-500">
          <span>{filtered.length} examen{filtered.length > 1 ? "s" : ""}</span>
          <button className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors"><Download className="w-3.5 h-3.5" />Exporter CSV</button>
        </div>
      </div>
      {previewExam && <ExamPreviewModal exam={previewExam} onClose={() => setPreviewExam(null)} onEdit={() => { setEditExam(previewExam); setPreviewExam(null); }} />}
      {editExam && <ExamEditModal exam={editExam} onClose={() => setEditExam(null)} onSave={() => setEditExam(null)} />}
      {relaunchExam && <ExamRelaunchModal exam={relaunchExam} onClose={() => setRelaunchExam(null)} />}
      {downloadExam && <ExamDownloadModal exam={downloadExam} onClose={() => setDownloadExam(null)} />}
    </div>
  );
}

// ─── Fraud Alerts View ────────────────────────────────────────────────────────
const allFraudData = [
  { id: 1, student: "Marie Dubois", initials: "MD", examTitle: "Réseaux & Sécurité", type: "Changement d'onglet multiple", detail: "3 changements en 5 minutes", time: "10:05", date: "31 Mar 2026", severity: "high", status: "open" },
  { id: 2, student: "Thomas Martin", initials: "TM", examTitle: "Algorithmique Avancée", type: "Mouvement suspect", detail: "Présence d'une autre personne détectée", time: "10:11", date: "31 Mar 2026", severity: "high", status: "open" },
  { id: 3, student: "Sophie Bernard", initials: "SB", examTitle: "Réseaux & Sécurité", type: "Comportement suspect", detail: "Absence prolongée du poste détectée", time: "10:08", date: "31 Mar 2026", severity: "high", status: "open" },
  { id: 4, student: "Lucas Petit", initials: "LP", examTitle: "Architecture Java EE", type: "Copier-coller bloqué", detail: "Ctrl+V intercepté 2 fois", time: "10:15", date: "31 Mar 2026", severity: "medium", status: "reviewed" },
  { id: 5, student: "Emma Rousseau", initials: "ER", examTitle: "Base de données", type: "Perte de connexion", detail: "Déconnexion 30 secondes", time: "09:47", date: "30 Mar 2026", severity: "low", status: "dismissed" },
  { id: 6, student: "Nicolas Durand", initials: "ND", examTitle: "Sécurité Informatique", type: "Changement de réseau", detail: "Changement d'IP détecté", time: "14:22", date: "30 Mar 2026", severity: "medium", status: "reviewed" },
];

function FraudAlertsView() {
  const [alerts, setAlerts] = useState(allFraudData);
  const [severityFilter, setSeverityFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [statusFilter2, setStatusFilter2] = useState<"all" | "open" | "reviewed" | "dismissed">("all");

  const filtered = alerts.filter((a) => (severityFilter === "all" || a.severity === severityFilter) && (statusFilter2 === "all" || a.status === statusFilter2));
  const updateStatus = (id: number, status: string) => setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
  const openCount = alerts.filter((a) => a.status === "open").length;

  const severityConfig = {
    high: { color: "text-red-400 bg-red-500/10 border-red-500/20", bar: "border-l-red-500/60", label: "Critique" },
    medium: { color: "text-amber-400 bg-amber-500/10 border-amber-500/20", bar: "border-l-amber-500/50", label: "Moyen" },
    low: { color: "text-slate-400 bg-slate-700/20 border-slate-700/30", bar: "border-l-slate-600/40", label: "Faible" },
  };
  const statusConfig2 = { open: { color: "text-red-400", label: "Ouvert" }, reviewed: { color: "text-blue-400", label: "Traité" }, dismissed: { color: "text-slate-500", label: "Ignoré" } };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Alertes ouvertes", value: alerts.filter((a) => a.status === "open").length, color: "text-red-400 bg-red-500/10 border-red-500/20", icon: AlertTriangle },
          { label: "Traitées", value: alerts.filter((a) => a.status === "reviewed").length, color: "text-blue-400 bg-blue-500/10 border-blue-500/20", icon: CheckCircle2 },
          { label: "Ignorées", value: alerts.filter((a) => a.status === "dismissed").length, color: "text-slate-400 bg-slate-700/20 border-slate-700/30", icon: X },
        ].map((s) => (
          <div key={s.label} className={`p-4 rounded-2xl border flex items-center gap-3 ${s.color}`}>
            <s.icon className="w-5 h-5 flex-shrink-0" /><div><p className="text-xl text-white">{s.value}</p><p className="text-xs opacity-70">{s.label}</p></div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-500">Sévérité :</span>
        {(["all", "high", "medium", "low"] as const).map((s) => (<button key={s} onClick={() => setSeverityFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${severityFilter === s ? "bg-blue-500/20 border-blue-500/30 text-blue-300" : "bg-slate-800/40 border-slate-700/30 text-slate-400 hover:text-slate-200"}`}>{s === "all" ? "Toutes" : severityConfig[s].label}</button>))}
        <div className="w-px h-4 bg-slate-700/60 mx-1" />
        <span className="text-xs text-slate-500">Statut :</span>
        {(["all", "open", "reviewed", "dismissed"] as const).map((s) => (<button key={s} onClick={() => setStatusFilter2(s)} className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${statusFilter2 === s ? "bg-blue-500/20 border-blue-500/30 text-blue-300" : "bg-slate-800/40 border-slate-700/30 text-slate-400 hover:text-slate-200"}`}>{s === "all" ? "Tous" : statusConfig2[s].label}</button>))}
        <button onClick={() => alerts.filter((a) => a.status === "open").forEach((a) => updateStatus(a.id, "reviewed"))} disabled={openCount === 0} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-slate-800/50 border border-slate-700/40 text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all disabled:opacity-40">
          <CheckSquare className="w-3.5 h-3.5" />Tout traiter
        </button>
      </div>
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-slate-900/40 border border-slate-800/50 rounded-2xl">
            <Shield className="w-12 h-12 text-green-500/30 mb-3" /><p className="text-green-400 text-sm mb-1">Aucune alerte dans cette catégorie</p>
          </div>
        ) : filtered.map((alert) => {
          const sc = severityConfig[alert.severity as keyof typeof severityConfig];
          const st = statusConfig2[alert.status as keyof typeof statusConfig2];
          return (
            <div key={alert.id} className={`bg-slate-900/60 border border-l-2 border-slate-800/60 rounded-2xl px-5 py-4 ${sc.bar} ${alert.status === "dismissed" ? "opacity-50" : ""} transition-all`}>
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs border ${sc.color}`}>{alert.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm text-slate-200">{alert.student}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${sc.color}`}>{sc.label}</span>
                    <span className={`text-xs ${st.color}`}>{st.label}</span>
                  </div>
                  <p className="text-sm text-slate-400">{alert.type}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{alert.detail}</p>
                  <p className="text-xs text-slate-600 mt-1">{alert.examTitle} · {alert.date} à {alert.time}</p>
                </div>
                {alert.status === "open" && (
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <button onClick={() => updateStatus(alert.id, "reviewed")} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-blue-500/15 text-blue-400 border border-blue-500/25 hover:bg-blue-500/25 transition-all"><Check className="w-3 h-3" />Traiter</button>
                    <button onClick={() => updateStatus(alert.id, "dismissed")} className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-slate-700/40 transition-all"><X className="w-3.5 h-3.5" /></button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Statistics View ──────────────────────────────────────────────────────────
function StatisticsView() {
  const scoreData = [
    { exam: "Réseaux", avg: 74, high: 96, low: 42 },
    { exam: "Algo", avg: 68, high: 94, low: 38 },
    { exam: "BDD", avg: 81, high: 98, low: 55 },
    { exam: "SE", avg: 77, high: 91, low: 50 },
    { exam: "Java EE", avg: 74, high: 96, low: 45 },
  ];
  const typeData = [
    { type: "QCM", count: 38, pct: 47, color: "bg-blue-500" },
    { type: "Texte", count: 24, pct: 30, color: "bg-purple-500" },
    { type: "Code", count: 19, pct: 23, color: "bg-cyan-500" },
  ];
  const weeklyActivity = [
    { day: "Lun", students: 75 }, { day: "Mar", students: 142 }, { day: "Mer", students: 52 },
    { day: "Jeu", students: 193 }, { day: "Ven", students: 88 }, { day: "Sam", students: 0 }, { day: "Dim", students: 43 },
  ];
  const maxStudents = Math.max(...weeklyActivity.map((w) => w.students));
  const fraudStats = [
    { type: "Changement d'onglet", count: 34, pct: 42 },
    { type: "Perte de connexion / inactivité", count: 21, pct: 26 },
    { type: "Copier-coller", count: 15, pct: 19 },
    { type: "Perte de connexion", count: 11, pct: 13 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Score moyen global", value: "75%", sub: "+3% ce mois", color: "text-cyan-400", icon: TrendingUp },
          { label: "Taux de réussite", value: "87%", sub: "≥ 50/100", color: "text-green-400", icon: CheckCircle2 },
          { label: "Taux de fraude", value: "3.2%", sub: "-0.5% ce mois", color: "text-red-400", icon: AlertTriangle },
          { label: "Examens ce mois", value: "18", sub: "+5 planifiés", color: "text-blue-400", icon: FileText },
        ].map((s) => (
          <div key={s.label} className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className={`text-2xl ${s.color} mb-0.5`}>{s.value}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
            <p className="text-xs text-slate-600 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5">
          <h3 className="text-sm text-slate-200 mb-5 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-400" />Activité hebdomadaire</h3>
          <div className="flex items-end gap-2 h-32">
            {weeklyActivity.map((w) => (
              <div key={w.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center justify-end h-24">
                  <div className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-cyan-500 transition-all" style={{ height: `${maxStudents > 0 ? (w.students / maxStudents) * 100 : 0}%`, minHeight: w.students > 0 ? "4px" : "0" }} />
                </div>
                <span className="text-xs text-slate-500">{w.day}</span>
                <span className="text-xs text-slate-600">{w.students}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5">
          <h3 className="text-sm text-slate-200 mb-5 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-cyan-400" />Scores par examen</h3>
          <div className="space-y-3.5">
            {scoreData.map((d) => (
              <div key={d.exam} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-14 flex-shrink-0">{d.exam}</span>
                <div className="flex-1 h-5 bg-slate-800/60 rounded-full relative overflow-hidden">
                  <div className="absolute top-0 h-full bg-blue-500/15 rounded-full" style={{ left: `${d.low}%`, width: `${d.high - d.low}%` }} />
                  <div className="absolute top-0 h-full w-1 bg-cyan-400 rounded-full" style={{ left: `${d.avg - 0.5}%` }} />
                </div>
                <div className="flex items-center gap-2 text-xs flex-shrink-0">
                  <span className="text-cyan-400">{d.avg}%</span>
                  <span className="text-slate-600">{d.low}-{d.high}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5">
          <h3 className="text-sm text-slate-200 mb-5 flex items-center gap-2"><PieChart className="w-4 h-4 text-purple-400" />Répartition des types de questions</h3>
          <div className="space-y-4">
            {typeData.map((t) => (
              <div key={t.type} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${t.color}`} />
                <span className="text-xs text-slate-400 w-16 flex-shrink-0">{t.type}</span>
                <div className="flex-1 h-2 bg-slate-800/60 rounded-full overflow-hidden"><div className={`h-full rounded-full ${t.color}`} style={{ width: `${t.pct}%` }} /></div>
                <span className="text-xs text-slate-300 w-10 text-right flex-shrink-0">{t.count}q</span>
                <span className="text-xs text-slate-500 w-8 text-right flex-shrink-0">{t.pct}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5">
          <h3 className="text-sm text-slate-200 mb-5 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-400" />Types de fraude détectés</h3>
          <div className="space-y-4">
            {fraudStats.map((f) => (
              <div key={f.type} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 flex-1 min-w-0 truncate">{f.type}</span>
                <div className="w-32 h-2 bg-slate-800/60 rounded-full overflow-hidden flex-shrink-0"><div className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-500" style={{ width: `${f.pct}%` }} /></div>
                <span className="text-xs text-red-400 w-6 text-right flex-shrink-0">{f.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
            <p className="text-xs text-slate-500"><span className="text-red-400">81 incidents</span> détectés ce mois · Taux global : <span className="text-white">3.2%</span> des sessions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Students View ────────────────────────────────────────────────────────────
const studentsData = [
  { id: 1, name: "Marie Dubois", email: "m.dubois@univ.fr", group: "Master 1 GL", exams: 5, avgScore: 78, flags: 2, status: "active" },
  { id: 2, name: "Thomas Martin", email: "t.martin@univ.fr", group: "Master 2 IA", exams: 4, avgScore: 85, flags: 1, status: "active" },
  { id: 3, name: "Sophie Bernard", email: "s.bernard@univ.fr", group: "Master 1 GL", exams: 5, avgScore: 91, flags: 0, status: "active" },
  { id: 4, name: "Lucas Petit", email: "l.petit@univ.fr", group: "Licence 3", exams: 3, avgScore: 67, flags: 1, status: "active" },
  { id: 5, name: "Emma Rousseau", email: "e.rousseau@univ.fr", group: "Master 2 SI", exams: 6, avgScore: 88, flags: 0, status: "active" },
  { id: 6, name: "Nicolas Durand", email: "n.durand@univ.fr", group: "Master 1 GL", exams: 4, avgScore: 72, flags: 3, status: "suspended" },
];

function StudentsView() {
  const [search, setSearch] = useState("");
  const filtered = studentsData.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un étudiant…" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" />
        </div>
        <span className="text-xs text-slate-500">{filtered.length} étudiant{filtered.length > 1 ? "s" : ""}</span>
      </div>
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800/60">
              <th className="text-left px-5 py-3.5 text-xs text-slate-500">Étudiant</th>
              <th className="text-left px-4 py-3.5 text-xs text-slate-500 hidden md:table-cell">Groupe</th>
              <th className="text-left px-4 py-3.5 text-xs text-slate-500 hidden lg:table-cell">Examens</th>
              <th className="text-left px-4 py-3.5 text-xs text-slate-500 hidden lg:table-cell">Moy.</th>
              <th className="text-left px-4 py-3.5 text-xs text-slate-500">Alertes</th>
              <th className="text-right px-5 py-3.5 text-xs text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-800/20 transition-colors group">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${s.status === "suspended" ? "bg-red-500/20 text-red-300" : "bg-blue-500/20 text-blue-300"}`}>{s.name.split(" ").map((n) => n[0]).join("")}</div>
                    <div><p className="text-slate-200">{s.name}</p><p className="text-xs text-slate-500">{s.email}</p></div>
                  </div>
                </td>
                <td className="px-4 py-4 hidden md:table-cell"><span className="text-xs text-slate-400">{s.group}</span></td>
                <td className="px-4 py-4 hidden lg:table-cell"><span className="text-xs text-slate-400">{s.exams}</span></td>
                <td className="px-4 py-4 hidden lg:table-cell"><span className={`text-xs ${s.avgScore >= 80 ? "text-green-400" : s.avgScore >= 60 ? "text-blue-400" : "text-amber-400"}`}>{s.avgScore}%</span></td>
                <td className="px-4 py-4">
                  {s.flags > 0 ? <span className={`flex items-center gap-1 text-xs ${s.flags >= 3 ? "text-red-400" : "text-amber-400"}`}><AlertTriangle className="w-3.5 h-3.5" />{s.flags}</span>
                  : <span className="text-xs text-green-400 flex items-center gap-1"><Check className="w-3.5 h-3.5" />Aucune</span>}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <button className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all" title="Voir profil"><Eye className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-700/40 transition-all" title="Exporter"><Download className="w-3.5 h-3.5" /></button>
                    {s.status !== "suspended"
                      ? <button className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Suspendre"><Ban className="w-3.5 h-3.5" /></button>
                      : <span className="flex items-center gap-1 text-xs text-red-400 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20"><Ban className="w-3 h-3" />Suspendu</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Groups & student import panel ───────────────────────────────────────────
const groupsData = [
  { id: "g1", name: "Master 1 GL", count: 28 },
  { id: "g2", name: "Master 2 IA", count: 22 },
  { id: "g3", name: "Master 2 SI", count: 18 },
  { id: "g4", name: "Licence 3 Info", count: 32 },
];

function StudentManagementPanel() {
  const [tab, setTab] = useState<"groups" | "manual" | "import">("groups");
  const [selectedGroups, setSelectedGroups] = useState<string[]>(["g1"]);
  const [manualEmail, setManualEmail] = useState("");
  const [addedStudents, setAddedStudents] = useState<string[]>([]);
  const [importState, setImportState] = useState<"idle" | "loading" | "done">("idle");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleGroup = (id: string) => setSelectedGroups((prev) => prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]);
  const addManual = () => {
    if (manualEmail.trim() && !addedStudents.includes(manualEmail.trim())) {
      setAddedStudents((prev) => [...prev, manualEmail.trim()]);
      setManualEmail("");
    }
  };
  const simulateImport = () => {
    setImportState("loading");
    setTimeout(() => setImportState("done"), 1500);
  };
  const totalSelected = selectedGroups.reduce((sum, id) => sum + (groupsData.find((g) => g.id === id)?.count ?? 0), 0) + addedStudents.length;

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm text-slate-200">Sélection des participants</h3>
        </div>
        {totalSelected > 0 && (
          <span className="px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-300 text-xs">
            {totalSelected} étudiant{totalSelected > 1 ? "s" : ""} sélectionné{totalSelected > 1 ? "s" : ""}
          </span>
        )}
      </div>
      <div className="flex border-b border-slate-800/50">
        {([
          { id: "groups", label: "Groupes", icon: Users },
          { id: "manual", label: "Manuel", icon: UserPlus },
          { id: "import", label: "Importer", icon: Upload },
        ] as const).map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-5 py-3 text-xs transition-all border-b-2 ${tab === t.id ? "border-blue-500 text-blue-300" : "border-transparent text-slate-500 hover:text-slate-300"}`}>
            <t.icon className="w-3.5 h-3.5" />{t.label}
          </button>
        ))}
      </div>
      <div className="p-6">
        {tab === "groups" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 mb-3">Sélectionnez un ou plusieurs groupes. Ajoutez des étudiants individuels dans l'onglet «\u202fManuel\u202f».</p>
            <div className="grid grid-cols-2 gap-3">
              {groupsData.map((g) => {
                const sel = selectedGroups.includes(g.id);
                return (
                  <button key={g.id} onClick={() => toggleGroup(g.id)} className={`flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all text-left ${sel ? "bg-blue-500/10 border-blue-500/30" : "bg-slate-800/30 border-slate-700/40 hover:border-slate-600/50"}`}>
                    <div>
                      <p className={`text-sm ${sel ? "text-blue-200" : "text-slate-300"}`}>{g.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{g.count} étudiants</p>
                    </div>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border transition-all ${sel ? "bg-blue-500 border-blue-500" : "border-slate-600"}`}>
                      {sel && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
            {selectedGroups.length > 0 && (
              <div className="flex items-center gap-2 p-3 bg-blue-500/5 border border-blue-500/15 rounded-xl text-xs text-blue-400">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                {selectedGroups.map((id) => groupsData.find((g) => g.id === id)?.name).join(", ")} — {totalSelected - addedStudents.length} étudiants inclus
              </div>
            )}
          </div>
        )}
        {tab === "manual" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">Ajoutez des étudiants individuels par e-mail.</p>
            <div className="flex gap-2">
              <input value={manualEmail} onChange={(e) => setManualEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addManual()} placeholder="etudiant@universite.fr" className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all" />
              <button onClick={addManual} className="px-4 py-2.5 bg-blue-600/80 hover:bg-blue-600 rounded-xl text-sm text-white transition-all flex items-center gap-2"><UserPlus className="w-4 h-4" />Ajouter</button>
            </div>
            {addedStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 bg-slate-800/20 border border-dashed border-slate-700/40 rounded-xl">
                <UserPlus className="w-8 h-8 text-slate-600 mb-2" /><p className="text-xs text-slate-500">Aucun étudiant ajouté manuellement</p>
              </div>
            ) : (
              <div className="space-y-2">
                {addedStudents.map((email) => (
                  <div key={email} className="flex items-center justify-between px-4 py-2.5 bg-slate-800/30 border border-slate-700/30 rounded-xl">
                    <span className="text-xs text-slate-300">{email}</span>
                    <button onClick={() => setAddedStudents((p) => p.filter((e) => e !== email))} className="p-1 hover:bg-slate-700/60 rounded-lg transition-colors"><X className="w-3.5 h-3.5 text-slate-500" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {tab === "import" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">Importez une liste d'étudiants depuis un fichier Excel ou JSON.</p>
            {importState === "done" ? (
              <div className="flex flex-col items-center justify-center py-10 bg-green-500/5 border border-green-500/15 rounded-xl">
                <CheckCircle2 className="w-10 h-10 text-green-400 mb-3" />
                <p className="text-sm text-green-400">24 étudiants importés avec succès</p>
                <button onClick={() => setImportState("idle")} className="mt-3 text-xs text-slate-400 hover:text-slate-200 transition-colors">Importer un autre fichier</button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); simulateImport(); }}
                onClick={() => fileRef.current?.click()}
                className={`flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl cursor-pointer transition-all ${dragOver ? "border-blue-500/60 bg-blue-500/5" : "border-slate-700/50 hover:border-slate-600/60 hover:bg-slate-800/20"}`}
              >
                <input ref={fileRef} type="file" accept=".xlsx,.json" className="hidden" onChange={simulateImport} />
                {importState === "loading" ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-400 rounded-full animate-spin" />
                    <p className="text-xs text-slate-400">Importation en cours…</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-slate-600 mb-3" />
                    <p className="text-sm text-slate-300 mb-1">Glissez votre fichier ici</p>
                    <p className="text-xs text-slate-500">ou cliquez pour sélectionner</p>
                    <div className="flex items-center gap-2 mt-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/40 text-xs text-slate-400">.xlsx</span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/40 text-xs text-slate-400">.json</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Admin Settings View ──────────────────────────────────────────────────────
function AdminSettingsView() {
  const [tab, setTab] = useState<"profile" | "password" | "notifications" | "exam-prefs" | "security">("profile");
  const [profile, setProfile] = useState({ name: "Admin Durand", email: "admin@examguard.io", institution: "Université Paris-Saclay", role: "Administrateur principal", phone: "+33 6 12 34 56 78" });
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwSaveState, setPwSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [defaultDuration, setDefaultDuration] = useState(90);
  const [defaultWarnings, setDefaultWarnings] = useState(3);

  const handleSaveProfile = async () => {
    setSaveState("saving");
    await new Promise(r => setTimeout(r, 800));
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 2000);
  };
  const handleSavePw = async () => {
    if (!pwForm.current || !pwForm.newPw || pwForm.newPw !== pwForm.confirm) {
      setPwSaveState("error"); setTimeout(() => setPwSaveState("idle"), 2000); return;
    }
    setPwSaveState("saving");
    await new Promise(r => setTimeout(r, 900));
    setPwSaveState("saved");
    setPwForm({ current: "", newPw: "", confirm: "" });
    setTimeout(() => setPwSaveState("idle"), 2000);
  };

  const settingsTabs = [
    { id: "profile", label: "Profil", icon: Users },
    { id: "password", label: "Mot de passe", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "exam-prefs", label: "Préférences", icon: Settings },
    { id: "security", label: "Sécurité", icon: Shield },
  ];
  const notifItems = [
    { label: "Démarrage d'examen", desc: "Alerte quand un examen est lancé", def: true },
    { label: "Soumissions reçues", desc: "Notification par soumission d'étudiant", def: false },
    { label: "Alertes fraude critiques", desc: "Notification immédiate pour incidents graves", def: true },
    { label: "Toutes les alertes fraude", desc: "Incluant les incidents de faible sévérité", def: false },
    { label: "Rapport hebdomadaire", desc: "Résumé d'activité chaque lundi matin", def: true },
    { label: "Mises à jour système", desc: "Nouvelles fonctionnalités et maintenances", def: true },
  ];
  const sessions = [
    { device: "Chrome · Windows 11", location: "Paris, FR", time: "Maintenant", current: true },
    { device: "Safari · iPhone 15", location: "Paris, FR", time: "Il y a 2h", current: false },
    { device: "Firefox · macOS", location: "Lyon, FR", time: "Il y a 3j", current: false },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-1 p-1 bg-slate-800/40 border border-slate-700/40 rounded-2xl flex-wrap">
        {settingsTabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${tab === t.id ? "bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"}`}>
            <t.icon className="w-3.5 h-3.5 flex-shrink-0" /><span className="hidden md:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl overflow-hidden">
          <div className="px-7 py-5 border-b border-slate-800/50 flex items-center gap-2"><Users className="w-4 h-4 text-blue-400" /><h3 className="text-base text-slate-100">Informations du profil</h3></div>
          <div className="p-7 space-y-5">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xl text-white select-none">AD</div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center hover:bg-slate-600 transition-colors"><Edit3 className="w-3 h-3 text-slate-300" /></button>
              </div>
              <div>
                <p className="text-sm text-slate-200">{profile.name}</p>
                <p className="text-xs text-slate-500">{profile.role} · {profile.institution}</p>
                <button className="mt-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">Changer la photo</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Nom complet", key: "name", type: "text" },
                { label: "Adresse e-mail", key: "email", type: "email" },
                { label: "Établissement", key: "institution", type: "text" },
                { label: "Téléphone", key: "phone", type: "tel" },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs text-slate-400 mb-2">{field.label}</label>
                  <input type={field.type} value={profile[field.key as keyof typeof profile]} onChange={e => setProfile({...profile, [field.key]: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all" />
                </div>
              ))}
              <div>
                <label className="block text-xs text-slate-400 mb-2">Rôle</label>
                <select value={profile.role} onChange={e => setProfile({...profile, role: e.target.value})} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all">
                  <option>Administrateur principal</option><option>Professeur</option><option>Chargé de cours</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={handleSaveProfile} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all ${saveState === "saved" ? "bg-green-500/20 border border-green-500/30 text-green-400" : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/20"}`}>
                {saveState === "saving" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : saveState === "saved" ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saveState === "saved" ? "Enregistré !" : "Sauvegarder"}
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "password" && (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl overflow-hidden">
          <div className="px-7 py-5 border-b border-slate-800/50 flex items-center gap-2"><Lock className="w-4 h-4 text-blue-400" /><h3 className="text-base text-slate-100">Changer le mot de passe</h3></div>
          <div className="p-7 space-y-4 max-w-md">
            {[
              { label: "Mot de passe actuel", key: "current" },
              { label: "Nouveau mot de passe", key: "newPw" },
              { label: "Confirmer le nouveau mot de passe", key: "confirm" },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs text-slate-400 mb-2">{field.label}</label>
                <div className="relative">
                  <input type="password" value={pwForm[field.key as keyof typeof pwForm]} onChange={e => setPwForm({...pwForm, [field.key]: e.target.value})} placeholder="••••••••" className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${pwSaveState === "error" ? "border-red-500/50 focus:ring-red-500/30" : "border-slate-700/50 focus:ring-blue-500/30 focus:border-blue-500/50"}`} />
                  <Eye className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                </div>
              </div>
            ))}
            {pwSaveState === "error" && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">Vérifiez que les mots de passe correspondent et que tous les champs sont remplis.</div>}
            <div className="flex justify-end pt-2">
              <button onClick={handleSavePw} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all ${pwSaveState === "saved" ? "bg-green-500/20 border border-green-500/30 text-green-400" : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/20"}`}>
                {pwSaveState === "saving" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : pwSaveState === "saved" ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                {pwSaveState === "saved" ? "Mis à jour !" : "Mettre à jour"}
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "notifications" && (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl overflow-hidden">
          <div className="px-7 py-5 border-b border-slate-800/50 flex items-center gap-2"><Bell className="w-4 h-4 text-blue-400" /><h3 className="text-base text-slate-100">Préférences de notifications</h3></div>
          <div className="p-7 space-y-3">
            {notifItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between p-4 bg-slate-800/25 hover:bg-slate-800/40 border border-slate-800/50 rounded-xl transition-all">
                <div className="min-w-0"><p className="text-sm text-slate-200">{item.label}</p><p className="text-xs text-slate-500 mt-0.5">{item.desc}</p></div>
                <ToggleSwitch defaultChecked={item.def} />
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "exam-prefs" && (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl overflow-hidden">
          <div className="px-7 py-5 border-b border-slate-800/50 flex items-center gap-2"><Settings className="w-4 h-4 text-blue-400" /><h3 className="text-base text-slate-100">Préférences d'examen par défaut</h3></div>
          <div className="p-7 space-y-6">
            <div>
              <p className="text-sm text-slate-200 mb-1">Durée par défaut</p>
              <p className="text-xs text-slate-500 mb-3">Durée pré-remplie lors de la création d'un nouvel examen</p>
              <div className="flex items-center gap-2 flex-wrap">
                {[30, 60, 90, 120, 180].map(d => (
                  <button key={d} onClick={() => setDefaultDuration(d)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${defaultDuration === d ? "bg-blue-500/20 border-blue-500/30 text-blue-300" : "bg-slate-800/40 border-slate-700/30 text-slate-400 hover:text-slate-200"}`}>{d} min</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-200 mb-1">Avertissements par défaut</p>
              <p className="text-xs text-slate-500 mb-3">Nombre maximum d'avertissements autorisés avant sanction</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setDefaultWarnings(p => Math.max(1, p - 1))} className="w-7 h-7 rounded-lg bg-slate-700/60 border border-slate-600/50 text-slate-300 hover:bg-slate-600/60 flex items-center justify-center transition-all">−</button>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => setDefaultWarnings(n)} className={`w-10 py-2 rounded-lg text-sm transition-all border ${defaultWarnings === n ? "bg-red-500/20 border-red-500/30 text-red-300" : "bg-slate-800/40 border-slate-700/30 text-slate-500 hover:text-slate-300"}`}>{n}</button>
                  ))}
                </div>
                <button onClick={() => setDefaultWarnings(p => Math.min(5, p + 1))} className="w-7 h-7 rounded-lg bg-slate-700/60 border border-slate-600/50 text-slate-300 hover:bg-slate-600/60 flex items-center justify-center transition-all">+</button>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Plein écran obligatoire", desc: "Activé par défaut pour les nouveaux examens", def: true },
                { label: "Bloquer copier-coller", desc: "Désactive Ctrl+C/V par défaut", def: true },
                { label: "Soumission automatique à l'expiration", desc: "Soumettre automatiquement quand le temps expire", def: false },
                { label: "Afficher le nombre d'avertissements restants", desc: "Informer l'étudiant en temps réel", def: true },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-4 bg-slate-800/25 border border-slate-800/50 rounded-xl">
                  <div><p className="text-sm text-slate-200">{item.label}</p><p className="text-xs text-slate-500 mt-0.5">{item.desc}</p></div>
                  <ToggleSwitch defaultChecked={item.def} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "security" && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl overflow-hidden">
            <div className="px-7 py-5 border-b border-slate-800/50 flex items-center gap-2"><Shield className="w-4 h-4 text-blue-400" /><h3 className="text-base text-slate-100">Paramètres de sécurité</h3></div>
            <div className="p-7 space-y-5">
              <div className="flex items-center justify-between p-4 bg-slate-800/25 border border-slate-800/50 rounded-xl">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm text-slate-200">Authentification à deux facteurs (2FA)</p>
                    <span className="text-xs px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400">Recommandé</span>
                  </div>
                  <p className="text-xs text-slate-500">Protège votre compte avec un code temporaire</p>
                </div>
                <ToggleSwitch defaultChecked={false} />
              </div>
              <div>
                <h4 className="text-sm text-slate-300 mb-3 flex items-center gap-2"><Activity className="w-3.5 h-3.5 text-slate-500" />Sessions actives</h4>
                <div className="space-y-2">
                  {sessions.map((s, i) => (
                    <div key={i} className={`flex items-center justify-between p-3.5 rounded-xl border ${s.current ? "bg-blue-500/5 border-blue-500/15" : "bg-slate-800/25 border-slate-800/50"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.current ? "bg-green-400" : "bg-slate-600"}`} />
                        <div><p className="text-xs text-slate-200">{s.device}</p><p className="text-xs text-slate-500">{s.location} · {s.time}</p></div>
                      </div>
                      {s.current ? <span className="text-xs text-green-400 px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/20">Session actuelle</span>
                        : <button className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors">Déconnecter</button>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-slate-800/25 border border-slate-800/50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-slate-200">Historique de connexion</p>
                  <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Voir tout</button>
                </div>
                <div className="space-y-2">
                  {[
                    { action: "Connexion réussie", device: "Chrome · Windows", time: "Aujourd'hui 09:42", ok: true },
                    { action: "Tentative échouée", device: "Inconnu · iOS", time: "Hier 23:15", ok: false },
                    { action: "Connexion réussie", device: "Safari · iPhone", time: "Hier 14:30", ok: true },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${log.ok ? "bg-green-400" : "bg-red-400"}`} />
                      <span className="text-slate-400 flex-1">{log.action} · {log.device}</span>
                      <span className="text-slate-600 flex-shrink-0">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Nav items ────────────────────────────────────────────────────────────────
const navItems = [
  { id: "overview", icon: LayoutDashboard, label: "Dashboard" },
  { id: "create", icon: Plus, label: "Créer un examen" },
  { id: "exams", icon: FileText, label: "Mes examens" },
  { id: "alerts", icon: AlertTriangle, label: "Alertes fraude" },
  { id: "stats", icon: BarChart3, label: "Statistiques" },
  { id: "students", icon: Users, label: "Étudiants" },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<number>>(new Set());

  const visibleAlerts = fraudAlerts.filter((a) => !dismissedAlerts.has(a.id));

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white">
      <GridBackground />

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-60 flex-shrink-0 border-r border-slate-800/50 backdrop-blur-xl bg-slate-900/20 flex flex-col">
          <div className="px-5 pt-5 pb-4 border-b border-slate-800/40 flex items-center">
            <Logo size="md" className="max-w-full" />
          </div>
          <nav className="flex-1 p-3 space-y-0.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                    isActive
                      ? "bg-blue-500/15 text-blue-300 border border-blue-500/25 shadow-sm"
                      : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                  }`}
                >
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-blue-400" : ""}`} />
                  <span>{item.label}</span>
                  {item.id === "alerts" && visibleAlerts.length > 0 && (
                    <span className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs flex items-center justify-center">
                      {visibleAlerts.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
          <div className="p-3 border-t border-slate-800/40 space-y-0.5">
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all ${activeTab === "settings" ? "bg-blue-500/15 text-blue-300 border border-blue-500/25" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"}`}
            >
              <Settings className={`w-4 h-4 ${activeTab === "settings" ? "text-blue-400" : ""}`} />
              Paramètres
            </button>
            <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 transition-all">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="border-b border-slate-800/50 backdrop-blur-xl bg-[#0a0e27]/60 sticky top-0 z-40">
            <div className="px-8 h-16 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-base text-slate-100">{activeTab === "settings" ? "Paramètres" : navItems.find((n) => n.id === activeTab)?.label}</h1>
                <p className="text-xs text-slate-500">
                  {activeTab === "settings" ? "Paramètres du compte"
                  : activeTab === "overview" ? "Vue d'ensemble · 31 Mars 2026"
                  : activeTab === "create" ? "Configurez un nouvel examen en quelques étapes"
                  : activeTab === "exams" ? "Gérez et supervisez tous vos examens"
                  : activeTab === "alerts" ? "Incidents de fraude détectés en temps réel"
                  : activeTab === "stats" ? "Analyse des performances et de l'intégrité"
                  : activeTab === "students" ? "Gestion des étudiants inscrits"
                  : activeTab === "settings" ? "Gérez votre profil, sécurité et préférences"
                  : "ExamGuard"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  247 en ligne
                </div>
                <NotificationPanel role="admin" />
                <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800/60">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs">AD</div>
                  <div className="hidden md:block">
                    <p className="text-sm text-slate-200 leading-none">Admin Durand</p>
                    <p className="text-xs text-slate-500 mt-0.5">Administrateur</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-8 overflow-auto">
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="group relative">
                      <div className="absolute -inset-px bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 hover:border-slate-700/60 rounded-2xl p-5 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${colorMap[stat.color]}`}>
                            <stat.icon className="w-4 h-4" />
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${stat.trend === "alert" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"}`}>
                            {stat.change}
                          </span>
                        </div>
                        <p className="text-2xl text-white mb-0.5">{stat.value}</p>
                        <p className="text-xs text-slate-400">{stat.label}</p>
                        <p className="text-xs text-slate-600 mt-0.5">{stat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Recent Exams */}
                  <div className="xl:col-span-2">
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl overflow-hidden">
                      <div className="px-6 py-5 border-b border-slate-800/50 flex items-center justify-between">
                        <h2 className="text-base text-slate-100">Examens récents</h2>
                        <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                          Voir tout <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="divide-y divide-slate-800/40">
                        {recentExams.map((exam) => (
                          <div key={exam.id} className="px-6 py-4 hover:bg-slate-800/25 transition-colors cursor-pointer group">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4 min-w-0">
                                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-blue-400" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm text-slate-200 group-hover:text-blue-300 transition-colors truncate">{exam.title}</p>
                                  <p className="text-xs text-slate-500 mt-0.5">{exam.subject}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <div className="hidden md:flex items-center gap-3 text-xs text-slate-500">
                                  <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{exam.date}</div>
                                  <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{exam.students}</div>
                                  <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{exam.duration}m</div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs ${exam.status === "scheduled" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-slate-600/20 text-slate-400 border border-slate-600/30"}`}>
                                  {exam.status === "scheduled" ? "Planifié" : "Brouillon"}
                                </span>
                                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-6 py-4 border-t border-slate-800/40">
                        <button onClick={() => setActiveTab("create")} className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                          Créer un nouvel examen
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Fraud Alerts */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl overflow-hidden">
                      <div className="px-5 py-4 border-b border-slate-800/50 flex items-center justify-between">
                        <h2 className="text-base text-slate-100 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          Alertes fraude
                        </h2>
                        {visibleAlerts.length > 0 && <span className="px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/25 text-red-400 text-xs">{visibleAlerts.length}</span>}
                      </div>
                      <div className="divide-y divide-slate-800/30 max-h-72 overflow-y-auto">
                        {visibleAlerts.length === 0 ? (
                          <div className="px-5 py-8 text-center">
                            <Check className="w-8 h-8 text-green-400 mx-auto mb-2 opacity-60" />
                            <p className="text-xs text-slate-500">Aucune alerte active</p>
                          </div>
                        ) : visibleAlerts.map((alert) => (
                          <div key={alert.id} className={`px-5 py-3.5 hover:bg-slate-800/20 transition-colors group ${alert.severity === "high" ? "border-l-2 border-red-500/60" : "border-l-2 border-amber-500/50"}`}>
                            <div className="flex items-start gap-3">
                              <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs ${alert.severity === "high" ? "bg-red-500/20 text-red-300" : "bg-amber-500/20 text-amber-300"}`}>
                                {alert.initials}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-200 truncate">{alert.student}</p>
                                <p className="text-xs text-slate-500 truncate mt-0.5">{alert.type}</p>
                                <p className="text-xs text-slate-600 mt-0.5">{alert.time}</p>
                              </div>
                              <button onClick={() => setDismissedAlerts((p) => new Set([...p, alert.id]))} className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-700/50 rounded transition-all">
                                <X className="w-3 h-3 text-slate-500" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Activity */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl overflow-hidden">
                      <div className="px-5 py-4 border-b border-slate-800/50">
                        <h2 className="text-base text-slate-100 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-cyan-400" />
                          Activité récente
                        </h2>
                      </div>
                      <div className="p-4 space-y-2">
                        {activityFeed.map((item) => (
                          <div key={item.id} className="flex items-start gap-3 text-xs">
                            <span className="text-slate-600 flex-shrink-0 tabular-nums">{item.time}</span>
                            <div className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 ${item.type === "alert" ? "bg-red-400" : item.type === "warn" ? "bg-amber-400" : item.type === "start" ? "bg-green-400" : "bg-slate-500"}`} />
                            <span className="text-slate-400">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "create" && <CreateExamView />}
            {activeTab === "exams" && <ExamsListView onCreateExam={() => setActiveTab("create")} />}
            {activeTab === "alerts" && <FraudAlertsView />}
            {activeTab === "stats" && <StatisticsView />}
            {activeTab === "students" && <StudentsView />}
            {activeTab === "settings" && <AdminSettingsView />}
          </div>
        </main>
      </div>
    </div>
  );
}