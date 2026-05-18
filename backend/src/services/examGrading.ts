/**
 * Correction et finalisation des tentatives d'examen.
 *
 * Helpers partagés entre les routes étudiant (soumission, expiration du temps)
 * et professeur (clôture d'un examen en cours).
 */
import { NotificationModel } from "../models/Notification.js";

/** Tri MCQ multi : compare deux ensembles d'options sans tenir compte de l'ordre. */
export function sameOptionSet(a: unknown, b: unknown): boolean {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  const sa = [...a].map(String).sort();
  const sb = [...b].map(String).sort();
  return sa.every((v, i) => v === sb[i]);
}

/** Auto-correction MCQ : retourne le score gagné et indique s'il reste des questions ouvertes. */
export function autoGrade(
  questions: any[],
  answersById: Map<number, any>,
): { score: number; hasOpen: boolean } {
  let score = 0;
  let hasOpen = false;
  for (const q of questions) {
    if (q.type !== "mcq") {
      hasOpen = true;
      continue;
    }
    const given = answersById.get(q.id);
    if (q.multiple && Array.isArray(q.correctOptionIds)) {
      if (sameOptionSet(given, q.correctOptionIds)) score += q.points;
    } else if (given === q.correctOptionId) {
      score += q.points;
    }
  }
  return { score, hasOpen };
}

/** Options de finalisation d'une tentative. */
export type FinalizeOptions = {
  /** Marque la tentative comme soumise automatiquement (et non par l'étudiant). */
  autoSubmitted?: boolean;
  /** Titre de notification personnalisé pour une soumission automatique. */
  autoSubmitTitle?: string;
};

/** Finalise une tentative : auto-corrige les MCQ, écrit le score, crée la notification. */
export async function finalizeAttempt(
  attempt: any,
  exam: any,
  options: FinalizeOptions = {},
) {
  const answersById = new Map<number, any>(
    (attempt.answers ?? []).map((a: any) => [a.questionId, a.value]),
  );
  const { score, hasOpen } = autoGrade(exam.questions ?? [], answersById);

  attempt.submittedAt = new Date();
  attempt.status = hasOpen ? "submitted" : "graded";
  attempt.score = score;
  attempt.maxScore = exam.totalPoints;
  if (options.autoSubmitted) attempt.autoSubmitted = true;
  await attempt.save();

  await NotificationModel.create({
    userId: attempt.studentId,
    type: hasOpen ? "exam-submitted" : "exam-graded",
    title: options.autoSubmitted
      ? (options.autoSubmitTitle ?? "Temps écoulé — examen soumis")
      : hasOpen
        ? "Examen soumis"
        : "Examen corrigé",
    message: hasOpen
      ? `${exam.title} : en attente de correction par le professeur.`
      : `${exam.title} : ${score}/${exam.totalPoints}`,
  });

  return { score, hasOpen };
}
