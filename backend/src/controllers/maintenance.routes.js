import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const addMaintenance = async (req, res) => {
    const { vehicleId, notes } = req.body;

    const maintenance = await prisma.maintenance.create({
        data: { vehicleId, notes }
    });

    await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { status: "InShop" }
    });

    res.json(maintenance);
};