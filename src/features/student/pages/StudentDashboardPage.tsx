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
  ChevronDown,
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
  Search,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router";
import { GridBackground } from "@/shared/components/GridBackground";
import { Logo } from "@/shared/components/BrandLogo";
import { NotificationPanel } from "@/shared/components/NotificationPanel";
import { ToggleSwitch } from "@/shared/components/ToggleSwitch";
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
  const [examSearchQuery, setExamSearchQuery] = useState("");
  const [examTypeFilter, setExamTypeFilter] = useState<string>("all");

  const [resultSearchQuery, setResultSearchQuery] = useState("");
  const [resultStatusFilter, setResultStatusFilter] = useState<string>("all");
  const [resultScoreFilter, setResultScoreFilter] = useState<string>("all");

  const [calendarSearchQuery, setCalendarSearchQuery] = useState("");
  const [calendarMonthFilter, setCalendarMonthFilter] = useState<string>("all");
  const [calendarSubjectFilter, setCalendarSubjectFilter] = useState<string>("all");
  const [calendarTypeFilter, setCalendarTypeFilter] = useState<string>("all");
  const [selectedResult, setSelectedResult] = useState<number | null>(null);
  const [settingsTab, setSettingsTab] = useState<"profile" | "password" | "notifications" | "security">("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showExamLock, setShowExamLock] = useState(false);
  const [targetExamId, setTargetExamId] = useState<number | null>(null);
  const [expandedExam, setExpandedExam] = useState<number | null>(null);

  useEffect(() => {
    const anyModalOpen = selectedResult !== null || showExamLock;
    if (anyModalOpen) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = previous; };
    }
  }, [selectedResult, showExamLock]);

  const handleLogoClick = () => {
    setActiveTab("dashboard");
    setExamFilter("all");
    setExamSearchQuery("");
    setExamTypeFilter("all");
    setResultSearchQuery("");
    setResultStatusFilter("all");
    setResultScoreFilter("all");
    setCalendarSearchQuery("");
    setCalendarMonthFilter("all");
    setCalendarSubjectFilter("all");
    setCalendarTypeFilter("all");
    setSelectedResult(null);
    setSettingsTab("profile");
    setShowExamLock(false);
    setTargetExamId(null);
    setExpandedExam(null);
  };

  const handleJoinExam = (examId: number) => {
    setTargetExamId(examId);
    setShowExamLock(true);
  };

  const confirmJoinExam = async () => {
    if (targetExamId) {
      try {
        const el = document.documentElement as any;
        const requestFs = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (requestFs) {
          await requestFs.call(el, { navigationUI: "hide" });
        }
      } catch (err) {
        console.warn("Fullscreen request failed", err);
      }
      navigate(`/exam/${targetExamId}`);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const activeExam = allExams.find((e) => e.status === "ongoing");
  const completedExams = allExams.filter((e) => e.status === "completed");

  const filteredExams = allExams.filter((exam) => {
    const matchesStatus = examFilter === "all" || exam.status === examFilter;
    const matchesSearch = !examSearchQuery || exam.title.toLowerCase().includes(examSearchQuery.toLowerCase()) || exam.subject.toLowerCase().includes(examSearchQuery.toLowerCase());
    const matchesType = examTypeFilter === "all" || exam.types.includes(examTypeFilter);
    return matchesStatus && matchesSearch && matchesType;
  });

  const filteredResults = completedExams.filter((exam) => {
    const matchesSearch = !resultSearchQuery || exam.title.toLowerCase().includes(resultSearchQuery.toLowerCase()) || exam.subject.toLowerCase().includes(resultSearchQuery.toLowerCase());
    const note = exam.score!;
    const matchesScore = resultScoreFilter === "all" ||
      (resultScoreFilter === "0-10" && note < 10) ||
      (resultScoreFilter === "10-20" && note >= 10);
    const matchesStatus = resultStatusFilter === "all" ||
      (resultStatusFilter === "success" && note >= 10) ||
      (resultStatusFilter === "fail" && note < 10);
    return matchesSearch && matchesScore && matchesStatus;
  });

  const filteredCalendar = calendarEvents.filter((event) => {
    const examMatch = allExams.find(e => e.title === event.title);
    const types = examMatch ? examMatch.types : [];
    const subject = examMatch ? examMatch.subject : "";
    
    const matchesSearch = !calendarSearchQuery || event.title.toLowerCase().includes(calendarSearchQuery.toLowerCase()) || event.date.toLowerCase().includes(calendarSearchQuery.toLowerCase()) || event.month.toLowerCase().includes(calendarSearchQuery.toLowerCase());
    const matchesMonth = calendarMonthFilter === "all" || event.month.toLowerCase() === calendarMonthFilter.toLowerCase();
    const matchesSubject = calendarSubjectFilter === "all" || subject === calendarSubjectFilter;
    const matchesType = calendarTypeFilter === "all" || types.includes(calendarTypeFilter);
    
    return matchesSearch && matchesMonth && matchesSubject && matchesType;
  });

  const FilterPill = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
        active
          ? "bg-[#00809D] text-white"
          : "bg-white border border-[#E5E5E5] text-[#666666] hover:text-black hover:border-black shadow-sm"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="cyber-dashboard-page relative min-h-screen overflow-hidden bg-[#FAFAFA]">
      <GridBackground variant="dashboard" />
      <div className="relative z-10">
      {/* Header */}
      <header className="cyber-topbar sticky top-0 z-50 bg-white border-b border-[#E5E5E5]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 sm:px-6 lg:h-16 lg:flex-row lg:items-center lg:justify-between lg:py-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
            <Logo size="sm" onClick={handleLogoClick} />
            <nav className="flex items-center gap-2 overflow-x-auto pt-2 pb-2 px-1 -ml-1 lg:gap-6">
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
                    className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
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

          <div className="flex items-center justify-between gap-3 sm:justify-end sm:gap-4">
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
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {/* Welcome Header */}
        {activeTab === "dashboard" && (
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-[var(--cyber-text)] sm:text-4xl">Bonjour, Jean</h1>
            <p className="text-base text-[var(--cyber-muted-text)] sm:text-lg">Bienvenue sur votre tableau de bord</p>
          </div>
        )}

        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          allExams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in duration-700 slide-in-from-bottom-4 mt-4 bg-white border border-[#E5E5E5] rounded-3xl shadow-sm">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-[#00809D] blur-3xl opacity-20 rounded-full animate-pulse"></div>
                <div className="relative w-32 h-32 bg-[#F5F7FB] rounded-3xl border border-[#E5E5E5] flex items-center justify-center shadow-lg rotate-3 transition-transform hover:rotate-6">
                  <Hash className="w-12 h-12 text-[#00809D]" />
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#00809D] rounded-xl flex items-center justify-center shadow-lg -rotate-12 animate-bounce" style={{ animationDuration: '3s' }}>
                  <Plus className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-black mb-4">
                Aucun examen pour le moment
              </h2>
              
              <p className="text-lg text-[#666666] max-w-lg mx-auto mb-10 leading-relaxed">
                Vous n'êtes inscrit à aucun examen. Pour commencer, vous devez rejoindre un examen en utilisant le code fourni par votre enseignant.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#F5F7FB] border border-[#E5E5E5] rounded-2xl p-2 pl-6 pr-2 shadow-sm">
                <span className="text-sm font-medium text-[#666666]">
                  Étape 1 : Cliquez sur le bouton
                </span>
                <div className="hidden sm:block w-8 h-px bg-[#E5E5E5]"></div>
                <button
                  onClick={() => { setShowJoinCode(true); setJoinStep("input"); setExamCode(""); setJoinError(""); }}
                  className="flex items-center gap-2 px-6 py-3 bg-[#00809D] hover:bg-[#006B82] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  <span>Rejoindre un examen</span>
                </button>
              </div>
            </div>
          ) : (
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
                    <h2 className="text-2xl font-semibold text-[var(--cyber-text)] sm:text-3xl">
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
                  <div className="flex flex-col items-start lg:self-stretch lg:items-end">
                    <button
                      onClick={() => handleJoinExam(activeExam.id)}
                      className="cyber-button-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold lg:mt-auto"
                    >
                      <Play className="w-4 h-4" />
                      <span>Rejoindre l&apos;examen</span>
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
                <h2 className="text-xl font-serif text-black sm:text-2xl">
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
                    <ScoreRing score={16.8} size="lg" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-[var(--cyber-muted-text)]">
                      <span>Moyenne de la classe</span>
                      <span className="font-semibold text-[var(--cyber-text)]">15.6/20</span>
                    </div>
                    <div className="dashboard-divider" />
                    <div className="flex items-center gap-2 text-sm text-[var(--cyber-muted-text)]">
                      <ArrowUp className="w-4 h-4 text-[var(--cyber-accent-strong)]" />
                      <span>+1.2 pts au-dessus de la moyenne</span>
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
          )
        )}

        {/* Exams View */}
        {activeTab === "exams" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-serif text-black sm:text-4xl">
                Mes Examens
              </h1>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="relative w-full lg:flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                <input
                  type="text"
                  placeholder="Rechercher un examen..."
                  value={examSearchQuery}
                  onChange={(e) => setExamSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#E5E5E5] rounded-xl pl-11 pr-11 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
                />
                {examSearchQuery && (
                  <button onClick={() => setExamSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666666] hover:text-black">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
                <div className="relative min-w-[150px]">
                  <select
                    value={examFilter}
                    onChange={(e) => setExamFilter(e.target.value as any)}
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
                    value={examTypeFilter}
                    onChange={(e) => setExamTypeFilter(e.target.value)}
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

            {/* Exam List */}
            {allExams.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white border border-[#E5E5E5] rounded-3xl shadow-sm animate-in fade-in">
                <div className="w-20 h-20 bg-[#F5F7FB] rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  <Hash className="w-8 h-8 text-[#00809D]" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Prêt à passer un examen ?</h3>
                <p className="text-[#666666] max-w-md mx-auto mb-8">
                  Rejoignez votre premier examen en utilisant le code fourni par votre professeur.
                </p>
                <button
                  onClick={() => { setShowJoinCode(true); setJoinStep("input"); setExamCode(""); setJoinError(""); }}
                  className="flex items-center gap-2 px-6 py-3 bg-[#00809D] hover:bg-[#006B82] text-white font-bold rounded-xl transition-all shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  <span>Rejoindre un examen</span>
                </button>
              </div>
            ) : filteredExams.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white border border-[#E5E5E5] rounded-2xl">
                <Search className="w-12 h-12 text-[#E5E5E5] mb-4" />
                <h3 className="text-lg font-bold text-black mb-1">Aucun résultat trouvé</h3>
                <p className="text-[#666666]">Essayez de modifier vos filtres ou votre recherche.</p>
              </div>
            ) : (
              <div className="grid gap-5">
                {filteredExams.map((exam) => (
                  <DashboardCard
                    key={exam.id}
                  interactive
                  className="p-6 transition-all duration-300"
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
                          <ScoreRing score={exam.score} size="lg" variant="out-of-20" />
                        </div>
                      )}
                      {exam.status === "ongoing" && (
                        <button
                          onClick={() => handleJoinExam(exam.id)}
                          className="cyber-button-primary flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
                        >
                          <Play className="w-4 h-4" />
                          <span>Rejoindre</span>
                        </button>
                      )}
                      {exam.status === "upcoming" && (
                        <button 
                          onClick={() => setExpandedExam(expandedExam === exam.id ? null : exam.id)}
                          className="cyber-button-secondary rounded-xl px-6 py-3 text-sm font-medium"
                        >
                          {expandedExam === exam.id ? "Masquer" : "Détails"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details section */}
                  {expandedExam === exam.id && exam.status === "upcoming" && (
                    <div className="mt-6 pt-6 border-t border-[rgba(117,195,214,0.12)] grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-[rgba(117,195,214,0.08)] text-[var(--cyber-accent-strong)]">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[var(--cyber-subtle-text)] uppercase tracking-wider mb-1">Professeur</p>
                          <p className="text-sm font-medium text-[var(--cyber-text)]">Dr. Alan Turing</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-[rgba(117,195,214,0.08)] text-[var(--cyber-accent-strong)]">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[var(--cyber-subtle-text)] uppercase tracking-wider mb-1">Description</p>
                          <p className="text-sm font-medium text-[var(--cyber-text)]">Cet examen couvrira l'ensemble des chapitres abordés ce semestre. Les documents ne sont pas autorisés.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </DashboardCard>
              ))}
            </div>
            )}
          </div>
        )}

        {/* Results View */}
        {activeTab === "results" && (
          <div className="space-y-6">
            <h1 className="mb-6 text-3xl font-serif text-black sm:text-4xl">
              Mes Résultats
            </h1>

                {/* Search and Filters */}
                <div className="flex flex-col lg:flex-row items-center gap-4 mb-6">
                  <div className="relative w-full lg:flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                    <input
                      type="text"
                      placeholder="Rechercher un résultat..."
                      value={resultSearchQuery}
                      onChange={(e) => setResultSearchQuery(e.target.value)}
                      className="w-full bg-white border border-[#E5E5E5] rounded-xl pl-11 pr-11 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
                    />
                    {resultSearchQuery && (
                      <button onClick={() => setResultSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666666] hover:text-black">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
                    <div className="relative min-w-[150px]">
                      <select
                        value={resultStatusFilter}
                        onChange={(e) => setResultStatusFilter(e.target.value)}
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
                        value={resultScoreFilter}
                        onChange={(e) => setResultScoreFilter(e.target.value)}
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
                          <span>Votre note</span>
                          <span className="font-semibold text-[var(--cyber-text)]">{exam.score!.toFixed(1)}/20</span>
                        </div>
                        <div className="flex justify-between text-sm text-[var(--cyber-muted-text)]">
                          <span>Classement</span>
                          <span className="font-semibold text-[var(--cyber-text)]">#{exam.rank}</span>
                        </div>
                        <div className="flex justify-between text-sm text-[var(--cyber-muted-text)]">
                          <span>Moyenne</span>
                          <span className="font-semibold text-[var(--cyber-text)]">{exam.classAvg!.toFixed(1)}/20</span>
                        </div>
                      </div>
                    </button>
                  ))}
                  </div>
                )}
            
            {/* Modal Overlay for Selected Result */}
            {selectedResult !== null && (() => {
              const exam = allExams.find((e) => e.id === selectedResult)!;
              return (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="absolute inset-0" onClick={() => setSelectedResult(null)}></div>
                  <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-2xl animate-in zoom-in-95 duration-200">
                    <DashboardCard className="p-5 sm:p-6 relative">
                        <div className="flex items-start justify-between mb-5">
                          <div>
                            <div className="mb-2">
                              <DashboardStatusBadge status="completed" />
                            </div>
                            <h1 className="text-2xl font-serif text-black mb-1">
                              {exam.title}
                            </h1>
                            <p className="text-base text-[#666666] mb-3">{exam.subject}</p>
                            <div className="flex flex-wrap items-center gap-3">
                              <DashboardMetaItem icon={CalendarDays}>
                                {exam.date}
                              </DashboardMetaItem>
                              <DashboardMetaItem icon={Clock}>
                                {exam.duration} min
                              </DashboardMetaItem>
                            </div>
                          </div>
                          <div className="text-right">
                            <ScoreRing score={exam.score!} size="md" />
                            <p className="mt-1 text-xs text-[var(--cyber-muted-text)]">Votre note</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                          {[
                            { label: "Note finale", value: `${exam.score!.toFixed(1)}/20` },
                            { label: "Classement", value: `#${exam.rank}` },
                            { label: "Moyenne classe", value: `${exam.classAvg!.toFixed(1)}/20` },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="rounded-2xl border border-[rgba(117,195,214,0.12)] bg-[rgba(11,27,38,0.58)] p-4"
                            >
                              <p className="text-xs text-[var(--cyber-muted-text)] mb-1">{item.label}</p>
                              <p className="text-xl font-semibold text-[var(--cyber-text)] sm:text-2xl">{item.value}</p>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-lg font-bold text-black">Détails par type</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {exam.types.map((type) => (
                              <div key={type} className="rounded-2xl border border-[rgba(117,195,214,0.12)] bg-[rgba(11,27,38,0.58)] p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <TypeChip type={type} />
                                  <span className="text-sm font-semibold text-[var(--cyber-text)]">17/20</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-[rgba(117,195,214,0.12)]">
                                  <div className="h-1.5 rounded-full bg-[var(--cyber-accent)]" style={{ width: "85%" }}></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </DashboardCard>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Calendar View */}
        {activeTab === "calendar" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-serif text-black sm:text-4xl">
              Calendrier des Examens
            </h1>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="relative w-full lg:flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                <input
                  type="text"
                  placeholder="Rechercher par examen ou date..."
                  value={calendarSearchQuery}
                  onChange={(e) => setCalendarSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#E5E5E5] rounded-xl pl-11 pr-11 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
                />
                {calendarSearchQuery && (
                  <button onClick={() => setCalendarSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666666] hover:text-black">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
                <div className="relative min-w-[140px]">
                  <select
                    value={calendarMonthFilter}
                    onChange={(e) => setCalendarMonthFilter(e.target.value)}
                    className="w-full appearance-none bg-white border border-[#E5E5E5] text-[#666666] font-medium text-sm rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-black shadow-sm cursor-pointer hover:border-black hover:text-black transition-colors"
                  >
                    <option value="all">Tous les mois</option>
                    <option value="mars">Mars</option>
                    <option value="avril">Avril</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666] pointer-events-none" />
                </div>
                <div className="relative min-w-[160px]">
                  <select
                    value={calendarSubjectFilter}
                    onChange={(e) => setCalendarSubjectFilter(e.target.value)}
                    className="w-full appearance-none bg-white border border-[#E5E5E5] text-[#666666] font-medium text-sm rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-black shadow-sm cursor-pointer hover:border-black hover:text-black transition-colors"
                  >
                    <option value="all">Tous les modules</option>
                    {Array.from(new Set(allExams.map(e => e.subject))).slice(0, 3).map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666] pointer-events-none" />
                </div>
                <div className="relative min-w-[140px]">
                  <select
                    value={calendarTypeFilter}
                    onChange={(e) => setCalendarTypeFilter(e.target.value)}
                    className="w-full appearance-none bg-white border border-[#E5E5E5] text-[#666666] font-medium text-sm rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-black shadow-sm cursor-pointer hover:border-black hover:text-black transition-colors"
                  >
                    <option value="all">Tous les types</option>
                    <option value="mcq">QCM</option>
                    <option value="code">Code</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666] pointer-events-none" />
                </div>
              </div>
            </div>

            {filteredCalendar.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white border border-[#E5E5E5] rounded-2xl">
                <Search className="w-12 h-12 text-[#E5E5E5] mb-4" />
                <h3 className="text-lg font-bold text-black mb-1">Aucun résultat trouvé</h3>
                <p className="text-[#666666]">Essayez de modifier vos filtres ou votre recherche.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredCalendar.map((event) => (
                  <DashboardCard
                  key={event.id}
                  interactive
                  className="p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
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
        )}

        {/* Settings View */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <h1 className="mb-6 text-3xl font-serif text-black sm:text-4xl">
              Paramètres
            </h1>

            <div className="flex flex-col gap-6 xl:flex-row">
              {/* Settings Sidebar */}
              <div className="dashboard-card w-full shrink-0 p-4 xl:w-64">
                <nav className="grid grid-cols-2 gap-1 sm:grid-cols-4 xl:grid-cols-1">
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
              <div className="dashboard-card min-w-0 flex-1 p-5 sm:p-8">
                {settingsTab === "profile" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif text-black mb-6">
                      Informations du profil
                    </h2>
                    
                    {/* Profile Picture Section */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#E5E5E5] mb-6">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-[#F5F7FB] border-2 border-[#E5E5E5] flex items-center justify-center overflow-hidden">
                          <User className="w-10 h-10 text-[#666666]" />
                        </div>
                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity duration-200">
                          <Camera className="w-6 h-6" />
                          <input type="file" className="hidden" accept="image/*" />
                        </label>
                      </div>
                      <div className="text-center sm:text-left">
                        <h3 className="text-lg font-bold text-black">Photo de profil</h3>
                        <p className="text-sm text-[#666666] mt-1 mb-3">
                          JPG, GIF ou PNG. Taille maximale de 800 Ko.
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-3">
                          <label className="px-4 py-2 bg-[#F5F7FB] hover:bg-[#E5E5E5] text-black text-sm font-semibold rounded-lg transition-colors border border-[#E5E5E5] cursor-pointer">
                            Changer
                            <input type="file" className="hidden" accept="image/*" />
                          </label>
                          <button className="px-4 py-2 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-lg transition-colors">
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
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
                    <div className="flex justify-stretch pt-4 sm:justify-end">
                      <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00809D] px-6 py-3 font-bold text-white transition-all hover:bg-[#1C1C1C] sm:w-auto">
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
                    <div className="flex justify-stretch pt-4 sm:justify-end">
                      <button className="w-full rounded-xl bg-[#00809D] px-6 py-3 font-bold text-white transition-all hover:bg-[#1C1C1C] sm:w-auto">
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
                        { key: "examReminders", label: "Rappels d'examen", desc: "Recevoir des notifications avant chaque examen", default: true },
                        { key: "resultNotifications", label: "Notifications de résultats", desc: "Être averti lorsque les résultats sont publiés", default: true },
                        { key: "systemUpdates", label: "Mises à jour système", desc: "Recevoir les annonces et mises à jour de la plateforme", default: false },
                      ].map((setting) => (
                        <div key={setting.key} className="flex flex-col gap-4 rounded-xl bg-[#F5F7FB] p-5 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-black mb-1">{setting.label}</p>
                            <p className="text-sm text-[#666666]">{setting.desc}</p>
                          </div>
                          <ToggleSwitch defaultChecked={setting.default} />
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
                        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                              <div key={idx} className="flex flex-col gap-4 rounded-xl bg-[#F5F7FB] p-4 sm:flex-row sm:items-center sm:justify-between">
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
          <div className="w-full max-w-md rounded-2xl border-2 border-[#E5E5E5] bg-white p-5 shadow-2xl sm:p-8">
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
              <div className="flex w-full flex-col gap-3 sm:flex-row">
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
