/*
  Warnings:

  - The `total_rate` column on the `procurement_stocks` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "procurement_stocks" ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "rate" SET DATA TYPE DOUBLE PRECISION,
DROP COLUMN "total_rate",
ADD COLUMN     "total_rate" DOUBLE PRECISION;
