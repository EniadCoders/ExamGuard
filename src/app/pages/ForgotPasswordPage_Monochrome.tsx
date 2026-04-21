import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2, Send, Lock } from "lucide-react";
import { useNavigate } from "react-router";
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
                    <Mail className="w-6 h-6 text-black" />
                  </div>
                  <h2 className="text-2xl font-bold text-black mb-2">Mot de passe oublié ?</h2>
                  <p className="text-[#666666] text-sm leading-relaxed">
                    Saisissez votre adresse e-mail. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Adresse e-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888] pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.fr"
                        required
                        className="w-full bg-white border border-[#E5E5E5] rounded-xl pl-11 pr-4 py-3 text-black placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-black transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !email.trim()}
                    className="w-full bg-black hover:bg-[#222222] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-[0_2px_8px_rgba(0,0,0,0.16)] flex items-center justify-center gap-2 group"
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
                    className="inline-flex items-center gap-1.5 text-sm text-[#666666] hover:text-black transition-colors"
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
                  <div className="w-16 h-16 rounded-2xl bg-black border-2 border-black flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-black mb-3">Lien envoyé !</h2>
                <p className="text-[#666666] text-sm leading-relaxed mb-2">
                  Un e-mail de réinitialisation a été envoyé à
                </p>
                <p className="text-black font-bold text-sm mb-6 px-4 py-2 bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl inline-block">
                  {email}
                </p>
                <p className="text-[#888888] text-xs leading-relaxed mb-8 mx-auto max-w-xs">
                  Vérifiez votre boîte de réception et cliquez sur le lien pour créer un nouveau mot de passe. Le lien expire dans <span className="text-black font-semibold">30 minutes</span>.
                </p>

                {/* Simulate clicking the link in email */}
                <button
                  onClick={() => navigate("/reset-password")}
                  className="w-full bg-black hover:bg-[#222222] text-white font-bold py-3 rounded-xl transition-all shadow-[0_2px_8px_rgba(0,0,0,0.16)] text-sm mb-4"
                >
                  Simuler le lien reçu par e-mail →
                </button>

                <div className="flex flex-col gap-3 items-center">
                  <button
                    onClick={() => { setStep("form"); setEmail(""); }}
                    className="text-sm text-[#666666] hover:text-black transition-colors"
                  >
                    Changer d'adresse e-mail
                  </button>
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
