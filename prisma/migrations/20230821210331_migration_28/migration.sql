/*
  Warnings:

  - You are about to drop the column `course_id` on the `schedules_hist` table. All the data in the column will be lost.
  - You are about to drop the column `day_of_week` on the `schedules_hist` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_course_course_id_fk";

-- DropForeignKey
ALTER TABLE "files_hist" DROP CONSTRAINT "files_hist_category_course_category_id_fk";

-- DropForeignKey
ALTER TABLE "files_hist" DROP CONSTRAINT "files_hist_certificate_certificate_id_fk";

-- DropForeignKey
ALTER TABLE "files_hist" DROP CONSTRAINT "files_hist_class_class_id_fk";

-- DropForeignKey
ALTER TABLE "files_hist" DROP CONSTRAINT "files_hist_course_course_id_fk";

-- DropForeignKey
ALTER TABLE "files_hist" DROP CONSTRAINT "files_hist_enrollment_course_enrollment_id_fk";

-- DropForeignKey
ALTER TABLE "files_hist" DROP CONSTRAINT "files_hist_usser_user_id_fk";

-- DropForeignKey
ALTER TABLE "schedules_hist" DROP CONSTRAINT "schedules_hist_course_course_id_fk";

-- AlterTable
ALTER TABLE "enrollment_course" ALTER COLUMN "user_id" DROP DEFAULT,
ALTER COLUMN "course_id" DROP DEFAULT;
DROP SEQUENCE "enrollment_course_user_id_seq";
DROP SEQUENCE "enrollment_course_course_id_seq";

-- AlterTable
ALTER TABLE "payment" ALTER COLUMN "enrollment_id" DROP DEFAULT;
DROP SEQUENCE "payment_enrollment_id_seq";

-- AlterTable
ALTER TABLE "schedules_hist" DROP COLUMN "course_id",
DROP COLUMN "day_of_week",
ADD COLUMN     "class_id" INTEGER,
ADD COLUMN     "date" DATE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_course_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;
