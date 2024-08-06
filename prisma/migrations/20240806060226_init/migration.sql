/*
  Warnings:

  - You are about to drop the column `bid_type` on the `bid_details` table. All the data in the column will be lost.
  - Added the required column `comparison_type` to the `bid_details` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "camparison_type_enum" AS ENUM ('technical', 'financial', 'fintech', 'rate_contract');

-- AlterTable
ALTER TABLE "bid_details" DROP COLUMN "bid_type",
ADD COLUMN     "comparison_type" "camparison_type_enum" NOT NULL,
ADD COLUMN     "creationStatus" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0;

-- DropEnum
DROP TYPE "bid_type_enum";
