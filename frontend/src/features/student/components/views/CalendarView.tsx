/**
 * Vue "Calendrier" du dashboard étudiant : agenda chronologique des examens
 * (à venir, en cours, passés) avec filtres par statut, recherche textuelle
 * et regroupement par mois.
 */
import { AlertTriangle, ChevronDown, Search, X } from "lucide-react";
import {
  DashboardCard,
  DashboardStatusBadge,
} from "@/shared/components/dashboard/DashboardCard";
import type { CalendarEvent, DashboardExam } from "@/features/student/api";

interface CalendarViewProps {
  allExams: DashboardExam[];
  calendarEvents: CalendarEvent[];
  filteredEvents: CalendarEvent[];
  search: string;
  monthFilter: string;
  subjectFilter: string;
  typeFilter: string;
  onSearchChange: (value: string) => void;
  onMonthFilterChange: (value: string) => void;
  onSubjectFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
}

export function CalendarView({
  allExams,
  calendarEvents,
  filteredEvents,
  search,
  monthFilter,
  subjectFilter,
  typeFilter,
  onSearchChange,
  onMonthFilterChange,
  onSubjectFilterChange,
  onTypeFilterChange,
}: CalendarViewProps) {
  const months = Array.from(new Set(calendarEvents.map((e) => e.month)));
  const subjects = Array.from(new Set(allExams.map((e) => e.subject)));
  const types = Array.from(new Set(allExams.flatMap((e) => e.types)));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif text-black sm:text-4xl">Calendrier des Examens</h1>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full lg:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
          <input
            type="text"
            placeholder="Rechercher par examen ou date..."
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
          <FilterSelect value={monthFilter} onChange={onMonthFilterChange} minWidth={140}>
            <option value="all">Tous les mois</option>
            {months.map((month) => (
              <option key={month} value={month.toLowerCase()}>
                {month}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect value={subjectFilter} onChange={onSubjectFilterChange} minWidth={160}>
            <option value="all">Tous les modules</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect value={typeFilter} onChange={onTypeFilterChange} minWidth={140}>
            <option value="all">Tous les types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type === "mcq" ? "QCM" : type === "code" ? "Code" : type === "text" ? "Texte" : type}
              </option>
            ))}
          </FilterSelect>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white border border-[#E5E5E5] rounded-2xl">
          <Search className="w-12 h-12 text-[#E5E5E5] mb-4" />
          <h3 className="text-lg font-bold text-black mb-1">Aucun résultat trouvé</h3>
          <p className="text-[#666666]">Essayez de modifier vos filtres ou votre recherche.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEvents.map((event) => (
            <DashboardCard key={event.id} interactive className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl border border-[rgba(117,195,214,0.14)] bg-[rgba(11,27,38,0.64)]">
                  <span className="text-sm font-medium uppercase text-[var(--cyber-subtle-text)]">
                    {event.month.slice(0, 3)}
                  </span>
                  <span className="text-2xl font-semibold text-[var(--cyber-text)]">
                    {event.date}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[var(--cyber-text)] mb-1">
                    {event.title}
                  </h3>
                  <p className="text-sm text-[var(--cyber-muted-text)]">{event.time}</p>
                </div>
                <DashboardStatusBadge
                  status={event.status as "completed" | "ongoing" | "upcoming"}
                />
              </div>
            </DashboardCard>
          ))}
        </div>
      )}

      <DashboardCard className="p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgba(255,211,107,0.16)] bg-[rgba(255,211,107,0.08)]">
            <AlertTriangle className="w-5 h-5 text-[var(--cyber-warning)]" />
          </div>
          <div>
            <p className="mb-1 font-semibold text-[var(--cyber-text)]">Rejoindre un examen</p>
            <p className="text-sm text-[var(--cyber-muted-text)]">
              Vous pouvez rejoindre un examen 5 minutes avant l'heure de début prévue.
            </p>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  minWidth: number;
  children: React.ReactNode;
}

function FilterSelect({ value, onChange, minWidth, children }: FilterSelectProps) {
  return (
    <div className="relative" style={{ minWidth }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-white border border-[#E5E5E5] text-[#666666] font-medium text-sm rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-black shadow-sm cursor-pointer hover:border-black hover:text-black transition-colors"
      >
        {children}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666] pointer-events-none" />
    </div>
  );
}
