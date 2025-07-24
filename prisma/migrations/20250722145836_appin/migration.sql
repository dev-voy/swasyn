/*
  Warnings:

  - The values [telemedicine] on the enum `AppointmentType` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Appointment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `doctor_id` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `hospital_id` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `patient_id` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `doctor_id` on the `DoctorRating` table. All the data in the column will be lost.
  - You are about to drop the column `doctors_ids` on the `Hospital` table. All the data in the column will be lost.
  - The primary key for the `Patient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Patient` table. All the data in the column will be lost.
  - The required column `appointment_id` was added to the `Appointment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `patient_id` was added to the `Patient` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AppointmentType_new" AS ENUM ('in_person', 'online', 'home_visit', 'follow_up', 'emergency', 'virtual');
ALTER TABLE "Appointment" ALTER COLUMN "appointment_type" DROP DEFAULT;
ALTER TABLE "Appointment" ALTER COLUMN "appointment_type" TYPE "AppointmentType_new" USING ("appointment_type"::text::"AppointmentType_new");
ALTER TYPE "AppointmentType" RENAME TO "AppointmentType_old";
ALTER TYPE "AppointmentType_new" RENAME TO "AppointmentType";
DROP TYPE "AppointmentType_old";
ALTER TABLE "Appointment" ALTER COLUMN "appointment_type" SET DEFAULT 'in_person';
COMMIT;

-- DropForeignKey
ALTER TABLE "DoctorRating" DROP CONSTRAINT "DoctorRating_doctor_id_fkey";

-- DropForeignKey
ALTER TABLE "DoctorRating" DROP CONSTRAINT "DoctorRating_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_user_id_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_pkey",
DROP COLUMN "doctor_id",
DROP COLUMN "hospital_id",
DROP COLUMN "id",
DROP COLUMN "patient_id",
ADD COLUMN     "appointment_id" TEXT NOT NULL,
ADD CONSTRAINT "Appointment_pkey" PRIMARY KEY ("appointment_id");

-- AlterTable
ALTER TABLE "DoctorRating" DROP COLUMN "doctor_id";

-- AlterTable
ALTER TABLE "Hospital" DROP COLUMN "doctors_ids";

-- AlterTable
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_pkey",
DROP COLUMN "id",
ADD COLUMN     "allergies" TEXT[],
ADD COLUMN     "medical_history" TEXT,
ADD COLUMN     "patient_id" TEXT NOT NULL,
ADD CONSTRAINT "Patient_pkey" PRIMARY KEY ("patient_id");

-- AddForeignKey
ALTER TABLE "DoctorRating" ADD CONSTRAINT "DoctorRating_id_fkey" FOREIGN KEY ("id") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "patient_id" FOREIGN KEY ("appointment_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "doctor_id" FOREIGN KEY ("appointment_id") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "hospital_id" FOREIGN KEY ("appointment_id") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
