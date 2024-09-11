-- CreateEnum
CREATE TYPE "comparison_ratio_enum" AS ENUM ('t80f20', 't70f30', 't60f40');

-- AlterTable
ALTER TABLE "bid_details" ADD COLUMN     "comparison_ratio" "comparison_ratio_enum";

-- AlterTable
ALTER TABLE "pre_tendering_details" ADD COLUMN     "no_of_covers" INTEGER;
