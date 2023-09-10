/*
  Warnings:

  - You are about to drop the `faqs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_faqs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_faqs" DROP CONSTRAINT "user_faqs_faqs_id_fkey";

-- DropForeignKey
ALTER TABLE "user_faqs" DROP CONSTRAINT "user_faqs_user_id_fkey";

-- DropTable
DROP TABLE "faqs";

-- DropTable
DROP TABLE "user_faqs";

-- CreateTable
CREATE TABLE "answer" (
    "answer_id" SERIAL NOT NULL,
    "response" TEXT NOT NULL,

    CONSTRAINT "answer_pk" PRIMARY KEY ("answer_id")
);

-- CreateTable
CREATE TABLE "question" (
    "question_id" SERIAL NOT NULL,
    "ask" VARCHAR(100) NOT NULL,
    "isOtherQuestion" INTEGER,

    CONSTRAINT "question_pk" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "question_answer" (
    "question_id" INTEGER NOT NULL,
    "answer_id" INTEGER NOT NULL,

    CONSTRAINT "question_answer_pk" PRIMARY KEY ("question_id","answer_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "answer_response_uindex" ON "answer"("response");

-- CreateIndex
CREATE UNIQUE INDEX "question_ask_uindex" ON "question"("ask");

-- AddForeignKey
ALTER TABLE "question_answer" ADD CONSTRAINT "question_answer_answer_answer_id_fk" FOREIGN KEY ("answer_id") REFERENCES "answer"("answer_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "question_answer" ADD CONSTRAINT "question_answer_question_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "question"("question_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
