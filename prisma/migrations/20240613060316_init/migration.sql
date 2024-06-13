/*
  Warnings:

  - The `docPath` column on the `cover_details_docs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "cover_details_docs" DROP COLUMN "docPath",
ADD COLUMN     "docPath" TEXT[];
