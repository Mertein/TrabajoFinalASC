-- CreateTable
CREATE TABLE "branch_offices" (
    "id_branch" SERIAL NOT NULL,
    "people_capacity" INTEGER NOT NULL,
    "branch_name" VARCHAR(30) NOT NULL,

    CONSTRAINT "branch_offices_pkey" PRIMARY KEY ("id_branch")
);

-- CreateTable
CREATE TABLE "category_course" (
    "category_name" VARCHAR(40) NOT NULL,
    "category_id" SERIAL NOT NULL,

    CONSTRAINT "category_course_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "certificate" (
    "file_certificate" BYTEA NOT NULL,
    "certificate_id" SERIAL NOT NULL,
    "certificate_name" VARCHAR(40) NOT NULL,
    "idcategory_course_certificate" INTEGER NOT NULL,
    "enrollment_id" SERIAL NOT NULL,
    "user_id" SERIAL NOT NULL,

    CONSTRAINT "certificate_pkey" PRIMARY KEY ("certificate_id")
);

-- CreateTable
CREATE TABLE "class" (
    "class_id" SERIAL NOT NULL,
    "description_class" VARCHAR(255) NOT NULL,
    "date_class" DATE NOT NULL,
    "class_file" BYTEA NOT NULL,
    "star_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "course_id" SERIAL NOT NULL,

    CONSTRAINT "class_pkey" PRIMARY KEY ("class_id")
);

-- CreateTable
CREATE TABLE "course" (
    "course_id" SERIAL NOT NULL,
    "course_name" VARCHAR(40) NOT NULL,
    "price_course" DOUBLE PRECISION NOT NULL,
    "description_course" VARCHAR(400) NOT NULL,
    "user_id" SERIAL NOT NULL,
    "category_id" SERIAL NOT NULL,
    "id_branch" SERIAL NOT NULL,
    "shedule_id" SERIAL NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("course_id")
);

-- CreateTable
CREATE TABLE "enrollment_course" (
    "enrollment_id" SERIAL NOT NULL,
    "feedback_course" VARCHAR(400) NOT NULL,
    "start_date" DATE NOT NULL,
    "payment_status" INTEGER NOT NULL,
    "end_date" DATE NOT NULL,
    "enrollment_date" DATE NOT NULL,
    "completion_status" INTEGER NOT NULL,
    "user_id" SERIAL NOT NULL,
    "course_id" SERIAL NOT NULL,

    CONSTRAINT "enrollment_course_pkey" PRIMARY KEY ("enrollment_id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "answer" VARCHAR NOT NULL,
    "question" VARCHAR NOT NULL,
    "faqs_id" SERIAL NOT NULL,
    "user_id" SERIAL NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("faqs_id")
);

-- CreateTable
CREATE TABLE "grade" (
    "grade_id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "enrollment_id" SERIAL NOT NULL,

    CONSTRAINT "grade_pkey" PRIMARY KEY ("grade_id")
);

-- CreateTable
CREATE TABLE "payment" (
    "payment_id" SERIAL NOT NULL,
    "payment_amount" DOUBLE PRECISION NOT NULL,
    "payment_date" DATE NOT NULL,
    "payment_method" VARCHAR(30) NOT NULL,
    "payment_status" INTEGER NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "payment_proof" BYTEA NOT NULL,
    "enrollment_id" SERIAL NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "rol" (
    "rol_id" SERIAL NOT NULL,
    "rol_name" VARCHAR(20) NOT NULL,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("rol_id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "shedule_id" SERIAL NOT NULL,
    "user_id" SERIAL NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("shedule_id")
);

-- CreateTable
CREATE TABLE "user_faqs" (
    "user_id" SERIAL NOT NULL,
    "faqs_id" SERIAL NOT NULL,

    CONSTRAINT "user_faqs_pkey" PRIMARY KEY ("user_id","faqs_id")
);

-- CreateTable
CREATE TABLE "user_rol" (
    "rol_date" DATE NOT NULL,
    "user_id" SERIAL NOT NULL,
    "rol_id" SERIAL NOT NULL,

    CONSTRAINT "user_rol_pkey" PRIMARY KEY ("user_id","rol_id")
);

-- CreateTable
CREATE TABLE "usser" (
    "user_id" SERIAL NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "date_of__birth" DATE NOT NULL,
    "emergency_contact" TEXT NOT NULL,
    "password" VARCHAR(50) NOT NULL,
    "gender" VARCHAR(20) NOT NULL,
    "first_name" VARCHAR(30) NOT NULL,
    "phone_number" TEXT NOT NULL,
    "specialty" VARCHAR(30) NOT NULL,
    "dni" INTEGER NOT NULL,
    "picture_dni" BYTEA[],
    "picture_profile" BYTEA[],
    "last_name" VARCHAR(30) NOT NULL,

    CONSTRAINT "usser_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usser_email_key" ON "usser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usser_dni_key" ON "usser"("dni");

-- AddForeignKey
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollment_course"("enrollment_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usser"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category_course"("category_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_id_branch_fkey" FOREIGN KEY ("id_branch") REFERENCES "branch_offices"("id_branch") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_shedule_id_fkey" FOREIGN KEY ("shedule_id") REFERENCES "schedules"("shedule_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usser"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "enrollment_course" ADD CONSTRAINT "enrollment_course_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "enrollment_course" ADD CONSTRAINT "enrollment_course_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usser"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usser"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grade" ADD CONSTRAINT "grade_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollment_course"("enrollment_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollment_course"("enrollment_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usser"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_faqs" ADD CONSTRAINT "user_faqs_faqs_id_fkey" FOREIGN KEY ("faqs_id") REFERENCES "faqs"("faqs_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_faqs" ADD CONSTRAINT "user_faqs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usser"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_rol" ADD CONSTRAINT "user_rol_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "rol"("rol_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_rol" ADD CONSTRAINT "user_rol_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usser"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
