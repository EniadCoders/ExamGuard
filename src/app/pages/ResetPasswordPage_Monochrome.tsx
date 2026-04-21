import { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle2, ShieldCheck, ArrowLeft, KeyRound } from "lucide-react";
import { useNavigate } from "react-router";
import { Logo } from "../components/Logo";

type Step = "form" | "success";

function StrengthBar({ password }: { password: string }) {
  const score = (() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const labels = ["", "Faible", "Moyen", "Fort", "Très fort"];
  const grays = ["", "bg-[#CCCCCC]", "bg-[#888888]", "bg-[#444444]", "bg-black"];
  const textColors = ["", "text-[#CCCCCC]", "text-[#888888]", "text-[#444444]", "text-black"];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= score ? grays[score] : "bg-[#E5E5E5]"}`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${textColors[score]}`}>{labels[score]}</p>
    </div>
  );
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("form");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setStep("success");
  };

  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center p-6">
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Logo size="xl" className="relative" />
        </div>

        {/* Card */}
        <div className="relative">
          <div className="relative bg-white border-2 border-[#E5E5E5] rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden">

            {/* ── STEP: form ── */}
            {step === "form" && (
              <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#F5F5F5] border-2 border-[#E5E5E5] flex items-center justify-center mb-5">
                    <KeyRound className="w-6 h-6 text-black" />
                  </div>
                  <h2 className="text-2xl font-bold text-black mb-2">Nouveau mot de passe</h2>
                  <p className="text-[#666666] text-sm leading-relaxed">
                    Choisissez un mot de passe sécurisé. Il doit contenir au moins 8 caractères.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* New password */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 pr-11 text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-black transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#666666] hover:text-black transition-colors"
                      >
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <StrengthBar password={newPassword} />
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className={`w-full bg-white border-2 rounded-xl px-4 py-3 pr-11 text-black placeholder:text-[#888888] focus:outline-none transition-all ${
                          passwordsMismatch
                            ? "border-[#AAAAAA] focus:ring-2 focus:ring-[#888888]"
                            : passwordsMatch
                            ? "border-black focus:ring-2 focus:ring-black"
                            : "border-[#E5E5E5] focus:ring-2 focus:ring-black"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#666666] hover:text-black transition-colors"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordsMatch && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-black font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Les mots de passe correspondent
                      </p>
                    )}
                    {passwordsMismatch && (
                      <p className="mt-1.5 text-xs text-[#666666]">
                        Les mots de passe ne correspondent pas.
                      </p>
                    )}
                  </div>

                  {/* Rules hint */}
                  <div className="p-3.5 bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl space-y-1.5">
                    <p className="text-xs text-[#666666] mb-2 font-semibold">Le mot de passe doit contenir :</p>
                    {[
                      { rule: "Au moins 8 caractères", ok: newPassword.length >= 8 },
                      { rule: "Une lettre majuscule", ok: /[A-Z]/.test(newPassword) },
                      { rule: "Un chiffre", ok: /[0-9]/.test(newPassword) },
                      { rule: "Un caractère spécial (!@#$…)", ok: /[^A-Za-z0-9]/.test(newPassword) },
                    ].map((r) => (
                      <div key={r.rule} className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${r.ok && newPassword ? "bg-black" : "bg-[#E5E5E5] border border-[#CCCCCC]"}`}>
                          {r.ok && newPassword && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <span className={`text-xs transition-colors font-medium ${r.ok && newPassword ? "text-black" : "text-[#888888]"}`}>{r.rule}</span>
                      </div>
                    ))}
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="p-3 bg-[#EAEAEA] border-2 border-black rounded-xl text-xs text-black font-medium">
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading || !newPassword || !confirmPassword}
                    className="w-full bg-black hover:bg-[#222222] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-[0_2px_8px_rgba(0,0,0,0.16)] flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Réinitialiser le mot de passe
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => navigate("/")}
                    className="inline-flex items-center gap-1.5 text-sm text-[#666666] hover:text-black transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Retour à la connexion
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP: success ── */}
            {step === "success" && (
              <div className="p-8 text-center">
                {/* Success animation */}
                <div className="relative flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-3xl bg-black border-2 border-black flex items-center justify-center">
                    <ShieldCheck className="w-10 h-10 text-white" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-black mb-3">Mot de passe mis à jour !</h2>
                <p className="text-[#666666] text-sm leading-relaxed mb-6 mx-auto max-w-xs">
                  Votre mot de passe a bien été réinitialisé. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                </p>

                {/* Security info */}
                <div className="flex items-center gap-3 p-4 bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl mb-8 text-left">
                  <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-black font-semibold">Sécurité renforcée</p>
                    <p className="text-xs text-[#666666] mt-0.5">Toutes vos sessions précédentes ont été déconnectées.</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-black hover:bg-[#222222] text-white font-bold py-3 rounded-xl transition-all shadow-[0_2px_8px_rgba(0,0,0,0.16)] flex items-center justify-center gap-2"
                >
                  Se connecter maintenant
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[#888888] text-xs">
          <Lock className="w-3 h-3" />
          <span>Connexion chiffrée TLS 1.3 · Données sécurisées</span>
        </div>
      </div>
    </div>
  );
}
