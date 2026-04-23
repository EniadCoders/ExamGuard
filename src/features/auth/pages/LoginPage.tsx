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

  const providerButtonClass =
    "flex h-[clamp(2.25rem,4.2vh,2.75rem)] items-center justify-center rounded-[0.9rem] border border-[rgba(117,195,214,0.14)] bg-[rgba(11,21,31,0.9)] text-[var(--cyber-muted-text)] transition hover:border-[rgba(123,241,255,0.34)] hover:bg-[rgba(14,27,39,0.98)] hover:text-white sm:rounded-[0.95rem] md:rounded-[1.05rem]";
  const fieldClass =
    "cyber-input h-[clamp(2.55rem,4.7vh,3rem)] w-full rounded-[0.95rem] px-[clamp(0.85rem,1vw,1rem)] text-[clamp(0.82rem,1.45vh,0.95rem)] text-[var(--cyber-text)] sm:rounded-[1rem] md:rounded-[1.05rem]";
  const roleButtonBaseClass =
    "rounded-[0.78rem] px-3 py-[clamp(0.58rem,1.15vh,0.72rem)] text-[clamp(0.68rem,1.2vh,0.84rem)] font-semibold transition sm:rounded-[0.9rem] sm:px-4 md:rounded-[0.95rem]";
  const footerTextClass = "text-[clamp(0.74rem,1.25vh,0.9rem)]";

  return (
    <div className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-[var(--cyber-bg)] px-2 py-2 sm:px-4 sm:py-4 md:h-dvh md:overflow-hidden md:px-6 md:py-4 lg:px-8">
      <GridBackground variant="auth" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,9,15,0.28)_0%,rgba(4,9,15,0.18)_42%,rgba(4,9,15,0.34)_100%)]" />

      <div className="relative mx-auto flex min-h-[calc(100dvh-1rem)] w-full max-w-5xl flex-col items-center justify-center gap-[clamp(0.75rem,1.8vh,1.35rem)] sm:min-h-[calc(100dvh-2rem)] md:h-full md:min-h-0">
        <div className="flex justify-center">
          <Logo size="xl" className="h-[clamp(2rem,4.4vh,2.85rem)] md:h-[clamp(2.2rem,4.8vh,3.15rem)]" />
        </div>

        <div className="flex w-full max-w-md flex-col justify-center rounded-[1.15rem] border border-[rgba(117,195,214,0.18)] bg-[rgba(9,16,24,0.9)] p-[clamp(0.85rem,1.8vh,1.35rem)] shadow-[0_32px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl md:max-h-full md:max-w-[32rem] md:rounded-[1.4rem] lg:max-w-[33rem]">
          <div className="mx-auto flex w-full max-w-[28rem] flex-col gap-[clamp(0.65rem,1.35vh,1rem)]">
            <div className="text-center">
              <h1 className="text-[clamp(1.35rem,3.3vh,2.05rem)] font-bold leading-[1.05] text-[var(--cyber-text)] md:text-[clamp(1.55rem,3.6vh,2.2rem)]">
                Log In
              </h1>
              <p className="mt-[clamp(0.22rem,0.7vh,0.45rem)] text-[clamp(0.76rem,1.2vh,0.92rem)] leading-[1.45] text-[var(--cyber-muted-text)]">
                Enter your account details below.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-[clamp(0.4rem,0.8vh,0.55rem)] sm:grid-cols-4">
              <button
                type="button"
                className={providerButtonClass}
                onClick={() => console.log("Secure access provider clicked")}
                aria-label="Secure access"
              >
                <ShieldCheck className="h-[clamp(0.95rem,1.8vh,1.15rem)] w-[clamp(0.95rem,1.8vh,1.15rem)]" />
              </button>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className={providerButtonClass}
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
                className={providerButtonClass}
                onClick={() => console.log("GitHub login clicked")}
                aria-label="Continue with GitHub"
              >
                <Github className="h-[clamp(0.95rem,1.8vh,1.15rem)] w-[clamp(0.95rem,1.8vh,1.15rem)]" />
              </button>
              <button
                type="button"
                className={providerButtonClass}
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
                <label className="cyber-label mb-[clamp(0.32rem,0.7vh,0.45rem)] text-[clamp(0.72rem,1.08vh,0.82rem)]" htmlFor="login-email">
                  Email/Username
                </label>
                <input
                  id="login-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Username or email"
                  required
                  className={fieldClass}
                />
              </div>

              <div>
                <div className="mb-[clamp(0.32rem,0.7vh,0.45rem)] flex items-center justify-between gap-3">
                  <label className="cyber-label mb-0 text-[clamp(0.72rem,1.08vh,0.82rem)]" htmlFor="login-password">
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
                    className={`${fieldClass} pr-11 sm:pr-12`}
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
                className="cyber-button-primary flex h-[clamp(2.65rem,4.9vh,3.05rem)] w-full items-center justify-center rounded-[0.95rem] px-5 text-[clamp(0.82rem,1.35vh,0.96rem)] font-bold disabled:cursor-not-allowed disabled:opacity-70 md:rounded-[1.05rem]"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[rgba(4,17,23,0.18)] border-t-[rgba(4,17,23,0.95)]" />
                ) : (
                  "Log In"
                )}
              </button>
            </form>

            <div className={`space-y-[clamp(0.28rem,0.7vh,0.45rem)] text-center ${footerTextClass}`}>
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
