/*
  Warnings:

  - You are about to drop the column `brand_masterId` on the `procurement` table. All the data in the column will be lost.
  - You are about to drop the column `category_masterId` on the `procurement` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `procurement` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `procurement` table. All the data in the column will be lost.
  - You are about to drop the column `rate` on the `procurement` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `procurement` table. All the data in the column will be lost.
  - You are about to drop the column `subcategory_masterId` on the `procurement` table. All the data in the column will be lost.
  - You are about to drop the column `unit_masterId` on the `procurement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "procurement" DROP CONSTRAINT "procurement_brand_masterId_fkey";

-- DropForeignKey
ALTER TABLE "procurement" DROP CONSTRAINT "procurement_category_masterId_fkey";

-- DropForeignKey
ALTER TABLE "procurement" DROP CONSTRAINT "procurement_statusId_fkey";

-- DropForeignKey
ALTER TABLE "procurement" DROP CONSTRAINT "procurement_subcategory_masterId_fkey";

-- DropForeignKey
ALTER TABLE "procurement" DROP CONSTRAINT "procurement_unit_masterId_fkey";

-- AlterTable
ALTER TABLE "procurement" DROP COLUMN "brand_masterId",
DROP COLUMN "category_masterId",
DROP COLUMN "description",
DROP COLUMN "quantity",
DROP COLUMN "rate",
DROP COLUMN "statusId",
DROP COLUMN "subcategory_masterId",
DROP COLUMN "unit_masterId",
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "ia_pre_procurement_inbox" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ia_pre_procurement_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement_stocks" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "handover_no" TEXT NOT NULL,

    CONSTRAINT "procurement_stocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ia_pre_procurement_inbox_procurement_no_key" ON "ia_pre_procurement_inbox"("procurement_no");

-- CreateIndex
CREATE UNIQUE INDEX "procurement_stocks_handover_no_key" ON "procurement_stocks"("handover_no");

-- AddForeignKey
ALTER TABLE "ia_pre_procurement_inbox" ADD CONSTRAINT "ia_pre_procurement_inbox_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_stocks" ADD CONSTRAINT "procurement_stocks_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_stocks" ADD CONSTRAINT "procurement_stocks_handover_no_fkey" FOREIGN KEY ("handover_no") REFERENCES "stock_request"("stock_handover_no") ON DELETE RESTRICT ON UPDATE CASCADE;
