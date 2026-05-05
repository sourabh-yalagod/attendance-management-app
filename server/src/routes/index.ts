import express from "express";
import batchRoutes from "./batch.routes";
import sessionRoutes from "./session.routes";
import attendanceRoutes from "./attendance.routes";
import summaryRoutes from "./summary.routes";

const router = express.Router();

router.use("/batches", batchRoutes);
router.use("/sessions", sessionRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/", summaryRoutes);

export default router;