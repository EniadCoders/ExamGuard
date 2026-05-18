import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { GridBackground } from "@/shared/components/GridBackground";
import {
  fetchDashboard,
  joinExamByCode,
  fetchAttempt,
  type DashboardExam,
  type DashboardStat,
  type CalendarEvent,
  type DashboardUser,
  type DashboardPerformance,
  type AttemptResult,
} from "@/features/student/api";
import { ApiError } from "@/shared/lib/api";
import { updateProfile, logout } from "@/features/auth/api";

import {
  StudentDashboardHeader,
  type StudentTab,
} from "@/features/student/components/StudentDashboardHeader";
import { DashboardOverview } from "@/features/student/components/views/DashboardOverview";
import {
  ExamsList,
  type ExamStatusFilter,
} from "@/features/student/components/views/ExamsList";
import { ResultsList } from "@/features/student/components/views/ResultsList";
import { CalendarView } from "@/features/student/components/views/CalendarView";
import {
  SettingsView,
  type SettingsTab,
} from "@/features/student/components/views/SettingsView";
import { JoinExamModal } from "@/features/student/components/modals/JoinExamModal";
import { ExamLockModal } from "@/features/student/components/modals/ExamLockModal";
import { TwoFactorConfirmModal } from "@/features/student/components/modals/TwoFactorConfirmModal";
import { RevokeSessionModal } from "@/features/student/components/modals/RevokeSessionModal";
import type { ProfileMessage } from "@/features/student/components/settings/ProfileSettings";

