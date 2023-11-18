/*
  Warnings:

  - You are about to drop the `UserLanguage` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[language]` on the table `Language` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Complexity" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- DropForeignKey
ALTER TABLE "UserLanguage" DROP CONSTRAINT "UserLanguage_language_id_fkey";

-- DropForeignKey
ALTER TABLE "UserLanguage" DROP CONSTRAINT "UserLanguage_user_id_fkey";

-- DropTable
DROP TABLE "UserLanguage";

-- CreateTable
CREATE TABLE "AnsweredQuestion" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "questionTitle" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "complexity" "Complexity" NOT NULL,
    "category" TEXT[],
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnsweredQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Language_language_key" ON "Language"("language");

-- AddForeignKey
ALTER TABLE "AnsweredQuestion" ADD CONSTRAINT "AnsweredQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
