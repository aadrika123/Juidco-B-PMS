-- AlterTable
ALTER TABLE "procurement_history" ADD COLUMN     "is_partial" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "rate" DOUBLE PRECISION,
ADD COLUMN     "total_rate" DOUBLE PRECISION;
