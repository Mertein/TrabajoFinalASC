-- AlterTable
ALTER TABLE "course" ADD COLUMN     "apply_discount" BOOLEAN,
ADD COLUMN     "discount_days_before" INTEGER,
ADD COLUMN     "discount_percentage" INTEGER;
