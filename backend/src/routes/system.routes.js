import express from "express";
import { systemStatusController } from "../controllers/system.controller.js";

const router = express.Router();

router.get("/status", systemStatusController);

export default router;