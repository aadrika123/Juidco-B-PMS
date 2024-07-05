/*
  Warnings:

  - You are about to drop the column `isAcknowledged` on the `stock_request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "stock_request" DROP COLUMN "isAcknowledged";
