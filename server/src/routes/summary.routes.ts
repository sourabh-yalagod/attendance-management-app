import express from "express";
import {
  batchSummary,
  programmeSummary,
} from "../controllers/summary.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { allowRoles } from "../middleware/role.middleware";

const router = express.Router();

router.get("/batches/:id/summary", authMiddleware, allowRoles("INSTITUTION"), batchSummary);

router.get(
  "/programme/summary",
  authMiddleware,
  allowRoles("PROGRAMME_MANAGER", "MONITORING_OFFICER"),
  programmeSummary
);

export default router;