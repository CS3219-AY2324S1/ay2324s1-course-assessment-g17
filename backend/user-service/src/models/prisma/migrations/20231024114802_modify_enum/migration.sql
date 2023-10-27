/*
  Warnings:

  - The values [EASY,MEDIUM,HARD] on the enum `Complexity` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Complexity_new" AS ENUM ('Easy', 'Medium', 'Hard');
ALTER TABLE "AnsweredQuestion" ALTER COLUMN "complexity" TYPE "Complexity_new" USING ("complexity"::text::"Complexity_new");
ALTER TYPE "Complexity" RENAME TO "Complexity_old";
ALTER TYPE "Complexity_new" RENAME TO "Complexity";
DROP TYPE "Complexity_old";
COMMIT;
