import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ActiveSessionModel } from "../models/ActiveSession.js";

export type AuthPayload = {
  userId: string;
  role: "student" | "teacher" | "superadmin";
  /** Identifiant de la session active liée au token (révocation). */
  sessionId?: string;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "missing token" });
  }
  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    // Token rattaché à une session : rejeté si la session a été révoquée.
    if (payload.sessionId) {
      const session = await ActiveSessionModel.exists({ _id: payload.sessionId });
      if (!session) return res.status(401).json({ error: "session revoked" });
    }
    req.auth = payload;
    next();
  } catch {
    res.status(401).json({ error: "invalid token" });
  }
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

export function requireRole(...roles: AuthPayload["role"][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) return res.status(401).json({ error: "missing token" });
    if (!roles.includes(req.auth.role)) {
      return res.status(403).json({ error: "forbidden" });
    }
    next();
  };
}
