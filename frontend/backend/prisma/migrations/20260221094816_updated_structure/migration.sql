/*
  Warnings:

  - You are about to drop the column `licenseExpiry` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `safetyScore` on the `Driver` table. All the data in the column will be lost.
  - The `status` column on the `Driver` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Trip` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `odometer` on the `Vehicle` table. All the data in the column will be lost.
  - The `status` column on the `Vehicle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[licenseNumber]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `experience` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `licenseExpiryDate` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `licenseNumber` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fuelType` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mileage` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED');

-- CreateEnum
CREATE TYPE "DriverStatus" AS ENUM ('ON_DUTY', 'ON_TRIP', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('DRAFT', 'DISPATCHED', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "licenseExpiry",
DROP COLUMN "safetyScore",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "experience" INTEGER NOT NULL,
ADD COLUMN     "fatigue" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "licenseExpiryDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "licenseNumber" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "safetyRating" DOUBLE PRECISION NOT NULL DEFAULT 5,
DROP COLUMN "status",
ADD COLUMN     "status" "DriverStatus" NOT NULL DEFAULT 'ON_DUTY';

-- AlterTable
ALTER TABLE "Maintenance" ADD COLUMN     "cost" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "status",
ADD COLUMN     "status" "TripStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "odometer",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fuelType" TEXT NOT NULL,
ADD COLUMN     "mileage" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "VehicleStatus" NOT NULL DEFAULT 'AVAILABLE';

-- CreateIndex
CREATE UNIQUE INDEX "Driver_licenseNumber_key" ON "Driver"("licenseNumber");
