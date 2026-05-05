import express from "express";
import {
  createSession,
  getSessionAttendance,
} from "../controllers/session.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { allowRoles } from "../middleware/role.middleware";
import { UserRole } from "../lib/enums/userRole";

const router = express.Router();

router.post("/", authMiddleware, allowRoles(UserRole.TRAINER), createSession);
router.get("/:id/attendance", authMiddleware, allowRoles(UserRole.TRAINER), getSessionAttendance);

export default router;