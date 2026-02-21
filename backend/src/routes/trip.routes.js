import express from "express";
import {
    createTrip,
    completeTrip,
    getTrips
} from "../controllers/trip.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getTrips);
router.post("/", protect, authorize("DISPATCHER"), createTrip);
router.post("/:tripId/complete", protect, authorize("DISPATCHER"), completeTrip);

export default router;