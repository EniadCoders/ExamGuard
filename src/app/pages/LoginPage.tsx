import { useState } from "react";
import { Building2, Eye, EyeOff, Github, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";
import imgGoogleIcon from "figma:asset/8e4241399baefbe8f8feffab0fe67682e140e1b1.png";
import { GridBackground } from "../components/GridBackground";
import { Logo } from "../components/Logo";

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
    <div className="relative min-h-screen overflow-hidden bg-[var(--cyber-bg)] px-4 py-8 sm:px-6 lg:px-8">
      <GridBackground variant="auth" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,9,15,0.28)_0%,rgba(4,9,15,0.18)_42%,rgba(4,9,15,0.34)_100%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
        <div className="w-full max-w-[39rem] rounded-[2rem] border border-[rgba(117,195,214,0.18)] bg-[rgba(9,16,24,0.9)] p-6 shadow-[0_32px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-10">
          <div className="mx-auto max-w-[32rem]">
            <div className="flex justify-center">
              <Logo size="xl" className="h-10 sm:h-12" />
            </div>

            <div className="mt-8 text-center">
              <h1 className="text-4xl font-bold text-[var(--cyber-text)] sm:text-[2.75rem]">
                Log In
              </h1>
              <p className="mt-3 text-sm leading-7 text-[var(--cyber-muted-text)] sm:text-base">
                Enter your account details below.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-4 gap-3">
              <button
                type="button"
                className="flex h-12 items-center justify-center rounded-2xl border border-[rgba(117,195,214,0.14)] bg-[rgba(11,21,31,0.9)] text-[var(--cyber-muted-text)] transition hover:border-[rgba(123,241,255,0.34)] hover:bg-[rgba(14,27,39,0.98)] hover:text-white"
                onClick={() => console.log("Secure access provider clicked")}
                aria-label="Secure access"
              >
                <ShieldCheck className="h-[18px] w-[18px]" />
              </button>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex h-12 items-center justify-center rounded-2xl border border-[rgba(117,195,214,0.14)] bg-[rgba(11,21,31,0.9)] text-[var(--cyber-muted-text)] transition hover:border-[rgba(123,241,255,0.34)] hover:bg-[rgba(14,27,39,0.98)] hover:text-white"
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
                className="flex h-12 items-center justify-center rounded-2xl border border-[rgba(117,195,214,0.14)] bg-[rgba(11,21,31,0.9)] text-[var(--cyber-muted-text)] transition hover:border-[rgba(123,241,255,0.34)] hover:bg-[rgba(14,27,39,0.98)] hover:text-white"
                onClick={() => console.log("GitHub login clicked")}
                aria-label="Continue with GitHub"
              >
                <Github className="h-[18px] w-[18px]" />
              </button>
              <button
                type="button"
                className="flex h-12 items-center justify-center rounded-2xl border border-[rgba(117,195,214,0.14)] bg-[rgba(11,21,31,0.9)] text-[var(--cyber-muted-text)] transition hover:border-[rgba(123,241,255,0.34)] hover:bg-[rgba(14,27,39,0.98)] hover:text-white"
                onClick={() => console.log("Organization login clicked")}
                aria-label="Continue with organization"
              >
                <Building2 className="h-[18px] w-[18px]" />
              </button>
            </div>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[rgba(117,195,214,0.12)]" />
              <span className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--cyber-muted-text)]">
                Or
              </span>
              <div className="h-px flex-1 bg-[rgba(117,195,214,0.12)]" />
            </div>

            <div className="mb-6 grid grid-cols-2 gap-1 rounded-2xl border border-[rgba(117,195,214,0.14)] bg-[rgba(8,18,27,0.86)] p-1">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`rounded-[0.95rem] px-4 py-3 text-sm font-semibold transition ${
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
                className={`rounded-[0.95rem] px-4 py-3 text-sm font-semibold transition ${
                  role === "admin"
                    ? "cyber-button-primary"
                    : "text-[var(--cyber-muted-text)] hover:bg-[rgba(123,241,255,0.08)] hover:text-white"
                }`}
              >
                Admin
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
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
                  className="cyber-input w-full rounded-2xl px-4 py-3.5 text-sm text-[var(--cyber-text)]"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label className="cyber-label mb-0" htmlFor="login-password">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs font-semibold text-[var(--cyber-accent)] transition hover:text-white"
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
                    className="cyber-input w-full rounded-2xl px-4 py-3.5 pr-12 text-sm text-[var(--cyber-text)]"
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

              <div className="flex items-center justify-between gap-4 text-sm text-[var(--cyber-muted-text)]">
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
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--cyber-subtle-text)]">
                  {role === "student" ? "Student Portal" : "Admin Portal"}
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="cyber-button-primary flex w-full items-center justify-center rounded-2xl px-5 py-3.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[rgba(4,17,23,0.18)] border-t-[rgba(4,17,23,0.95)]" />
                ) : (
                  "Log In"
                )}
              </button>
            </form>

            <div className="mt-8 space-y-3 text-center text-sm">
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
