/*
  Warnings:

  - You are about to drop the column `ReferenceNo` on the `boq_doc` table. All the data in the column will be lost.
  - You are about to drop the column `uniqueId` on the `boq_doc` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "boq_doc" DROP COLUMN "ReferenceNo",
DROP COLUMN "uniqueId",
ADD COLUMN     "docPath" TEXT;
