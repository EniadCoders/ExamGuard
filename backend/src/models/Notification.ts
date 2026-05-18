import { Schema, model, Types, type InferSchemaType } from "mongoose";

/** Schéma Notification : message in-app destiné à un utilisateur. */
const notificationSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, required: true }, // e.g. "exam-scheduled", "exam-graded", "system"
    title: { type: String, required: true },
    message: { type: String, default: "" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type Notification = InferSchemaType<typeof notificationSchema>;
export const NotificationModel = model("Notification", notificationSchema);
