/*
  Warnings:

  - The primary key for the `branch_offices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_branch` on the `branch_offices` table. All the data in the column will be lost.
  - The `picture_profile` column on the `usser` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `branch_address` to the `branch_offices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `usser` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `emergency_contact` on the `usser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `phone_number` on the `usser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "course" DROP CONSTRAINT "course_id_branch_fkey";

-- DropIndex
DROP INDEX "usser_dni_key";

-- AlterTable
ALTER TABLE "branch_offices" DROP CONSTRAINT "branch_offices_pkey",
DROP COLUMN "id_branch",
ADD COLUMN     "branch_address" VARCHAR(40) NOT NULL,
ADD COLUMN     "branch_id" SERIAL NOT NULL,
ADD CONSTRAINT "branch_offices_pkey" PRIMARY KEY ("branch_id");

-- AlterTable
ALTER TABLE "usser" ADD COLUMN     "address" VARCHAR(50) NOT NULL,
DROP COLUMN "emergency_contact",
ADD COLUMN     "emergency_contact" DECIMAL NOT NULL,
ALTER COLUMN "password" SET DATA TYPE VARCHAR(1000),
DROP COLUMN "phone_number",
ADD COLUMN     "phone_number" DECIMAL NOT NULL,
ALTER COLUMN "dni" SET DATA TYPE DECIMAL,
DROP COLUMN "picture_profile",
ADD COLUMN     "picture_profile" BYTEA;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_id_branch_fkey" FOREIGN KEY ("id_branch") REFERENCES "branch_offices"("branch_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
