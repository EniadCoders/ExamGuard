/**
 * Client HTTP centralisé pour communiquer avec l'API ExamGuard.
 *
 * Ce module expose :
 *  - La gestion du JWT (`getToken` / `setToken`) avec un choix de persistance :
 *    `localStorage` (appareil mémorisé) ou `sessionStorage` (session de l'onglet).
 *  - La synchronisation entre onglets (`watchForeignAuthChanges`) : une connexion
 *    ou déconnexion dans un autre onglet invalide la session locale.
 *  - Le décodage des claims du JWT (`getAuthClaims`) pour les gardes de routes.
 *  - Une classe d'erreur `ApiError` enrichie du code HTTP.
 *  - Un helper `api()` qui injecte automatiquement les headers JSON et
 *    l'Authorization Bearer, puis parse la réponse JSON.
 *
 * Toutes les requêtes sont préfixées par `/api` (proxy défini dans la config Vite).
 */

/** Clé utilisée pour persister le JWT de l'utilisateur. */
const TOKEN_KEY = "examguard_token";

/**
 * Clé de diffusion inter-onglets : sa valeur change à chaque connexion ou
 * déconnexion. Les autres onglets réagissent via l'événement `storage`.
 */
const AUTH_SIGNAL_KEY = "examguard_auth_signal";

/** Identifiant du dernier signal émis par CET onglet (pour ignorer son propre événement). */
let currentTabAuthId: string | null = null;

/**
 * Récupère le JWT actuellement stocké dans le navigateur.
 *
 * Le `sessionStorage` (session non mémorisée, propre à l'onglet) a priorité sur
 * le `localStorage` (appareil mémorisé, partagé entre onglets).
 *
 * @returns Le token JWT ou `null` si aucun utilisateur n'est connecté.
 */
export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY);
}

/**
 * Stocke ou supprime le JWT, et notifie les autres onglets du changement.
 *
 * @param token - Le JWT à enregistrer, ou `null` pour déconnecter l'utilisateur.
 * @param remember - `true` : persiste dans `localStorage` (l'utilisateur reste
 *   connecté après fermeture du navigateur). `false` : `sessionStorage`, la
 *   session est effacée à la fermeture de l'onglet. Ignoré quand `token` est `null`.
 */
export function setToken(token: string | null, remember = true) {
  if (token) {
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
      sessionStorage.removeItem(TOKEN_KEY);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
      localStorage.removeItem(TOKEN_KEY);
    }
  } else {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  }
  broadcastAuthChange();
}

/** Émet un signal `storage` pour prévenir les autres onglets d'un changement d'auth. */
function broadcastAuthChange() {
  currentTabAuthId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  localStorage.setItem(AUTH_SIGNAL_KEY, currentTabAuthId);
}

/**
 * Surveille les connexions / déconnexions effectuées dans les AUTRES onglets.
 *
 * Lorsqu'un autre onglet change de compte, la session de cet onglet n'est plus
 * cohérente : on efface le token propre à l'onglet (`sessionStorage`) puis on
 * recharge la page pour que les gardes de routes resynchronisent l'affichage.
 *
 * @returns Une fonction de désabonnement (à appeler au démontage).
 */
export function watchForeignAuthChanges(): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key !== AUTH_SIGNAL_KEY || !e.newValue) return;
    if (e.newValue === currentTabAuthId) return; // signal émis par cet onglet
    sessionStorage.removeItem(TOKEN_KEY);
    window.location.reload();
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

/** Claims contenus dans un JWT ExamGuard. */
export type AuthClaims = {
  userId: string;
  role: "student" | "teacher" | "superadmin";
  sessionId?: string;
  /** Expiration (timestamp Unix en secondes). */
  exp?: number;
};

/**
 * Décode les claims du JWT courant sans vérifier la signature.
 *
 * Suffisant pour les gardes de routes côté client : le serveur revérifie le
 * token à chaque requête protégée.
 *
 * @returns Les claims, ou `null` si aucun token, token illisible ou expiré.
 */
export function getAuthClaims(): AuthClaims | null {
  const token = getToken();
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const payload = JSON.parse(atob(padded)) as AuthClaims;
    if (payload.exp && payload.exp * 1000 <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Erreur applicative levée lorsqu'une requête API retourne un statut HTTP non-OK.
 *
 * Conserve le code HTTP (`status`) afin que les composants appelants puissent
 * réagir différemment selon le type d'échec (401, 403, 404, 500, etc.).
 */
export class ApiError extends Error {
  /**
   * @param status - Code HTTP renvoyé par le serveur.
   * @param message - Message d'erreur (issu du backend ou message par défaut).
   */
  constructor(public status: number, message: string) {
    super(message);
  }
}

/**
 * Effectue une requête HTTP vers l'API ExamGuard.
 *
 * Ajoute automatiquement :
 *  - Le header `Content-Type: application/json`.
 *  - Le header `Authorization: Bearer <token>` si un JWT est présent.
 *
 * Parse la réponse en JSON et lève une `ApiError` si le statut HTTP n'est pas OK.
 *
 * @typeParam T - Type attendu de la réponse parsée.
 * @param path - Chemin relatif de l'endpoint (ex: `/auth/login`), sans le préfixe `/api`.
 * @param init - Options `fetch` standard (méthode, body, headers supplémentaires, etc.).
 * @returns La réponse parsée en JSON, typée selon `T`.
 * @throws {ApiError} Si la réponse HTTP n'est pas OK.
 */
export async function api<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new ApiError(res.status, data?.error ?? `request failed (${res.status})`);
  }
  return data as T;
}
