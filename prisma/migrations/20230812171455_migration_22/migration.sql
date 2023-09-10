/*
  Warnings:

  - A unique constraint covering the columns `[course_id]` on the table `files` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[enrollment_id,identifier]` on the table `files` will be added. If there are existing duplicate values, this will fail.
  - Made the column `end_date` on table `course` required. This step will fail if there are existing NULL values in that column.
  - Made the column `start_date` on table `course` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `end_time` on the `schedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `start_time` on the `schedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "class" DROP CONSTRAINT "class_course_id_fkey";

-- DropForeignKey
ALTER TABLE "class" DROP CONSTRAINT "class_schedules_shedule_id_fk";

-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_class_class_id_fk";

-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_branch_offices_branch_id_fk";

-- DropIndex
DROP INDEX "idx_unique_user_id_identifier";

-- AlterTable
ALTER TABLE "course" ALTER COLUMN "course_name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description_course" SET DATA TYPE TEXT,
ALTER COLUMN "end_date" SET NOT NULL,
ALTER COLUMN "start_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "end_time",
ADD COLUMN     "end_time" TIME(6) NOT NULL,
DROP COLUMN "start_time",
ADD COLUMN     "start_time" TIME(6) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "files_course_id_uindex" ON "files"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_unique_user_id_identifier" ON "files"("enrollment_id", "identifier");

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_schedules_shedule_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("shedule_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_branch_offices_branch_id_fk" FOREIGN KEY ("branch_id") REFERENCES "branch_offices"("branch_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_class_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "class"("class_id") ON DELETE CASCADE ON UPDATE CASCADE;
