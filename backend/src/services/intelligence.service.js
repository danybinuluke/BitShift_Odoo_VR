import prisma from "../config/prisma.js";


// ===============================
// 1. Fleet Risk Engine
// ===============================
export const calculateFleetRisk = async () => {

    const vehiclesInShop =
        await prisma.vehicle.count({
            where: { status: "IN_SHOP" }
        });

    const expiredDrivers =
        await prisma.driver.count({
            where: {
                licenseExpiryDate: {
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
    async (vehicleId, driverId, cargoWeight, fatigueLevel) => {

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

        let aiRiskLevel = "MEDIUM";

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
                        safetyScore: driver.safetyRating,
                        tripsCompleted: driver.tripsCompleted || 23,
                        fatigueLevel: fatigueLevel
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
            driver.safetyRating / 100;

        const fatiguePenalty =
            (fatigueLevel || 0) * 0.02;

        const adjustedSafetyScore =
            Math.max(0, safetyScore - fatiguePenalty);

        const availabilityPenalty =
            vehicle.status === "ON_TRIP" ? 0.2 : 0;

        const baseScore =
            (0.6 * capacityScore)
            +
            (0.4 * adjustedSafetyScore);

        let finalScore =
            baseScore - availabilityPenalty;


        // ===============================
        // AI Risk Adjustment
        // ===============================

        if (aiRiskLevel === "HIGH")
            finalScore -= 0.3;
        else if (aiRiskLevel === "MEDIUM")
            finalScore -= 0.1;

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
            driverSafetyRating: driver.safetyRating
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
            where: { status: "ON_TRIP" }
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


// ===============================
// 6. Profit Trend Engine
// ===============================
export const getProfitTrend = async () => {

    const trips = await prisma.trip.findMany({
        orderBy: {
            createdAt: "asc"
        }
    });

    const trend = trips.map(trip => {

        const cost =
            trip.fuelCost +
            trip.maintenanceCost;

        const profit =
            trip.revenue - cost;

        return {
            tripId: trip.id,
            date: trip.createdAt,
            revenue: trip.revenue,
            cost,
            profit
        };

    });

    return trend;
};


// ===============================
// 7. Cost Per KM Intelligence
// ===============================
export const getCostPerKm = async (vehicleId) => {

    const lastTrip = await prisma.trip.findFirst({
        where: {
            vehicleId: vehicleId,
            status: "COMPLETED"
        },
        orderBy: {
            id: "desc"
        }
    });

    if (!lastTrip)
        throw new Error("No completed trips found");

    const totalCost =
        lastTrip.fuelCost +
        lastTrip.maintenanceCost;

    const costPerKm =
        lastTrip.distance === 0
            ? 0
            : totalCost / lastTrip.distance;

    return {
        vehicleId,
        tripId: lastTrip.id,
        distance: lastTrip.distance,
        fuelCost: lastTrip.fuelCost,
        maintenanceCost: lastTrip.maintenanceCost,
        totalCost,
        costPerKm: Number(costPerKm.toFixed(2))
    };

};