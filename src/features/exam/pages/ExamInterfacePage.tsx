import { useState, useEffect, useCallback, useRef } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Lock,
  Shield,
  Flag,
  Clock,
  Eye,
  Wifi,
  Monitor,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router";
import { GridBackground } from "@/shared/components/GridBackground";
import { Logo } from "@/shared/components/BrandLogo";
import { CodeEditorPanel } from "@/shared/components/CodeEditorPanel";
import type {
  Question,
  MCQAnswer,
  TextAnswer,
  CodeAnswer,
  Answer,
} from "@/shared/types/exam";
import { TYPE_LABELS } from "@/shared/types/exam";
import {
  mockExamQuestions as examQuestions,
  TOTAL_QUESTIONS as TOTAL,
} from "@/features/exam/exam.data";
import {
  AutoSaveStatus as AutoSaveIndicator,
  ExamResultsView as ExamResultsScreen,
  FraudWarningBanner as WarningBanner,
  QuestionTypeIcon as QTypeIcon,
  SubmitExamModal as SubmitModal,
} from "@/features/exam/components/ExamInterfaceHelpers";

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

  const [isFullscreen, setIsFullscreen] = useState(true);
  const [fullscreenExits, setFullscreenExits] = useState(0);

  const exitFullscreen = async () => {
    try {
      const doc = document as any;
      const exitFs = doc.exitFullscreen || doc.webkitExitFullscreen || doc.mozCancelFullScreen || doc.msExitFullscreen;
      const fsElement = doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement;
      
      if (exitFs && fsElement) {
        await exitFs.call(doc);
      }
    } catch (err) {
      console.warn("Exit fullscreen error:", err);
    }
  };

  const requestFullscreen = async () => {
    try {
      const el = document.documentElement as any;
      const requestFs = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
      if (requestFs) {
        await requestFs.call(el, { navigationUI: "hide" });
      }
    } catch (err) {
      console.warn("Fullscreen error:", err);
    }
  };

  useEffect(() => {
    let initialCheck = true;
    const handleFullscreenChange = () => {
      const doc = document as any;
      const fsElement = doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement;
      
      if (!fsElement) {
        setIsFullscreen(false);
        if (!initialCheck) {
          setFullscreenExits((prev) => {
            const newCount = prev + 1;
            console.log(`[Anti-Cheat] Fullscreen exit detected at ${new Date().toISOString()}. Count: ${newCount}`);
            return newCount;
          });
        }
      } else {
        setIsFullscreen(true);
      }
      initialCheck = false;
    };

    handleFullscreenChange();

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  const question = examQuestions[current];

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((p) => {
      if (p <= 1 && !submitted) {
        setSubmitted(true);
        exitFullscreen();
        return 0;
      }
      return p > 0 ? p - 1 : 0;
    }), 1000);
    return () => clearInterval(timer);
  }, [submitted]);

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
    <div className="cyber-exam-page relative min-h-screen overflow-hidden bg-white">
      <GridBackground variant="exam" />

      {/* Fullscreen Warning Modal */}
      {!isFullscreen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.85)] backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[rgba(123,241,255,0.2)] bg-[#0A141A] p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)] text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(255,85,85,0.15)]">
              <AlertTriangle className="h-7 w-7 text-[#FF5555]" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">Attention</h2>
            <p className="mb-6 text-sm text-[var(--cyber-muted-text)]">
              Vous avez quitté le mode plein écran. Veuillez y retourner pour continuer l'examen.
            </p>
            <button
              onClick={requestFullscreen}
              className="w-full rounded-xl bg-[var(--cyber-accent)] px-4 py-3 text-sm font-bold text-black transition-all hover:bg-[var(--cyber-accent-strong)]"
            >
              Reprendre en plein écran
            </button>
          </div>
        </div>
      )}

      {showSubmit && (
        <SubmitModal
          answeredCount={answeredCount}
          total={TOTAL}
          onConfirm={() => {
            setShowSubmit(false);
            setSubmitted(true);
            exitFullscreen();
          }}
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
        <header className="cyber-topbar sticky top-0 z-40 border-b border-[#E5E5E5] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-3 sm:px-6 lg:h-[64px] lg:flex-row lg:items-center lg:justify-between lg:py-0">
            {/* Left */}
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <Logo size="md" />
              <div className="hidden sm:block w-px h-5 bg-[#E5E5E5]" />
              <div className="hidden sm:block min-w-0">
                <p className="text-sm text-black font-semibold truncate">Examen Java - Architecture Logicielle</p>
                <p className="text-xs text-[#666666]">
                  {TOTAL} questions · {totalPoints} points
                </p>
              </div>
            </div>

            {/* Center: Timer */}
            <div
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 sm:gap-2.5 sm:px-5 ${
                isLowTime
                  ? "bg-black border-black shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
                  : "bg-white border-[#E5E5E5]"
              }`}
            >
              <Clock
                className={`w-4 h-4 ${isLowTime ? "text-white" : "text-black"}`}
              />
              <span
                className={`text-xl tabular-nums tracking-tight font-bold sm:text-2xl ${
                  isLowTime ? "text-white" : "text-black"
                }`}
              >
                {t.h}:{t.m}:{t.s}
              </span>
            </div>

            {/* Right */}
            <div className="flex flex-wrap items-center gap-2">
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
        <div className="mx-auto flex w-full max-w-[1400px] flex-1 gap-4 px-3 py-4 sm:px-4 sm:py-6 sm:gap-5">
          {/* Left navigation rail */}
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
                      title={`Q${idx + 1} - ${TYPE_LABELS[q.type]}`}
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

          {/* Center: Question */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            {/* Question card */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              {/* Card header */}
              <div className="flex flex-col gap-3 border-b border-[#E5E5E5] bg-[#FAFAFA] px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-3">
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
              <div className="px-4 py-5 sm:px-6">
                <p className="text-sm font-medium leading-relaxed text-black sm:text-base">{question.text}</p>
              </div>

              {/* MCQ Answer */}
              {question.type === "mcq" && (
                <div className="space-y-2.5 px-4 pb-5 sm:px-6 sm:pb-6">
                  {question.options.map((opt) => {
                    const sel = answers[current] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setAnswer(opt.id as MCQAnswer)}
                        className={`group w-full rounded-xl border-2 px-4 py-3.5 text-left transition-all sm:px-5 sm:py-4 ${
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

              {/* Text Answer */}
              {question.type === "text" && (() => {
                const textVal = (answers[current] as TextAnswer) ?? "";
                const words = textVal.trim()
                  ? textVal.trim().split(/\s+/).length
                  : 0;
                const minW = question.minWords ?? 0;
                const meetsMin = words >= minW;
                return (
                  <div className="px-4 pb-5 sm:px-6 sm:pb-6">
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

              {/* Code Answer */}
              {question.type === "code" && (() => {
                const codeAns: CodeAnswer = (answers[current] as CodeAnswer) ?? {
                  code: question.starterCode,
                  output: "",
                  hasRun: false,
                  isRunning: false,
                };
                return (
                  <div className="px-4 pb-5 sm:px-6 sm:pb-6">
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
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setCurrent(Math.max(0, current - 1))}
                disabled={current === 0}
                className="flex items-center gap-2 rounded-xl border-2 border-[#E5E5E5] px-3 py-2.5 text-xs font-medium text-black transition-all hover:border-[#CCCCCC] hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-30 sm:px-5 sm:text-sm"
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
                  className="flex items-center gap-2 rounded-xl bg-black px-3 py-2.5 text-xs font-medium text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:bg-[#222222] sm:px-5 sm:text-sm"
                >
                  Suivante
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmit(true)}
                  className="flex items-center gap-2 rounded-xl bg-black px-3 py-2.5 text-xs font-medium text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:bg-[#222222] sm:px-5 sm:text-sm"
                >
                  Soumettre
                  <Shield className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right panel: proctoring */}
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
