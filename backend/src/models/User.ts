import { Schema, model, type InferSchemaType } from "mongoose";

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
    status: {
      type: String,
      enum: ["active", "suspended", "pending"],
      default: "active",
    },
    lastLoginAt: { type: Date },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } },
);

export type User = InferSchemaType<typeof userSchema>;
export const UserModel = model("User", userSchema);
