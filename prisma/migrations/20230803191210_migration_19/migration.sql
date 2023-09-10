-- AlterTable
ALTER TABLE "files" ADD COLUMN     "deleted_at" TIMESTAMP(6),
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "grade" ALTER COLUMN "value" DROP NOT NULL,
ALTER COLUMN "enrollment_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "branch_offices_hist" (
    "branch_id_hist" SERIAL NOT NULL,
    "branch_name" VARCHAR(30) NOT NULL,
    "branch_address" VARCHAR(40) NOT NULL,
    "people_capacity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),
    "d_operation" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "c_user_operation" VARCHAR(100),
    "c_operation" VARCHAR(1) NOT NULL,
    "branch_id" INTEGER NOT NULL,

    CONSTRAINT "branch_offices_hist_pk" PRIMARY KEY ("branch_id_hist")
);

-- CreateTable
CREATE TABLE "category_course_hist" (
    "category_id_hist" SERIAL NOT NULL,
    "category_id" INTEGER,
    "d_operation" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "c_user_operation" VARCHAR(100),
    "c_operation" VARCHAR(1) NOT NULL,
    "category_name" VARCHAR(40) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "category_course_hist_pk" PRIMARY KEY ("category_id_hist")
);

-- CreateTable
CREATE TABLE "class_hist" (
    "class_id_hist" SERIAL NOT NULL,
    "d_operation" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "c_user_operation" VARCHAR(100),
    "c_operation" VARCHAR(1) NOT NULL,
    "class_id" INTEGER NOT NULL,
    "course_id" INTEGER,
    "isVirtual" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "class_hist_pk" PRIMARY KEY ("class_id_hist")
);

-- CreateTable
CREATE TABLE "course_hist" (
    "course_id_hist" SERIAL NOT NULL,
    "d_operation" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "c_user_operation" VARCHAR(100),
    "c_operation" VARCHAR(1) NOT NULL,
    "course_id" INTEGER,
    "course_name" VARCHAR(40) NOT NULL,
    "price_course" DOUBLE PRECISION NOT NULL,
    "description_course" VARCHAR(400) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "category_id" INTEGER,
    "branch_id" INTEGER,
    "start_date" TIMESTAMP(6) NOT NULL,
    "end_date" TIMESTAMP(6) NOT NULL,
    "description" TEXT[],
    "isFree" BOOLEAN NOT NULL,
    "isVirtual" BOOLEAN,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "course_hist_pk" PRIMARY KEY ("course_id_hist")
);

-- CreateTable
CREATE TABLE "enrollment_course_hist" (
    "enrollment_id_hist" SERIAL NOT NULL,
    "d_operation" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "c_user_operation" VARCHAR(100),
    "c_operation" VARCHAR(1) NOT NULL,
    "enrollment_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_id" INTEGER,
    "enrollment_date" DATE NOT NULL,
    "payment_status" BOOLEAN,
    "completion_status" BOOLEAN,
    "feedback_course" VARCHAR(400) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "enrollment_course_hist_pk" PRIMARY KEY ("enrollment_id_hist")
);

-- CreateTable
CREATE TABLE "files_hist" (
    "id_hist" SERIAL NOT NULL,
    "d_operation" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "c_user_operation" VARCHAR(100),
    "c_operation" VARCHAR(1) NOT NULL,
    "link" TEXT,
    "path" VARCHAR(250) NOT NULL,
    "thumbnail" TEXT,
    "name" VARCHAR(100) NOT NULL,
    "size" DECIMAL(9,0) NOT NULL,
    "type" VARCHAR(250) NOT NULL,
    "title" VARCHAR,
    "format" "Format" NOT NULL,
    "identifier" "Identifier",
    "certificate_id" INTEGER,
    "class_id" INTEGER,
    "user_id" INTEGER,
    "category_id" INTEGER,
    "course_id" INTEGER,
    "enrollment_id" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "files_hist_pk" PRIMARY KEY ("id_hist")
);

-- CreateTable
CREATE TABLE "grade_hist" (
    "grade_id_hist" SERIAL NOT NULL,
    "d_operation" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "c_user_operation" VARCHAR(100),
    "c_operation" VARCHAR(1) NOT NULL,
    "grade_id" INTEGER,
    "value" DOUBLE PRECISION,
    "enrollment_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "grade_hist_pk" PRIMARY KEY ("grade_id_hist")
);

