import { useState } from "react";
import { Building2, Eye, EyeOff, Github, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";
import imgGoogleIcon from "@/assets/8e4241399baefbe8f8feffab0fe67682e140e1b1.png";
import { GridBackground } from "@/shared/components/GridBackground";
import { Logo } from "@/shared/components/BrandLogo";

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

  return (
    <div className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-[var(--cyber-bg)] px-2 py-2 sm:px-4 sm:py-4 md:h-screen md:overflow-hidden md:px-6 md:py-3 lg:px-8">
      <GridBackground variant="auth" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,9,15,0.28)_0%,rgba(4,9,15,0.18)_42%,rgba(4,9,15,0.34)_100%)]" />

      <div className="relative mx-auto flex min-h-[calc(100dvh-0.5rem)] w-full max-w-5xl items-start justify-center py-0.5 sm:min-h-[calc(100dvh-2rem)] sm:items-center sm:py-0 md:min-h-[calc(100dvh-1.5rem)]">
        <div className="w-full max-w-[31rem] rounded-[1.2rem] border border-[rgba(117,195,214,0.18)] bg-[rgba(9,16,24,0.9)] p-3 shadow-[0_32px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:max-w-[32rem] sm:rounded-[1.5rem] sm:p-4 md:max-w-[33rem] md:p-5 lg:max-w-[34rem] lg:p-[1.375rem]">
          <div className="mx-auto max-w-[32rem]">
            <div className="flex justify-center">
              <Logo size="xl" className="h-7 sm:h-8 md:h-9 lg:h-10" />
            </div>

            <div className="mt-2 text-center sm:mt-3 md:mt-4">
              <h1 className="text-[1.55rem] font-bold text-[var(--cyber-text)] sm:text-[1.85rem] md:text-[2rem] lg:text-[2.2rem]">
                Log In
              </h1>
              <p className="mt-1 text-xs leading-5 text-[var(--cyber-muted-text)] min-[390px]:text-sm min-[390px]:leading-5 sm:mt-1.5 sm:text-sm sm:leading-5 md:text-sm">
                Enter your account details below.
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-3.5 sm:grid-cols-4 sm:gap-2 md:mt-4">
              <button
                type="button"
                className="flex h-10 items-center justify-center rounded-[1rem] border border-[rgba(117,195,214,0.14)] bg-[rgba(11,21,31,0.9)] text-[var(--cyber-muted-text)] transition hover:border-[rgba(123,241,255,0.34)] hover:bg-[rgba(14,27,39,0.98)] hover:text-white sm:h-10 sm:rounded-[1rem] md:h-[2.625rem] md:rounded-[1.05rem]"
                onClick={() => console.log("Secure access provider clicked")}
                aria-label="Secure access"
              >
                <ShieldCheck className="h-[18px] w-[18px]" />
              </button>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex h-10 items-center justify-center rounded-[1rem] border border-[rgba(117,195,214,0.14)] bg-[rgba(11,21,31,0.9)] text-[var(--cyber-muted-text)] transition hover:border-[rgba(123,241,255,0.34)] hover:bg-[rgba(14,27,39,0.98)] hover:text-white sm:h-10 sm:rounded-[1rem] md:h-[2.625rem] md:rounded-[1.05rem]"
                aria-label="Continue with Google"
              >
                <img
                  src={imgGoogleIcon}
                  alt="Google"
                  className="h-[18px] w-[18px] object-contain"
                />
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center rounded-[1rem] border border-[rgba(117,195,214,0.14)] bg-[rgba(11,21,31,0.9)] text-[var(--cyber-muted-text)] transition hover:border-[rgba(123,241,255,0.34)] hover:bg-[rgba(14,27,39,0.98)] hover:text-white sm:h-10 sm:rounded-[1rem] md:h-[2.625rem] md:rounded-[1.05rem]"
                onClick={() => console.log("GitHub login clicked")}
                aria-label="Continue with GitHub"
              >
                <Github className="h-[18px] w-[18px]" />
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center rounded-[1rem] border border-[rgba(117,195,214,0.14)] bg-[rgba(11,21,31,0.9)] text-[var(--cyber-muted-text)] transition hover:border-[rgba(123,241,255,0.34)] hover:bg-[rgba(14,27,39,0.98)] hover:text-white sm:h-10 sm:rounded-[1rem] md:h-[2.625rem] md:rounded-[1.05rem]"
                onClick={() => console.log("Organization login clicked")}
                aria-label="Continue with organization"
              >
                <Building2 className="h-[18px] w-[18px]" />
              </button>
            </div>

            <div className="my-3 flex items-center gap-2.5 sm:my-3.5 sm:gap-3 md:my-4">
              <div className="h-px flex-1 bg-[rgba(117,195,214,0.12)]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--cyber-muted-text)] sm:text-sm sm:tracking-[0.28em]">
                Or
              </span>
              <div className="h-px flex-1 bg-[rgba(117,195,214,0.12)]" />
            </div>

            <div className="mb-3 grid grid-cols-2 gap-1 rounded-[1rem] border border-[rgba(117,195,214,0.14)] bg-[rgba(8,18,27,0.86)] p-1 sm:mb-3.5 sm:rounded-[1rem] md:mb-4 md:rounded-[1.05rem]">
              <button
                type="button"
                onClick={() => setRole("student")}
                  className={`rounded-[0.8rem] px-3 py-2.5 text-[11px] font-semibold transition min-[390px]:text-xs sm:rounded-[0.95rem] sm:px-4 sm:py-3 sm:text-sm ${
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
                  className={`rounded-[0.8rem] px-3 py-2.5 text-[11px] font-semibold transition min-[390px]:text-xs sm:rounded-[0.95rem] sm:px-4 sm:py-3 sm:text-sm ${
                  role === "admin"
                    ? "cyber-button-primary"
                    : "text-[var(--cyber-muted-text)] hover:bg-[rgba(123,241,255,0.08)] hover:text-white"
                }`}
              >
                Admin
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-2.5 sm:space-y-3 md:space-y-3.5">
              <div>
                <label className="cyber-label" htmlFor="login-email">
                  Email/Username
                </label>
                <input
                  id="login-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Username or email"
                  required
                  className="cyber-input w-full rounded-[1rem] px-3.5 py-2.5 text-sm text-[var(--cyber-text)] sm:rounded-[1rem] sm:px-4 sm:py-2.5 md:rounded-[1.05rem] md:py-3"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="cyber-label mb-0" htmlFor="login-password">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-[11px] font-semibold text-[var(--cyber-accent)] transition hover:text-white min-[390px]:text-xs"
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
                    className="cyber-input w-full rounded-[1rem] px-3.5 py-2.5 pr-11 text-sm text-[var(--cyber-text)] sm:rounded-[1rem] sm:px-4 sm:py-2.5 sm:pr-12 md:rounded-[1.05rem] md:py-3"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[var(--cyber-muted-text)] transition hover:bg-[rgba(123,241,255,0.08)] hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-xs text-[var(--cyber-muted-text)] min-[390px]:text-sm sm:flex-row sm:items-center sm:justify-between">
                <label
                  htmlFor="remember-session"
                  className="flex cursor-pointer items-center gap-3"
                >
                  <input
                    id="remember-session"
                    type="checkbox"
                    className="h-4 w-4 rounded border-[rgba(123,241,255,0.3)] bg-transparent accent-[var(--cyber-accent)]"
                  />
                  <span>Remember this device</span>
                </label>
                <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--cyber-subtle-text)] min-[390px]:text-xs min-[390px]:tracking-[0.2em]">
                  {role === "student" ? "Student Portal" : "Admin Portal"}
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="cyber-button-primary flex w-full items-center justify-center rounded-[1rem] px-5 py-2.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-70 sm:rounded-[1rem] sm:py-[0.6875rem] md:rounded-[1.05rem] md:py-3"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[rgba(4,17,23,0.18)] border-t-[rgba(4,17,23,0.95)]" />
                ) : (
                  "Log In"
                )}
              </button>
            </form>

            <div className="mt-3 space-y-1.5 text-center text-xs min-[390px]:text-sm sm:mt-3.5 sm:space-y-2 md:mt-4">
              <button
                type="button"
                className="font-medium text-[var(--cyber-accent)] transition hover:text-white"
                onClick={() => console.log("Organization SSO clicked")}
              >
                Log in with your organization SSO
              </button>
              <p className="text-[var(--cyber-muted-text)]">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="font-semibold text-[var(--cyber-accent)] transition hover:text-white"
                  onClick={() => console.log("Navigate to signup")}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
