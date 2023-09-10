/*
  Warnings:

  - You are about to drop the column `bytea` on the `files` table. All the data in the column will be lost.
  - You are about to drop the `classFile` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `name` on table `files` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "classFile" DROP CONSTRAINT "classFile_class_class_id_fk";

-- DropForeignKey
ALTER TABLE "classFile" DROP CONSTRAINT "classFile_files_id_fk";

-- AlterTable
ALTER TABLE "files" DROP COLUMN "bytea",
ADD COLUMN     "certificate_id" INTEGER,
ADD COLUMN     "class_id" INTEGER,
ADD COLUMN     "identifier" VARCHAR(20),
ADD COLUMN     "user_id" INTEGER,
ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "classFile";

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_certificate_certificate_id_fk" FOREIGN KEY ("certificate_id") REFERENCES "certificate"("certificate_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_class_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "class"("class_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_usser_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "usser"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
