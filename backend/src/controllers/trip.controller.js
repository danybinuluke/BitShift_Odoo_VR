import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const createTrip = async (req, res) => {
    const { vehicleId, driverId, cargoWeight, distance, origin, destination } = req.body;

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    const driver = await prisma.driver.findUnique({ where: { id: driverId } });

    if (!vehicle || !driver)
        return res.status(404).json({ error: "Vehicle or Driver not found" });

    if (vehicle.status !== "Available")
        return res.status(400).json({ error: "Vehicle not available" });

    if (cargoWeight > vehicle.capacity)
        return res.status(400).json({ error: "Over capacity" });

    if (new Date(driver.licenseExpiry) < new Date())
        return res.status(400).json({ error: "License expired" });

    const trip = await prisma.trip.create({
        data: {
            vehicleId,
            driverId,
            cargoWeight,
            distance,
            origin,
            destination,
            status: "Dispatched",
            revenue: distance * 15
        }
    });

    await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { status: "OnTrip" }
    });

    res.json(trip);
};

export const completeTrip = async (req, res) => {
    const { tripId, fuelCost, maintenanceCost } = req.body;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });

    if (!trip)
        return res.status(404).json({ error: "Trip not found" });

    await prisma.trip.update({
        where: { id: tripId },
        data: {
            status: "Completed",
            fuelCost,
            maintenanceCost
        }
    });

    await prisma.vehicle.update({
        where: { id: trip.vehicleId },
        data: {
            status: "Available",
            totalFuelCost: { increment: fuelCost },
            totalMaintenance: { increment: maintenanceCost }
        }
    });

    res.json({ message: "Trip completed successfully" });
};