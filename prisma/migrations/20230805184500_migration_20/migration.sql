/*
  Warnings:

  - You are about to drop the column `course_id` on the `schedules` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_course_course_id_fk";

-- AlterTable
ALTER TABLE "class" ADD COLUMN     "schedule_id" INTEGER;

-- AlterTable
ALTER TABLE "files" ALTER COLUMN "identifier" DROP NOT NULL;

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "course_id",
ADD COLUMN     "branch_id" INTEGER;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_schedules_shedule_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("shedule_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_branch_offices_branch_id_fk" FOREIGN KEY ("branch_id") REFERENCES "branch_offices"("branch_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
