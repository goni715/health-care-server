/*
  Warnings:

  - Made the column `contactNumber` on table `patients` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "patients" ALTER COLUMN "contactNumber" SET NOT NULL;