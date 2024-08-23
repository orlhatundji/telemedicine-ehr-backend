-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "certifications" TEXT,
ADD COLUMN     "employmentDate" TIMESTAMP(3),
ADD COLUMN     "languages" TEXT,
ADD COLUMN     "licenseNumber" TEXT,
ADD COLUMN     "qualifications" TEXT;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "alcoholConsumption" TEXT,
ADD COLUMN     "allergies" TEXT,
ADD COLUMN     "bloodGroup" TEXT,
ADD COLUMN     "commonFamilyConditions" TEXT,
ADD COLUMN     "currentMedications" TEXT,
ADD COLUMN     "genotype" TEXT,
ADD COLUMN     "pastMedicalConditions" TEXT,
ADD COLUMN     "socialHistory" TEXT,
ADD COLUMN     "surgicalHistory" TEXT,
ADD COLUMN     "vaccinationHistory" TEXT;
