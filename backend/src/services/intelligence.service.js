import prisma from "../config/prisma.js";


// ===============================
// 1. Fleet Risk Engine
// ===============================
export const calculateFleetRisk = async () => {

    const vehiclesInShop =
        await prisma.vehicle.count({
            where: { status: "Maintenance" }
        });

    const expiredDrivers =
        await prisma.driver.count({
            where: {
                licenseExpiry: {
                    lt: new Date()
                }
            }
        });

    const totalVehicles =
        await prisma.vehicle.count();

    const riskScore =
        (vehiclesInShop * 5)
        +
        (expiredDrivers * 10);

    let riskLevel = "Low";

    if (riskScore > 50)
        riskLevel = "High";
    else if (riskScore > 20)
        riskLevel = "Moderate";

    return {
        riskScore,
        riskLevel,
        vehiclesInShop,
        expiredDrivers,
        totalVehicles
    };
};



// ===============================
// 2. Smart Assignment Engine (AI + Logic)
// ===============================
export const recommendAssignment =
    async (vehicleId, driverId, cargoWeight) => {

        // Fetch vehicle and driver
        const vehicle =
            await prisma.vehicle.findUnique({
                where: { id: vehicleId }
            });

        const driver =
            await prisma.driver.findUnique({
                where: { id: driverId }
            });

        if (!vehicle || !driver)
            throw new Error("Vehicle or Driver not found");


        // ===============================
        // AI Risk Prediction
        // ===============================
        const AI_URL =
            process.env.AI_SERVICE_URL ||
            "https://fleetflow-ai.onrender.com";

        let aiRiskLevel = "MEDIUM"; // fallback default

        try {

            const controller = new AbortController();
            const timeout =
                setTimeout(() => controller.abort(), 5000);

            const aiResponse = await fetch(
                `${AI_URL}/predict-driver-risk`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        safetyScore: driver.safetyScore,
                        tripsCompleted: 100,
                        fatigueLevel: 2
                    }),
                    signal: controller.signal
                }
            );

            clearTimeout(timeout);

            if (aiResponse.ok) {
                const aiResult = await aiResponse.json();
                aiRiskLevel = aiResult.riskLevel;
            }

        } catch (error) {

            console.warn(
                "AI service unavailable, using fallback logic"
            );

        }


        // ===============================
        // Logic-Based Scoring
        // ===============================

        const capacityScore =
            1 - (cargoWeight / vehicle.capacity);

        const safetyScore =
            driver.safetyScore / 100;

        const availabilityPenalty =
            vehicle.status === "OnTrip" ? 0.2 : 0;

        const baseScore =
            (0.6 * capacityScore)
            +
            (0.4 * safetyScore);

        let finalScore =
            baseScore - availabilityPenalty;


        // ===============================
        // AI Risk Adjustment
        // ===============================

        if (aiRiskLevel === "HIGH")
            finalScore -= 0.3;
        else if (aiRiskLevel === "MEDIUM")
            finalScore -= 0.1;


        // Prevent negative score
        finalScore = Math.max(0, finalScore);


        // ===============================
        // Recommendation Decision
        // ===============================

        let recommendation = "Risky";

        if (finalScore > 0.75)
            recommendation = "Optimal";
        else if (finalScore > 0.4)
            recommendation = "Moderate";


        return {
            intelligenceScore:
                Number(finalScore.toFixed(2)),
            recommendation,
            aiRiskLevel,
            vehicleStatus: vehicle.status,
            driverSafetyScore: driver.safetyScore
        };
    };



// ===============================
// 3. Fleet Performance Metrics
// ===============================
export const getFleetMetrics = async () => {

    const totalVehicles =
        await prisma.vehicle.count();

    const activeVehicles =
        await prisma.vehicle.count({
            where: { status: "OnTrip" }
        });

    const totalDrivers =
        await prisma.driver.count();

    const totalTrips =
        await prisma.trip.count();

    const utilization =
        totalVehicles === 0
            ? 0
            : (activeVehicles / totalVehicles) * 100;

    return {
        totalVehicles,
        activeVehicles,
        totalDrivers,
        totalTrips,
        utilization:
            Number(utilization.toFixed(2))
    };
};



// ===============================
// 4. Profit Intelligence Engine
// ===============================
export const getProfitMetrics = async () => {

    const trips =
        await prisma.trip.findMany();

    let totalRevenue = 0;
    let totalFuelCost = 0;
    let totalMaintenanceCost = 0;

    trips.forEach(trip => {

        totalRevenue += trip.revenue;
        totalFuelCost += trip.fuelCost;
        totalMaintenanceCost += trip.maintenanceCost;

    });

    const totalCost =
        totalFuelCost + totalMaintenanceCost;

    const profit =
        totalRevenue - totalCost;

    const profitMargin =
        totalRevenue === 0
            ? 0
            : (profit / totalRevenue) * 100;

    return {
        totalRevenue,
        totalCost,
        profit,
        profitMargin:
            Number(profitMargin.toFixed(2))
    };
};

// ===============================
// 5. AI Health Check
// ===============================
export const getAIHealth = async () => {

    const AI_URL =
        process.env.AI_SERVICE_URL ||
        "https://fleetflow-ai.onrender.com";

    try {

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(
            `${AI_URL}/health`,
            {
                method: "GET",
                signal: controller.signal
            }
        );

        clearTimeout(timeout);

        return {
            status: "UP",
            serviceUrl: AI_URL,
            httpStatus: response.status
        };

    } catch (error) {

        return {
            status: "DOWN",
            serviceUrl: AI_URL,
            error: error.message
        };

    }

};
