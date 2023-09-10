/*
  Warnings:

  - You are about to drop the column `certificate_name` on the `certificate` table. All the data in the column will be lost.
  - You are about to drop the column `file_certificate` on the `certificate` table. All the data in the column will be lost.
  - You are about to drop the column `date_class` on the `class` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `class` table. All the data in the column will be lost.
  - You are about to drop the column `star_date` on the `class` table. All the data in the column will be lost.
  - You are about to drop the column `payment_proof` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `rol_date` on the `user_rol` table. All the data in the column will be lost.
  - You are about to drop the column `picture_dni` on the `usser` table. All the data in the column will be lost.
  - You are about to drop the column `picture_profile` on the `usser` table. All the data in the column will be lost.
  - You are about to drop the column `specialty` on the `usser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[branch_name]` on the table `branch_offices` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,identifier]` on the table `files` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `format` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identifier` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Format" AS ENUM ('link', 'file');

-- CreateEnum
CREATE TYPE "Identifier" AS ENUM ('studentCertificateCourse', 'studentCertificateWorkshop', 'userDniFront', 'userDniBack', 'userPicture', 'coursePicture', 'categoryPicture', 'branchPicture', 'userSignature');

-- AlterTable
ALTER TABLE "certificate" DROP COLUMN "certificate_name",
DROP COLUMN "file_certificate";

-- AlterTable
ALTER TABLE "class" DROP COLUMN "date_class",
DROP COLUMN "end_date",
DROP COLUMN "star_date",
ALTER COLUMN "isVirtual" DROP NOT NULL;

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "category_id" INTEGER,
ADD COLUMN     "course_id" INTEGER,
ADD COLUMN     "enrollment_id" INTEGER,
ADD COLUMN     "title" VARCHAR(100),
DROP COLUMN "format",
ADD COLUMN     "format" "Format" NOT NULL,
DROP COLUMN "identifier",
ADD COLUMN     "identifier" "Identifier" NOT NULL;

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "payment_proof";

-- AlterTable
ALTER TABLE "user_rol" DROP COLUMN "rol_date";

-- AlterTable
ALTER TABLE "usser" DROP COLUMN "picture_dni",
DROP COLUMN "picture_profile",
DROP COLUMN "specialty";

-- CreateIndex
CREATE UNIQUE INDEX "branch_offices_branch_name_uindex" ON "branch_offices"("branch_name");

-- CreateIndex
CREATE UNIQUE INDEX "idx_unique_user_id_identifier" ON "files"("user_id", "identifier");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_category_course_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "category_course"("category_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_course_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_enrollment_course_enrollment_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "enrollment_course"("enrollment_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
