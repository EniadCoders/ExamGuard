import { Schema, model, type InferSchemaType } from "mongoose";

const auditLogSchema = new Schema(
  {
    action: { type: String, required: true },
    actorEmail: { type: String, required: true },
    level: {
      type: String,
      enum: ["info", "warn", "danger"],
      default: "info",
    },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } },
);

auditLogSchema.index({ createdAt: -1 });

export type AuditLog = InferSchemaType<typeof auditLogSchema>;
export const AuditLogModel = model("AuditLog", auditLogSchema);
