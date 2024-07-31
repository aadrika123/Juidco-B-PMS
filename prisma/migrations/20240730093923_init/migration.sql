/*
  Warnings:

  - Added the required column `updatedAt` to the `procurement_stocks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "procurement_stocks" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "total_rate" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
