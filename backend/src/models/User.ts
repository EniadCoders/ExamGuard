import { Schema, model, type InferSchemaType } from "mongoose";

/** Préférences personnalisables stockées sous forme de sous-document. */
const preferencesSchema = new Schema(
  {
    emailFraudCritical: { type: Boolean, default: true },
    emailDailyDigest: { type: Boolean, default: true },
    emailExamSubmissions: { type: Boolean, default: true },
    realtimeFraud: { type: Boolean, default: true },
    realtimeStudentActivity: { type: Boolean, default: false },
    realtimeTechnical: { type: Boolean, default: true },
    defaultExamDuration: { type: Number, default: 90 },
    defaultPassingScore: { type: Number, default: 12 },
    examLanguage: { type: String, default: "fr" },
    timezone: { type: String, default: "europe/paris" },
  },
  { _id: false },
);

/** Schéma User : étudiants, professeurs et super-admin partagent ce modèle. */
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "teacher", "superadmin"],
      required: true,
    },
    fullName: { type: String, required: true },
    department: { type: String, default: "" },
    school: { type: String, default: "" },
    program: { type: String, default: "" },
    studentIdentifierType: { type: String, enum: ["apogee", "cne"] },
    studentIdentifier: { type: String },
    phone: { type: String, default: "" },
    title: { type: String, default: "" },
    location: { type: String, default: "" },
    bio: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    preferences: { type: preferencesSchema, default: () => ({}) },
    status: {
      type: String,
      enum: ["active", "suspended", "pending"],
      default: "active",
    },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

export type User = InferSchemaType<typeof userSchema>;
export const UserModel = model("User", userSchema);
