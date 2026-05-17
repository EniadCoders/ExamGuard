import { Schema, model, Types, type InferSchemaType } from "mongoose";

const mcqOptionSchema = new Schema(
  { id: { type: String, required: true }, text: { type: String, required: true } },
  { _id: false },
);

const questionSchema = new Schema(
  {
    id: { type: Number, required: true },
    type: { type: String, enum: ["mcq", "text", "code"], required: true },
    text: { type: String, required: true },
    points: { type: Number, required: true },
    // mcq
    options: { type: [mcqOptionSchema], default: undefined },
    correctOptionId: { type: String },
    correctOptionIds: { type: [String], default: undefined },
    multiple: { type: Boolean },
    // text
    placeholder: { type: String },
    minWords: { type: Number },
    // code
    language: { type: String, enum: ["java", "python", "cpp", "javascript", "c"] },
    starterCode: { type: String },
  },
  { _id: false },
);

const examRulesSchema = new Schema(
  {
    shuffleQuestions: { type: Boolean, default: true },
    shuffleOptions: { type: Boolean, default: true },
    allowBacktrack: { type: Boolean, default: true },
    showResultsImmediately: { type: Boolean, default: false },
    requireFullscreen: { type: Boolean, default: true },
    blockTabSwitch: { type: Boolean, default: true },
    preventCopyPaste: { type: Boolean, default: true },
    showTimer: { type: Boolean, default: true },
    warnBeforeEnd: { type: Boolean, default: true },
    attempts: { type: Number, default: 1 },
  },
  { _id: false },
);

const examSchema = new Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    joinCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: "" },
    durationMinutes: { type: Number, required: true },
    scheduledAt: { type: Date },
    status: {
      type: String,
      enum: ["draft", "scheduled", "ongoing", "live", "completed", "archived"],
      default: "draft",
    },
    previousStatus: {
      type: String,
      enum: ["draft", "scheduled", "completed"],
    },
    passingScore: { type: Number, default: 12 },
    launchMode: { type: String, enum: ["auto", "manual"], default: "auto" },
    importedFileName: { type: String, default: "" },
    rules: { type: examRulesSchema, default: () => ({}) },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    enrolledStudents: { type: [{ type: Types.ObjectId, ref: "User" }], default: [] },
    totalPoints: { type: Number, default: 0 },
    questions: { type: [questionSchema], default: [] },
  },
  { timestamps: true },
);

export type Exam = InferSchemaType<typeof examSchema>;
export const ExamModel = model("Exam", examSchema);
