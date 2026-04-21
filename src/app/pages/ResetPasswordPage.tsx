import { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle2, ShieldCheck, ArrowLeft, KeyRound } from "lucide-react";
import { useNavigate } from "react-router";
import { GridBackground } from "../components/GridBackground";
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
  const colors = ["", "bg-red-500", "bg-amber-500", "bg-blue-500", "bg-green-500"];
  const textColors = ["", "text-red-400", "text-amber-400", "text-blue-400", "text-green-400"];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : "bg-slate-700/60"}`}
          />
        ))}
      </div>
      <p className={`text-xs ${textColors[score]}`}>{labels[score]}</p>
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
    <div className="min-h-screen bg-[#0a0e27] text-white relative overflow-hidden flex items-center justify-center p-6">
      <GridBackground />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/15 rounded-3xl blur-2xl" />
            <Logo size="xl" className="relative drop-shadow-2xl" />
          </div>
        </div>

        {/* Card */}
        <div className="relative">
          <div className="absolute -inset-px bg-gradient-to-br from-blue-500/30 via-transparent to-cyan-500/20 rounded-2xl blur-sm opacity-70" />
          <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">

            {/* ── STEP: form ── */}
            {step === "form" && (
              <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                    <KeyRound className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-2xl text-white mb-2">Nouveau mot de passe</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Choisissez un mot de passe sécurisé. Il doit contenir au moins 8 caractères.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* New password */}
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 pr-11 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <StrengthBar password={newPassword} />
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className={`w-full bg-slate-800/60 border rounded-xl px-4 py-3 pr-11 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${
                          passwordsMismatch
                            ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50"
                            : passwordsMatch
                            ? "border-green-500/50 focus:ring-green-500/30 focus:border-green-500/50"
                            : "border-slate-700/50 focus:ring-blue-500/40 focus:border-blue-500/50"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordsMatch && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-green-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Les mots de passe correspondent
                      </p>
                    )}
                    {passwordsMismatch && (
                      <p className="mt-1.5 text-xs text-red-400">
                        Les mots de passe ne correspondent pas.
                      </p>
                    )}
                  </div>

                  {/* Rules hint */}
                  <div className="p-3.5 bg-slate-800/40 border border-slate-700/40 rounded-xl space-y-1.5">
                    <p className="text-xs text-slate-400 mb-2">Le mot de passe doit contenir :</p>
                    {[
                      { rule: "Au moins 8 caractères", ok: newPassword.length >= 8 },
                      { rule: "Une lettre majuscule", ok: /[A-Z]/.test(newPassword) },
                      { rule: "Un chiffre", ok: /[0-9]/.test(newPassword) },
                      { rule: "Un caractère spécial (!@#$…)", ok: /[^A-Za-z0-9]/.test(newPassword) },
                    ].map((r) => (
                      <div key={r.rule} className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${r.ok && newPassword ? "bg-green-500/20 border border-green-500/40" : "bg-slate-700/60 border border-slate-600/40"}`}>
                          {r.ok && newPassword && <CheckCircle2 className="w-2.5 h-2.5 text-green-400" />}
                        </div>
                        <span className={`text-xs transition-colors ${r.ok && newPassword ? "text-green-400" : "text-slate-500"}`}>{r.rule}</span>
                      </div>
                    ))}
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading || !newPassword || !confirmPassword}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center justify-center gap-2"
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
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
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
                  <div className="w-20 h-20 rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-10 h-10 text-green-400" />
                  </div>
                  <div className="absolute top-0 w-20 h-20 rounded-3xl bg-green-500/15 animate-ping opacity-30" />
                </div>

                <h2 className="text-2xl text-white mb-3">Mot de passe mis à jour !</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 mx-auto max-w-xs">
                  Votre mot de passe a bien été réinitialisé. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                </p>

                {/* Security info */}
                <div className="flex items-center gap-3 p-4 bg-slate-800/40 border border-slate-700/30 rounded-xl mb-8 text-left">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-300">Sécurité renforcée</p>
                    <p className="text-xs text-slate-500 mt-0.5">Toutes vos sessions précédentes ont été déconnectées.</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center justify-center gap-2"
                >
                  Se connecter maintenant
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-700 text-xs">
          <Lock className="w-3 h-3" />
          <span>Connexion chiffrée TLS 1.3 · Données sécurisées</span>
        </div>
      </div>
    </div>
  );
}
