/*
  Warnings:

  - You are about to drop the column `ReferenceNo` on the `cover_details_docs` table. All the data in the column will be lost.
  - You are about to drop the column `uniqueId` on the `cover_details_docs` table. All the data in the column will be lost.
  - Added the required column `docPath` to the `cover_details_docs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cover_details_docs" DROP COLUMN "ReferenceNo",
DROP COLUMN "uniqueId",
ADD COLUMN     "docPath" TEXT NOT NULL;
