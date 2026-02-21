import prisma from "../src/config/prisma.js";

async function main() {

    console.log("Seeding database...");

    // ===============================
    // Vehicles
    // ===============================
    await prisma.vehicle.createMany({
        data: [
            {
                model: "Tata Prima 5530",
                type: "Heavy",
                licensePlate: "GJ05TR1234",
                capacity: 10000,
                odometer: 120000,
                status: "Available",
                totalFuelCost: 50000,
                totalMaintenance: 20000
            },
            {
                model: "Ashok Leyland 4220",
                type: "Medium",
                licensePlate: "GJ05TR5678",
                capacity: 7000,
                odometer: 80000,
                status: "OnTrip",
                totalFuelCost: 30000,
                totalMaintenance: 15000
            },
            {
                model: "Eicher Pro 3015",
                type: "Light",
                licensePlate: "GJ05TR9999",
                capacity: 4000,
                odometer: 45000,
                status: "Maintenance",
                totalFuelCost: 15000,
                totalMaintenance: 12000
            }
        ],
        skipDuplicates: true
    });


    // ===============================
    // Drivers
    // ===============================
    await prisma.driver.createMany({
        data: [
            {
                name: "Raj Patel",
                safetyScore: 92,
                licenseExpiry: new Date("2027-12-31"),
                status: "OnDuty"
            },
            {
                name: "Amit Sharma",
                safetyScore: 65,
                licenseExpiry: new Date("2025-05-01"),
                status: "OnDuty"
            },
            {
                name: "Vikram Singh",
                safetyScore: 48,
                licenseExpiry: new Date("2024-03-10"),
                status: "OffDuty"
            }
        ],
        skipDuplicates: true
    });


    // ===============================
    // Trips
    // ===============================
    await prisma.trip.createMany({
        data: [
            {
                vehicleId: 1,
                driverId: 1,
                cargoWeight: 5000,
                distance: 300,
                origin: "Surat",
                destination: "Ahmedabad",
                revenue: 15000,
                fuelCost: 4000,
                maintenanceCost: 1000,
                status: "Completed"
            },
            {
                vehicleId: 2,
                driverId: 2,
                cargoWeight: 4000,
                distance: 200,
                origin: "Surat",
                destination: "Vadodara",
                revenue: 10000,
                fuelCost: 3000,
                maintenanceCost: 800,
                status: "Completed"
            }
        ],
        skipDuplicates: true
    });


    console.log("Database seeded successfully.");

}

main()
    .catch((error) => {
        console.error("Seed error:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });