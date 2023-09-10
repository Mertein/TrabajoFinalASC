/*
  Warnings:

  - A unique constraint covering the columns `[user_id,faq_id]` on the table `user_interactions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
CREATE SEQUENCE user_interactions_id_seq;
ALTER TABLE "user_interactions" ADD COLUMN     "isLike" BOOLEAN,
ALTER COLUMN "id" SET DEFAULT nextval('user_interactions_id_seq');
ALTER SEQUENCE user_interactions_id_seq OWNED BY "user_interactions"."id";

-- CreateIndex
CREATE UNIQUE INDEX "user_interactions_user_id_faq_id_uindex" ON "user_interactions"("user_id", "faq_id");
