/*
  Warnings:

  - You are about to drop the column `bid_type` on the `criteria` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "criteria_type_enum" AS ENUM ('technical', 'financial');

-- AlterTable
ALTER TABLE "criteria" DROP COLUMN "bid_type",
ADD COLUMN     "criteria_type" "criteria_type_enum";
