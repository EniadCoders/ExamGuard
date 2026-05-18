/**
 * LoginPage
 * ---------
 * Page de connexion principale d'ExamGuard.
 * Combine plusieurs méthodes d'authentification :
 *  - Fournisseurs SSO (Secure Access, Google, GitHub, Organisation).
 *  - Connexion classique email / mot de passe via LoginCredentialsForm.
 *
 * Après authentification, l'utilisateur est redirigé vers la route correspondant
 * à son rôle (étudiant, professeur, admin) grâce à routeForRole().
 *
 * Routes liées : "/sign-up" (création de compte).
 */
import { useNavigate } from "react-router";
import { routeForRole } from "@/features/auth/api";
import {
  AuthCard,
  AuthHeading,
  AuthPageLayout,
  authFooterLinkClass,
  authFooterTextClass,
  authTextLinkClass,
} from "@/features/auth/components/AuthPageLayout";
import { LoginCredentialsForm } from "@/features/auth/components/LoginCredentialsForm";
import { OrDivider } from "@/features/auth/components/OrDivider";
import { SsoProvidersRow } from "@/features/auth/components/SsoProvidersRow";

// Composant principal de la page de connexion : assemble les boutons SSO,
// le formulaire email/mot de passe et redirige selon le rôle de l'utilisateur authentifié.
export function LoginPage() {
  const navigate = useNavigate();

  return (
    <AuthPageLayout>
      <AuthCard>
        <AuthHeading title="Connexion" description="Saisissez vos informations de compte." />

        <SsoProvidersRow
          onSecureAccess={() => console.log("Secure access provider clicked")}
          onGoogle={() => console.log("Google login clicked")}
          onGitHub={() => console.log("GitHub login clicked")}
          onOrganization={() => console.log("Organization login clicked")}
        />

        <OrDivider />

        <LoginCredentialsForm onSuccess={(user) => navigate(routeForRole(user.role))} />

        <div className={`space-y-[clamp(0.28rem,0.7vh,0.45rem)] text-center ${authFooterTextClass}`}>
          <button
            type="button"
            className={authFooterLinkClass}
            onClick={() => console.log("Organization SSO clicked")}
          >
            Se connecter avec le SSO de votre organisation
          </button>
          <p className="text-[var(--cyber-muted-text)]">
            Vous n&apos;avez pas de compte ?{" "}
            <button
              type="button"
              className={authTextLinkClass}
              onClick={() => navigate("/sign-up")}
            >
              Créer un compte
            </button>
          </p>
        </div>
      </AuthCard>
    </AuthPageLayout>
  );
}
