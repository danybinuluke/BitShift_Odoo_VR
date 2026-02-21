import express from "express";
import {
    fleetRiskController,
    recommendAssignmentController,
    metricsController,
    profitMetricsController,
    aiHealthController,
    profitTrendController,
    costPerKmController
} from "../controllers/intelligence.controller.js";

const router = express.Router();

router.get("/fleet-risk", fleetRiskController);
router.post("/recommend", recommendAssignmentController);
router.get("/metrics", metricsController);
router.get("/profit-metrics", profitMetricsController);
router.get("/ai-health", aiHealthController);
router.get("/profit-trend", profitTrendController);
router.get("/cost-per-km/:vehicleId", costPerKmController);
export default router;