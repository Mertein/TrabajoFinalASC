/*
  Warnings:

  - You are about to drop the column `user_id` on the `schedules` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "branch_offices" ALTER COLUMN "deleted_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "category_course" ALTER COLUMN "deleted_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "certificate" ALTER COLUMN "deleted_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "class" ALTER COLUMN "deleted_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "course" ALTER COLUMN "deleted_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "enrollment_course" ALTER COLUMN "deleted_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "faqs" ALTER COLUMN "deleted_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "grade" ALTER COLUMN "deleted_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "payment" ALTER COLUMN "deleted_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "rol" ALTER COLUMN "deleted_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "user_id",
ALTER COLUMN "deleted_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user_faqs" ALTER COLUMN "deleted_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user_rol" ALTER COLUMN "deleted_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "usser" ALTER COLUMN "deleted_at" DROP DEFAULT;
