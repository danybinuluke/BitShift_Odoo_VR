import express from "express";
import { addMaintenance } from "../controllers/maintenance.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

/* MANAGER ONLY */
router.post("/", protect, authorize("MANAGER"), addMaintenance);

export default router;