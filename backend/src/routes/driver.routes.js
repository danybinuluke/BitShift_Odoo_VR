import express from "express";
import {
    createDriver,
    getDrivers
} from "../controllers/driver.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

/* MANAGER or SAFETY can add driver */
router.post("/", protect, authorize("MANAGER", "SAFETY"), createDriver);

/* Logged in users can view drivers */
router.get("/", protect, getDrivers);

export default router;