import {
  Clock,
  Users,
  CalendarDays,
  ChevronDown,
  Play,
  FileText,
  Search,
  X,
  User,
  Hash,
  Plus,
} from "lucide-react";
import {
  DashboardCard,
  DashboardMetaItem,
  DashboardStatusBadge,
} from "@/shared/components/dashboard/DashboardCard";
import {
  ExamTypeChip as TypeChip,
  ScoreRing,
} from "@/features/student/components/StudentDashboardPrimitives";
import type { DashboardExam } from "@/features/student/api";

export type ExamStatusFilter = "all" | "ongoing" | "upcoming" | "completed";

interface ExamsListProps {
  loading: boolean;
  allExams: DashboardExam[];
  filteredExams: DashboardExam[];
  search: string;
  statusFilter: ExamStatusFilter;
  typeFilter: string;
  expandedExamId: string | null;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: ExamStatusFilter) => void;
  onTypeFilterChange: (value: string) => void;
  onJoinExam: (examId: string) => void;
  onToggleExpand: (examId: string) => void;
  onOpenJoinCode: () => void;
}

export function ExamsList({
  loading,
  allExams,
  filteredExams,
  search,
  statusFilter,
  typeFilter,
  expandedExamId,
  onSearchChange,
  onStatusFilterChange,
  onTypeFilterChange,
  onJoinExam,
  onToggleExpand,
  onOpenJoinCode,
}: ExamsListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif text-black sm:text-4xl">Mes Examens</h1>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full lg:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
          <input
            type="text"
            placeholder="Rechercher un examen..."
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
              onChange={(e) => onStatusFilterChange(e.target.value as ExamStatusFilter)}
              className="w-full appearance-none bg-white border border-[#E5E5E5] text-[#666666] font-medium text-sm rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-black shadow-sm cursor-pointer hover:border-black hover:text-black transition-colors"
            >
              <option value="all">Tous ({allExams.length})</option>
              <option value="ongoing">En cours</option>
              <option value="upcoming">À venir</option>
              <option value="completed">Terminés</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666] pointer-events-none" />
          </div>
          <div className="relative min-w-[150px]">
            <select
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value)}
              className="w-full appearance-none bg-white border border-[#E5E5E5] text-[#666666] font-medium text-sm rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-black shadow-sm cursor-pointer hover:border-black hover:text-black transition-colors"
            >
              <option value="all">Tous les types</option>
              <option value="mcq">QCM</option>
              <option value="code">Code</option>
              <option value="text">Texte</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666] pointer-events-none" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#00809D]" />
        </div>
      ) : allExams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white border border-[#E5E5E5] rounded-3xl shadow-sm animate-in fade-in">
          <div className="w-20 h-20 bg-[#F5F7FB] rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <Hash className="w-8 h-8 text-[#00809D]" />
          </div>
          <h3 className="text-xl font-bold text-black mb-2">Prêt à passer un examen ?</h3>
          <p className="text-[#666666] max-w-md mx-auto mb-8">
            Rejoignez votre premier examen en utilisant le code fourni par votre professeur.
          </p>
          <button
            onClick={onOpenJoinCode}
            className="flex items-center gap-2 px-6 py-3 bg-[#00809D] hover:bg-[#006B82] text-white font-bold rounded-xl transition-all shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Rejoindre un examen</span>
          </button>
        </div>
      ) : filteredExams.length === 0 ? (
        <EmptySearchState />
      ) : (
        <div className="grid gap-5">
          {filteredExams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              expanded={expandedExamId === exam.id}
              onJoin={() => onJoinExam(exam.id)}
              onToggleExpand={() => onToggleExpand(exam.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptySearchState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white border border-[#E5E5E5] rounded-2xl">
      <Search className="w-12 h-12 text-[#E5E5E5] mb-4" />
      <h3 className="text-lg font-bold text-black mb-1">Aucun résultat trouvé</h3>
      <p className="text-[#666666]">Essayez de modifier vos filtres ou votre recherche.</p>
    </div>
  );
}

interface ExamCardProps {
  exam: DashboardExam;
  expanded: boolean;
  onJoin: () => void;
  onToggleExpand: () => void;
}

function ExamCard({ exam, expanded, onJoin, onToggleExpand }: ExamCardProps) {
  return (
    <DashboardCard interactive className="p-6 transition-all duration-300">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <DashboardStatusBadge
              status={exam.status as "completed" | "ongoing" | "upcoming"}
            />
          </div>
          <h3 className="text-2xl font-semibold text-[var(--cyber-text)]">{exam.title}</h3>
          <p className="mt-2 text-base text-[var(--cyber-muted-text)]">{exam.subject}</p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
            <DashboardMetaItem icon={CalendarDays}>{exam.date}</DashboardMetaItem>
            <DashboardMetaItem icon={Clock}>
              {exam.time} • {exam.duration} min
            </DashboardMetaItem>
            <DashboardMetaItem icon={Users}>{exam.students} étudiants</DashboardMetaItem>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {exam.types.map((type) => (
              <TypeChip key={type} type={type} />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 lg:ml-4 lg:items-end">
          {exam.status === "completed" && exam.score !== undefined && (
            <div className="rounded-2xl border border-[rgba(117,195,214,0.14)] bg-[rgba(11,27,38,0.72)] p-4">
              <ScoreRing score={exam.score} size="lg" variant="out-of-20" />
            </div>
          )}
          {exam.status === "ongoing" && (
            <button
              onClick={onJoin}
              className="cyber-button-primary flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
            >
              <Play className="w-4 h-4" />
              <span>Reprendre</span>
            </button>
          )}
          {exam.status === "upcoming" && exam.canStart && (
            <button
              onClick={onJoin}
              className="cyber-button-primary flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
            >
              <Play className="w-4 h-4" />
              <span>Commencer l'examen</span>
            </button>
          )}
          {exam.status === "upcoming" && !exam.canStart && (
            <button
              onClick={onToggleExpand}
              className="cyber-button-secondary rounded-xl px-6 py-3 text-sm font-medium"
            >
              {expanded ? "Masquer" : "Détails"}
            </button>
          )}
        </div>
      </div>

      {expanded && exam.status === "upcoming" && (
        <div className="mt-6 pt-6 border-t border-[rgba(117,195,214,0.12)] grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[rgba(117,195,214,0.08)] text-[var(--cyber-accent-strong)]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--cyber-subtle-text)] uppercase tracking-wider mb-1">
                Professeur
              </p>
              <p className="text-sm font-medium text-[var(--cyber-text)]">Dr. Alan Turing</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[rgba(117,195,214,0.08)] text-[var(--cyber-accent-strong)]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--cyber-subtle-text)] uppercase tracking-wider mb-1">
                Description
              </p>
              <p className="text-sm font-medium text-[var(--cyber-text)]">
                Cet examen couvrira l'ensemble des chapitres abordés ce semestre. Les documents
                ne sont pas autorisés.
              </p>
            </div>
          </div>
        </div>
      )}
    </DashboardCard>
  );
}
