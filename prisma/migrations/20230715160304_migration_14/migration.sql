/*
  Warnings:

  - You are about to drop the column `enrollment_id` on the `certificate` table. All the data in the column will be lost.
  - You are about to drop the column `idcategory_course_certificate` on the `certificate` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `certificate` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "certificate" DROP CONSTRAINT "certificate_enrollment_id_fkey";

-- DropForeignKey
ALTER TABLE "certificate" DROP CONSTRAINT "certificate_user_id_fkey";

-- AlterTable
ALTER TABLE "certificate" DROP COLUMN "enrollment_id",
DROP COLUMN "idcategory_course_certificate",
DROP COLUMN "user_id";
