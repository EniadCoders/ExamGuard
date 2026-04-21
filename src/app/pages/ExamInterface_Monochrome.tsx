import { useState, useEffect, useCallback, useRef } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Lock,
  Shield,
  Flag,
  X,
  CheckCircle2,
  Code2,
  AlignLeft,
  Clock,
  Eye,
  Wifi,
  Monitor,
  Info,
  Check,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { GridBackground } from "../components/GridBackground";
import { Logo } from "../components/Logo";
import { CodeEditorPanel } from "../components/CodeEditorPanel";
import type {
  Question,
  MCQAnswer,
  TextAnswer,
  CodeAnswer,
  Answer,
} from "../types/exam";
import { TYPE_LABELS } from "../types/exam";

// ─── Mock exam questions (mixed types) ─────────────────────────────────────
const examQuestions: Question[] = [
  {
    id: 1,
    type: "mcq",
    text: "Quel principe garantit la compatibilité des modules lors d'un examen sécurisé en Java? Choisissez la réponse la plus précise.",
    points: 2,
    options: [
      { id: "A", text: "Le principe d'encapsulation garantit l'isolation des modules" },
      { id: "B", text: "La JVM assure la portabilité via le bytecode indépendant de la plateforme" },
      { id: "C", text: "Les interfaces définissent des contrats stricts entre modules" },
      { id: "D", text: "Le garbage collector gère la compatibilité mémoire" },
    ],
  },
  {
    id: 2,
    type: "mcq",
    text: "Quelle est la différence fondamentale entre une ArrayList et une LinkedList en Java?",
    points: 2,
    options: [
      { id: "A", text: "ArrayList utilise un tableau dynamique, accès O(1) indexé" },
      { id: "B", text: "LinkedList utilise des nœuds doublement chaînés, insertion O(1)" },
      { id: "C", text: "Les deux ont la même complexité temporelle pour toutes les opérations" },
      { id: "D", text: "ArrayList est synchronisée contrairement à LinkedList" },
    ],
  },
  {
    id: 3,
    type: "text",
    text: "Expliquez le concept de polymorphisme en programmation orientée objet. Donnez un exemple concret en Java et décrivez comment il améliore la maintenabilité du code.",
    points: 5,
    placeholder: "Rédigez votre réponse ici. Soyez précis et illustrez avec des exemples...",
    minWords: 80,
  },
  {
    id: 4,
    type: "code",
    text: "Écrivez une fonction Java qui prend un tableau d'entiers en entrée et retourne le second plus grand élément. Gérez les cas limites (tableau vide, tous les éléments identiques).",
    points: 8,
    language: "java",
    starterCode: `public class Solution {
    
    /**
     * Retourne le second plus grand élément du tableau.
     * @param arr Le tableau d'entiers
     * @return Le second plus grand élément, ou -1 si non trouvé
     */
    public static int secondLargest(int[] arr) {
        // Votre code ici
        
    }
    
    public static void main(String[] args) {
        int[] test1 = {3, 1, 4, 1, 5, 9, 2, 6};
        System.out.println(secondLargest(test1)); // Attendu: 6
        
        int[] test2 = {1, 1, 1};
        System.out.println(secondLargest(test2)); // Attendu: -1
    }
}`,
  },
  {
    id: 5,
    type: "mcq",
    text: "Quel patron de conception permet de créer des objets sans spécifier leur classe concrète tout en définissant une interface pour la création?",
    points: 2,
    options: [
      { id: "A", text: "Singleton — une seule instance dans toute l'application" },
      { id: "B", text: "Factory Method — délègue la création aux sous-classes" },
      { id: "C", text: "Observer — notifie les dépendants d'un changement d'état" },
      { id: "D", text: "Decorator — ajoute dynamiquement des responsabilités" },
    ],
  },
  {
    id: 6,
    type: "text",
    text: "Décrivez les différences entre les exceptions vérifiées (checked) et non vérifiées (unchecked) en Java. Quand faut-il utiliser chaque type?",
    points: 4,
    placeholder: "Expliquez avec des exemples de cas d'utilisation...",
    minWords: 50,
  },
  {
    id: 7,
    type: "code",
    text: "Implémentez un algorithme de tri rapide (QuickSort) en Python. Votre implémentation doit trier une liste en ordre croissant.",
    points: 10,
    language: "python",
    starterCode: `def quicksort(arr):
    """
    Implémente le tri rapide (QuickSort).
    
    Args:
        arr: Liste d'entiers à trier
    Returns:
        Liste triée en ordre croissant
    """
    # Votre code ici
    pass


# Tests
print(quicksort([3, 6, 8, 10, 1, 2, 1]))  # [1, 1, 2, 3, 6, 8, 10]
print(quicksort([]))                        # []
print(quicksort([1]))                       # [1]
`,
  },
  {
    id: 8,
    type: "mcq",
    text: "Quelle instruction SQL retourne exactement les doublons dans une colonne 'email' de la table 'users'?",
    points: 3,
    options: [
      { id: "A", text: "SELECT email FROM users WHERE COUNT(email) > 1" },
      { id: "B", text: "SELECT email FROM users GROUP BY email HAVING COUNT(*) > 1" },
      { id: "C", text: "SELECT DISTINCT email FROM users WHERE email IS DUPLICATE" },
      { id: "D", text: "SELECT email, COUNT(*) FROM users HAVING COUNT(*) > 1" },
    ],
  },
];

