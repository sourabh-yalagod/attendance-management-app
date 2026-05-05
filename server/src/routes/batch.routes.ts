import express from "express";
import {
  createBatch,
  generateInvite,
  joinBatch,
} from "../controllers/batch.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { allowRoles } from "../middleware/role.middleware";
import { UserRole } from "../lib/enums/userRole";

const router = express.Router();

router.post("/", authMiddleware, allowRoles(UserRole.TRAINER, UserRole.INSTITUTION), createBatch);
router.post("/:id/invite", authMiddleware, allowRoles(UserRole.TRAINER), generateInvite);
router.post("/join", authMiddleware, allowRoles(UserRole.STUDENT), joinBatch);

export default router;