import { useState, useRef, useEffect } from "react";
import { Shield, Lock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { GridBackground } from "@/shared/components/GridBackground";
import { Logo } from "@/shared/components/BrandLogo";

const SUPER_ADMIN_PIN = "314159";
const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 60;

interface SuperAdminGateProps {
  onAuthenticated: () => void;
}

export function SuperAdminGate({ onAuthenticated }: SuperAdminGateProps) {
  const [pin, setPin] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!locked) return;
    const interval = setInterval(() => {
      setLockTimer((p) => {
        if (p <= 1) { setLocked(false); setAttempts(0); clearInterval(interval); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [locked]);

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  const handleChange = (idx: number, val: string) => {
    if (locked || verifying) return;
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...pin];
    next[idx] = digit;
    setPin(next);
    setError("");

    if (digit && idx < 5) inputRefs.current[idx + 1]?.focus();

    if (next.every((d) => d !== "")) {
      const code = next.join("");
      setVerifying(true);
      setTimeout(() => {
        if (code === SUPER_ADMIN_PIN) {
          setSuccess(true);
          setTimeout(onAuthenticated, 900);
        } else {
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          if (newAttempts >= MAX_ATTEMPTS) {
            setLocked(true);
            setLockTimer(LOCKOUT_SECONDS);
            setError(`Trop de tentatives. Verrouillé ${LOCKOUT_SECONDS}s.`);
          } else {
            setError(`Code incorrect. ${MAX_ATTEMPTS - newAttempts} tentative(s) restante(s).`);
          }
          setPin(Array(6).fill(""));
          setVerifying(false);
          setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
      }, 800);
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill("");
    pasted.split("").forEach((d, i) => { next[i] = d; });
    setPin(next);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
    if (pasted.length === 6) handleChange(5, pasted[5]);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#FAFAFA] p-4">
      <GridBackground variant="dashboard" />
      <div
        className="relative z-10 w-full max-w-md rounded-2xl border-2 border-[#E5E5E5] bg-white p-8 shadow-[0_8px_40px_rgba(0,0,0,0.1)] text-center"
        style={{ animation: "gate-pop 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        <div className="mb-6">
          <Logo size="md" />
        </div>

        <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center mx-auto mb-5">
          {success ? (
            <CheckCircle2 className="w-8 h-8 text-white animate-pulse" />
          ) : locked ? (
            <Lock className="w-8 h-8 text-white" />
          ) : (
            <Shield className="w-8 h-8 text-white" />
          )}
        </div>

        <h1 className="text-xl font-bold text-black mb-1">Accès Super Administrateur</h1>
        <p className="text-sm text-[#666666] mb-6">
          Entrez le code PIN à 6 chiffres pour accéder au panneau de contrôle.
        </p>

        {success ? (
          <div className="py-4">
            <p className="text-sm font-medium text-black">Authentification réussie</p>
            <p className="text-xs text-[#888888] mt-1">Redirection en cours...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-center gap-3 mb-5" onPaste={handlePaste}>
              {pin.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  disabled={locked || verifying}
                  className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-black ${
                    error
                      ? "border-red-300 bg-red-50"
                      : digit
                      ? "border-black bg-[#F5F5F5]"
                      : "border-[#E5E5E5] bg-white"
                  } ${locked ? "opacity-50 cursor-not-allowed" : ""}`}
                />
              ))}
            </div>

            {verifying && !success && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-4 h-4 border-2 border-[#CCCCCC] border-t-black rounded-full animate-spin" />
                <span className="text-sm text-[#666666]">Vérification...</span>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center gap-2 mb-4 px-4 py-2.5 rounded-xl bg-[#FFF5F5] border border-red-200">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-xs text-red-600 font-medium">{error}</span>
              </div>
            )}

            {locked && (
              <p className="text-xs text-[#888888] mb-4">
                Réessayer dans <span className="font-bold text-black">{lockTimer}s</span>
              </p>
            )}
          </>
        )}

        <div className="mt-6 pt-5 border-t border-[#E5E5E5]">
          <div className="flex items-center justify-center gap-2 text-xs text-[#888888]">
            <Lock className="w-3 h-3" />
            <span>Accès restreint · Chiffrement de bout en bout</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gate-pop {
          0% { opacity: 0; transform: scale(0.92) translateY(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
