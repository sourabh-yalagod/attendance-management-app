import express from "express";
import {
  createSession,
  getSessionAttendance,
} from "../controllers/session.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { allowRoles } from "../middleware/role.middleware";

const router = express.Router();

router.post("/", authMiddleware, allowRoles("TRAINER"), createSession);
router.get("/:id/attendance", authMiddleware, allowRoles("TRAINER"), getSessionAttendance);

export default router;