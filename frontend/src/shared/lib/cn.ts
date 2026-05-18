/**
 * Utilitaire de composition de classes CSS Tailwind.
 *
 * Combine `clsx` (gestion conditionnelle des classes) et `tailwind-merge`
 * (résolution intelligente des conflits entre classes Tailwind, ex: `p-2 p-4` → `p-4`).
 *
 * @example
 * cn("px-2 py-1", isActive && "bg-blue-500", "px-4") // → "py-1 bg-blue-500 px-4"
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fusionne plusieurs valeurs de classes CSS en une chaîne unique optimisée pour Tailwind.
 *
 * @param inputs - Liste de classes (strings, objets conditionnels, tableaux, etc.)
 * @returns Chaîne de classes CSS sans conflits Tailwind.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
