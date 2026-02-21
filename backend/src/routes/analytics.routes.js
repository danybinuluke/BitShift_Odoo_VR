import express from "express";
import {
    getFinanceDashboard,
    getSafetyDashboard
} from "../controllers/analytics.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Finance Role Only
router.get(
    "/finance",
    protect,
    authorize("FINANCE"),
    getFinanceDashboard
);

// Safety Role Only
router.get(
    "/safety",
    protect,
    authorize("SAFETY"),
    getSafetyDashboard
);

export default router;