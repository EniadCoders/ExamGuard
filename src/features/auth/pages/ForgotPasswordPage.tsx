import { useState } from "react";
import { ArrowLeft, CheckCircle2, Lock, Mail, Send } from "lucide-react";
import { useNavigate } from "react-router";
import { AuthShell } from "@/features/auth/components/AuthShell";

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
    <AuthShell
      heroBadge="Credential recovery"
      heroTitle={
        <>
          Recover access
          <br />
          without friction.
        </>
      }
      heroDescription={
        <>
          Reset links stay inside the same secure product language: dark
          surface, clear recovery states, and explicit platform protection
          signals.
        </>
      }
      footer="Secure recovery flow with audited reset entry points"
      panelClassName="max-w-[34rem]"
    >
      <div className="space-y-6">
        <div className="cyber-auth-card overflow-hidden rounded-[1.9rem] p-6 sm:p-8">
          {step === "form" && (
            <div>
              <div className="mb-8">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(123,241,255,0.18)] bg-[rgba(61,216,233,0.12)]">
                  <Mail className="h-6 w-6 text-[var(--cyber-accent-strong)]" />
                </div>
                <h2 className="text-3xl font-bold text-[var(--cyber-text)]">
                  Mot de passe oublie ?
                </h2>
                <p className="mt-2 text-sm leading-7 text-[var(--cyber-muted-text)] sm:text-base">
                  Saisissez votre adresse e-mail. Nous vous enverrons un lien
                  pour reinitialiser votre mot de passe.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="cyber-label" htmlFor="recovery-email">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--cyber-subtle-text)]" />
                    <input
                      id="recovery-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.fr"
                      required
                      className="cyber-input w-full rounded-2xl py-3.5 pl-11 pr-4 text-sm text-[var(--cyber-text)]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="cyber-button-primary flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[rgba(4,17,23,0.18)] border-t-[rgba(4,17,23,0.95)]" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Envoyer le lien de reinitialisation
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {step === "sent" && (
            <div className="text-center">
              <div className="relative mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(110,242,189,0.22)] bg-[rgba(110,242,189,0.12)]">
                  <CheckCircle2 className="h-8 w-8 text-[var(--cyber-success)]" />
                </div>
                <div className="absolute top-0 h-16 w-16 rounded-2xl bg-[rgba(110,242,189,0.12)] opacity-30 animate-ping" />
              </div>

              <h2 className="text-3xl font-bold text-[var(--cyber-text)]">
                Lien envoye
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--cyber-muted-text)] sm:text-base">
                Un e-mail de reinitialisation a ete envoye a cette adresse.
              </p>

              <div className="my-6 rounded-2xl border border-[rgba(123,241,255,0.18)] bg-[rgba(11,27,38,0.64)] px-4 py-3 text-sm font-semibold text-[var(--cyber-accent-strong)]">
                {email}
              </div>

              <p className="mx-auto mb-8 max-w-md text-xs leading-6 text-[var(--cyber-subtle-text)]">
                Verifiez votre boite de reception et cliquez sur le lien pour
                creer un nouveau mot de passe. Le lien expire dans 30 minutes.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/reset-password")}
                  className="cyber-button-primary w-full rounded-2xl px-5 py-3.5 text-sm font-bold"
                >
                  Simuler le lien recu par e-mail
                </button>
                <button
                  onClick={() => {
                    setStep("form");
                    setEmail("");
                  }}
                  className="cyber-button-secondary w-full rounded-2xl px-5 py-3.5 text-sm font-semibold"
                >
                  Changer d&apos;adresse e-mail
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 text-sm text-[var(--cyber-muted-text)]">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 font-semibold text-[var(--cyber-muted-text)] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour a la connexion
          </button>

          <div className="cyber-auth-note mt-0">
            <Lock className="h-3.5 w-3.5" />
            <span>Canal de reinitialisation chiffre</span>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
