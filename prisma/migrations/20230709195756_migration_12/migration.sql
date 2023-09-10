/*
  Warnings:

  - The `payment_status` column on the `enrollment_course` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `completion_status` on the `enrollment_course` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "user_rol" DROP CONSTRAINT "user_rol_rol_id_fkey";

-- AlterTable
ALTER TABLE "enrollment_course" ALTER COLUMN "feedback_course" DROP NOT NULL,
DROP COLUMN "payment_status",
ADD COLUMN     "payment_status" BOOLEAN,
DROP COLUMN "completion_status",
ADD COLUMN     "completion_status" BOOLEAN NOT NULL;

-- AddForeignKey
ALTER TABLE "user_rol" ADD CONSTRAINT "user_rol_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "rol"("rol_id") ON DELETE CASCADE ON UPDATE CASCADE;
