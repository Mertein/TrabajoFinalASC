/*
  Warnings:

  - You are about to drop the column `discount_days_before` on the `course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "course" DROP COLUMN "discount_days_before",
ADD COLUMN     "end_date_discount" DATE,
ADD COLUMN     "start_date_discount" DATE;
