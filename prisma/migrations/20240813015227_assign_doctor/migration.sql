-- CreateTable
CREATE TABLE "_DoctorToPatient" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DoctorToPatient_AB_unique" ON "_DoctorToPatient"("A", "B");

-- CreateIndex
CREATE INDEX "_DoctorToPatient_B_index" ON "_DoctorToPatient"("B");

-- AddForeignKey
ALTER TABLE "_DoctorToPatient" ADD CONSTRAINT "_DoctorToPatient_A_fkey" FOREIGN KEY ("A") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DoctorToPatient" ADD CONSTRAINT "_DoctorToPatient_B_fkey" FOREIGN KEY ("B") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
