import prisma from "../config/prisma.js";

////////////////////////////////////////////////////////////
// CREATE TRIP
////////////////////////////////////////////////////////////

export const createTrip = async (req, res) => {
    try {
        const {
            vehicleId,
            driverId,
            cargoWeight,
            distance,
            origin,
            destination
        } = req.body;

        const vehicle = await prisma.vehicle.findUnique({
            where: { id: parseInt(vehicleId) }
        });

        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        if (vehicle.status !== "AVAILABLE") {
            return res.status(400).json({ error: "Vehicle not available" });
        }

        const trip = await prisma.trip.create({
            data: {
                vehicleId: parseInt(vehicleId),
                driverId: parseInt(driverId),
                cargoWeight,
                distance,
                origin,
                destination,
                status: "DISPATCHED"
            }
        });

        // 🔥 Update vehicle status
        await prisma.vehicle.update({
            where: { id: parseInt(vehicleId) },
            data: { status: "ON_TRIP" }
        });

        res.json(trip);
    } catch (error) {
        console.error("Create Trip Error:", error);
        res.status(500).json({ error: error.message });
    }
};

////////////////////////////////////////////////////////////
// COMPLETE TRIP
////////////////////////////////////////////////////////////

export const completeTrip = async (req, res) => {
    try {
        const { tripId } = req.params;

        const trip = await prisma.trip.update({
            where: { id: parseInt(tripId) },
            data: { status: "COMPLETED" }
        });

        // 🔥 Make vehicle available again
        await prisma.vehicle.update({
            where: { id: trip.vehicleId },
            data: { status: "AVAILABLE" }
        });

        res.json({ message: "Trip completed successfully" });
    } catch (error) {
        console.error("Complete Trip Error:", error);
        res.status(500).json({ error: error.message });
    }
};