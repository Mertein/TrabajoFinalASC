/*
  Warnings:

  - You are about to drop the column `day_of_week` on the `schedules` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "day_of_week",
ADD COLUMN     "date" DATE;
