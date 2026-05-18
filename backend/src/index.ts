import "dotenv/config";
import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectToDatabase } from "./db.js";
import "./models/index.js";
import authRouter from "./routes/auth.js";
import studentRouter from "./routes/student.js";
import teacherRouter from "./routes/teacher.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authRouter);
app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);

app.get("/api/health", (_req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  res.json({
    status: "ok",
    db: states[mongoose.connection.readyState] ?? "unknown",
    dbName: mongoose.connection.name,
  });
});

/**
 * Handler d'erreurs global : sans lui, une route `async` qui rejette laisse la
 * requête HTTP en suspens et le client voit "serveur injoignable". On traduit
 * les erreurs Mongoose en 400 et tout le reste en 500 avec un message lisible.
 */
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof mongoose.Error.ValidationError) {
    const fields = Object.entries(err.errors).map(([path, e]) => ({
      path,
      message: e.message,
    }));
    return res.status(400).json({ error: "validation failed", fields });
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: `invalid value for ${err.path}` });
  }
  console.error("[server] unhandled error:", err);
  const message = err instanceof Error ? err.message : "internal server error";
  res.status(500).json({ error: message });
});

const PORT = Number(process.env.PORT ?? 4000);
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("[server] MONGODB_URI is missing in .env");
  process.exit(1);
}

connectToDatabase(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[server] listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("[server] failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
