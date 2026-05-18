/**
 * Section "Mot de passe" des paramètres étudiant : ancien mot de passe + nouveau
 * + confirmation, avec indicateur visuel de force calculé en temps réel et
 * toggle d'affichage en clair.
 */
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  textColor: string;
}

function computeStrength(pwd: string): PasswordStrength {
  if (!pwd) {
    return { score: 0, label: "", color: "bg-[#E5E5E5]", textColor: "text-transparent" };
  }
  let score = 0;
  if (pwd.length >= 8) score += 1;
  if (/[A-Z]/.test(pwd)) score += 1;
  if (/[0-9]/.test(pwd)) score += 1;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

  if (score <= 1) return { score: 1, label: "Faible", color: "bg-red-500", textColor: "text-red-500" };
  if (score === 2 || score === 3)
    return { score: 2, label: "Moyenne", color: "bg-yellow-500", textColor: "text-yellow-500" };
  return { score: 3, label: "Forte", color: "bg-green-500", textColor: "text-green-500" };
}

export function PasswordSettings() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const strength = computeStrength(newPassword);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-black mb-6">Changer le mot de passe</h2>
      <div className="space-y-5">
        <PasswordField
          label="Mot de passe actuel"
          visible={showCurrent}
          onToggleVisibility={() => setShowCurrent((v) => !v)}
        />

        <div>
          <label className="block text-sm font-medium text-black mb-2">Nouveau mot de passe</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#F5F7FB] border border-[#E5E5E5] rounded-xl px-4 py-3 pr-12 text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666666] hover:text-black"
            >
              {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {newPassword && (
            <div className="mt-3">
              <div className="flex gap-2 mb-1.5 h-1.5 w-full rounded-full overflow-hidden">
                <div
                  className={`h-full flex-1 rounded-full transition-colors ${
                    strength.score >= 1 ? strength.color : "bg-[#E5E5E5]"
                  }`}
                ></div>
                <div
                  className={`h-full flex-1 rounded-full transition-colors ${
                    strength.score >= 2 ? strength.color : "bg-[#E5E5E5]"
                  }`}
                ></div>
                <div
                  className={`h-full flex-1 rounded-full transition-colors ${
                    strength.score >= 3 ? strength.color : "bg-[#E5E5E5]"
                  }`}
                ></div>
              </div>
              <p className={`text-xs font-medium text-right ${strength.textColor}`}>
                Force : {strength.label}
              </p>
            </div>
          )}
        </div>

        <PasswordField
          label="Confirmer le mot de passe"
          visible={showConfirm}
          onToggleVisibility={() => setShowConfirm((v) => !v)}
        />
      </div>
      <div className="flex justify-stretch pt-4 sm:justify-end">
        <button className="w-full rounded-xl bg-[#00809D] px-6 py-3 font-bold text-white transition-all hover:bg-[#1C1C1C] sm:w-auto">
          Mettre à jour le mot de passe
        </button>
      </div>
    </div>
  );
}

interface PasswordFieldProps {
  label: string;
  visible: boolean;
  onToggleVisibility: () => void;
}

function PasswordField({ label, visible, onToggleVisibility }: PasswordFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-black mb-2">{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          className="w-full bg-[#F5F7FB] border border-[#E5E5E5] rounded-xl px-4 py-3 pr-12 text-black focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666666] hover:text-black"
        >
          {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
