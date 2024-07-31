/*
  Warnings:

  - You are about to drop the column `brand_masterId` on the `stock_request` table. All the data in the column will be lost.
  - You are about to drop the column `category_masterId` on the `stock_request` table. All the data in the column will be lost.
  - You are about to drop the column `subcategory_masterId` on the `stock_request` table. All the data in the column will be lost.
  - You are about to drop the column `supplier_masterId` on the `stock_request` table. All the data in the column will be lost.
  - You are about to drop the column `unit_masterId` on the `stock_request` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "stock_request" DROP CONSTRAINT "stock_request_brand_masterId_fkey";

-- DropForeignKey
ALTER TABLE "stock_request" DROP CONSTRAINT "stock_request_category_masterId_fkey";

-- DropForeignKey
ALTER TABLE "stock_request" DROP CONSTRAINT "stock_request_subcategory_masterId_fkey";

-- DropForeignKey
ALTER TABLE "stock_request" DROP CONSTRAINT "stock_request_supplier_masterId_fkey";

-- DropForeignKey
ALTER TABLE "stock_request" DROP CONSTRAINT "stock_request_unit_masterId_fkey";

-- AlterTable
ALTER TABLE "stock_request" DROP COLUMN "brand_masterId",
DROP COLUMN "category_masterId",
DROP COLUMN "subcategory_masterId",
DROP COLUMN "supplier_masterId",
DROP COLUMN "unit_masterId";
