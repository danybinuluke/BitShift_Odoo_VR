import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const plateRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;

export const createVehicle = async (req, res) => {
    try {
        const { model, type, licensePlate, capacity, odometer } = req.body;

        const formattedPlate = licensePlate.toUpperCase().trim();

        if (!plateRegex.test(formattedPlate)) {
            return res.status(400).json({ error: "Invalid license plate format" });
        }

        const vehicle = await prisma.vehicle.create({
            data: {
                model,
                type,
                licensePlate: formattedPlate,
                capacity,
                odometer
            }
        });

        res.json(vehicle);

    } catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({ error: "License plate already exists" });
        }
        res.status(500).json({ error: "Server error" });
    }
};

export const getVehicles = async (req, res) => {
    const vehicles = await prisma.vehicle.findMany();
    res.json(vehicles);
};