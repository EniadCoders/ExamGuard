import "dotenv/config";
import express from "express";
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
