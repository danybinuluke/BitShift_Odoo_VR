import prisma from "../config/prisma.js";

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