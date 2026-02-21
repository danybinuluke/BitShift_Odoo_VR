import express from "express";
import {
    addMaintenance,
    finishMaintenance,
    getMaintenances
} from "../controllers/maintenance.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getMaintenances);
router.post("/", protect, authorize("MANAGER"), addMaintenance);
router.put("/:vehicleId/finish", protect, authorize("MANAGER"), finishMaintenance);

export default router;