export function StudentDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<StudentTab>("dashboard");
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("profile");

  const [allExams, setAllExams] = useState<DashboardExam[]>([]);
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [performance, setPerformance] = useState<DashboardPerformance | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Filters
  const [examFilter, setExamFilter] = useState<ExamStatusFilter>("all");
  const [examSearchQuery, setExamSearchQuery] = useState("");
  const [examTypeFilter, setExamTypeFilter] = useState<string>("all");
  const [expandedExam, setExpandedExam] = useState<string | null>(null);

  const [resultSearchQuery, setResultSearchQuery] = useState("");
  const [resultStatusFilter, setResultStatusFilter] = useState<string>("all");
  const [resultScoreFilter, setResultScoreFilter] = useState<string>("all");
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [attemptDetail, setAttemptDetail] = useState<AttemptResult | null>(null);
  const [attemptDetailLoading, setAttemptDetailLoading] = useState(false);

  const [calendarSearchQuery, setCalendarSearchQuery] = useState("");
  const [calendarMonthFilter, setCalendarMonthFilter] = useState<string>("all");
  const [calendarSubjectFilter, setCalendarSubjectFilter] = useState<string>("all");
  const [calendarTypeFilter, setCalendarTypeFilter] = useState<string>("all");

  // Join-by-code modal
  const [showJoinCode, setShowJoinCode] = useState(false);
  const [joinStep, setJoinStep] = useState<"input" | "success">("input");
  const [examCode, setExamCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinedExamTitle, setJoinedExamTitle] = useState("");

  // Exam lock modal
  const [showExamLock, setShowExamLock] = useState(false);
  const [targetExamId, setTargetExamId] = useState<string | null>(null);

  // Settings modals
  const [show2FAPopup, setShow2FAPopup] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [sessionToRevoke, setSessionToRevoke] = useState<string | null>(null);
  const [activeSessionsList, setActiveSessionsList] = useState(["MacBook Pro", "iPhone 14"]);

  // Profile form state
  const [profileFirstName, setProfileFirstName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileSchool, setProfileSchool] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<ProfileMessage | null>(null);

  useEffect(() => {
    if (!user) return;
    setProfileFirstName(user.firstName ?? "");
    setProfileLastName(user.lastName ?? "");
    setProfilePhone(user.phone ?? "");
    setProfileSchool(user.school ?? "");
  }, [user]);

  const refreshDashboard = useCallback(() => {
    return fetchDashboard().then((data) => {
      setUser(data.user);
      setAllExams(data.exams);
      setStats(data.stats);
      setPerformance(data.performance);
      setCalendarEvents(data.calendarEvents);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchDashboard()
      .then((data) => {
        if (cancelled) return;
        setUser(data.user);
        setAllExams(data.exams);
        setStats(data.stats);
        setPerformance(data.performance);
        setCalendarEvents(data.calendarEvents);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err?.status === 401) navigate("/");
      })
      .finally(() => {
        if (!cancelled) setDashboardLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  useEffect(() => {
    if (!selectedResult) {
      setAttemptDetail(null);
      return;
    }
    const exam = allExams.find((e) => e.id === selectedResult);
    if (!exam?.attemptId) {
      setAttemptDetail(null);
      return;
    }
    let cancelled = false;
    setAttemptDetailLoading(true);
    fetchAttempt(exam.attemptId)
      .then((d) => {
        if (!cancelled) setAttemptDetail(d);
      })
      .catch(() => {
        if (!cancelled) setAttemptDetail(null);
      })
      .finally(() => {
        if (!cancelled) setAttemptDetailLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedResult, allExams]);

  const hasExams = !dashboardLoading && allExams.length > 0;

  useEffect(() => {
    if (dashboardLoading) return;
    if (!hasExams && activeTab !== "dashboard" && activeTab !== "settings") {
      setActiveTab("dashboard");
    }
  }, [dashboardLoading, hasExams, activeTab]);

  useEffect(() => {
    const anyModalOpen = selectedResult !== null || showExamLock;
    if (anyModalOpen) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [selectedResult, showExamLock]);

  const completedExams = useMemo(
    () => allExams.filter((e) => e.status === "completed"),
    [allExams],
  );

  const filteredExams = useMemo(() => {
    return allExams.filter((exam) => {
      const matchesStatus = examFilter === "all" || exam.status === examFilter;
      const matchesSearch =
        !examSearchQuery ||
        exam.title.toLowerCase().includes(examSearchQuery.toLowerCase()) ||
        exam.subject.toLowerCase().includes(examSearchQuery.toLowerCase());
      const matchesType = examTypeFilter === "all" || exam.types.includes(examTypeFilter);
      return matchesStatus && matchesSearch && matchesType;
    });
  }, [allExams, examFilter, examSearchQuery, examTypeFilter]);

  const filteredResults = useMemo(() => {
    return completedExams.filter((exam) => {
      const matchesSearch =
        !resultSearchQuery ||
        exam.title.toLowerCase().includes(resultSearchQuery.toLowerCase()) ||
        exam.subject.toLowerCase().includes(resultSearchQuery.toLowerCase());
      const note = exam.score!;
      const matchesScore =
        resultScoreFilter === "all" ||
        (resultScoreFilter === "0-10" && note < 10) ||
        (resultScoreFilter === "10-20" && note >= 10);
      const matchesStatus =
        resultStatusFilter === "all" ||
        (resultStatusFilter === "success" && note >= 10) ||
        (resultStatusFilter === "fail" && note < 10);
      return matchesSearch && matchesScore && matchesStatus;
    });
  }, [completedExams, resultSearchQuery, resultScoreFilter, resultStatusFilter]);

  const filteredCalendar = useMemo(() => {
    return calendarEvents.filter((event) => {
      const examMatch = allExams.find((e) => e.title === event.title);
      const types = examMatch ? examMatch.types : [];
      const subject = examMatch ? examMatch.subject : "";

      const matchesSearch =
        !calendarSearchQuery ||
        event.title.toLowerCase().includes(calendarSearchQuery.toLowerCase()) ||
        event.date.toLowerCase().includes(calendarSearchQuery.toLowerCase()) ||
        event.month.toLowerCase().includes(calendarSearchQuery.toLowerCase());
      const matchesMonth =
        calendarMonthFilter === "all" || event.month.toLowerCase() === calendarMonthFilter.toLowerCase();
      const matchesSubject = calendarSubjectFilter === "all" || subject === calendarSubjectFilter;
      const matchesType = calendarTypeFilter === "all" || types.includes(calendarTypeFilter);

      return matchesSearch && matchesMonth && matchesSubject && matchesType;
    });
  }, [
    calendarEvents,
    allExams,
    calendarSearchQuery,
    calendarMonthFilter,
    calendarSubjectFilter,
    calendarTypeFilter,
  ]);

  const selectedExam = useMemo(
    () => (selectedResult ? allExams.find((e) => e.id === selectedResult) : undefined),
    [selectedResult, allExams],
  );

  const openJoinCode = useCallback(() => {
    setShowJoinCode(true);
    setJoinStep("input");
    setExamCode("");
    setJoinError("");
  }, []);

  const handleSubmitJoinCode = useCallback(async () => {
    setJoinError("");
    setJoinLoading(true);
    try {
      const { exam } = await joinExamByCode(examCode);
      setJoinedExamTitle(exam.title);
      setJoinStep("success");
      await refreshDashboard();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) setJoinError("Code invalide.");
        else if (err.status === 400) setJoinError("Veuillez saisir un code.");
        else setJoinError("Impossible de rejoindre l'examen. Réessayez.");
      } else {
        setJoinError("Erreur de connexion.");
      }
    } finally {
      setJoinLoading(false);
    }
  }, [examCode, refreshDashboard]);

  const handleCloseJoinCode = useCallback(() => {
    setShowJoinCode(false);
    setJoinStep("input");
    setExamCode("");
  }, []);

  const handleSaveProfile = useCallback(async () => {
    setProfileSaving(true);
    setProfileMessage(null);
    try {
      const updated = await updateProfile({
        fullName: `${profileFirstName.trim()} ${profileLastName.trim()}`.trim(),
        phone: profilePhone.trim(),
        school: profileSchool,
      });
      setUser((prev) =>
        prev
          ? {
              ...prev,
              fullName: updated.fullName,
              firstName: profileFirstName.trim(),
              lastName: profileLastName.trim(),
              phone: updated.phone,
              school: updated.school,
            }
          : prev,
      );
      setProfileMessage({ kind: "ok", text: "Profil enregistré." });
    } catch (err) {
      setProfileMessage({
        kind: "err",
        text: err instanceof ApiError ? err.message : "Échec de l'enregistrement.",
      });
    } finally {
      setProfileSaving(false);
    }
  }, [profileFirstName, profileLastName, profilePhone, profileSchool]);

  const handleLogoClick = useCallback(() => {
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
  }, []);

  const handleJoinExam = useCallback((examId: string) => {
    setTargetExamId(examId);
    setShowExamLock(true);
  }, []);

  const confirmJoinExam = useCallback(async () => {
    if (!targetExamId) return;
    try {
      const el = document.documentElement as HTMLElement & {
        webkitRequestFullscreen?: () => Promise<void>;
        mozRequestFullScreen?: () => Promise<void>;
        msRequestFullscreen?: () => Promise<void>;
      };
      const requestFs =
        el.requestFullscreen ||
        el.webkitRequestFullscreen ||
        el.mozRequestFullScreen ||
        el.msRequestFullscreen;
      if (requestFs) {
        await requestFs.call(el, { navigationUI: "hide" } as FullscreenOptions);
      }
    } catch (err) {
      console.warn("Fullscreen request failed", err);
    }
    navigate(`/exam/${targetExamId}`);
  }, [navigate, targetExamId]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [navigate]);

  const handleToggleExpandExam = useCallback((examId: string) => {
    setExpandedExam((prev) => (prev === examId ? null : examId));
  }, []);

  return (
    <div className="cyber-dashboard-page relative min-h-screen overflow-hidden bg-[#FAFAFA]">
      <GridBackground variant="dashboard" />
      <div className="relative z-10">
        <StudentDashboardHeader
          user={user}
          activeTab={activeTab}
          hasExams={hasExams}
          onTabChange={setActiveTab}
          onLogoClick={handleLogoClick}
          onLogout={handleLogout}
        />

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
          {activeTab === "dashboard" && (
            <DashboardOverview
              user={user}
              loading={dashboardLoading}
              allExams={allExams}
              stats={stats}
              performance={performance}
              calendarEvents={calendarEvents}
              onJoinExam={handleJoinExam}
              onOpenExams={() => setActiveTab("exams")}
              onOpenCalendar={() => setActiveTab("calendar")}
              onOpenJoinCode={openJoinCode}
            />
          )}

          {activeTab === "exams" && (
            <ExamsList
              loading={dashboardLoading}
              allExams={allExams}
              filteredExams={filteredExams}
              search={examSearchQuery}
              statusFilter={examFilter}
              typeFilter={examTypeFilter}
              expandedExamId={expandedExam}
              onSearchChange={setExamSearchQuery}
              onStatusFilterChange={setExamFilter}
              onTypeFilterChange={setExamTypeFilter}
              onJoinExam={handleJoinExam}
              onToggleExpand={handleToggleExpandExam}
              onOpenJoinCode={openJoinCode}
            />
          )}

          {activeTab === "results" && (
            <ResultsList
              filteredResults={filteredResults}
              search={resultSearchQuery}
              statusFilter={resultStatusFilter}
              scoreFilter={resultScoreFilter}
              selectedResult={selectedResult}
              selectedExam={selectedExam}
              attemptDetail={attemptDetail}
              attemptDetailLoading={attemptDetailLoading}
              onSearchChange={setResultSearchQuery}
              onStatusFilterChange={setResultStatusFilter}
              onScoreFilterChange={setResultScoreFilter}
              onSelectResult={setSelectedResult}
            />
          )}

          {activeTab === "calendar" && (
            <CalendarView
              allExams={allExams}
              calendarEvents={calendarEvents}
              filteredEvents={filteredCalendar}
              search={calendarSearchQuery}
              monthFilter={calendarMonthFilter}
              subjectFilter={calendarSubjectFilter}
              typeFilter={calendarTypeFilter}
              onSearchChange={setCalendarSearchQuery}
              onMonthFilterChange={setCalendarMonthFilter}
              onSubjectFilterChange={setCalendarSubjectFilter}
              onTypeFilterChange={setCalendarTypeFilter}
            />
          )}

          {activeTab === "settings" && (
            <SettingsView
              activeTab={settingsTab}
              onTabChange={setSettingsTab}
              user={user}
              profileFirstName={profileFirstName}
              profileLastName={profileLastName}
              profilePhone={profilePhone}
              profileSchool={profileSchool}
              profileSaving={profileSaving}
              profileMessage={profileMessage}
              onProfileFirstNameChange={setProfileFirstName}
              onProfileLastNameChange={setProfileLastName}
              onProfilePhoneChange={setProfilePhone}
              onProfileSchoolChange={setProfileSchool}
              onSaveProfile={handleSaveProfile}
              is2FAEnabled={is2FAEnabled}
              activeSessions={activeSessionsList}
              onRequest2FAToggle={() => setShow2FAPopup(true)}
              onRequestRevokeSession={setSessionToRevoke}
            />
          )}
        </main>

        {show2FAPopup && (
          <TwoFactorConfirmModal
            isEnabled={is2FAEnabled}
            onCancel={() => setShow2FAPopup(false)}
            onConfirm={() => {
              setIs2FAEnabled((v) => !v);
              setShow2FAPopup(false);
            }}
          />
        )}

        {sessionToRevoke && (
          <RevokeSessionModal
            device={sessionToRevoke}
            onCancel={() => setSessionToRevoke(null)}
            onConfirm={() => {
              setActiveSessionsList((prev) => prev.filter((d) => d !== sessionToRevoke));
              setSessionToRevoke(null);
            }}
          />
        )}

        {showExamLock && (
          <ExamLockModal
            onCancel={() => setShowExamLock(false)}
            onConfirm={confirmJoinExam}
          />
        )}

        {showJoinCode && (
          <JoinExamModal
            step={joinStep}
            code={examCode}
            error={joinError}
            loading={joinLoading}
            joinedExamTitle={joinedExamTitle}
            onCodeChange={(value) => {
              setExamCode(value);
              if (joinError) setJoinError("");
            }}
            onSubmit={handleSubmitJoinCode}
            onClose={handleCloseJoinCode}
          />
        )}
      </div>
    </div>
  );
}
