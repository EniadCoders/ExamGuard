/**
 * Client HTTP centralisé pour communiquer avec l'API ExamGuard.
 *
 * Ce module expose :
 *  - La gestion du JWT (`getToken` / `setToken`) via `localStorage`.
 *  - Une classe d'erreur `ApiError` enrichie du code HTTP.
 *  - Un helper `api()` qui injecte automatiquement les headers JSON et
 *    l'Authorization Bearer, puis parse la réponse JSON.
 *
 * Toutes les requêtes sont préfixées par `/api` (proxy défini dans la config Vite).
 */

/** Clé utilisée dans `localStorage` pour persister le JWT de l'utilisateur. */
const TOKEN_KEY = "examguard_token";

/**
 * Récupère le JWT actuellement stocké dans le navigateur.
 *
 * @returns Le token JWT ou `null` si aucun utilisateur n'est connecté.
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Stocke ou supprime le JWT dans `localStorage`.
 *
 * Passer `null` revient à déconnecter l'utilisateur en supprimant le token.
 *
 * @param token - Le JWT à enregistrer, ou `null` pour supprimer le token existant.
 */
export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
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
