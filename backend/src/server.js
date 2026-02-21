import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import vehicleRoutes from "./routes/vehicle.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import maintenanceRoutes from "./routes/maintenance.routes.js";
import authRoutes from "./routes/auth.routes.js";
// ADD THIS LINE (YOUR ROUTES)
import intelligenceRoutes from "./routes/intelligence.routes.js";

dotenv.config();

const app = express();
app.get("/", (req, res) => {
    res.json({
        service: "FleetFlow Backend",
        status: "Running",
        version: "1.0"
    });
});

app.use(cors());
app.use(express.json());

// Core system routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/maintenance", maintenanceRoutes);

// ADD THIS BLOCK (DO NOT REMOVE maintenanceRoutes)
app.use("/api/intelligence", intelligenceRoutes);

// Health check
app.get("/health", (req, res) => res.send("Server Running"));

app.listen(5000, () => console.log("Server running on port 5000"));