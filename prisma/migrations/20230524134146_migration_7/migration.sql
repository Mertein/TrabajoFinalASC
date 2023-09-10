-- AlterTable
ALTER TABLE "branch_offices" ALTER COLUMN "deleted_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "category_course" ALTER COLUMN "deleted_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "certificate" ALTER COLUMN "deleted_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "class" ALTER COLUMN "deleted_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "course" ALTER COLUMN "deleted_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "enrollment_course" ALTER COLUMN "deleted_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "faqs" ALTER COLUMN "deleted_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "grade" ALTER COLUMN "deleted_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payment" ALTER COLUMN "deleted_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "rol" ALTER COLUMN "deleted_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "schedules" ALTER COLUMN "deleted_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_faqs" ALTER COLUMN "deleted_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_rol" ALTER COLUMN "deleted_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "usser" ALTER COLUMN "deleted_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;
