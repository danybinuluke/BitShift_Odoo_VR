import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const plateRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;

////////////////////////////////////////////////////////////
// CREATE VEHICLE
////////////////////////////////////////////////////////////

export const createVehicle = async (req, res) => {
    try {
        const {
            model,
            type,
            licensePlate,
            year,
            mileage,
            fuelType,
            capacity
        } = req.body;

        const formattedPlate = licensePlate.toUpperCase().trim();

        if (!plateRegex.test(formattedPlate)) {
            return res.status(400).json({ error: "Invalid license plate format" });
        }

        const vehicle = await prisma.vehicle.create({
            data: {
                model,
                type,
                licensePlate: formattedPlate,
                year,
                mileage,
                fuelType,
                capacity,
                status: "AVAILABLE"
            }
        });

        res.json(vehicle);
    } catch (error) {
        console.error("Create Vehicle Error:", error);

        if (error.code === "P2002") {
            return res.status(400).json({ error: "License plate already exists" });
        }

        res.status(500).json({ error: error.message });
    }
};

////////////////////////////////////////////////////////////
// GET VEHICLES
////////////////////////////////////////////////////////////

export const getVehicles = async (req, res) => {
    try {
        const vehicles = await prisma.vehicle.findMany();
        res.json(vehicles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};