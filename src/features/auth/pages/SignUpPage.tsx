import { useState } from "react";
import { ArrowRight, Eye, EyeOff, GraduationCap, Send, UserPlus } from "lucide-react";
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
type AccountType = "student" | "teacher";

export function SignUpPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<SignUpStep>("form");
  const [accountType, setAccountType] = useState<AccountType>("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const [message, setMessage] = useState("");
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

  const handleTeacherContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !institution.trim()) {
      setError("Please complete your name, email, and institution.");
      return;
    }

    const subject = encodeURIComponent("Teacher account request");
    const body = encodeURIComponent(
      [
        "Teacher account request",
        "",
        `Full name: ${fullName.trim()}`,
        `Email: ${email.trim()}`,
        `Institution: ${institution.trim()}`,
        "",
        "Message:",
        message.trim() || "No additional details provided.",
      ].join("\n"),
    );

    window.location.href = `mailto:support@examguard.com?subject=${subject}&body=${body}`;
    setStep("success");
  };

  const passwordToggleButtonClass =
    "absolute right-[clamp(0.55rem,0.9vw,0.75rem)] top-1/2 -translate-y-1/2 rounded-full p-[clamp(0.3rem,0.7vh,0.45rem)] text-[var(--cyber-muted-text)] transition hover:bg-[rgba(123,241,255,0.08)] hover:text-white";
  const accountTypeButtonClass =
    "rounded-[0.78rem] px-3 py-[clamp(0.58rem,1.15vh,0.72rem)] text-[clamp(0.68rem,1.2vh,0.84rem)] font-semibold transition sm:rounded-[0.9rem] sm:px-4 md:rounded-[0.95rem]";

  return (
    <AuthPageLayout>
      <AuthCard>
        {step === "form" ? (
          <>
            <AuthHeading
              title="Create Account"
              description={
                accountType === "student"
                  ? "Set up your ExamGuard access with the secure student authentication flow."
                  : "Teacher accounts are created by ExamGuard support. Send a request and we will contact you."
              }
            />

            <div className="grid grid-cols-2 gap-1 rounded-[0.95rem] border border-[rgba(117,195,214,0.14)] bg-[rgba(8,18,27,0.86)] p-1 md:rounded-[1.05rem]">
              <button
                type="button"
                onClick={() => {
                  setAccountType("student");
                  setError("");
                }}
                className={`${accountTypeButtonClass} ${
                  accountType === "student"
                    ? "cyber-button-primary"
                    : "text-[var(--cyber-muted-text)] hover:bg-[rgba(123,241,255,0.08)] hover:text-white"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => {
                  setAccountType("teacher");
                  setError("");
                }}
                className={`${accountTypeButtonClass} ${
                  accountType === "teacher"
                    ? "cyber-button-primary"
                    : "text-[var(--cyber-muted-text)] hover:bg-[rgba(123,241,255,0.08)] hover:text-white"
                }`}
              >
                Teacher
              </button>
            </div>

            {accountType === "student" ? (
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
            ) : (
              <form onSubmit={handleTeacherContact} className="flex flex-col gap-[clamp(0.62rem,1.2vh,0.9rem)]">
                <div className="rounded-[0.95rem] border border-[rgba(123,241,255,0.16)] bg-[rgba(11,27,38,0.58)] px-4 py-3 text-[clamp(0.72rem,1.12vh,0.84rem)] leading-[1.45] text-[var(--cyber-muted-text)] md:rounded-[1.05rem]">
                  Teachers should not use the standard sign up form. Contact us and our support team will create the account.
                </div>

                <div>
                  <label className={authLabelClass} htmlFor="teacher-name">
                    Full name
                  </label>
                  <input
                    id="teacher-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className={authFieldClass}
                  />
                </div>

                <div>
                  <label className={authLabelClass} htmlFor="teacher-email">
                    Email address
                  </label>
                  <input
                    id="teacher-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@institution.com"
                    required
                    className={authFieldClass}
                  />
                </div>

                <div>
                  <label className={authLabelClass} htmlFor="teacher-institution">
                    Institution
                  </label>
                  <input
                    id="teacher-institution"
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="School or organization"
                    required
                    className={authFieldClass}
                  />
                </div>

                <div>
                  <label className={authLabelClass} htmlFor="teacher-message">
                    Message
                  </label>
                  <textarea
                    id="teacher-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add any details for support"
                    rows={3}
                    className={`${authFieldClass} min-h-[5.5rem] resize-none py-[clamp(0.75rem,1.25vh,0.9rem)] leading-[1.45]`}
                  />
                </div>

                {error ? (
                  <div className="rounded-[0.95rem] border border-[rgba(255,123,130,0.22)] bg-[rgba(255,123,130,0.08)] px-4 py-3 text-[clamp(0.72rem,1.12vh,0.84rem)] font-semibold text-[var(--cyber-danger)] md:rounded-[1.05rem]">
                    {error}
                  </div>
                ) : null}

                <button type="submit" className={authPrimaryButtonClass}>
                  <span className="inline-flex items-center gap-2">
                    <Send className="h-[clamp(0.9rem,1.55vh,1rem)] w-[clamp(0.9rem,1.55vh,1rem)]" />
                    Contact support
                  </span>
                </button>
              </form>
            )}

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
              title={accountType === "student" ? "Account ready" : "Request prepared"}
              description={
                accountType === "student"
                  ? "Your access has been prepared. Continue to the login flow to enter the platform."
                  : "Your email app should open with a message addressed to support@examguard.com."
              }
            />

            <div className="rounded-[1rem] border border-[rgba(123,241,255,0.18)] bg-[rgba(11,27,38,0.6)] px-4 py-4 text-center md:rounded-[1.05rem]">
              {accountType === "teacher" ? (
                <GraduationCap className="mx-auto mb-3 h-7 w-7 text-[var(--cyber-accent)]" />
              ) : null}
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
                  setInstitution("");
                  setMessage("");
                  setError("");
                }}
                className={authSecondaryButtonClass}
              >
                {accountType === "student" ? "Edit details" : "Edit request"}
              </button>
            </div>
          </>
        )}
      </AuthCard>
    </AuthPageLayout>
  );
}
