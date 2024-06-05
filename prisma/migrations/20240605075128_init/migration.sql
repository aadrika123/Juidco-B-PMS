/*
  Warnings:

  - You are about to drop the column `amoount` on the `boq_procurement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "boq_procurement" DROP COLUMN "amoount",
ADD COLUMN     "amount" DOUBLE PRECISION;
