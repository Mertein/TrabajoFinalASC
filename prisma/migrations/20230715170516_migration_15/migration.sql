-- AlterTable
ALTER TABLE "files" ADD COLUMN     "bytea" BYTEA,
ALTER COLUMN "path" DROP NOT NULL;
