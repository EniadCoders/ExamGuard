import { useState } from "react";
import { ArrowLeft, CheckCircle2, Mail, Send } from "lucide-react";
import { useNavigate } from "react-router";
import {
  AuthCard,
  AuthHeading,
  AuthPageLayout,
  authFieldClass,
  authFooterLinkClass,
  authFooterTextClass,
  authLabelClass,
  authPrimaryButtonClass,
  authSecondaryButtonClass,
  authTextLinkClass,
} from "@/features/auth/components/AuthPageLayout";

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
    await new Promise((r) => setTimeout(r, 900));
    setIsLoading(false);
    setStep("sent");
  };

  return (
    <AuthPageLayout>
      <AuthCard>
        {step === "form" ? (
          <>
            <AuthHeading
              title="Forgot Password"
              description="Enter your account email and we will send you a secure reset link."
            />

            <form onSubmit={handleSubmit} className="flex flex-col gap-[clamp(0.62rem,1.2vh,0.9rem)]">
              <div>
                <label className={authLabelClass} htmlFor="recovery-email">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-[clamp(0.85rem,1vw,1rem)] top-1/2 h-[clamp(0.85rem,1.5vh,1rem)] w-[clamp(0.85rem,1.5vh,1rem)] -translate-y-1/2 text-[var(--cyber-subtle-text)]" />
                  <input
                    id="recovery-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className={`${authFieldClass} pl-[calc(clamp(0.85rem,1vw,1rem)+1.45rem)]`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className={authPrimaryButtonClass}
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[rgba(4,17,23,0.18)] border-t-[rgba(4,17,23,0.95)]" />
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <Send className="h-[clamp(0.9rem,1.55vh,1rem)] w-[clamp(0.9rem,1.55vh,1rem)]" />
                    Send reset link
                  </span>
                )}
              </button>
            </form>

            <div className={`space-y-[clamp(0.28rem,0.7vh,0.45rem)] text-center ${authFooterTextClass}`}>
              <button
                type="button"
                className={authFooterLinkClass}
                onClick={() => navigate("/")}
              >
                Back to login
              </button>
              <p className="text-[var(--cyber-muted-text)]">
                Need a new account?{" "}
                <button
                  type="button"
                  className={authTextLinkClass}
                  onClick={() => navigate("/sign-up")}
                >
                  Sign up
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            <AuthHeading
              title="Check your inbox"
              description="If the email exists, a reset link has been sent to the address below."
            />

            <div className="rounded-[1rem] border border-[rgba(110,242,189,0.18)] bg-[rgba(110,242,189,0.08)] px-4 py-4 text-center md:rounded-[1.05rem]">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(110,242,189,0.2)] bg-[rgba(110,242,189,0.12)]">
                <CheckCircle2 className="h-6 w-6 text-[var(--cyber-success)]" />
              </div>
              <p className="text-[clamp(0.8rem,1.35vh,0.95rem)] font-semibold text-[var(--cyber-text)]">
                {email}
              </p>
              <p className="mt-2 text-[clamp(0.74rem,1.18vh,0.88rem)] leading-[1.5] text-[var(--cyber-muted-text)]">
                Follow the secure link in the email to continue resetting your password.
              </p>
            </div>

            <div className="flex flex-col gap-[clamp(0.5rem,1vh,0.7rem)]">
              <button
                type="button"
                onClick={() => navigate("/reset-password")}
                className={authPrimaryButtonClass}
              >
                Continue to reset flow
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setEmail("");
                }}
                className={authSecondaryButtonClass}
              >
                Use another email
              </button>
            </div>

            <div className={`space-y-[clamp(0.28rem,0.7vh,0.45rem)] text-center ${authFooterTextClass}`}>
              <button
                type="button"
                className="inline-flex items-center gap-2 font-medium text-[var(--cyber-accent)] transition hover:text-white"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </button>
            </div>
          </>
        )}
      </AuthCard>
    </AuthPageLayout>
  );
}
