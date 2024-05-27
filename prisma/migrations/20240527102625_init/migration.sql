/*
  Warnings:

  - You are about to drop the column `brand` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `unit_price` on the `inventory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "inventory" DROP COLUMN "brand",
DROP COLUMN "unit_price";
