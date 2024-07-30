/*
  Warnings:

  - You are about to drop the column `brand_masterId` on the `procurement` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `procurement` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `procurement` table. All the data in the column will be lost.
  - You are about to drop the column `rate` on the `procurement` table. All the data in the column will be lost.
  - You are about to drop the column `subCategory_masterId` on the `procurement` table. All the data in the column will be lost.
  - You are about to drop the column `unit_masterId` on the `procurement` table. All the data in the column will be lost.
  - You are about to drop the column `handover_no` on the `procurement_stocks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "procurement" DROP CONSTRAINT "procurement_brand_masterId_fkey";

-- DropForeignKey
ALTER TABLE "procurement" DROP CONSTRAINT "procurement_subCategory_masterId_fkey";

-- DropForeignKey
ALTER TABLE "procurement" DROP CONSTRAINT "procurement_unit_masterId_fkey";

-- DropForeignKey
ALTER TABLE "procurement_stocks" DROP CONSTRAINT "procurement_stocks_handover_no_fkey";

-- DropIndex
DROP INDEX "procurement_stocks_handover_no_key";

-- AlterTable
ALTER TABLE "procurement" DROP COLUMN "brand_masterId",
DROP COLUMN "description",
DROP COLUMN "quantity",
DROP COLUMN "rate",
DROP COLUMN "subCategory_masterId",
DROP COLUMN "unit_masterId",
ALTER COLUMN "status" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "procurement_stocks" DROP COLUMN "handover_no",
ADD COLUMN     "brand_masterId" TEXT,
ADD COLUMN     "category_masterId" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "quantity" INTEGER,
ADD COLUMN     "rate" INTEGER,
ADD COLUMN     "subCategory_masterId" TEXT,
ADD COLUMN     "unit_masterId" TEXT;

-- CreateTable
CREATE TABLE "ia_pre_procurement_outbox" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ia_pre_procurement_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ia_pre_procurement_outbox_procurement_no_key" ON "ia_pre_procurement_outbox"("procurement_no");

-- AddForeignKey
ALTER TABLE "ia_pre_procurement_outbox" ADD CONSTRAINT "ia_pre_procurement_outbox_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_stocks" ADD CONSTRAINT "procurement_stocks_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_stocks" ADD CONSTRAINT "procurement_stocks_subCategory_masterId_fkey" FOREIGN KEY ("subCategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_stocks" ADD CONSTRAINT "procurement_stocks_brand_masterId_fkey" FOREIGN KEY ("brand_masterId") REFERENCES "brand_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_stocks" ADD CONSTRAINT "procurement_stocks_unit_masterId_fkey" FOREIGN KEY ("unit_masterId") REFERENCES "unit_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;
