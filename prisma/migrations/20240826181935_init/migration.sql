/*
  Warnings:

  - You are about to drop the column `rate` on the `rate_contract` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rate_contract" DROP COLUMN "rate",
ADD COLUMN     "unit_price" DOUBLE PRECISION;