const TOTAL = examQuestions.length;

// ─── Question type icon helper ──────────────────────────────────────────────
function QTypeIcon({ type, className = "w-4 h-4" }: { type: string; className?: string }) {
  if (type === "mcq") return <CheckCircle2 className={className} />;
  if (type === "text") return <AlignLeft className={className} />;
  return <Code2 className={className} />;
}

// ─── Fraud warning banner ───────────────────────────────────────────────────
interface WarningBannerProps {
  count: number;
  onDismiss: () => void;
}
function WarningBanner({ count, onDismiss }: WarningBannerProps) {
  return (
    <div className="relative border-b-2 border-black bg-[#EAEAEA]">
      <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-black flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-black text-sm font-medium">
            <span className="font-bold">Avertissement #{count} :</span>{" "}
            Changement de fenêtre détecté. Cet incident a été enregistré et signalé au surveillant.{" "}
            <span className="font-bold">{3 - count} avertissement{3 - count > 1 ? "s" : ""}</span>{" "}
            restant{3 - count > 1 ? "s" : ""} avant soumission automatique.
          </span>
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 hover:bg-[#CCCCCC] rounded transition-colors"
        >
          <X className="w-4 h-4 text-black" />
        </button>
      </div>
    </div>
  );
}

// ─── Submit modal ────────────────────────────────────────────────────────────
interface SubmitModalProps {
  answeredCount: number;
  total: number;
  onConfirm: () => void;
  onCancel: () => void;
}
function SubmitModal({ answeredCount, total, onConfirm, onCancel }: SubmitModalProps) {
  const unanswered = total - answeredCount;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white border-2 border-black rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.16)]">
        <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mx-auto mb-5">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-bold text-center mb-2 text-black">Soumettre l'examen?</h3>
        <p className="text-[#666666] text-sm text-center mb-4">
          Vous avez répondu à{" "}
          <span className="text-black font-semibold">{answeredCount}</span> question
          {answeredCount > 1 ? "s" : ""} sur{" "}
          <span className="text-black font-semibold">{total}</span>.
        </p>
        {unanswered > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#F5F5F5] border border-[#CCCCCC] mb-5">
            <AlertTriangle className="w-4 h-4 text-black flex-shrink-0" />
            <p className="text-[#333333] text-xs">
              {unanswered} question{unanswered > 1 ? "s" : ""} sans réponse.
              Cette action est irréversible.
            </p>
          </div>
        )}
        <div className="flex gap-3 mt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border-2 border-black text-black hover:bg-[#F5F5F5] transition-all text-sm font-medium"
          >
            Continuer
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-black hover:bg-[#222222] text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.16)] text-sm font-medium"
          >
            Soumettre
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Auto-save indicator ──────────────────────────────────────────────────────
function AutoSaveIndicator({ visible }: { visible: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}>
      <Check className="w-3 h-3 text-black" />
      <span className="text-[#333333] font-medium">Sauvegardé</span>
    </div>
  );
}

