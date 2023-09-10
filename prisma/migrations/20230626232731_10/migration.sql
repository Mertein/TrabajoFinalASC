/*
  Warnings:

  - You are about to drop the column `user_id` on the `faqs` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[category_name]` on the table `category_course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file_category` to the `category_course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "course" DROP CONSTRAINT "course_category_id_fkey";

-- DropForeignKey
ALTER TABLE "course" DROP CONSTRAINT "course_id_branch_fkey";

-- DropForeignKey
ALTER TABLE "course" DROP CONSTRAINT "course_user_id_fkey";

-- DropForeignKey
ALTER TABLE "enrollment_course" DROP CONSTRAINT "enrollment_course_course_id_fkey";

-- DropForeignKey
ALTER TABLE "enrollment_course" DROP CONSTRAINT "enrollment_course_user_id_fkey";

-- DropForeignKey
ALTER TABLE "faqs" DROP CONSTRAINT "faqs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_course_course_id_fk";

-- DropForeignKey
ALTER TABLE "user_rol" DROP CONSTRAINT "user_rol_user_id_fkey";

-- AlterTable
ALTER TABLE "category_course" ADD COLUMN     "file_category" BYTEA NOT NULL;

-- AlterTable
ALTER TABLE "course" ADD COLUMN     "description" TEXT[],
ADD COLUMN     "isFree" BOOLEAN,
ADD COLUMN     "isVirtual" BOOLEAN;

-- AlterTable
ALTER TABLE "faqs" DROP COLUMN "user_id";

-- CreateIndex
CREATE UNIQUE INDEX "category_course__index_name" ON "category_course"("category_name");

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category_course"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_id_branch_fkey" FOREIGN KEY ("id_branch") REFERENCES "branch_offices"("branch_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usser"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment_course" ADD CONSTRAINT "enrollment_course_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment_course" ADD CONSTRAINT "enrollment_course_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usser"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_course_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_rol" ADD CONSTRAINT "user_rol_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usser"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
