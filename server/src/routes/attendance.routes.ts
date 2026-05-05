import express from "express";
import { markAttendance } from "../controllers/attendance.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { allowRoles } from "../middleware/role.middleware";

const router = express.Router();

router.post("/mark", authMiddleware, allowRoles("STUDENT"), markAttendance);

export default router;