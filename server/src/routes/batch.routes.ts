import express from "express";
import {
  createBatch,
  generateInvite,
  joinBatch,
} from "../controllers/batch.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { allowRoles } from "../middleware/role.middleware";

const router = express.Router();

router.post("/", authMiddleware, allowRoles("TRAINER", "INSTITUTION"), createBatch);
router.post("/:id/invite", authMiddleware, allowRoles("TRAINER"), generateInvite);
router.post("/join", authMiddleware, allowRoles("STUDENT"), joinBatch);

export default router;