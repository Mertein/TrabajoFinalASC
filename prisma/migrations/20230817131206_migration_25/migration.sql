/*
  Warnings:

  - You are about to drop the `answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `question_answer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "question_answer" DROP CONSTRAINT "question_answer_answer_answer_id_fk";

-- DropForeignKey
ALTER TABLE "question_answer" DROP CONSTRAINT "question_answer_question_question_id_fk";

-- DropTable
DROP TABLE "answer";

-- DropTable
DROP TABLE "question";

-- DropTable
DROP TABLE "question_answer";

-- CreateTable
CREATE TABLE "faqs" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT,
    "tags" TEXT[],
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "faqs_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_interactions" (
    "id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "faq_id" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "feedback" TEXT,

    CONSTRAINT "user_interactions_pk" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_interactions" ADD CONSTRAINT "user_interactions_faqs_id_fk" FOREIGN KEY ("faq_id") REFERENCES "faqs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_interactions" ADD CONSTRAINT "user_interactions_usser_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "usser"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
