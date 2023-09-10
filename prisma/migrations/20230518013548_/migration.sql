/*
  Warnings:

  - You are about to drop the column `shedule_id` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `enrollment_course` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `enrollment_course` table. All the data in the column will be lost.
  - Added the required column `day_of_week` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `star_time` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "dayOfWeek" AS ENUM ('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo');

-- DropForeignKey
ALTER TABLE "course" DROP CONSTRAINT "course_shedule_id_fkey";

-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_user_id_fkey";

-- AlterTable
ALTER TABLE "course" DROP COLUMN "shedule_id";

-- AlterTable
ALTER TABLE "enrollment_course" DROP COLUMN "end_date",
DROP COLUMN "start_date";

-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "course_id" SERIAL NOT NULL,
ADD COLUMN     "day_of_week" "dayOfWeek" NOT NULL,
ADD COLUMN     "end_time" DATE NOT NULL,
ADD COLUMN     "star_time" DATE NOT NULL;
