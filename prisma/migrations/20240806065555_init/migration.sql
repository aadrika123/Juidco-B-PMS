/*
  Warnings:

  - Changed the type of `comparison_type` on the `bid_details` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "bid_type_enum" AS ENUM ('technical', 'financial', 'fintech', 'rate_contract');

-- AlterTable
ALTER TABLE "bid_details" DROP COLUMN "comparison_type",
ADD COLUMN     "comparison_type" "bid_type_enum" NOT NULL;

-- DropEnum
DROP TYPE "camparison_type_enum";
