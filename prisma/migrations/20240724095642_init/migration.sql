/*
  Warnings:

  - You are about to drop the column `brand_masterId` on the `stock_request_history` table. All the data in the column will be lost.
  - You are about to drop the column `category_masterId` on the `stock_request_history` table. All the data in the column will be lost.
  - You are about to drop the column `subcategory_masterId` on the `stock_request_history` table. All the data in the column will be lost.
  - You are about to drop the column `supplier_masterId` on the `stock_request_history` table. All the data in the column will be lost.
  - You are about to drop the column `unit_masterId` on the `stock_request_history` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "stock_request_history" DROP CONSTRAINT "stock_request_history_brand_masterId_fkey";

-- DropForeignKey
ALTER TABLE "stock_request_history" DROP CONSTRAINT "stock_request_history_category_masterId_fkey";

-- DropForeignKey
ALTER TABLE "stock_request_history" DROP CONSTRAINT "stock_request_history_subcategory_masterId_fkey";

-- DropForeignKey
ALTER TABLE "stock_request_history" DROP CONSTRAINT "stock_request_history_supplier_masterId_fkey";

-- DropForeignKey
ALTER TABLE "stock_request_history" DROP CONSTRAINT "stock_request_history_unit_masterId_fkey";

-- AlterTable
ALTER TABLE "stock_request_history" DROP COLUMN "brand_masterId",
DROP COLUMN "category_masterId",
DROP COLUMN "subcategory_masterId",
DROP COLUMN "supplier_masterId",
DROP COLUMN "unit_masterId",
ADD COLUMN     "inventoryId" TEXT;

-- AddForeignKey
ALTER TABLE "stock_request_history" ADD CONSTRAINT "stock_request_history_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