// ─── Exam Results Screen ──────────────────────────────────────────────────────
function ExamResultsScreen({ navigate, answeredCount, total, flaggedCount }: {
  navigate: (p: string) => void;
  answeredCount: number;
  total: number;
  flaggedCount: number;
}) {
  const score = Math.round((answeredCount / total) * 100 * 0.87); // mock
  const isPassed = score >= 50;
  const breakdown = [
    { label: "QCM", pts: 9, maxPts: 9 },
    { label: "Texte", pts: 7, maxPts: 9 },
    { label: "Code", pts: 15, maxPts: 18 },
  ];
  const totalPts = breakdown.reduce((a, b) => a + b.pts, 0);
  const maxPts = breakdown.reduce((a, b) => a + b.maxPts, 0);
  const circ = 2 * Math.PI * 52;

  return (
    <div className="min-h-screen bg-white">
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-8 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto mb-4">
                {isPassed ? (
                  <CheckCircle2 className="w-8 h-8 text-white" />
                ) : (
                  <XCircle className="w-8 h-8 text-white" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-black mb-2">Examen soumis !</h1>
              <p className="text-sm text-[#666666]">
                Examen Java — Architecture Logicielle · 31 Mars 2026
              </p>
            </div>

            {/* Big score ring */}
            <div className="flex justify-center mb-8">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="-rotate-90 absolute" width="144" height="144">
                  <circle cx="72" cy="72" r="52" fill="none" stroke="#E5E5E5" strokeWidth="8" />
                  <circle
                    cx="72" cy="72" r="52" fill="none"
                    stroke="#000000" strokeWidth="8"
                    strokeDasharray={circ}
                    strokeDashoffset={circ * (1 - score / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="text-center z-10">
                  <p className="text-4xl font-bold text-black">{score}%</p>
                  <p className="text-xs text-[#888888] mt-1">{totalPts}/{maxPts} pts</p>
                </div>
              </div>
            </div>

            {/* Status + time */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-xl border-2 border-[#E5E5E5] p-4 text-center bg-[#F5F5F5]">
                {isPassed ? (
                  <Check className="w-5 h-5 mx-auto mb-1 text-black" />
                ) : (
                  <X className="w-5 h-5 mx-auto mb-1 text-black" />
                )}
                <p className="text-base font-bold text-black">{isPassed ? "Admis" : "Ajourné"}</p>
                <p className="text-xs text-[#888888]">Statut</p>
              </div>
              <div className="rounded-xl border-2 border-[#E5E5E5] p-4 text-center">
                <Clock className="w-5 h-5 mx-auto mb-1 text-black" />
                <p className="text-base font-bold text-black">{answeredCount}/{total}</p>
                <p className="text-xs text-[#888888]">Questions répondues</p>
              </div>
            </div>

            {/* Type breakdown */}
            <div className="space-y-2.5 mb-7">
              <p className="text-xs text-[#666666] mb-2 font-medium">Détail par type</p>
              {breakdown.map((b) => (
                <div key={b.label} className="flex items-center gap-3">
                  <span className="text-xs text-[#666666] w-12 font-medium">{b.label}</span>
                  <div className="flex-1 h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-black"
                      style={{ width: `${(b.pts / b.maxPts) * 100}%` }} />
                  </div>
                  <span className="text-xs text-[#666666] w-16 text-right font-medium">{b.pts}/{b.maxPts} pts</span>
                </div>
              ))}
            </div>

            {flaggedCount > 0 && (
              <div className="flex items-center gap-2 p-3 bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl mb-5 text-xs text-[#333333]">
                <Flag className="w-3.5 h-3.5 flex-shrink-0 text-black" />
                {flaggedCount} question{flaggedCount > 1 ? "s" : ""} marquée{flaggedCount > 1 ? "s" : ""} pour révision
              </div>
            )}

            <button
              onClick={() => navigate("/student")}
              className="w-full py-3 bg-black hover:bg-[#222222] rounded-xl text-sm text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.12)] font-medium"
            >
              Retour au dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ExamInterface component ────────────────────────────────────────────
export function ExamInterface() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [timeLeft, setTimeLeft] = useState(5025);
  const [warnings, setWarnings] = useState(1);
  const [showWarning, setShowWarning] = useState(true);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [showSubmit, setShowSubmit] = useState(false);
  const [wordCounts, setWordCounts] = useState<Record<number, number>>({});
  const [showSaved, setShowSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = examQuestions[current];

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => ({
    h: String(Math.floor(s / 3600)).padStart(2, "0"),
    m: String(Math.floor((s % 3600) / 60)).padStart(2, "0"),
    s: String(s % 60).padStart(2, "0"),
  });

  const t = formatTime(timeLeft);
  const isLowTime = timeLeft < 600;
  const timerProgress = (timeLeft / 5400) * 100;

  const isAnswered = useCallback(
    (idx: number): boolean => {
      const q = examQuestions[idx];
      const a = answers[idx];
      if (!a) return false;
      if (q.type === "mcq") return typeof a === "string" && a.length > 0;
      if (q.type === "text") return typeof a === "string" && (a as string).trim().length > 20;
      if (q.type === "code") {
        const ca = a as CodeAnswer;
        return ca.hasRun || (ca.code?.trim().length > 0 && ca.code !== (q as any).starterCode);
      }
      return false;
    },
    [answers]
  );

  const answeredCount = examQuestions.filter((_, i) => isAnswered(i)).length;

  const setAnswer = (val: Answer) => {
    setAnswers((prev) => ({ ...prev, [current]: val }));
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setShowSaved(false);
    saveTimerRef.current = setTimeout(() => {
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    }, 600);
  };

  const toggleFlag = () => {
    setFlagged((prev) => {
      const n = new Set(prev);
      n.has(current) ? n.delete(current) : n.add(current);
      return n;
    });
  };

  const totalPoints = examQuestions.reduce((sum, q) => sum + q.points, 0);

  if (submitted) {
    return (
      <ExamResultsScreen
        navigate={navigate}
        answeredCount={answeredCount}
        total={TOTAL}
        flaggedCount={flagged.size}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {showSubmit && (
        <SubmitModal
          answeredCount={answeredCount}
          total={TOTAL}
          onConfirm={() => setSubmitted(true)}
          onCancel={() => setShowSubmit(false)}
        />
      )}

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Warning banner */}
        {showWarning && (
          <WarningBanner count={warnings} onDismiss={() => setShowWarning(false)} />
        )}

        {/* Timer progress line */}
        <div className="h-1 bg-[#E5E5E5] relative overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full transition-all duration-1000 ${
              isLowTime ? "bg-black" : "bg-[#666666]"
            }`}
            style={{ width: `${timerProgress}%` }}
          />
        </div>

        {/* Header */}
        <header className="border-b border-[#E5E5E5] bg-white sticky top-0 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="max-w-[1400px] mx-auto px-6 h-[64px] flex items-center gap-4 justify-between">
            {/* Left */}
            <div className="flex items-center gap-4 min-w-0">
              <Logo size="md" />
              <div className="hidden sm:block w-px h-5 bg-[#E5E5E5]" />
              <div className="hidden sm:block min-w-0">
                <p className="text-sm text-black font-semibold truncate">Examen Java — Architecture Logicielle</p>
                <p className="text-xs text-[#666666]">
                  {TOTAL} questions · {totalPoints} points
                </p>
              </div>
            </div>

            {/* Center: Timer */}
            <div
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl border-2 ${
                isLowTime
                  ? "bg-black border-black shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
                  : "bg-white border-[#E5E5E5]"
              }`}
            >
              <Clock
                className={`w-4 h-4 ${isLowTime ? "text-white" : "text-black"}`}
              />
              <span
                className={`text-2xl tabular-nums tracking-tight font-bold ${
                  isLowTime ? "text-white" : "text-black"
                }`}
              >
                {t.h}:{t.m}:{t.s}
              </span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              <AutoSaveIndicator visible={showSaved} />
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${
                  warnings > 0
                    ? "bg-[#EAEAEA] border-black text-black"
                    : "bg-[#F5F5F5] border-[#E5E5E5] text-[#666666]"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{warnings}/3</span>
              </div>
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F5F5] border border-[#E5E5E5] text-xs text-[#333333] font-medium">
                <Lock className="w-3.5 h-3.5 text-black" />
                Mode sécurisé
              </div>
            </div>
          </div>
        </header>

        {/* Main layout */}
        <div className="flex flex-1 max-w-[1400px] mx-auto w-full px-4 py-6 gap-5">
          {/* ── Left navigation rail ── */}
          <aside className="hidden xl:flex flex-col gap-3 w-56 flex-shrink-0">
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 sticky top-[80px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#666666] font-semibold">Questions</span>
                <span className="text-xs text-[#888888]">
                  {answeredCount}/{TOTAL}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 mb-4">
                {examQuestions.map((q, idx) => {
                  const active = idx === current;
                  const answered = isAnswered(idx);
                  const isFlagged = flagged.has(idx);
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrent(idx)}
                      title={`Q${idx + 1} — ${TYPE_LABELS[q.type]}`}
                      className={`relative aspect-square rounded-lg text-xs font-semibold transition-all flex items-center justify-center ${
                        active
                          ? "bg-black text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                          : answered
                          ? "bg-[#F5F5F5] text-black border border-[#E5E5E5] hover:bg-[#EAEAEA]"
                          : "bg-white text-[#888888] border border-[#E5E5E5] hover:bg-[#F5F5F5] hover:text-black"
                      }`}
                    >
                      {idx + 1}
                      {isFlagged && !active && (
                        <div className="absolute top-0 right-0 w-2 h-2 -mt-0.5 -mr-0.5 rounded-full bg-black border border-white" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="space-y-1.5 text-xs text-[#666666] pb-4 border-b border-[#E5E5E5]">
                {[
                  { color: "bg-black", label: "Actuelle" },
                  { color: "bg-[#F5F5F5] border border-[#E5E5E5]", label: "Répondue" },
                  { color: "bg-white border border-[#E5E5E5]", label: "Non répondue" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded ${item.color}`} />
                    {item.label}
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <div className="relative w-3 h-3">
                    <div className="w-3 h-3 rounded bg-white border border-[#E5E5E5]" />
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-black" />
                  </div>
                  Marquée
                </div>
              </div>

              {/* Type legend */}
              <div className="mt-3 space-y-1.5 text-xs text-[#666666]">
                {(["mcq", "text", "code"] as const).map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <QTypeIcon type={type} className="w-3 h-3 text-black" />
                    <span className="text-black font-medium">
                      {TYPE_LABELS[type]}
                    </span>
                    <span className="ml-auto text-[#888888]">
                      {examQuestions.filter((q) => q.type === type).length}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowSubmit(true)}
                className="w-full mt-4 py-2.5 bg-black hover:bg-[#222222] rounded-xl text-xs font-semibold text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
              >
                Soumettre l'examen
              </button>
            </div>
          </aside>

          {/* ── Center: Question ── */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            {/* Question card */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              {/* Card header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] bg-[#FAFAFA]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#E5E5E5] bg-white text-xs font-medium text-black">
                    <QTypeIcon type={question.type} className="w-3 h-3" />
                    {TYPE_LABELS[question.type]}
                  </div>
                  <span className="text-xs text-[#888888] font-medium">
                    Q{current + 1}/{TOTAL}
                  </span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#F5F5F5] text-xs text-[#666666] font-semibold">
                    <span>{question.points}</span>
                    <span className="text-[#888888]">pts</span>
                  </div>
                  {flagged.has(current) && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black text-white text-xs font-medium">
                      <Flag className="w-3 h-3" />
                      Marquée
                    </span>
                  )}
                </div>
                <button
                  onClick={toggleFlag}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    flagged.has(current)
                      ? "bg-black border-black text-white hover:bg-[#222222]"
                      : "border-[#E5E5E5] text-[#666666] hover:border-black hover:text-black"
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  {flagged.has(current) ? "Retirer" : "Marquer"}
                </button>
              </div>

              {/* Question text */}
              <div className="px-6 py-5">
                <p className="text-base text-black leading-relaxed font-medium">{question.text}</p>
              </div>

              {/* ── MCQ Answer ── */}
              {question.type === "mcq" && (
                <div className="px-6 pb-6 space-y-2.5">
                  {question.options.map((opt) => {
                    const sel = answers[current] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setAnswer(opt.id as MCQAnswer)}
                        className={`group w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                          sel
                            ? "border-black bg-[#F5F5F5] shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                            : "border-[#E5E5E5] bg-white hover:border-[#CCCCCC] hover:bg-[#FAFAFA]"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                              sel
                                ? "bg-black text-white"
                                : "bg-[#F5F5F5] text-[#666666] group-hover:bg-[#EAEAEA] group-hover:text-black"
                            }`}
                          >
                            {opt.id}
                          </div>
                          <p
                            className={`flex-1 text-sm transition-colors ${
                              sel ? "text-black font-medium" : "text-[#333333]"
                            }`}
                          >
                            {opt.text}
                          </p>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                              sel
                                ? "border-black bg-black"
                                : "border-[#CCCCCC] group-hover:border-[#888888]"
                            }`}
                          >
                            {sel && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ── Text Answer ── */}
              {question.type === "text" && (() => {
                const textVal = (answers[current] as TextAnswer) ?? "";
                const words = textVal.trim()
                  ? textVal.trim().split(/\s+/).length
                  : 0;
                const minW = question.minWords ?? 0;
                const meetsMin = words >= minW;
                return (
                  <div className="px-6 pb-6">
                    {question.minWords && (
                      <div className="flex items-center gap-2 mb-3 p-3 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5]">
                        <Info className="w-3.5 h-3.5 text-[#666666] flex-shrink-0" />
                        <p className="text-xs text-[#666666]">
                          Réponse minimale recommandée :{" "}
                          <span className="text-black font-semibold">{question.minWords} mots</span>
                        </p>
                      </div>
                    )}
                    <div className="relative">
                      <textarea
                        value={textVal}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAnswer(val as TextAnswer);
                          const w = val.trim() ? val.trim().split(/\s+/).length : 0;
                          setWordCounts((prev) => ({ ...prev, [current]: w }));
                        }}
                        placeholder={question.placeholder}
                        rows={10}
                        className="w-full bg-white border-2 border-[#E5E5E5] rounded-xl px-5 py-4 text-sm text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all resize-none leading-relaxed"
                      />
                      <div className="absolute bottom-3 right-4 flex items-center gap-2">
                        <span
                          className={`text-xs font-medium ${
                            minW && words < minW
                              ? "text-[#666666]"
                              : words > 0
                              ? "text-black"
                              : "text-[#AAAAAA]"
                          }`}
                        >
                          {words} mot{words !== 1 ? "s" : ""}
                          {minW > 0 && ` / ${minW} min`}
                        </span>
                        {minW > 0 && meetsMin && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ── Code Answer ── */}
              {question.type === "code" && (() => {
                const codeAns: CodeAnswer = (answers[current] as CodeAnswer) ?? {
                  code: question.starterCode,
                  output: "",
                  hasRun: false,
                  isRunning: false,
                };
                return (
                  <div className="px-6 pb-6">
                    <CodeEditorPanel
                      language={question.language}
                      starterCode={question.starterCode}
                      value={codeAns}
                      onChange={setAnswer}
                    />
                  </div>
                );
              })()}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrent(Math.max(0, current - 1))}
                disabled={current === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#E5E5E5] text-sm font-medium text-black hover:bg-[#F5F5F5] hover:border-[#CCCCCC] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédente
              </button>

              {/* Progress dots (compact) */}
              <div className="hidden sm:flex items-center gap-1.5">
                {examQuestions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`rounded-full transition-all ${
                      i === current
                        ? "w-6 h-2 bg-black"
                        : isAnswered(i)
                        ? "w-2 h-2 bg-[#666666] hover:bg-black"
                        : "w-2 h-2 bg-[#CCCCCC] hover:bg-[#888888]"
                    }`}
                  />
                ))}
              </div>

              {current < TOTAL - 1 ? (
                <button
                  onClick={() => setCurrent(current + 1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black hover:bg-[#222222] text-sm font-medium text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                >
                  Suivante
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmit(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black hover:bg-[#222222] text-sm font-medium text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                >
                  Soumettre
                  <Shield className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* ── Right panel: proctoring ── */}
          <aside className="hidden lg:flex flex-col gap-3 w-52 flex-shrink-0">
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 sticky top-[80px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h3 className="text-xs text-[#666666] font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-black" />
                Surveillance
              </h3>
              <div className="space-y-2.5">
                {[
                  { icon: Monitor, label: "Plein écran", ok: true },
                  { icon: Eye, label: "Focus fenêtre", ok: false },
                  { icon: Wifi, label: "Connexion stable", ok: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[#666666]">
                      <item.icon className="w-3.5 h-3.5 text-[#888888]" />
                      {item.label}
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs font-semibold ${
                        item.ok ? "text-black" : "text-[#666666]"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.ok ? "bg-black" : "bg-[#666666]"
                        }`}
                      />
                      {item.ok ? "OK" : "Alerte"}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[#E5E5E5]">
                <p className="text-xs text-[#666666] mb-2 font-semibold">Progression</p>
                <div className="w-full h-2 bg-[#E5E5E5] rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full bg-black rounded-full transition-all"
                    style={{ width: `${(answeredCount / TOTAL) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-[#888888]">
                  {answeredCount}/{TOTAL} répondue{answeredCount > 1 ? "s" : ""}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-[#E5E5E5]">
                <p className="text-xs text-[#666666] mb-2 font-semibold">Répartition</p>
                <div className="space-y-1">
                  {(["mcq", "text", "code"] as const).map((type) => {
                    const typeQs = examQuestions.filter((q) => q.type === type);
                    const typeAnswered = typeQs.filter((q) =>
                      isAnswered(examQuestions.indexOf(q))
                    ).length;
                    return (
                      <div key={type} className="flex items-center gap-2">
                        <QTypeIcon type={type} className="w-3 h-3 text-[#888888]" />
                        <span className="text-xs text-[#666666] flex-1">
                          {TYPE_LABELS[type]}
                        </span>
                        <span className="text-xs text-black font-semibold">
                          {typeAnswered}/{typeQs.length}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => setShowSubmit(true)}
                className="w-full mt-5 py-2.5 bg-black hover:bg-[#222222] rounded-xl text-xs font-semibold text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
              >
                Soumettre
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
