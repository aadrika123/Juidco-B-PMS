/*
  Warnings:

  - You are about to drop the column `comparison_type` on the `bid_details` table. All the data in the column will be lost.
  - Added the required column `bid_type` to the `bid_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bid_details" DROP COLUMN "comparison_type",
ADD COLUMN     "bid_type" "bid_type_enum" NOT NULL;
