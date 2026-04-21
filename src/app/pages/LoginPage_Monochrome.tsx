import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import imgLogo from "figma:asset/773b0834d55c508b618e28a0da9cc005c296dc99.png";
import imgGoogleIcon from "figma:asset/8e4241399baefbe8f8feffab0fe67682e140e1b1.png";
import svgPaths from "../../imports/svg-7qj2twbbtq";

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
    // Mock Google OAuth
    console.log("Google login clicked");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-[1138px] h-[808px] flex rounded-[50px] overflow-hidden shadow-[0_10px_60px_rgba(0,0,0,0.15)]">
        {/* Left Panel — Inspirational Quote */}
        <div className="hidden lg:flex flex-col justify-between w-[460px] bg-black p-12 relative">
          {/* Top Badge */}
          <div className="relative">
            <div className="flex items-center gap-4 mb-8">
              <p className="text-white text-[16px] font-normal uppercase tracking-wide">
                UNE CITATION INSPIRANTE
              </p>
              <div className="flex-1 h-px bg-white"></div>
            </div>
          </div>

          {/* Center Quote */}
          <div className="flex-1 flex items-end pb-12">
            <div>
              <h1 className="text-white text-[48px] leading-tight mb-6 font-serif" style={{ fontFamily: "'IM FELL French Canon', serif" }}>
                Le travail sincère mène au vrai succès.
              </h1>
              <p className="text-[#AAABAC] text-[16px] leading-relaxed max-w-[400px]">
                Accédez à un espace d'examen conçu pour assurer transparence, sécurité et égalité des chances.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel — Login Form */}
        <div className="flex-1 bg-white flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-[440px]">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img
                src={imgLogo}
                alt="ExamGuard"
                className="h-[23px] w-auto object-contain"
              />
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-[40px] font-serif leading-tight text-black mb-2" style={{ fontFamily: "'IM FELL French Canon', serif" }}>
                Bienvenue à nouveau
              </h2>
              <p className="text-[#AAABAC] text-[20px] font-light">
                Entrez votre e-mail et votre mot de passe pour accéder à votre compte
              </p>
            </div>

            {/* Role Toggle */}
            <div className="bg-black rounded-[10px] p-1 flex gap-1 mb-8">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex-1 h-[41px] rounded-lg font-medium text-[18px] transition-all ${
                  role === "student"
                    ? "bg-white text-black"
                    : "bg-transparent text-white hover:bg-[#2A2A2A]"
                }`}
              >
                Étudiant
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex-1 h-[41px] rounded-lg font-medium text-[18px] transition-all ${
                  role === "admin"
                    ? "bg-white text-black"
                    : "bg-transparent text-white hover:bg-[#2A2A2A]"
                }`}
              >
                Professeur
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-[18px] text-black mb-2 font-normal">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Entrez votre e-mail"
                  required
                  className="w-full bg-[#F5F7FB] border-0 rounded-[10px] px-[14px] py-3 h-[47px] text-[16px] text-black placeholder:text-[#AAABAC] focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[18px] text-black font-normal">
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-[14px] text-[#AAABAC] hover:text-black transition-colors"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    required
                    className="w-full bg-[#F5F7FB] border-0 rounded-[10px] px-[14px] py-3 h-[47px] pr-12 text-[16px] text-black placeholder:text-[#AAABAC] focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#AAABAC] hover:text-black transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1C1C1C] hover:bg-black disabled:opacity-70 text-white font-medium text-[20px] py-3 h-[52px] rounded-[10px] transition-all flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Se connecter"
                )}
              </button>

              {/* Google Login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white hover:bg-[#F5F7FB] border border-[#F0F0F0] text-[#1C1C1C] font-normal text-[15px] py-3 h-[52px] rounded-[10px] transition-all flex items-center justify-center gap-3"
              >
                <img
                  src={imgGoogleIcon}
                  alt="Google"
                  className="w-[18px] h-[18px] object-contain"
                />
                <span>
                  Se connecter avec <span className="font-bold">Google</span>
                </span>
              </button>
            </form>

            {/* Footer Link */}
            <div className="mt-8 text-center">
              <p className="text-[16px] text-black">
                Vous n'avez pas de compte ?{" "}
                <button
                  type="button"
                  className="font-semibold hover:underline"
                  onClick={() => console.log("Navigate to signup")}
                >
                  S'inscrire
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
