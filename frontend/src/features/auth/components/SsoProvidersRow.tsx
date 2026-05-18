/**
 * Rangée des fournisseurs SSO (accès sécurisé, Google, GitHub,
 * organisation) au-dessus du formulaire de connexion. Chaque bouton
 * délègue son action au parent via une prop optionnelle.
 */
import { Building2, Github, ShieldCheck } from "lucide-react";
import imgGoogleIcon from "@/assets/8e4241399baefbe8f8feffab0fe67682e140e1b1.png";
import { authProviderButtonClass } from "@/features/auth/components/AuthPageLayout";

interface SsoProvidersRowProps {
  onSecureAccess?: () => void;
  onGoogle?: () => void;
  onGitHub?: () => void;
  onOrganization?: () => void;
}

const iconClass = "h-[clamp(0.95rem,1.8vh,1.15rem)] w-[clamp(0.95rem,1.8vh,1.15rem)]";

/** Rangée des 4 fournisseurs SSO ; chaque bouton délègue son clic à une prop optionnelle. */
export function SsoProvidersRow({
  onSecureAccess,
  onGoogle,
  onGitHub,
  onOrganization,
}: SsoProvidersRowProps) {
  return (
    <div className="grid grid-cols-2 gap-[clamp(0.4rem,0.8vh,0.55rem)] sm:grid-cols-4">
      <button
        type="button"
        className={authProviderButtonClass}
        onClick={onSecureAccess}
        aria-label="Accès sécurisé"
      >
        <ShieldCheck className={iconClass} />
      </button>
      <button
        type="button"
        onClick={onGoogle}
        className={authProviderButtonClass}
        aria-label="Continuer avec Google"
      >
        <img src={imgGoogleIcon} alt="Google" className={`${iconClass} object-contain`} />
      </button>
      <button
        type="button"
        className={authProviderButtonClass}
        onClick={onGitHub}
        aria-label="Continuer avec GitHub"
      >
        <Github className={iconClass} />
      </button>
      <button
        type="button"
        className={authProviderButtonClass}
        onClick={onOrganization}
        aria-label="Continuer avec votre organisation"
      >
        <Building2 className={iconClass} />
      </button>
    </div>
  );
}
