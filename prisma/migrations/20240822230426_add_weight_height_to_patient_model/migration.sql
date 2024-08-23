/*
  Warnings:

  - You are about to drop the column `commonFamilyConditions` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "commonFamilyConditions",
ADD COLUMN     "familyConditions" TEXT,
ADD COLUMN     "height" TEXT,
ADD COLUMN     "weight" TEXT;
