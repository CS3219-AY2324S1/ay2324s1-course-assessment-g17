/*
  Warnings:

  - Changed the type of `complexity` on the `AnsweredQuestion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "AnsweredQuestion" DROP COLUMN "complexity",
ADD COLUMN     "complexity" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Complexity";
