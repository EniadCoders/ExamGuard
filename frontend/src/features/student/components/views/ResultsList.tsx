/**
 * Vue "Résultats" : liste des copies corrigées avec anneau de score, badge de
 * validation et ouverture du détail dans `ResultDetailModal` au clic.
 */
import { ChevronDown, Search, X } from "lucide-react";
import {
  DashboardStatusBadge,
} from "@/shared/components/dashboard/DashboardCard";
import { ScoreRing } from "@/features/student/components/StudentDashboardPrimitives";
import { ResultDetailModal } from "@/features/student/components/modals/ResultDetailModal";
import type { DashboardExam, AttemptResult } from "@/features/student/api";

interface ResultsListProps {
  filteredResults: DashboardExam[];
  search: string;
  statusFilter: string;
  scoreFilter: string;
  selectedResult: string | null;
  selectedExam: DashboardExam | undefined;
  attemptDetail: AttemptResult | null;
  attemptDetailLoading: boolean;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onScoreFilterChange: (value: string) => void;
  onSelectResult: (examId: string | null) => void;
}

export function ResultsList({
  filteredResults,
  search,
  statusFilter,
  scoreFilter,
  selectedResult,
  selectedExam,
  attemptDetail,
  attemptDetailLoading,
  onSearchChange,
  onStatusFilterChange,
  onScoreFilterChange,
  onSelectResult,
}: ResultsListProps) {
  return (
    <div className="space-y-6">
      <h1 className="mb-6 text-3xl font-serif text-black sm:text-4xl">Mes Résultats</h1>

      <div className="flex flex-col lg:flex-row items-center gap-4 mb-6">
        <div className="relative w-full lg:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
          <input
            type="text"
            placeholder="Rechercher un résultat..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border border-[#E5E5E5] rounded-xl pl-11 pr-11 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666666] hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
          <div className="relative min-w-[150px]">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full appearance-none bg-white border border-[#E5E5E5] text-[#666666] font-medium text-sm rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-black shadow-sm cursor-pointer hover:border-black hover:text-black transition-colors"
            >
              <option value="all">Tous les statuts</option>
              <option value="success">Réussi</option>
              <option value="fail">Échoué</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666] pointer-events-none" />
          </div>
          <div className="relative min-w-[150px]">
            <select
              value={scoreFilter}
              onChange={(e) => onScoreFilterChange(e.target.value)}
              className="w-full appearance-none bg-white border border-[#E5E5E5] text-[#666666] font-medium text-sm rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-black shadow-sm cursor-pointer hover:border-black hover:text-black transition-colors"
            >
              <option value="all">Toutes les notes</option>
              <option value="10-20">10 - 20</option>
              <option value="0-10">0 - 10</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666] pointer-events-none" />
          </div>
        </div>
      </div>

      {filteredResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white border border-[#E5E5E5] rounded-2xl">
          <Search className="w-12 h-12 text-[#E5E5E5] mb-4" />
          <h3 className="text-lg font-bold text-black mb-1">Aucun résultat trouvé</h3>
          <p className="text-[#666666]">Essayez de modifier vos filtres ou votre recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResults.map((exam) => (
            <ResultCard key={exam.id} exam={exam} onClick={() => onSelectResult(exam.id)} />
          ))}
        </div>
      )}

      {selectedResult !== null && selectedExam && (
        <ResultDetailModal
          exam={selectedExam}
          attemptDetail={attemptDetail}
          loading={attemptDetailLoading}
          onClose={() => onSelectResult(null)}
        />
      )}
    </div>
  );
}

function ResultCard({ exam, onClick }: { exam: DashboardExam; onClick: () => void }) {
  return (
    <button onClick={onClick} className="dashboard-card dashboard-card-interactive p-6 text-left">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-2">
            <DashboardStatusBadge status="completed" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--cyber-text)]">{exam.title}</h3>
          <p className="mt-1 text-sm text-[var(--cyber-muted-text)]">{exam.subject}</p>
          <p className="mt-3 text-xs text-[var(--cyber-subtle-text)]">{exam.date}</p>
        </div>
      </div>
      <div className="mb-4 flex items-center justify-center">
        <ScoreRing score={exam.score!} size="lg" />
      </div>
      <div className="dashboard-divider mb-4" />
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-[var(--cyber-muted-text)]">
          <span>Votre note</span>
          <span className="font-semibold text-[var(--cyber-text)]">
            {exam.score != null ? `${exam.score}/${exam.maxScore ?? "?"}` : "—"}
          </span>
        </div>
        <div className="flex justify-between text-sm text-[var(--cyber-muted-text)]">
          <span>Matière</span>
          <span className="font-semibold text-[var(--cyber-text)]">{exam.subject}</span>
        </div>
      </div>
    </button>
  );
}
