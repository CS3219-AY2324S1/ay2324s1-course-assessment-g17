/*
  Warnings:

  - You are about to drop the `UserLanguage` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[language]` on the table `Language` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UserLanguage" DROP CONSTRAINT "UserLanguage_language_id_fkey";

-- DropForeignKey
ALTER TABLE "UserLanguage" DROP CONSTRAINT "UserLanguage_user_id_fkey";

-- DropTable
DROP TABLE "UserLanguage";

-- CreateIndex
CREATE UNIQUE INDEX "Language_language_key" ON "Language"("language");
