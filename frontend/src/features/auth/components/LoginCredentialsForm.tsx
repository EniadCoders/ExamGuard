/**
 * Formulaire email + mot de passe de la page de connexion.
 * Gère son propre état (saisie, chargement, erreur), appelle `login()`
 * et remonte l'utilisateur authentifié via `onSuccess` pour que la page
 * gère la redirection selon le rôle.
 */
import { useState } from "react";
import { useNavigate } from "react-router";
import { login, routeForRole, type AuthUser } from "@/features/auth/api";
import { ApiError } from "@/shared/lib/api";
import {
  authFieldClass,
  authLabelClass,
  authPrimaryButtonClass,
} from "@/features/auth/components/AuthPageLayout";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { RoleTabs } from "@/features/auth/components/RoleTabs";

type Role = "student" | "teacher";

interface LoginCredentialsFormProps {
  onSuccess: (user: AuthUser) => void;
}

const roleOptions = [
  { value: "student" as const, label: "Étudiant" },
  { value: "teacher" as const, label: "Professeur" },
];

/** Sous-écran principal du login : onglets rôle + saisie email/mot de passe + soumission. */
export function LoginCredentialsForm({ onSuccess }: LoginCredentialsFormProps) {
  const navigate = useNavigate();

  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Envoie les identifiants à l'API ; mappe les statuts HTTP vers un message d'erreur français.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const user = await login(email, password);
      onSuccess(user);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) setError("Email ou mot de passe incorrect.");
        else if (err.status === 403) setError("Votre compte est suspendu. Contactez le support.");
        else if (err.status === 400) setError("Veuillez renseigner votre email et votre mot de passe.");
        else setError("Connexion impossible. Réessayez.");
      } else {
        setError("Connexion impossible. Vérifiez votre connexion.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Décorateur de setter : applique la nouvelle valeur et efface l'erreur affichée si besoin.
  const clearErrorOn = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    if (error) setError("");
  };

  return (
    <>
      <RoleTabs value={role} onChange={setRole} options={roleOptions} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-[clamp(0.62rem,1.2vh,0.9rem)]">
        <div>
          <label className={authLabelClass} htmlFor="login-email">
            Email / nom d'utilisateur
          </label>
          <input
            id="login-email"
            type="text"
            value={email}
            onChange={(e) => clearErrorOn(setEmail)(e.target.value)}
            placeholder="Nom d'utilisateur ou email"
            required
            aria-invalid={Boolean(error)}
            className={`${authFieldClass} ${
              error ? "border-[var(--cyber-danger)] focus:border-[var(--cyber-danger)]" : ""
            }`}
          />
        </div>

        <div>
          <div className="mb-[clamp(0.32rem,0.7vh,0.45rem)] flex items-center justify-between gap-3">
            <label className={`${authLabelClass} mb-0`} htmlFor="login-password">
              Mot de passe
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-[clamp(0.64rem,1vh,0.76rem)] font-semibold text-[var(--cyber-accent)] transition hover:text-white"
            >
              Mot de passe oublié ?
            </button>
          </div>

          <PasswordInput
            id="login-password"
            value={password}
            onChange={clearErrorOn(setPassword)}
            placeholder="Mot de passe"
            required
            invalid={Boolean(error)}
            ariaDescribedBy={error ? "login-error" : undefined}
          />
          {error ? (
            <p
              id="login-error"
              role="alert"
              className="mt-[clamp(0.32rem,0.7vh,0.45rem)] text-[clamp(0.68rem,1.05vh,0.8rem)] font-semibold text-[var(--cyber-danger)]"
            >
              {error}
            </p>
          ) : null}
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
            <span>Se souvenir de cet appareil</span>
          </label>
          <span className="text-[clamp(0.58rem,0.95vh,0.72rem)] uppercase tracking-[0.16em] text-[var(--cyber-subtle-text)] md:tracking-[0.2em]">
            {role === "student" ? "Portail étudiant" : "Portail professeur"}
          </span>
        </div>

        <button type="submit" disabled={isLoading} className={authPrimaryButtonClass}>
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[rgba(4,17,23,0.18)] border-t-[rgba(4,17,23,0.95)]" />
          ) : (
            "Se connecter"
          )}
        </button>
      </form>
    </>
  );
}

export { routeForRole };
