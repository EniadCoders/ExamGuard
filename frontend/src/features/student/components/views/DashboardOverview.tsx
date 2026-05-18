import {
  Clock,
  Users,
  CalendarDays,
  ChevronRight,
  Play,
  TrendingUp,
  Calendar,
  Hash,
  Plus,
} from "lucide-react";
import {
  DashboardCard,
  DashboardMetricCard,
  DashboardMetaItem,
  DashboardSectionCard,
  DashboardStatusBadge,
} from "@/shared/components/dashboard/DashboardCard";
import {
  ExamTypeChip as TypeChip,
  ScoreRing,
} from "@/features/student/components/StudentDashboardPrimitives";
import type {
  DashboardExam,
  DashboardStat,
  DashboardUser,
  DashboardPerformance,
  CalendarEvent,
} from "@/features/student/api";

interface DashboardOverviewProps {
  user: DashboardUser | null;
  loading: boolean;
  allExams: DashboardExam[];
  stats: DashboardStat[];
  performance: DashboardPerformance | null;
  calendarEvents: CalendarEvent[];
  onJoinExam: (examId: string) => void;
  onOpenExams: () => void;
  onOpenCalendar: () => void;
  onOpenJoinCode: () => void;
}

export function DashboardOverview({
  user,
  loading,
  allExams,
  stats,
  performance,
  calendarEvents,
  onJoinExam,
  onOpenExams,
  onOpenCalendar,
  onOpenJoinCode,
}: DashboardOverviewProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#00809D]" />
      </div>
    );
  }

  // Examen en cours de passage, ou à défaut un examen démarrable immédiatement.
  const activeExam =
    allExams.find((e) => e.status === "ongoing") ??
    allExams.find((e) => e.status === "upcoming" && e.canStart);

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-[var(--cyber-text)] sm:text-4xl">
          Bonjour{user?.firstName ? `, ${user.firstName}` : ""}
        </h1>
        <p className="text-base text-[var(--cyber-muted-text)] sm:text-lg">
          Bienvenue sur votre tableau de bord
        </p>
      </div>

      {allExams.length === 0 ? (
        <EmptyExamsState onOpenJoinCode={onOpenJoinCode} />
      ) : (
        <div className="space-y-8">
          {activeExam && (
            <ActiveExamCard
              exam={activeExam}
              isResume={activeExam.status === "ongoing"}
              onJoin={() => onJoinExam(activeExam.id)}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <DashboardMetricCard
                  key={idx}
                  icon={Icon}
                  label={stat.label}
                  value={stat.value}
                  change={stat.change}
                  iconTone={idx === 1 || idx === 2 || idx === 3 ? "positive" : "default"}
                  changeTone="info"
                />
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-5">
              <h2 className="text-xl font-serif text-black sm:text-2xl">
                Examens récents & à venir
              </h2>
              {allExams.slice(0, 3).map((exam) => (
                <RecentExamCard key={exam.id} exam={exam} onClick={onOpenExams} />
              ))}
            </div>

            <div className="space-y-6">
              <DashboardSectionCard
                title="Performance"
                subtitle={
                  performance && performance.completedCount > 0
                    ? `Moyenne sur ${performance.completedCount} examen${performance.completedCount > 1 ? "s" : ""}`
                    : "Aucun examen complété pour le moment"
                }
                icon={TrendingUp}
              >
                <div className="flex justify-center mb-4">
                  {performance?.averageScore != null ? (
                    <ScoreRing score={performance.averageScore} size="lg" />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-[rgba(117,195,214,0.2)] text-sm text-[var(--cyber-muted-text)]">
                      —
                    </div>
                  )}
                </div>
              </DashboardSectionCard>

              <DashboardSectionCard
                title="Calendrier"
                subtitle="Vos prochains rendez-vous"
                icon={Calendar}
                interactive
                onClick={onOpenCalendar}
                className="cursor-pointer"
              >
                <div className="space-y-3">
                  {calendarEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="rounded-2xl border border-[rgba(117,195,214,0.12)] bg-[rgba(11,27,38,0.56)] p-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-[rgba(117,195,214,0.14)] bg-[rgba(7,18,27,0.9)]">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--cyber-subtle-text)]">
                            {event.month.slice(0, 3)}
                          </span>
                          <span className="text-lg font-semibold text-[var(--cyber-text)]">
                            {event.date}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[var(--cyber-text)]">
                            {event.title}
                          </p>
                          <p className="mt-1 text-xs text-[var(--cyber-muted-text)]">
                            {event.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardSectionCard>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function EmptyExamsState({ onOpenJoinCode }: { onOpenJoinCode: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in duration-700 slide-in-from-bottom-4 mt-4 bg-white border border-[#E5E5E5] rounded-3xl shadow-sm">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-[#00809D] blur-3xl opacity-20 rounded-full animate-pulse"></div>
        <div className="relative w-32 h-32 bg-[#F5F7FB] rounded-3xl border border-[#E5E5E5] flex items-center justify-center shadow-lg rotate-3 transition-transform hover:rotate-6">
          <Hash className="w-12 h-12 text-[#00809D]" />
        </div>
        <div
          className="absolute -top-4 -right-4 w-12 h-12 bg-[#00809D] rounded-xl flex items-center justify-center shadow-lg -rotate-12 animate-bounce"
          style={{ animationDuration: "3s" }}
        >
          <Plus className="w-6 h-6 text-white" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-black mb-4">Aucun examen pour le moment</h2>

      <p className="text-lg text-[#666666] max-w-lg mx-auto mb-10 leading-relaxed">
        Vous n'êtes inscrit à aucun examen. Pour commencer, vous devez rejoindre un examen en
        utilisant le code fourni par votre enseignant.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#F5F7FB] border border-[#E5E5E5] rounded-2xl p-2 pl-6 pr-2 shadow-sm">
        <span className="text-sm font-medium text-[#666666]">Étape 1 : Cliquez sur le bouton</span>
        <div className="hidden sm:block w-8 h-px bg-[#E5E5E5]"></div>
        <button
          onClick={onOpenJoinCode}
          className="flex items-center gap-2 px-6 py-3 bg-[#00809D] hover:bg-[#006B82] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span>Rejoindre un examen</span>
        </button>
      </div>
    </div>
  );
}

function ActiveExamCard({
  exam,
  isResume,
  onJoin,
}: {
  exam: DashboardExam;
  isResume: boolean;
  onJoin: () => void;
}) {
  return (
    <DashboardCard tone="accent" className="p-7 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <DashboardStatusBadge status={isResume ? "ongoing" : "upcoming"} />
            <span className="dashboard-card-kicker">
              {isResume ? "Examen actif" : "Disponible maintenant"}
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-[var(--cyber-text)] sm:text-3xl">
            {exam.title}
          </h2>
          <p className="mt-2 text-base text-[var(--cyber-muted-text)]">{exam.subject}</p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
            <DashboardMetaItem icon={Clock}>{exam.duration} min</DashboardMetaItem>
            <DashboardMetaItem icon={Users}>{exam.students} étudiants</DashboardMetaItem>
            <DashboardMetaItem icon={CalendarDays}>
              {exam.date} • {exam.time}
            </DashboardMetaItem>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {exam.types.map((type) => (
              <TypeChip key={type} type={type} />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-start lg:self-stretch lg:items-end">
          <button
            onClick={onJoin}
            className="cyber-button-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold lg:mt-auto"
          >
            <Play className="w-4 h-4" />
            <span>{isResume ? "Reprendre l'examen" : "Commencer l'examen"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </DashboardCard>
  );
}

function RecentExamCard({ exam, onClick }: { exam: DashboardExam; onClick: () => void }) {
  return (
    <DashboardCard interactive onClick={onClick} className="p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <DashboardStatusBadge
              status={exam.status as "completed" | "ongoing" | "upcoming"}
            />
          </div>
          <h3 className="text-xl font-semibold text-[var(--cyber-text)]">{exam.title}</h3>
          <p className="mt-1 text-sm text-[var(--cyber-muted-text)]">{exam.subject}</p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            <DashboardMetaItem icon={CalendarDays}>{exam.date}</DashboardMetaItem>
            <DashboardMetaItem icon={Clock}>
              {exam.time} • {exam.duration} min
            </DashboardMetaItem>
            <DashboardMetaItem icon={Users}>{exam.students}</DashboardMetaItem>
          </div>
        </div>
        {exam.status === "completed" && exam.score !== undefined && (
          <div className="flex shrink-0 items-center justify-center rounded-2xl border border-[rgba(117,195,214,0.14)] bg-[rgba(11,27,38,0.72)] p-4">
            <ScoreRing score={exam.score} size="md" />
          </div>
        )}
      </div>
      <div className="dashboard-divider my-5" />
      <div className="flex flex-wrap items-center gap-2">
        {exam.types.map((type) => (
          <TypeChip key={type} type={type} />
        ))}
      </div>
    </DashboardCard>
  );
}
