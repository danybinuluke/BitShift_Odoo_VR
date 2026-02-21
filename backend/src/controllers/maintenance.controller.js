import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

////////////////////////////////////////////////////////////
// ADD MAINTENANCE
////////////////////////////////////////////////////////////

export const addMaintenance = async (req, res) => {
    try {
        const { vehicleId, notes, cost } = req.body;

        const vehicle = await prisma.vehicle.findUnique({
            where: { id: parseInt(vehicleId) }
        });

        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        const maintenance = await prisma.maintenance.create({
            data: {
                vehicleId: parseInt(vehicleId),
                notes,
                cost
            }
        });

        // 🔥 Switch vehicle to IN_SHOP
        await prisma.vehicle.update({
            where: { id: parseInt(vehicleId) },
            data: { status: "IN_SHOP" }
        });

        res.json(maintenance);
    } catch (error) {
        console.error("Add Maintenance Error:", error);
        res.status(500).json({ error: error.message });
    }
};

////////////////////////////////////////////////////////////
// FINISH MAINTENANCE
////////////////////////////////////////////////////////////

export const finishMaintenance = async (req, res) => {
    try {
        const { vehicleId } = req.params;

        await prisma.vehicle.update({
            where: { id: parseInt(vehicleId) },
            data: { status: "AVAILABLE" }
        });

        res.json({ message: "Vehicle is now AVAILABLE" });
    } catch (error) {
        console.error("Finish Maintenance Error:", error);
        res.status(500).json({ error: error.message });
    }
};