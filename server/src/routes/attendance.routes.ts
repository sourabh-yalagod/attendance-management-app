import express from "express";
import { markAttendance } from "../controllers/attendance.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { allowRoles } from "../middleware/role.middleware";
import { UserRole } from "../lib/enums/userRole";

const router = express.Router();

router.post("/mark", authMiddleware, allowRoles(UserRole.STUDENT), markAttendance);

export default router;