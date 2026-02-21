import express from "express";
import {
    createVehicle,
    getVehicles
} from "../controllers/vehicle.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

/* MANAGER ONLY */
router.post("/", protect, authorize("MANAGER"), createVehicle);

/* All logged in users can view */
router.get("/", protect, getVehicles);

export default router;