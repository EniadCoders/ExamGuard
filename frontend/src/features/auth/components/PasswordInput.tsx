/**
 * Champ mot de passe avec bouton œil pour afficher/masquer la saisie.
 * Encapsule le toggle de visibilité, l'état `invalid` et les attributs
 * d'accessibilité (`aria-invalid`, `aria-describedby`). Réutilisé dans
 * le login et les deux champs de l'inscription.
 */
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authFieldClass } from "@/features/auth/components/AuthPageLayout";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  ariaDescribedBy?: string;
  autoComplete?: string;
}

const toggleButtonClass =
  "absolute right-[clamp(0.55rem,0.9vw,0.75rem)] top-1/2 -translate-y-1/2 rounded-full p-[clamp(0.3rem,0.7vh,0.45rem)] text-[var(--cyber-muted-text)] transition hover:bg-[rgba(123,241,255,0.08)] hover:text-white";

/** Input mot de passe contrôlé : bouton œil pour basculer visible/masqué + style d'erreur. */
export function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  required,
  invalid,
  ariaDescribedBy,
  autoComplete,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={invalid || undefined}
        aria-describedby={ariaDescribedBy}
        className={`${authFieldClass} pr-11 sm:pr-12 ${
          invalid ? "border-[var(--cyber-danger)] focus:border-[var(--cyber-danger)]" : ""
        }`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className={toggleButtonClass}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
      >
        {visible ? (
          <EyeOff className="h-[clamp(0.85rem,1.5vh,1rem)] w-[clamp(0.85rem,1.5vh,1rem)]" />
        ) : (
          <Eye className="h-[clamp(0.85rem,1.5vh,1rem)] w-[clamp(0.85rem,1.5vh,1rem)]" />
        )}
      </button>
    </div>
  );
}
