import { useState, useEffect } from "react";
import {
  LogOut,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  TrendingUp,
  CalendarDays,
  ChevronRight,
  Play,
  Award,
  LayoutDashboard,
  FileText,
  BarChart3,
  Calendar,
  Star,
  Target,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  Zap,
  Lock,
  ShieldAlert,
  Settings,
  Eye,
  Save,
  Activity,
  EyeOff,
  User,
  Mail,
  Building,
  Phone,
  Shield,
  Smartphone,
  Monitor,
  X,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router";
import { GridBackground } from "@/shared/components/GridBackground";
import { Logo } from "@/shared/components/BrandLogo";
import { NotificationPanel } from "@/shared/components/NotificationPanel";
import {
  DashboardCard,
  DashboardMetricCard,
  DashboardMetaItem,
  DashboardSectionCard,
  DashboardStatusBadge,
} from "@/shared/components/dashboard/DashboardCard";
import {
  studentCalendarEvents as calendarEvents,
  studentDashboardStats as stats,
  studentExams as allExams,
} from "@/features/student/student.data";
import {
  ExamTypeChip as TypeChip,
  ScoreRing,
} from "@/features/student/components/StudentDashboardPrimitives";

export function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"dashboard" | "exams" | "results" | "calendar" | "settings">("dashboard");
  const [examFilter, setExamFilter] = useState<"all" | "ongoing" | "upcoming" | "completed">("all");
  const [selectedResult, setSelectedResult] = useState<number | null>(null);
  const [settingsTab, setSettingsTab] = useState<"profile" | "password" | "notifications" | "security">("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showExamLock, setShowExamLock] = useState(false);
  const [targetExamId, setTargetExamId] = useState<number | null>(null);

  const [notificationSettings, setNotificationSettings] = useState({
    examReminders: true,
    resultNotifications: true,
    systemUpdates: false,
  });

  const handleJoinExam = (examId: number) => {
    setTargetExamId(examId);
    setShowExamLock(true);
  };

  const confirmJoinExam = () => {
    if (targetExamId) {
      navigate(`/exam/${targetExamId}`);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const activeExam = allExams.find((e) => e.status === "ongoing");
  const filteredExams = examFilter === "all" ? allExams : allExams.filter((e) => e.status === examFilter);
  const completedExams = allExams.filter((e) => e.status === "completed");

  return (
    <div className="cyber-dashboard-page relative min-h-screen overflow-hidden bg-[#FAFAFA]">
      <GridBackground variant="dashboard" />
      <div className="relative z-10">
      {/* Header */}
      <header className="cyber-topbar sticky top-0 z-50 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo size="sm" />
            <nav className="hidden md:flex items-center gap-6">
              {[
                { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
                { id: "exams", label: "Mes Examens", icon: FileText },
                { id: "results", label: "Résultats", icon: BarChart3 },
                { id: "calendar", label: "Calendrier", icon: Calendar },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
                      activeTab === tab.id
                        ? "bg-[#00809D] text-white"
                        : "text-[#666666] hover:text-black hover:bg-[#F5F7FB]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <NotificationPanel role="student" />

            <div className="flex items-center gap-3 pl-3 border-l border-[#E5E5E5]">
              <button
                onClick={() => setActiveTab("settings")}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F5F7FB] transition-colors"
              >
                <div className="w-8 h-8 bg-[#00809D] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">JD</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-black">Jean Dupont</p>
                  <p className="text-xs text-[#666666]">Étudiant</p>
                </div>
              </button>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-[#F5F7FB] transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="w-5 h-5 text-black" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        {activeTab === "dashboard" && (
          <div className="cyber-page-intro mb-8">
            <h1 className="text-4xl font-serif text-black mb-2">Bonjour, Jean</h1>
            <p className="text-[#666666] text-lg">Bienvenue sur votre tableau de bord</p>
          </div>
        )}

        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Active Exam CTA */}
            {activeExam && (
              <DashboardCard tone="accent" className="p-7 sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <DashboardStatusBadge status="ongoing" />
                      <span className="dashboard-card-kicker">Examen actif</span>
                    </div>
                    <h2 className="text-3xl font-semibold text-[var(--cyber-text)]">
                      {activeExam.title}
                    </h2>
                    <p className="mt-2 text-base text-[var(--cyber-muted-text)]">
                      {activeExam.subject}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
                      <DashboardMetaItem icon={Clock}>
                        {activeExam.duration} min
                      </DashboardMetaItem>
                      <DashboardMetaItem icon={Users}>
                        {activeExam.students} étudiants
                      </DashboardMetaItem>
                      <DashboardMetaItem icon={CalendarDays}>
                        {activeExam.date} • {activeExam.time}
                      </DashboardMetaItem>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {activeExam.types.map((type) => (
                        <TypeChip key={type} type={type} />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-4 lg:items-end">
                    <div className="rounded-2xl border border-[rgba(123,241,255,0.16)] bg-[rgba(8,20,29,0.78)] px-4 py-3 text-left">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--cyber-subtle-text)]">
                        Session
                      </p>
                      <p className="mt-1 text-sm font-medium text-[var(--cyber-text)]">
                        Surveillance active
                      </p>
                    </div>
                    <button
                      onClick={() => handleJoinExam(activeExam.id)}
                      className="cyber-button-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
                    >
                      <Play className="w-4 h-4" />
                      <span>Reprendre l&apos;examen</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </DashboardCard>
            )}

            {/* Stats Grid */}
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
                    iconTone={
                      idx === 1 || idx === 2 ? "positive" : idx === 3 ? "warning" : "default"
                    }
                    changeTone={idx === 3 ? "warning" : "info"}
                  />
                );
              })}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Recent & Upcoming Exams */}
              <div className="xl:col-span-2 space-y-5">
                <h2 className="text-2xl font-serif text-black">
                  Examens récents & à venir
                </h2>
                {allExams.slice(0, 3).map((exam) => (
                  <DashboardCard
                    key={exam.id}
                    interactive
                    className="p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <DashboardStatusBadge
                            status={exam.status as "completed" | "ongoing" | "upcoming"}
                          />
                        </div>
                        <h3 className="text-xl font-semibold text-[var(--cyber-text)]">
                          {exam.title}
                        </h3>
                        <p className="mt-1 text-sm text-[var(--cyber-muted-text)]">
                          {exam.subject}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                          <DashboardMetaItem icon={CalendarDays}>
                            {exam.date}
                          </DashboardMetaItem>
                          <DashboardMetaItem icon={Clock}>
                            {exam.time} • {exam.duration} min
                          </DashboardMetaItem>
                          <DashboardMetaItem icon={Users}>
                            {exam.students}
                          </DashboardMetaItem>
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
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Performance */}
                <DashboardSectionCard
                  title="Performance"
                  subtitle="Vue d'ensemble de votre progression"
                  icon={TrendingUp}
                >
                  <div className="flex justify-center mb-4">
                    <ScoreRing score={84} size="lg" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-[var(--cyber-muted-text)]">
                      <span>Moyenne de la classe</span>
                      <span className="font-semibold text-[var(--cyber-text)]">78%</span>
                    </div>
                    <div className="dashboard-divider" />
                    <div className="flex items-center gap-2 text-sm text-[var(--cyber-muted-text)]">
                      <ArrowUp className="w-4 h-4 text-[var(--cyber-accent-strong)]" />
                      <span>+6% au-dessus de la moyenne</span>
                    </div>
                  </div>
                </DashboardSectionCard>

                {/* Calendar */}
                <DashboardSectionCard
                  title="Calendrier"
                  subtitle="Vos prochains rendez-vous"
                  icon={Calendar}
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

        {/* Exams View */}
        {activeTab === "exams" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-serif text-black">
                Mes Examens
              </h1>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {[
                { id: "all", label: "Tous", count: allExams.length },
                { id: "ongoing", label: "En cours", count: allExams.filter((e) => e.status === "ongoing").length },
                { id: "upcoming", label: "À venir", count: allExams.filter((e) => e.status === "upcoming").length },
                { id: "completed", label: "Terminés", count: allExams.filter((e) => e.status === "completed").length },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setExamFilter(filter.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                    examFilter === filter.id
                      ? "bg-[#00809D] text-white"
                      : "bg-white border border-[#E5E5E5] text-[#666666] hover:text-black hover:border-black"
                  }`}
                >
                  <span>{filter.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    examFilter === filter.id ? "bg-white text-black" : "bg-[#F5F7FB] text-[#666666]"
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Exam List */}
            <div className="grid gap-5">
              {filteredExams.map((exam) => (
                <DashboardCard
                  key={exam.id}
                  interactive
                  className="p-6"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <DashboardStatusBadge
                          status={exam.status as "completed" | "ongoing" | "upcoming"}
                        />
                      </div>
                      <h3 className="text-2xl font-semibold text-[var(--cyber-text)]">
                        {exam.title}
                      </h3>
                      <p className="mt-2 text-base text-[var(--cyber-muted-text)]">
                        {exam.subject}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
                        <DashboardMetaItem icon={CalendarDays}>
                          {exam.date}
                        </DashboardMetaItem>
                        <DashboardMetaItem icon={Clock}>
                          {exam.time} • {exam.duration} min
                        </DashboardMetaItem>
                        <DashboardMetaItem icon={Users}>
                          {exam.students} étudiants
                        </DashboardMetaItem>
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
                          <ScoreRing score={exam.score} size="lg" />
                        </div>
                      )}
                      {exam.status === "ongoing" && (
                        <button
                          onClick={() => handleJoinExam(exam.id)}
                          className="cyber-button-primary flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
                        >
                          <Play className="w-4 h-4" />
                          <span>Reprendre</span>
                        </button>
                      )}
                      {exam.status === "upcoming" && (
                        <button className="cyber-button-secondary rounded-xl px-6 py-3 text-sm font-medium">
                          Détails
                        </button>
                      )}
                    </div>
                  </div>
                </DashboardCard>
              ))}
            </div>
          </div>
        )}

        {/* Results View */}
        {activeTab === "results" && (
          <div className="space-y-6">
            {selectedResult === null ? (
              <>
                <h1 className="text-4xl font-serif text-black mb-6">
                  Mes Résultats
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {completedExams.map((exam) => (
                    <button
                      key={exam.id}
                      onClick={() => setSelectedResult(exam.id)}
                      className="dashboard-card dashboard-card-interactive p-6 text-left"
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="mb-2">
                            <DashboardStatusBadge status="completed" />
                          </div>
                          <h3 className="text-lg font-semibold text-[var(--cyber-text)]">
                            {exam.title}
                          </h3>
                          <p className="mt-1 text-sm text-[var(--cyber-muted-text)]">
                            {exam.subject}
                          </p>
                          <p className="mt-3 text-xs text-[var(--cyber-subtle-text)]">
                            {exam.date}
                          </p>
                        </div>
                      </div>
                      <div className="mb-4 flex items-center justify-center">
                        <ScoreRing score={exam.score!} size="lg" />
                      </div>
                      <div className="dashboard-divider mb-4" />
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-[var(--cyber-muted-text)]">
                          <span>Votre score</span>
                          <span className="font-semibold text-[var(--cyber-text)]">{exam.score}/{exam.maxScore}</span>
                        </div>
                        <div className="flex justify-between text-sm text-[var(--cyber-muted-text)]">
                          <span>Classement</span>
                          <span className="font-semibold text-[var(--cyber-text)]">#{exam.rank}</span>
                        </div>
                        <div className="flex justify-between text-sm text-[var(--cyber-muted-text)]">
                          <span>Moyenne</span>
                          <span className="font-semibold text-[var(--cyber-text)]">{exam.classAvg}%</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div>
                {(() => {
                  const exam = allExams.find((e) => e.id === selectedResult)!;
                  return (
                    <>
                      <button
                        onClick={() => setSelectedResult(null)}
                        className="flex items-center gap-2 text-[#666666] hover:text-black mb-6 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="font-medium">Retour aux résultats</span>
                      </button>

                      <DashboardCard className="p-8">
                        <div className="flex items-start justify-between mb-8">
                          <div>
                            <div className="mb-3">
                              <DashboardStatusBadge status="completed" />
                            </div>
                            <h1 className="text-3xl font-serif text-black mb-2">
                              {exam.title}
                            </h1>
                            <p className="text-lg text-[#666666] mb-4">{exam.subject}</p>
                            <div className="flex flex-wrap items-center gap-4">
                              <DashboardMetaItem icon={CalendarDays}>
                                {exam.date}
                              </DashboardMetaItem>
                              <DashboardMetaItem icon={Clock}>
                                {exam.duration} min
                              </DashboardMetaItem>
                            </div>
                          </div>
                          <div className="text-right">
                            <ScoreRing score={exam.score!} size="lg" />
                            <p className="mt-2 text-sm text-[var(--cyber-muted-text)]">Votre score</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          {[
                            { label: "Note finale", value: `${exam.score}/${exam.maxScore}` },
                            { label: "Classement", value: `#${exam.rank}` },
                            { label: "Moyenne classe", value: `${exam.classAvg}%` },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="rounded-2xl border border-[rgba(117,195,214,0.12)] bg-[rgba(11,27,38,0.58)] p-5"
                            >
                              <p className="text-sm text-[var(--cyber-muted-text)] mb-2">{item.label}</p>
                              <p className="text-3xl font-semibold text-[var(--cyber-text)]">{item.value}</p>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-xl font-bold text-black">Détails par type de question</h3>
                          {exam.types.map((type) => (
                            <div key={type} className="rounded-2xl border border-[rgba(117,195,214,0.12)] bg-[rgba(11,27,38,0.58)] p-5">
                              <div className="flex items-center justify-between mb-3">
                                <TypeChip type={type} />
                                <span className="text-sm font-semibold text-[var(--cyber-text)]">85%</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-[rgba(117,195,214,0.12)]">
                                <div className="h-2 rounded-full bg-[var(--cyber-accent)]" style={{ width: "85%" }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </DashboardCard>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Calendar View */}
        {activeTab === "calendar" && (
          <div className="space-y-6">
            <h1 className="text-4xl font-serif text-black">
              Calendrier des Examens
            </h1>

            <div className="grid gap-4">
              {calendarEvents.map((event) => (
                <DashboardCard
                  key={event.id}
                  interactive
                  className="p-6"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl border border-[rgba(117,195,214,0.14)] bg-[rgba(11,27,38,0.64)]">
                      <span className="text-sm font-medium uppercase text-[var(--cyber-subtle-text)]">{event.month.slice(0, 3)}</span>
                      <span className="text-2xl font-semibold text-[var(--cyber-text)]">{event.date}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[var(--cyber-text)] mb-1">{event.title}</h3>
                      <p className="text-sm text-[var(--cyber-muted-text)]">{event.time}</p>
                    </div>
                    <DashboardStatusBadge
                      status={event.status as "completed" | "ongoing" | "upcoming"}
                    />
                  </div>
                </DashboardCard>
              ))}
            </div>

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
        )}

        {/* Settings View */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <h1 className="text-4xl font-serif text-black mb-6">
              Paramètres
            </h1>

            <div className="flex gap-6">
              {/* Settings Sidebar */}
              <div className="dashboard-card w-64 p-4">
                <nav className="space-y-1">
                  {[
                    { id: "profile", label: "Profil", icon: User },
                    { id: "password", label: "Mot de passe", icon: Lock },
                    { id: "notifications", label: "Notifications", icon: Bell },
                    { id: "security", label: "Sécurité", icon: Shield },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setSettingsTab(tab.id as any)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all ${
                          settingsTab === tab.id
                            ? "bg-[#00809D] text-white"
                            : "text-[#666666] hover:bg-[#F5F7FB] hover:text-black"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Settings Content */}
              <div className="dashboard-card flex-1 p-8">
                {settingsTab === "profile" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif text-black mb-6">
                      Informations du profil
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Prénom</label>
                        <input
                          type="text"
                          defaultValue="Jean"
                          className="w-full bg-[#F5F7FB] border border-[#E5E5E5] rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Nom</label>
                        <input
                          type="text"
                          defaultValue="Dupont"
                          className="w-full bg-[#F5F7FB] border border-[#E5E5E5] rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue="jean.dupont@universite.fr"
                          className="w-full bg-[#F5F7FB] border border-[#E5E5E5] rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Téléphone</label>
                        <input
                          type="tel"
                          defaultValue="+33 6 12 34 56 78"
                          className="w-full bg-[#F5F7FB] border border-[#E5E5E5] rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-black mb-2">Établissement</label>
                        <input
                          type="text"
                          defaultValue="Université Paris-Saclay"
                          readOnly
                          className="w-full bg-[#F5F7FB] border border-[#E5E5E5] rounded-xl px-4 py-3 text-[#666666] cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <button className="px-6 py-3 bg-[#00809D] hover:bg-[#1C1C1C] text-white font-bold rounded-xl transition-all flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        <span>Enregistrer</span>
                      </button>
                    </div>
                  </div>
                )}

                {settingsTab === "password" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif text-black mb-6">
                      Changer le mot de passe
                    </h2>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Mot de passe actuel</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="w-full bg-[#F5F7FB] border border-[#E5E5E5] rounded-xl px-4 py-3 pr-12 text-black focus:outline-none focus:ring-2 focus:ring-black"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666666] hover:text-black"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Nouveau mot de passe</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            className="w-full bg-[#F5F7FB] border border-[#E5E5E5] rounded-xl px-4 py-3 pr-12 text-black focus:outline-none focus:ring-2 focus:ring-black"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666666] hover:text-black"
                          >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">Confirmer le mot de passe</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full bg-[#F5F7FB] border border-[#E5E5E5] rounded-xl px-4 py-3 pr-12 text-black focus:outline-none focus:ring-2 focus:ring-black"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666666] hover:text-black"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <button className="px-6 py-3 bg-[#00809D] hover:bg-[#1C1C1C] text-white font-bold rounded-xl transition-all">
                        Mettre à jour le mot de passe
                      </button>
                    </div>
                  </div>
                )}

                {settingsTab === "notifications" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif text-black mb-6">
                      Préférences de notification
                    </h2>
                    <div className="space-y-5">
                      {[
                        { key: "examReminders", label: "Rappels d'examen", desc: "Recevoir des notifications avant chaque examen" },
                        { key: "resultNotifications", label: "Notifications de résultats", desc: "Être averti lorsque les résultats sont publiés" },
                        { key: "systemUpdates", label: "Mises à jour système", desc: "Recevoir les annonces et mises à jour de la plateforme" },
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between p-5 bg-[#F5F7FB] rounded-xl">
                          <div className="flex-1">
                            <p className="font-semibold text-black mb-1">{setting.label}</p>
                            <p className="text-sm text-[#666666]">{setting.desc}</p>
                          </div>
                          <button
                            onClick={() =>
                              setNotificationSettings((prev) => ({
                                ...prev,
                                [setting.key]: !prev[setting.key as keyof typeof prev],
                              }))
                            }
                            className={`relative w-12 h-6 rounded-full transition-all ${
                              notificationSettings[setting.key as keyof typeof notificationSettings]
                                ? "bg-[#00809D]"
                                : "bg-[#E5E5E5]"
                            }`}
                          >
                            <div
                              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                                notificationSettings[setting.key as keyof typeof notificationSettings]
                                  ? "right-0.5"
                                  : "left-0.5"
                              }`}
                            ></div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {settingsTab === "security" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif text-black mb-6">
                      Sécurité du compte
                    </h2>
                    <div className="space-y-5">
                      <div className="p-5 bg-[#F5F7FB] rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                              <Shield className="w-5 h-5 text-black" />
                            </div>
                            <div>
                              <p className="font-semibold text-black">Authentification à deux facteurs</p>
                              <p className="text-sm text-[#666666]">Ajouter une couche de sécurité supplémentaire</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-[#00809D] text-white text-sm font-bold rounded-lg hover:bg-[#1C1C1C] transition-all">
                            Activer
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-black mb-3">Sessions actives</h3>
                        <div className="space-y-3">
                          {[
                            { device: "MacBook Pro", location: "Paris, France", current: true, icon: Monitor },
                            { device: "iPhone 14", location: "Paris, France", current: false, icon: Smartphone },
                          ].map((session, idx) => {
                            const Icon = session.icon;
                            return (
                              <div key={idx} className="flex items-center justify-between p-4 bg-[#F5F7FB] rounded-xl">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-black" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-black text-sm">
                                      {session.device}
                                      {session.current && (
                                        <span className="ml-2 px-2 py-0.5 bg-[#00809D] text-white text-xs rounded-full">
                                          Actuelle
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-xs text-[#666666]">{session.location}</p>
                                  </div>
                                </div>
                                {!session.current && (
                                  <button className="text-sm text-[#666666] hover:text-black font-medium">
                                    Révoquer
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="p-5 bg-[#F5F7FB] border border-[#E5E5E5] rounded-xl">
                        <p className="font-semibold text-black mb-2">Supprimer le compte</p>
                        <p className="text-sm text-[#666666] mb-4">
                          Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                        </p>
                        <button className="px-4 py-2 bg-white border border-black text-black text-sm font-bold rounded-lg hover:bg-[#00809D] hover:text-white transition-all">
                          Supprimer mon compte
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Exam Lock Modal */}
      {showExamLock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00809D]/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full border-2 border-[#E5E5E5] shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#F5F7FB] rounded-full flex items-center justify-center mb-4">
                <ShieldAlert className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-2xl font-serif text-black mb-3">
                Mode Examen Sécurisé
              </h2>
              <p className="text-[#666666] mb-6">
                En rejoignant cet examen, votre session sera verrouillée. Vous ne pourrez pas quitter la page ou changer d'onglet sans déclencher une alerte.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowExamLock(false)}
                  className="flex-1 px-4 py-3 bg-white border border-[#E5E5E5] text-black font-medium rounded-xl hover:border-black transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmJoinExam}
                  className="flex-1 px-4 py-3 bg-[#00809D] text-white font-bold rounded-xl hover:bg-[#1C1C1C] transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Rejoindre</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
