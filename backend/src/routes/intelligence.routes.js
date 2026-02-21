import express from "express";
import {
    fleetRiskController,
    recommendAssignmentController,
    metricsController,
    profitMetricsController
} from "../controllers/intelligence.controller.js";

const router = express.Router();

router.get("/fleet-risk", fleetRiskController);
router.post("/recommend", recommendAssignmentController);
router.get("/metrics", metricsController);
router.get("/profit-metrics", profitMetricsController);

export default router;