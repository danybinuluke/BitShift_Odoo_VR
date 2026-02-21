import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import systemRoutes from "./routes/system.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import maintenanceRoutes from "./routes/maintenance.routes.js";
import authRoutes from "./routes/auth.routes.js";
import intelligenceRoutes from "./routes/intelligence.routes.js";

dotenv.config();

const app = express();


// ===============================
// Core Middleware
// ===============================

app.use(cors());
app.use(express.json());


// ===============================
// Root Endpoint (Backend Info)
// ===============================

app.get("/", (req, res) => {

    res.json({
        service: "FleetFlow Backend",
        status: "Production Running",
        version: "1.0",
        aiService: process.env.AI_SERVICE_URL,
        timestamp: new Date()
    });

});


// ===============================
// API Root Endpoint (FULL ROUTE LIST)
// ===============================

app.get("/api", (req, res) => {

    res.json({

        message: "FleetFlow API is running",

        modules: {

            system: [
                "/api/system/status"
            ],

            auth: [
                "/api/auth/login",
                "/api/auth/register"
            ],

            vehicles: [
                "GET /api/vehicles",
                "POST /api/vehicles"
            ],

            drivers: [
                "GET /api/drivers",
                "POST /api/drivers"
            ],

            trips: [
                "GET /api/trips",
                "POST /api/trips"
            ],

            maintenance: [
                "GET /api/maintenance",
                "POST /api/maintenance"
            ],

            intelligence: [

                // Core Intelligence
                "GET /api/intelligence/metrics",
                "GET /api/intelligence/dashboard-summary",

                // Profit Intelligence
                "GET /api/intelligence/profit-metrics",
                "GET /api/intelligence/profit-trend",

                // Risk Intelligence
                "GET /api/intelligence/fleet-risk",

                // Cost Intelligence
                "GET /api/intelligence/cost-per-km/:vehicleId",

                // AI Recommendation
                "POST /api/intelligence/recommend",

                // AI Health
                "GET /api/intelligence/ai-health"

            ]

        }

    });

});


// ===============================
// Route Mounting
// ===============================

app.use("/api/system", systemRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/vehicles", vehicleRoutes);

app.use("/api/drivers", driverRoutes);

app.use("/api/trips", tripRoutes);

app.use("/api/maintenance", maintenanceRoutes);

app.use("/api/intelligence", intelligenceRoutes);


// ===============================
// Health Check Endpoint
// ===============================

app.get("/health", (req, res) => {

    res.send("Server Running");

});


// ===============================
// Start Server
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`FleetFlow Backend running on port ${PORT}`);

});