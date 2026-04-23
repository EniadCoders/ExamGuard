import { useNavigate } from "react-router";
import {
  AlertTriangle,
  AlignLeft,
  Check,
  CheckCircle2,
  Code2,
  Shield,
  X,
  XCircle,
} from "lucide-react";
import { GridBackground } from "@/shared/components/GridBackground";

interface QuestionTypeIconProps {
  type: string;
  className?: string;
}

export function QuestionTypeIcon({
  type,
  className = "w-4 h-4",
}: QuestionTypeIconProps) {
  if (type === "mcq") return <CheckCircle2 className={className} />;
  if (type === "text") return <AlignLeft className={className} />;
  return <Code2 className={className} />;
}

interface FraudWarningBannerProps {
  warningCount?: number;
  count?: number;
  onDismiss: () => void;
}

export function FraudWarningBanner({
  warningCount,
  count,
  onDismiss,
}: FraudWarningBannerProps) {
  const resolvedWarningCount = warningCount ?? count ?? 0;
  const remainingWarnings = Math.max(0, 3 - resolvedWarningCount);

  return (
    <div className="relative border-b-2 border-black bg-[#EAEAEA]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:px-6">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-black flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-black text-sm font-medium">
            <span className="font-bold">Avertissement #{resolvedWarningCount} :</span>{" "}
            Changement de fenetre detecte. Cet incident a ete enregistre et signale au surveillant.{" "}
            <span className="font-bold">{remainingWarnings} avertissement{remainingWarnings > 1 ? "s" : ""}</span>{" "}
            restant{remainingWarnings > 1 ? "s" : ""} avant soumission automatique.
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

interface SubmitExamModalProps {
  answeredCount: number;
  totalQuestions?: number;
  total?: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SubmitExamModal({
  answeredCount,
  totalQuestions,
  total,
  onConfirm,
  onCancel,
}: SubmitExamModalProps) {
  const resolvedTotalQuestions = totalQuestions ?? total ?? answeredCount;
  const unansweredCount = resolvedTotalQuestions - answeredCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl border-2 border-black bg-white p-5 shadow-[0_8px_32px_rgba(0,0,0,0.16)] sm:p-8">
        <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mx-auto mb-5">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-bold text-center mb-2 text-black">Soumettre l'examen?</h3>
        <p className="text-[#666666] text-sm text-center mb-4">
          Vous avez repondu a{" "}
          <span className="text-black font-semibold">{answeredCount}</span> question
          {answeredCount > 1 ? "s" : ""} sur{" "}
          <span className="text-black font-semibold">{resolvedTotalQuestions}</span>.
        </p>
        {unansweredCount > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#F5F5F5] border border-[#CCCCCC] mb-5">
            <AlertTriangle className="w-4 h-4 text-black flex-shrink-0" />
            <p className="text-[#333333] text-xs">
              {unansweredCount} question{unansweredCount > 1 ? "s" : ""} sans reponse.
              Cette action est irreversible.
            </p>
          </div>
        )}
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
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

interface AutoSaveStatusProps {
  isVisible?: boolean;
  visible?: boolean;
}

export function AutoSaveStatus({ isVisible, visible }: AutoSaveStatusProps) {
  const resolvedVisibility = isVisible ?? visible ?? false;

  return (
    <div className={`flex items-center gap-1.5 text-xs transition-all duration-300 ${resolvedVisibility ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}>
      <Check className="w-3 h-3 text-black" />
      <span className="text-[#333333] font-medium">Sauvegarde</span>
    </div>
  );
}

interface ExamResultsViewProps {
  answeredCount: number;
  totalQuestions?: number;
  total?: number;
  flaggedCount: number;
  navigate?: unknown;
}

export function ExamResultsView({
  answeredCount,
  totalQuestions,
  total,
  flaggedCount,
}: ExamResultsViewProps) {
  const navigate = useNavigate();
  const resolvedTotalQuestions = totalQuestions ?? total ?? Math.max(answeredCount, 1);
  const score = Math.round((answeredCount / resolvedTotalQuestions) * 100 * 0.87);
  const isPassed = score >= 50;
  const breakdown = [
    { label: "QCM", pts: 9, maxPts: 9 },
    { label: "Texte", pts: 7, maxPts: 9 },
    { label: "Code", pts: 15, maxPts: 18 },
  ];
  const totalPts = breakdown.reduce((sum, item) => sum + item.pts, 0);
  const maxPts = breakdown.reduce((sum, item) => sum + item.maxPts, 0);
  const circumference = 2 * Math.PI * 52;

  return (
    <div className="cyber-exam-page relative min-h-screen overflow-hidden bg-white">
      <GridBackground variant="exam" />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg">
          <div className="rounded-3xl border-2 border-[#E5E5E5] bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.08)] sm:p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto mb-4">
                {isPassed ? <CheckCircle2 className="w-8 h-8 text-white" /> : <XCircle className="w-8 h-8 text-white" />}
              </div>
              <h1 className="mb-2 text-xl font-bold text-black sm:text-2xl">Examen soumis !</h1>
              <p className="text-sm text-[#666666]">
                Examen Java - Architecture Logicielle - 31 Mars 2026
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="-rotate-90 absolute" width="144" height="144">
                  <circle cx="72" cy="72" r="52" fill="none" stroke="rgba(117, 195, 214, 0.16)" strokeWidth="8" />
                  <circle
                    cx="72"
                    cy="72"
                    r="52"
                    fill="none"
                    stroke="#8BF3FF"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - score / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="text-center z-10">
                  <p className="text-3xl font-bold text-black sm:text-4xl">{score}%</p>
                  <p className="text-xs text-[#888888] mt-1">{totalPts}/{maxPts} pts</p>
                </div>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border-2 border-[#E5E5E5] p-4 text-center bg-[#F5F5F5]">
                {isPassed ? <Check className="w-5 h-5 mx-auto mb-1 text-black" /> : <X className="w-5 h-5 mx-auto mb-1 text-black" />}
                <p className="text-xs text-[#888888]">Statut</p>
                <p className="text-sm font-bold text-black mt-0.5">{isPassed ? "Valide" : "A revoir"}</p>
              </div>
              <div className="rounded-xl border-2 border-[#E5E5E5] p-4 text-center bg-[#F5F5F5]">
                <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-black" />
                <p className="text-xs text-[#888888]">Questions signalees</p>
                <p className="text-sm font-bold text-black mt-0.5">{flaggedCount}</p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {breakdown.map((item) => {
                const width = `${(item.pts / item.maxPts) * 100}%`;
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-black font-medium">{item.label}</span>
                      <span className="text-[#666666]">{item.pts}/{item.maxPts}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#E5E5E5] overflow-hidden">
                      <div className="h-full rounded-full bg-black" style={{ width }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => navigate("/student")}
              className="w-full py-3 rounded-xl bg-black hover:bg-[#222222] text-white transition-all text-sm font-medium shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
            >
              Retourner au tableau de bord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
