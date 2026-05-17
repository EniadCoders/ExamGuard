import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// Toutes les routes professeur exigent un compte authentifié avec le rôle "teacher".
router.use(requireAuth, requireRole("teacher"));

export default router;
