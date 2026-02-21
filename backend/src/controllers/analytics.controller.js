import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

////////////////////////////////////////////////////////////
// FINANCE DASHBOARD
////////////////////////////////////////////////////////////

export const getFinanceDashboard = async (req, res) => {
    try {
        const trips = await prisma.trip.findMany();
        const vehicles = await prisma.vehicle.findMany();

        const totalFuelCost = trips.reduce(
            (sum, trip) => sum + trip.fuelCost,
            0
        );

        const totalMaintenanceCost = vehicles.reduce(
            (sum, vehicle) => sum + vehicle.totalMaintenance,
            0
        );

        const totalRevenue = trips.reduce(
            (sum, trip) => sum + trip.revenue,
            0
        );

        const totalProfit =
            totalRevenue - (totalFuelCost + totalMaintenanceCost);

        res.json({
            totalFuelCost,
            totalMaintenanceCost,
            totalRevenue,
            totalProfit
        });
    } catch (error) {
        console.error("Finance Dashboard Error:", error);
        res.status(500).json({ error: error.message });
    }
};

////////////////////////////////////////////////////////////
// SAFETY DASHBOARD
////////////////////////////////////////////////////////////

export const getSafetyDashboard = async (req, res) => {
    try {
        const drivers = await prisma.driver.findMany();

        const expiringSoon = drivers.filter(driver => {
            const today = new Date();
            const expiry = new Date(driver.licenseExpiryDate);
            const diffDays =
                (expiry - today) / (1000 * 60 * 60 * 24);

            return diffDays <= 30;
        });

        res.json({
            totalDrivers: drivers.length,
            driversExpiringSoon: expiringSoon.length,
            drivers: drivers.map(d => ({
                id: d.id,
                name: d.name,
                safetyRating: d.safetyRating,
                fatigue: d.fatigue,
                status: d.status
            }))
        });
    } catch (error) {
        console.error("Safety Dashboard Error:", error);
        res.status(500).json({ error: error.message });
    }
};