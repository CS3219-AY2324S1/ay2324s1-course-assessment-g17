/*
  Warnings:

  - The `upvotes` column on the `Comment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `upvotes` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "upvotes",
ADD COLUMN     "upvotes" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "upvotes",
ADD COLUMN     "upvotes" TEXT[] DEFAULT ARRAY[]::TEXT[];
