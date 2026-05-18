import { Schema, model, Types, type InferSchemaType } from "mongoose";

/** Réponse fournie par l'étudiant pour une question donnée. */
const answerSchema = new Schema(
  {
    questionId: { type: Number, required: true },
    value: { type: Schema.Types.Mixed }, // string for mcq/text, { code, output, ... } for code
  },
  { _id: false },
);

/** Message envoyé par le professeur à un étudiant pendant l'examen. */
const examMessageSchema = new Schema(
  {
    text: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

/** Évènement anti-triche horodaté (sortie plein écran, perte de focus, etc.). */
const antiCheatEventSchema = new Schema(
  {
    type: { type: String, required: true }, // e.g. "tab-blur", "fullscreen-exit", "paste"
    timestamp: { type: Date, default: Date.now },
    details: { type: Schema.Types.Mixed },
  },
  { _id: false },
);

/** Schéma ExamAttempt : une tentative d'examen unique par couple (examen, étudiant). */
const examAttemptSchema = new Schema(
  {
    examId: { type: Types.ObjectId, ref: "Exam", required: true },
    studentId: { type: Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["in-progress", "submitted", "graded"],
      default: "in-progress",
    },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date },
    score: { type: Number },
    maxScore: { type: Number },
    answers: { type: [answerSchema], default: [] },
    antiCheatEvents: { type: [antiCheatEventSchema], default: [] },
    questionOrder: { type: [Number], default: [] },
    autoSubmitted: { type: Boolean, default: false },
    /** Étudiant exclu de l'examen par le professeur. */
    kicked: { type: Boolean, default: false },
    /** Motif d'exclusion communiqué à l'étudiant. */
    kickReason: { type: String, default: "" },
    /** Messages reçus du professeur pendant l'examen. */
    messages: { type: [examMessageSchema], default: [] },
  },
  { timestamps: true },
);

/** Index unique : empêche deux tentatives pour le même couple examen / étudiant. */
examAttemptSchema.index({ examId: 1, studentId: 1 }, { unique: true });

export type ExamAttempt = InferSchemaType<typeof examAttemptSchema>;
export const ExamAttemptModel = model("ExamAttempt", examAttemptSchema);
