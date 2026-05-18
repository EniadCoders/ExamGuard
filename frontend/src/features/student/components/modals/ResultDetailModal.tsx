import { Clock, CalendarDays } from "lucide-react";
import {
  DashboardCard,
  DashboardMetaItem,
  DashboardStatusBadge,
} from "@/shared/components/dashboard/DashboardCard";
import {
  ExamTypeChip as TypeChip,
  ScoreRing,
} from "@/features/student/components/StudentDashboardPrimitives";
import type { DashboardExam, AttemptResult } from "@/features/student/api";

interface ResultDetailModalProps {
  exam: DashboardExam;
  attemptDetail: AttemptResult | null;
  loading: boolean;
  onClose: () => void;
}

export function ResultDetailModal({
  exam,
  attemptDetail,
  loading,
  onClose,
}: ResultDetailModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-2xl animate-in zoom-in-95 duration-200">
        <DashboardCard className="p-5 sm:p-6 relative">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="mb-2">
                <DashboardStatusBadge status="completed" />
              </div>
              <h1 className="text-2xl font-serif text-black mb-1">{exam.title}</h1>
              <p className="text-base text-[#666666] mb-3">{exam.subject}</p>
              <div className="flex flex-wrap items-center gap-3">
                <DashboardMetaItem icon={CalendarDays}>{exam.date}</DashboardMetaItem>
                <DashboardMetaItem icon={Clock}>{exam.duration} min</DashboardMetaItem>
              </div>
            </div>
            <div className="text-right">
              <ScoreRing score={exam.score!} size="md" />
              <p className="mt-1 text-xs text-[var(--cyber-muted-text)]">Votre note</p>
            </div>
          </div>

          {attemptDetail?.attempt.passed != null && (
            <div
              className={`mb-4 rounded-xl px-4 py-3 flex items-center justify-between ${
                attemptDetail.attempt.passed
                  ? "bg-green-50 border-2 border-green-300 text-green-800"
                  : "bg-red-50 border-2 border-red-300 text-red-800"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-base">
                {attemptDetail.attempt.passed ? "✓ Validé" : "✗ Échec"}
              </div>
              {attemptDetail.attempt.passingScore != null && (
                <span className="text-sm">
                  Note minimale : {attemptDetail.attempt.passingScore}/
                  {attemptDetail.attempt.maxScore}
                </span>
              )}
            </div>
          )}
          {attemptDetail?.attempt.autoSubmitted && (
            <div className="mb-4 rounded-xl bg-amber-50 border-2 border-amber-300 px-4 py-3 text-amber-800 text-sm font-semibold">
              Soumission automatique : le temps imparti était écoulé.
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {[
              {
                label: "Note finale",
                value:
                  attemptDetail?.attempt.score != null
                    ? `${attemptDetail.attempt.score}/${attemptDetail.attempt.maxScore ?? exam.maxScore ?? 0}`
                    : "—",
              },
              {
                label: "Évènements anti-triche",
                value: String(attemptDetail?.attempt.antiCheatEventsCount ?? 0),
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[rgba(117,195,214,0.12)] bg-[rgba(11,27,38,0.58)] p-4"
              >
                <p className="text-xs text-[var(--cyber-muted-text)] mb-1">{item.label}</p>
                <p className="text-xl font-semibold text-[var(--cyber-text)] sm:text-2xl">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-black">Détail par question</h3>
            {loading ? (
              <p className="text-sm text-[#666]">Chargement…</p>
            ) : attemptDetail ? (
              <div className="space-y-2">
                {attemptDetail.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="rounded-xl border border-[#E5E5E5] bg-white p-3 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-sm font-mono text-[#666] shrink-0">Q{idx + 1}</span>
                      <TypeChip type={q.type} />
                      <span className="truncate text-sm text-black">{q.text}</span>
                    </div>
                    <span className="text-sm font-semibold shrink-0">
                      {q.isCorrect === true
                        ? `✓ ${q.points} pts`
                        : q.isCorrect === false
                          ? `✗ 0/${q.points}`
                          : `${q.points} pts`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#666]">Aucun détail disponible.</p>
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
