import { Schema, model, Types, type InferSchemaType } from "mongoose";

const answerSchema = new Schema(
  {
    questionId: { type: Number, required: true },
    value: { type: Schema.Types.Mixed }, // string for mcq/text, { code, output, ... } for code
  },
  { _id: false },
);

const antiCheatEventSchema = new Schema(
  {
    type: { type: String, required: true }, // e.g. "tab-blur", "fullscreen-exit", "paste"
    timestamp: { type: Date, default: Date.now },
    details: { type: Schema.Types.Mixed },
  },
  { _id: false },
);

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
  },
  { timestamps: true },
);

examAttemptSchema.index({ examId: 1, studentId: 1 }, { unique: true });

export type ExamAttempt = InferSchemaType<typeof examAttemptSchema>;
export const ExamAttemptModel = model("ExamAttempt", examAttemptSchema);
