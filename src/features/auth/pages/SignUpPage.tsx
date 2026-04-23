import { useState } from "react";
import { ArrowRight, Eye, EyeOff, UserPlus } from "lucide-react";
import { useNavigate } from "react-router";
import {
  AuthCard,
  AuthHeading,
  AuthPageLayout,
  authFieldClass,
  authFooterTextClass,
  authLabelClass,
  authPrimaryButtonClass,
  authSecondaryButtonClass,
  authTextLinkClass,
} from "@/features/auth/components/AuthPageLayout";

type SignUpStep = "form" | "success";

export function SignUpPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<SignUpStep>("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsLoading(false);
    setStep("success");
  };

  const passwordToggleButtonClass =
    "absolute right-[clamp(0.55rem,0.9vw,0.75rem)] top-1/2 -translate-y-1/2 rounded-full p-[clamp(0.3rem,0.7vh,0.45rem)] text-[var(--cyber-muted-text)] transition hover:bg-[rgba(123,241,255,0.08)] hover:text-white";

  return (
    <AuthPageLayout>
      <AuthCard>
        {step === "form" ? (
          <>
            <AuthHeading
              title="Create Account"
              description="Set up your ExamGuard access with the same secure authentication flow."
            />

            <form onSubmit={handleSubmit} className="flex flex-col gap-[clamp(0.62rem,1.2vh,0.9rem)]">
              <div>
                <label className={authLabelClass} htmlFor="sign-up-name">
                  Full name
                </label>
                <input
                  id="sign-up-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className={authFieldClass}
                />
              </div>

              <div>
                <label className={authLabelClass} htmlFor="sign-up-email">
                  Email address
                </label>
                <input
                  id="sign-up-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className={authFieldClass}
                />
              </div>

              <div>
                <label className={authLabelClass} htmlFor="sign-up-password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="sign-up-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    required
                    className={`${authFieldClass} pr-11 sm:pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className={passwordToggleButtonClass}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-[clamp(0.85rem,1.5vh,1rem)] w-[clamp(0.85rem,1.5vh,1rem)]" />
                    ) : (
                      <Eye className="h-[clamp(0.85rem,1.5vh,1rem)] w-[clamp(0.85rem,1.5vh,1rem)]" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className={authLabelClass} htmlFor="sign-up-confirm-password">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="sign-up-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    required
                    className={`${authFieldClass} pr-11 sm:pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className={passwordToggleButtonClass}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-[clamp(0.85rem,1.5vh,1rem)] w-[clamp(0.85rem,1.5vh,1rem)]" />
                    ) : (
                      <Eye className="h-[clamp(0.85rem,1.5vh,1rem)] w-[clamp(0.85rem,1.5vh,1rem)]" />
                    )}
                  </button>
                </div>
              </div>

              {error ? (
                <div className="rounded-[0.95rem] border border-[rgba(255,123,130,0.22)] bg-[rgba(255,123,130,0.08)] px-4 py-3 text-[clamp(0.72rem,1.12vh,0.84rem)] font-semibold text-[var(--cyber-danger)] md:rounded-[1.05rem]">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className={authPrimaryButtonClass}
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[rgba(4,17,23,0.18)] border-t-[rgba(4,17,23,0.95)]" />
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <UserPlus className="h-[clamp(0.9rem,1.55vh,1rem)] w-[clamp(0.9rem,1.55vh,1rem)]" />
                    Create account
                  </span>
                )}
              </button>
            </form>

            <div className={`space-y-[clamp(0.28rem,0.7vh,0.45rem)] text-center ${authFooterTextClass}`}>
              <p className="text-[var(--cyber-muted-text)]">
                Already have an account?{" "}
                <button
                  type="button"
                  className={authTextLinkClass}
                  onClick={() => navigate("/")}
                >
                  Log in
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            <AuthHeading
              title="Account ready"
              description="Your access has been prepared. Continue to the login flow to enter the platform."
            />

            <div className="rounded-[1rem] border border-[rgba(123,241,255,0.18)] bg-[rgba(11,27,38,0.6)] px-4 py-4 text-center md:rounded-[1.05rem]">
              <p className="text-[clamp(0.8rem,1.35vh,0.95rem)] font-semibold text-[var(--cyber-text)]">
                {fullName}
              </p>
              <p className="mt-1 text-[clamp(0.74rem,1.18vh,0.88rem)] text-[var(--cyber-muted-text)]">
                {email}
              </p>
            </div>

            <div className="flex flex-col gap-[clamp(0.5rem,1vh,0.7rem)]">
              <button
                type="button"
                onClick={() => navigate("/")}
                className={authPrimaryButtonClass}
              >
                <span className="inline-flex items-center gap-2">
                  Go to login
                  <ArrowRight className="h-[clamp(0.9rem,1.55vh,1rem)] w-[clamp(0.9rem,1.55vh,1rem)]" />
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setFullName("");
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                  setError("");
                }}
                className={authSecondaryButtonClass}
              >
                Edit details
              </button>
            </div>
          </>
        )}
      </AuthCard>
    </AuthPageLayout>
  );
}
