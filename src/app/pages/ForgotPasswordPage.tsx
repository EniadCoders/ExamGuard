import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2, Send, Lock } from "lucide-react";
import { useNavigate } from "react-router";
import { GridBackground } from "../components/GridBackground";
import { Logo } from "../components/Logo";

type Step = "form" | "sent";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setStep("sent");
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white relative overflow-hidden flex items-center justify-center p-6">
      <GridBackground />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo — centré, grand */}
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
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-2xl text-white mb-2">Mot de passe oublié ?</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Saisissez votre adresse e-mail. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      Adresse e-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.fr"
                        required
                        className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !email.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center justify-center gap-2 group"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        Envoyer le lien de réinitialisation
                      </>
                    )}
                  </button>
                </form>

                {/* Back link */}
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

            {/* ── STEP: sent ── */}
            {step === "sent" && (
              <div className="p-8 text-center">
                {/* Success icon */}
                <div className="relative flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  {/* Pulse ring */}
                  <div className="absolute top-0 w-16 h-16 rounded-2xl bg-green-500/20 animate-ping opacity-30" />
                </div>

                <h2 className="text-2xl text-white mb-3">Lien envoyé !</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-2">
                  Un e-mail de réinitialisation a été envoyé à
                </p>
                <p className="text-cyan-400 text-sm mb-6 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl inline-block">
                  {email}
                </p>
                <p className="text-slate-500 text-xs leading-relaxed mb-8 mx-auto max-w-xs">
                  Vérifiez votre boîte de réception et cliquez sur le lien pour créer un nouveau mot de passe. Le lien expire dans <span className="text-slate-300">30 minutes</span>.
                </p>

                {/* Simulate clicking the link in email */}
                <button
                  onClick={() => navigate("/reset-password")}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 text-sm mb-4"
                >
                  Simuler le lien reçu par e-mail →
                </button>

                <div className="flex flex-col gap-3 items-center">
                  <button
                    onClick={() => { setStep("form"); setEmail(""); }}
                    className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Changer d'adresse e-mail
                  </button>
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
