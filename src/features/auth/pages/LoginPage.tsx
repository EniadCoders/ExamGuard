import { useState } from "react";
import { Building2, Eye, EyeOff, Github, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";
import imgGoogleIcon from "@/assets/8e4241399baefbe8f8feffab0fe67682e140e1b1.png";
import {
  AuthCard,
  AuthHeading,
  AuthPageLayout,
  authFieldClass,
  authFooterLinkClass,
  authFooterTextClass,
  authLabelClass,
  authPrimaryButtonClass,
  authProviderButtonClass,
  authTextLinkClass,
} from "@/features/auth/components/AuthPageLayout";

export function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"student" | "admin">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    navigate(role === "student" ? "/student" : "/admin");
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };
  const roleButtonBaseClass =
    "rounded-[0.78rem] px-3 py-[clamp(0.58rem,1.15vh,0.72rem)] text-[clamp(0.68rem,1.2vh,0.84rem)] font-semibold transition sm:rounded-[0.9rem] sm:px-4 md:rounded-[0.95rem]";

  return (
    <AuthPageLayout>
      <AuthCard>
        <AuthHeading
          title="Log In"
          description="Enter your account details below."
        />

        <div className="grid grid-cols-2 gap-[clamp(0.4rem,0.8vh,0.55rem)] sm:grid-cols-4">
              <button
                type="button"
                className={authProviderButtonClass}
                onClick={() => console.log("Secure access provider clicked")}
                aria-label="Secure access"
              >
                <ShieldCheck className="h-[clamp(0.95rem,1.8vh,1.15rem)] w-[clamp(0.95rem,1.8vh,1.15rem)]" />
              </button>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className={authProviderButtonClass}
                aria-label="Continue with Google"
              >
                <img
                  src={imgGoogleIcon}
                  alt="Google"
                  className="h-[clamp(0.95rem,1.8vh,1.15rem)] w-[clamp(0.95rem,1.8vh,1.15rem)] object-contain"
                />
              </button>
              <button
                type="button"
                className={authProviderButtonClass}
                onClick={() => console.log("GitHub login clicked")}
                aria-label="Continue with GitHub"
              >
                <Github className="h-[clamp(0.95rem,1.8vh,1.15rem)] w-[clamp(0.95rem,1.8vh,1.15rem)]" />
              </button>
              <button
                type="button"
                className={authProviderButtonClass}
                onClick={() => console.log("Organization login clicked")}
                aria-label="Continue with organization"
              >
                <Building2 className="h-[clamp(0.95rem,1.8vh,1.15rem)] w-[clamp(0.95rem,1.8vh,1.15rem)]" />
              </button>
            </div>

        <div className="flex items-center gap-[clamp(0.45rem,1vh,0.7rem)]">
              <div className="h-px flex-1 bg-[rgba(117,195,214,0.12)]" />
              <span className="text-[clamp(0.62rem,1.05vh,0.78rem)] font-semibold uppercase tracking-[0.2em] text-[var(--cyber-muted-text)] md:tracking-[0.24em]">
                Or
              </span>
              <div className="h-px flex-1 bg-[rgba(117,195,214,0.12)]" />
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-[0.95rem] border border-[rgba(117,195,214,0.14)] bg-[rgba(8,18,27,0.86)] p-1 md:rounded-[1.05rem]">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`${roleButtonBaseClass} ${
                  role === "student"
                    ? "cyber-button-primary"
                    : "text-[var(--cyber-muted-text)] hover:bg-[rgba(123,241,255,0.08)] hover:text-white"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`${roleButtonBaseClass} ${
                  role === "admin"
                    ? "cyber-button-primary"
                    : "text-[var(--cyber-muted-text)] hover:bg-[rgba(123,241,255,0.08)] hover:text-white"
                }`}
              >
                Admin
              </button>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-[clamp(0.62rem,1.2vh,0.9rem)]">
              <div>
                <label className={authLabelClass} htmlFor="login-email">
                  Email/Username
                </label>
                <input
                  id="login-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Username or email"
                  required
                  className={authFieldClass}
                />
              </div>

              <div>
                <div className="mb-[clamp(0.32rem,0.7vh,0.45rem)] flex items-center justify-between gap-3">
                  <label className={`${authLabelClass} mb-0`} htmlFor="login-password">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-[clamp(0.64rem,1vh,0.76rem)] font-semibold text-[var(--cyber-accent)] transition hover:text-white"
                  >
                    Forgot your password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className={`${authFieldClass} pr-11 sm:pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-[clamp(0.55rem,0.9vw,0.75rem)] top-1/2 -translate-y-1/2 rounded-full p-[clamp(0.3rem,0.7vh,0.45rem)] text-[var(--cyber-muted-text)] transition hover:bg-[rgba(123,241,255,0.08)] hover:text-white"
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

              <div className="flex flex-col gap-[clamp(0.32rem,0.7vh,0.45rem)] text-[clamp(0.72rem,1.15vh,0.88rem)] text-[var(--cyber-muted-text)] sm:flex-row sm:items-center sm:justify-between">
                <label
                  htmlFor="remember-session"
                  className="flex cursor-pointer items-center gap-[clamp(0.45rem,0.85vw,0.75rem)]"
                >
                  <input
                    id="remember-session"
                    type="checkbox"
                    className="h-[clamp(0.8rem,1.45vh,1rem)] w-[clamp(0.8rem,1.45vh,1rem)] rounded border-[rgba(123,241,255,0.3)] bg-transparent accent-[var(--cyber-accent)]"
                  />
                  <span>Remember this device</span>
                </label>
                <span className="text-[clamp(0.58rem,0.95vh,0.72rem)] uppercase tracking-[0.16em] text-[var(--cyber-subtle-text)] md:tracking-[0.2em]">
                  {role === "student" ? "Student Portal" : "Admin Portal"}
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={authPrimaryButtonClass}
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[rgba(4,17,23,0.18)] border-t-[rgba(4,17,23,0.95)]" />
                ) : (
                  "Log In"
                )}
              </button>
        </form>

        <div className={`space-y-[clamp(0.28rem,0.7vh,0.45rem)] text-center ${authFooterTextClass}`}>
              <button
                type="button"
                className={authFooterLinkClass}
                onClick={() => console.log("Organization SSO clicked")}
              >
                Log in with your organization SSO
              </button>
              <p className="text-[var(--cyber-muted-text)]">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className={authTextLinkClass}
                  onClick={() => navigate("/sign-up")}
                >
                  Sign up
                </button>
              </p>
        </div>
      </AuthCard>
    </AuthPageLayout>
  );
}
