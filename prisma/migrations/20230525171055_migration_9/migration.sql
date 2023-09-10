/*
  Warnings:

  - You are about to drop the column `star_time` on the `schedules` table. All the data in the column will be lost.
  - Added the required column `start_time` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "star_time",
ADD COLUMN     "start_time" VARCHAR(20) NOT NULL,
ALTER COLUMN "end_time" SET DATA TYPE VARCHAR(20);
