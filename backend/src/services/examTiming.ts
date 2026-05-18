/**
 * Calcul du temps restant d'un examen.
 *
 * Tient compte du temps additionnel accordé par le professeur et des pauses.
 * Partagé entre les routes étudiant et professeur pour que les deux côtés
 * affichent exactement le même chronomètre.
 */

/** Millisecondes de pause à déduire des échéances (pauses passées + pause en cours). */
export function pausedMsOf(exam: any): number {
  const lc = exam?.liveControl ?? {};
  let ms = lc.totalPausedMs ?? 0;
  if (lc.paused && lc.pausedAt) {
    ms += Math.max(0, Date.now() - new Date(lc.pausedAt).getTime());
  }
  return ms;
}

/**
 * Secondes restantes à partir d'un instant de départ donné.
 *
 * @param exam - Examen (doit exposer `durationMinutes` et `liveControl`).
 * @param startedAt - Instant de départ du décompte (début de la tentative).
 */
export function remainingSecondsFrom(
  exam: any,
  startedAt: Date | string | number,
): number {
  const totalMs =
    (exam.durationMinutes + (exam.liveControl?.extraMinutes ?? 0)) * 60_000;
  const elapsedMs =
    Date.now() - new Date(startedAt).getTime() - pausedMsOf(exam);
  return Math.max(0, Math.round((totalMs - elapsedMs) / 1000));
}
