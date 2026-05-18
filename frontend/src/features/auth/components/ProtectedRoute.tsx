/**
 * ProtectedRoute
 * --------------
 * Garde de route appliquée aux pages réservées aux utilisateurs connectés.
 *
 *  - Aucun token valide (absent ou expiré) → redirection vers la connexion.
 *  - Token présent mais rôle insuffisant → redirection vers le dashboard du
 *    rôle réel (un étudiant ne peut pas ouvrir `/teacher`, et inversement).
 *
 * La vérification s'appuie sur les claims décodés côté client ; le backend
 * revérifie le token à chaque requête protégée.
 */
import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { getAuthClaims } from "@/shared/lib/api";
import { routeForRole, type AuthUser } from "@/features/auth/api";

interface ProtectedRouteProps {
  /** Rôle requis. Omis : la route exige seulement d'être connecté. */
  role?: AuthUser["role"];
  children: ReactNode;
}

/** Enveloppe une route privée et redirige si l'accès n'est pas autorisé. */
export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const claims = getAuthClaims();
  if (!claims) return <Navigate to="/" replace />;
  if (role && claims.role !== role) {
    return <Navigate to={routeForRole(claims.role)} replace />;
  }
  return <>{children}</>;
}
