import { useState } from "react";
import { Eye, EyeOff, Shield, Lock, Zap, BarChart3, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { GridBackground } from "../components/GridBackground";
import { Logo } from "../components/Logo";

const features = [
  {
    icon: Shield,
    title: "Proctoring en temps réel",
    desc: "Surveillance IA comportementale et détection d'anomalies en temps réel",
  },
  {
    icon: Lock,
    title: "Mode sécurisé avancé",
    desc: "Verrouillage du navigateur et détection des changements d'onglet",
  },
  {
    icon: Zap,
    title: "Alertes instantanées",
    desc: "Notifications en direct pour les tentatives de fraude",
  },
  {
    icon: BarChart3,
    title: "Analyses détaillées",
    desc: "Rapports complets sur les performances et l'intégrité",
  },
];

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

  return (
    <div className="min-h-screen bg-vision-dark text-white relative overflow-hidden">
      <GridBackground />

      <div className="relative z-10 min-h-screen flex">
        {/* Left Panel — Branding */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 border-r border-white/10">
          {/* Logo — bigger, with subtle glow */}
          <div className="flex items-center animate-fadeIn">
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-[#3282B8]/20 to-[#BBE1FA]/15 rounded-2xl blur-xl" />
              <Logo size="xl" className="relative drop-shadow-2xl" />
            </div>
          </div>

          {/* Hero text */}
          <div className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <div className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#BBE1FA]/10 border border-[#BBE1FA]/20 text-[#BBE1FA] text-xs font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-[#BBE1FA] animate-pulse-soft" />
              Plateforme certifiée & sécurisée
            </div>
            <h1 className="text-5xl font-bold mt-4 mb-5 text-vision-gradient leading-tight tracking-tight">
              Examens sécurisés.<br />
              Résultats fiables.
            </h1>
            <p className="text-[#BBE1FA] text-lg leading-relaxed max-w-md">
              ExamGuard combine surveillance intelligente et interface fluide pour garantir l'intégrité de chaque évaluation.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            {features.map((f, i) => (
              <div
                key={i}
                className="glass-card flex items-start gap-4 p-4 rounded-2xl hover:border-white/20 transition-all group hover-lift"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#3282B8]/10 border border-[#3282B8]/20 flex items-center justify-center group-hover:bg-[#3282B8]/20 transition-all">
                  <f.icon className="w-4 h-4 text-[#3282B8]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-0.5">{f.title}</p>
                  <p className="text-xs text-[#BBE1FA]">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <p className="text-[#BBE1FA] text-xs">
            © 2026 ExamGuard. Tous droits réservés.
          </p>
        </div>

        {/* Right Panel — Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md animate-scaleIn">
            {/* Mobile logo — bigger, centered, with glow */}
            <div className="lg:hidden flex justify-center mb-10">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#3282B8]/25 to-[#BBE1FA]/20 rounded-3xl blur-2xl" />
                <Logo size="xl" className="relative drop-shadow-2xl" />
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Bienvenue</h2>
              <p className="text-[#BBE1FA] font-medium">
                Connectez-vous à votre espace{" "}
                <span className="text-[#BBE1FA]">ExamGuard</span>
              </p>
            </div>

            {/* Role Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl glass-card mb-7">
              {(["student", "admin"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    role === r
                      ? "btn-vision text-white shadow-lg"
                      : "text-[#BBE1FA] hover:text-white transition-smooth-fast"
                  }`}
                >
                  {r === "student" ? "Étudiant" : "Administrateur"}
                </button>
              ))}
            </div>

            {/* Card */}
            <div className="relative">
              <div className="absolute -inset-px bg-gradient-to-br from-[#3282B8]/30 via-transparent to-[#BBE1FA]/20 rounded-2xl blur-sm opacity-60" />
              <div className="relative glass-card-strong rounded-2xl p-8 shadow-2xl">
                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Adresse e-mail
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={
                        role === "student"
                          ? "etudiant@universite.fr"
                          : "admin@examguard.io"
                      }
                      className="w-full glass-input rounded-xl px-4 py-3 text-white placeholder:text-[#BBE1FA]/60 focus:outline-none transition-smooth"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-white">
                        Mot de passe
                      </label>
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-xs font-bold text-[#3282B8] hover:text-[#BBE1FA] transition-colors underline-offset-2 hover:underline"
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full glass-input rounded-xl px-4 py-3 pr-11 text-white placeholder:text-[#BBE1FA]/60 focus:outline-none transition-smooth"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#BBE1FA] hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember */}
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 rounded border-[#3282B8] bg-transparent accent-[#3282B8]"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium text-[#BBE1FA] cursor-pointer"
                    >
                      Se souvenir de moi
                    </label>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-vision disabled:opacity-70 text-white font-bold py-3 rounded-xl transition-all shadow-lg glow-blue flex items-center justify-center gap-2 group"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>
                          Se connecter en tant que{" "}
                          {role === "student" ? "Étudiant" : "Admin"}
                        </span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Security note */}
            <div className="mt-6 flex items-center justify-center gap-2 text-[#BBE1FA] text-xs font-medium">
              <Lock className="w-3 h-3" />
              <span>Connexion chiffrée TLS 1.3 · Données sécurisées</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}