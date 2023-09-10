/*
  Warnings:

  - You are about to drop the column `schedule_id` on the `class` table. All the data in the column will be lost.
  - Added the required column `class_id` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "class" DROP CONSTRAINT "class_schedules_shedule_id_fk";

-- AlterTable
ALTER TABLE "class" DROP COLUMN "schedule_id";

-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "class_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules___fk" FOREIGN KEY ("class_id") REFERENCES "class"("class_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
