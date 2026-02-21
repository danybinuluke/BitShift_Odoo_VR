
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const createDriver = async (req, res) => {
    const driver = await prisma.driver.create({
        data: req.body
    });
    res.json(driver);
};

export const getDrivers = async (req, res) => {
    const drivers = await prisma.driver.findMany();
    res.json(drivers);
};