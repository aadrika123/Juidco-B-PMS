/*
  Warnings:

  - Added the required column `bidding_amount` to the `bidder_master` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bidder_master" ADD COLUMN     "bidding_amount" DOUBLE PRECISION NOT NULL;
