/*
  Warnings:

  - You are about to drop the column `class_file` on the `class` table. All the data in the column will be lost.
  - Added the required column `isVirtual` to the `class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "class" DROP COLUMN "class_file",
ADD COLUMN     "isVirtual" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "classFile" (
    "id" SERIAL NOT NULL,
    "class" INTEGER NOT NULL,
    "file" INTEGER NOT NULL,
    "create_at" TIMESTAMP(6),
    "update_at" TIMESTAMP(6),

    CONSTRAINT "classFile_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" SERIAL NOT NULL,
    "link" TEXT,
    "path" VARCHAR(250) NOT NULL,
    "thumbnail" TEXT,
    "name" VARCHAR(100),
    "size" DECIMAL(9,0),
    "type" VARCHAR(250),
    "format" INTEGER,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "files_pk" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "classFile" ADD CONSTRAINT "classFile_class_class_id_fk" FOREIGN KEY ("class") REFERENCES "class"("class_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "classFile" ADD CONSTRAINT "classFile_files_id_fk" FOREIGN KEY ("file") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
