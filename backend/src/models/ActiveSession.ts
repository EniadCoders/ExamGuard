import { Schema, model, Types, type InferSchemaType } from "mongoose";

const activeSessionSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    device: { type: String, required: true }, // e.g. "Chrome - macOS"
    ip: { type: String, default: "" },
    location: { type: String, default: "" },
    lastActiveAt: { type: Date, default: Date.now },
    current: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type ActiveSession = InferSchemaType<typeof activeSessionSchema>;
export const ActiveSessionModel = model("ActiveSession", activeSessionSchema);
