/*
  Warnings:

  - Added the required column `title` to the `TreatmentPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TreatmentPlan" ADD COLUMN     "title" TEXT NOT NULL;