-- CreateTable
CREATE TABLE "payment_hist" (
    "payment_id_hist" SERIAL NOT NULL,
    "d_operation" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "c_user_operation" VARCHAR(100),
    "c_operation" VARCHAR(1) NOT NULL,
    "payment_id" INTEGER,
    "payment_amount" DOUBLE PRECISION,
    "payment_date" DATE,
    "payment_method" VARCHAR(30),
    "payment_status" INTEGER,
    "transaction_id" INTEGER,
    "enrollment_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "payment_hist_pk" PRIMARY KEY ("payment_id_hist")
);

-- CreateTable
CREATE TABLE "schedules_hist" (
    "schedule_id_hist" SERIAL NOT NULL,
    "d_operation" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "c_user_operation" VARCHAR(100),
    "c_operation" VARCHAR(1) NOT NULL,
    "schedule_id" INTEGER,
    "course_id" INTEGER,
    "day_of_week" "dayOfWeek" NOT NULL,
    "start_time" VARCHAR(20),
    "end_time" VARCHAR(20),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "schedules_hist_pk" PRIMARY KEY ("schedule_id_hist")
);

-- CreateTable
CREATE TABLE "user_hist" (
    "user_id_hist" SERIAL NOT NULL,
    "d_operation" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "c_user_operation" VARCHAR(100),
    "c_operation" VARCHAR(1) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "gender" VARCHAR(20) NOT NULL,
    "dni" DECIMAL NOT NULL,
    "first_name" VARCHAR(30) NOT NULL,
    "last_name" VARCHAR(30) NOT NULL,
    "address" VARCHAR(50) NOT NULL,
    "emergency_contact" DECIMAL NOT NULL,
    "phone_number" DECIMAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "user_hist_pk" PRIMARY KEY ("user_id_hist")
);

-- CreateTable
CREATE TABLE "user_rol_hist" (
    "user_id_hist" INTEGER NOT NULL,
    "rol_id_hist" INTEGER NOT NULL,
    "d_operation" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "c_user_operation" VARCHAR(100),
    "c_operation" VARCHAR(1) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),
    "user_rol_id" SERIAL NOT NULL,

    CONSTRAINT "user_rol_hist_pk" PRIMARY KEY ("user_rol_id")
);

-- RenameForeignKey
ALTER TABLE "payment" RENAME CONSTRAINT "payment_enrollment_id_fkey" TO "payment_enrollment_course_enrollment_id_fk";

-- AddForeignKey
ALTER TABLE "class_hist" ADD CONSTRAINT "class_hist_course_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_hist" ADD CONSTRAINT "course_hist_branch_offices_branch_id_fk" FOREIGN KEY ("branch_id") REFERENCES "branch_offices"("branch_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_hist" ADD CONSTRAINT "course_hist_category_course_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "category_course"("category_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_hist" ADD CONSTRAINT "course_hist_usser_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "usser"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "enrollment_course_hist" ADD CONSTRAINT "enrollment_course_hist_course_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "enrollment_course_hist" ADD CONSTRAINT "enrollment_course_hist_usser_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "usser"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "files_hist" ADD CONSTRAINT "files_hist_category_course_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "category_course"("category_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "files_hist" ADD CONSTRAINT "files_hist_certificate_certificate_id_fk" FOREIGN KEY ("certificate_id") REFERENCES "certificate"("certificate_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "files_hist" ADD CONSTRAINT "files_hist_class_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "class"("class_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "files_hist" ADD CONSTRAINT "files_hist_course_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "files_hist" ADD CONSTRAINT "files_hist_enrollment_course_enrollment_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "enrollment_course"("enrollment_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "files_hist" ADD CONSTRAINT "files_hist_usser_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "usser"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grade_hist" ADD CONSTRAINT "grade_hist_enrollment_course_enrollment_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "enrollment_course"("enrollment_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment_hist" ADD CONSTRAINT "payment_hist_enrollment_course_enrollment_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "enrollment_course"("enrollment_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedules_hist" ADD CONSTRAINT "schedules_hist_course_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_rol_hist" ADD CONSTRAINT "user_rol_hist_rol_rol_id_fk" FOREIGN KEY ("rol_id_hist") REFERENCES "rol"("rol_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_rol_hist" ADD CONSTRAINT "user_rol_hist_usser_user_id_fk" FOREIGN KEY ("user_id_hist") REFERENCES "usser"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
