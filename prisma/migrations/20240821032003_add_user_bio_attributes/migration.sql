-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'DIVORCED', 'MARRIED', 'WIDOWED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "emergencyContact" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "maritalStatus" "MaritalStatus",
ADD COLUMN     "nextOfKin" TEXT,
ADD COLUMN     "nextOfKinRelationShip" TEXT,
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "phone" TEXT;
