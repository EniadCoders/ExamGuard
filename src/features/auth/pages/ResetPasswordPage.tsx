import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router";
import { AuthShell } from "@/features/auth/components/AuthShell";

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

  const labels = ["", "Faible", "Moyen", "Fort", "Tres fort"];
  const fillClasses = [
    "",
    "from-[rgba(255,123,130,0.8)] to-[rgba(255,123,130,0.45)]",
    "from-[rgba(255,211,107,0.85)] to-[rgba(255,211,107,0.45)]",
    "from-[rgba(61,216,233,0.9)] to-[rgba(61,216,233,0.45)]",
    "from-[rgba(110,242,189,0.9)] to-[rgba(110,242,189,0.45)]",
  ];
  const textClasses = [
    "",
    "text-[var(--cyber-danger)]",
    "text-[var(--cyber-warning)]",
    "text-[var(--cyber-accent-strong)]",
    "text-[var(--cyber-success)]",
  ];

  if (!password) return null;

  return (
    <div className="mt-3">
      <div className="mb-2 grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              index <= score
                ? `bg-gradient-to-r ${fillClasses[score]}`
                : "bg-[rgba(117,195,214,0.14)]"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-semibold ${textClasses[score]}`}>
        {labels[score]}
      </p>
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
      setError("Le mot de passe doit contenir au moins 8 caracteres.");
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

  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  return (
    <AuthShell
      heroBadge="Credential reset"
      heroTitle={
        <>
          Rotate credentials.
          <br />
          Keep trust intact.
        </>
      }
      heroDescription={
        <>
          Password renewal inherits the same secure design system: strong visual
          hierarchy, explicit validation, and enterprise-grade recovery cues.
        </>
      }
      footer="Reset credentials inside the same protected ExamGuard shell"
      panelClassName="max-w-[34rem]"
    >
      <div className="space-y-5 sm:space-y-6">
        <div className="cyber-auth-card overflow-hidden rounded-[1.6rem] p-5 sm:rounded-[1.9rem] sm:p-8">
          {step === "form" && (
            <div>
              <div className="mb-8">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(123,241,255,0.18)] bg-[rgba(61,216,233,0.12)]">
                  <KeyRound className="h-6 w-6 text-[var(--cyber-accent-strong)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--cyber-text)] sm:text-3xl">
                  Nouveau mot de passe
                </h2>
                <p className="mt-2 text-sm leading-7 text-[var(--cyber-muted-text)] sm:text-base">
                  Choisissez un mot de passe securise. Il doit contenir au
                  moins 8 caracteres et respecter les criteres ci-dessous.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="cyber-label" htmlFor="new-password">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="cyber-input w-full rounded-2xl px-4 py-3.5 pr-12 text-sm text-[var(--cyber-text)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[var(--cyber-muted-text)] hover:bg-[rgba(123,241,255,0.08)] hover:text-white"
                    >
                      {showNew ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <StrengthBar password={newPassword} />
                </div>

                <div>
                  <label className="cyber-label" htmlFor="confirm-password">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className={`w-full rounded-2xl px-4 py-3.5 pr-12 text-sm text-[var(--cyber-text)] ${
                        passwordsMismatch
                          ? "border border-[rgba(255,123,130,0.35)] bg-[rgba(255,123,130,0.06)]"
                          : passwordsMatch
                          ? "border border-[rgba(110,242,189,0.28)] bg-[rgba(110,242,189,0.06)]"
                          : "cyber-input"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[var(--cyber-muted-text)] hover:bg-[rgba(123,241,255,0.08)] hover:text-white"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {passwordsMatch && (
                    <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-[var(--cyber-success)]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Les mots de passe correspondent
                    </p>
                  )}
                  {passwordsMismatch && (
                    <p className="mt-2 text-xs font-semibold text-[var(--cyber-danger)]">
                      Les mots de passe ne correspondent pas.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-[rgba(117,195,214,0.16)] bg-[rgba(9,21,29,0.7)] p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--cyber-subtle-text)]">
                    Politique de mot de passe
                  </p>
                  <div className="space-y-2.5">
                    {[
                      {
                        rule: "Au moins 8 caracteres",
                        ok: newPassword.length >= 8,
                      },
                      {
                        rule: "Une lettre majuscule",
                        ok: /[A-Z]/.test(newPassword),
                      },
                      {
                        rule: "Un chiffre",
                        ok: /[0-9]/.test(newPassword),
                      },
                      {
                        rule: "Un caractere special",
                        ok: /[^A-Za-z0-9]/.test(newPassword),
                      },
                    ].map((item) => (
                      <div key={item.rule} className="flex items-center gap-2">
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                            item.ok
                              ? "border-[rgba(110,242,189,0.28)] bg-[rgba(110,242,189,0.14)]"
                              : "border-[rgba(117,195,214,0.18)] bg-[rgba(117,195,214,0.08)]"
                          }`}
                        >
                          {item.ok && (
                            <CheckCircle2 className="h-3 w-3 text-[var(--cyber-success)]" />
                          )}
                        </div>
                        <span
                          className={`text-xs ${
                            item.ok
                              ? "text-[var(--cyber-success)]"
                              : "text-[var(--cyber-muted-text)]"
                          }`}
                        >
                          {item.rule}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="rounded-2xl border border-[rgba(255,123,130,0.22)] bg-[rgba(255,123,130,0.08)] px-4 py-3 text-xs font-semibold text-[var(--cyber-danger)]">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !newPassword || !confirmPassword}
                  className="cyber-button-primary flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[rgba(4,17,23,0.18)] border-t-[rgba(4,17,23,0.95)]" />
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Reinitialiser le mot de passe
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {step === "success" && (
            <div className="text-center">
              <div className="relative mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-[rgba(110,242,189,0.22)] bg-[rgba(110,242,189,0.12)]">
                  <ShieldCheck className="h-10 w-10 text-[var(--cyber-success)]" />
                </div>
                <div className="absolute top-0 h-20 w-20 rounded-3xl bg-[rgba(110,242,189,0.12)] opacity-30 animate-ping" />
              </div>

              <h2 className="text-2xl font-bold text-[var(--cyber-text)] sm:text-3xl">
                Mot de passe mis a jour
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--cyber-muted-text)] sm:text-base">
                Votre mot de passe a bien ete reinitialise. Vous pouvez
                maintenant vous connecter avec vos nouveaux identifiants.
              </p>

              <div className="my-8 flex items-start gap-3 rounded-2xl border border-[rgba(123,241,255,0.16)] bg-[rgba(9,21,29,0.7)] p-4 text-left">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[rgba(123,241,255,0.18)] bg-[rgba(61,216,233,0.12)]">
                  <Lock className="h-4 w-4 text-[var(--cyber-accent-strong)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--cyber-text)]">
                    Securite renforcee
                  </p>
                  <p className="mt-1 text-xs leading-6 text-[var(--cyber-muted-text)]">
                    Toutes vos sessions precedentes ont ete deconnectees pour
                    garantir la mise a jour complete des identifiants.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/")}
                className="cyber-button-primary flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold"
              >
                Se connecter maintenant
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 text-sm text-[var(--cyber-muted-text)] sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 font-semibold text-[var(--cyber-muted-text)] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour a la connexion
          </button>

          <div className="cyber-auth-note mt-0">
            <Lock className="h-3.5 w-3.5" />
            <span>Rotation securisee des identifiants</span>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
