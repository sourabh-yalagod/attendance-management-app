import express from "express";
import {
  batchSummary,
  programmeSummary,
} from "../controllers/summary.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { allowRoles } from "../middleware/role.middleware";
import { UserRole } from "../lib/enums/userRole";

const router = express.Router();

router.get("/batches/:id/summary", authMiddleware, allowRoles(UserRole.INSTITUTION), batchSummary);

router.get(
  "/programme/summary",
  authMiddleware,
  allowRoles(UserRole.PROGRAMME_MANAGER, UserRole.MONITORING_OFFICER),
  programmeSummary
);

export default router;