/*
  Warnings:

  - You are about to drop the column `supplier_masterId` on the `procurement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "procurement" DROP CONSTRAINT "procurement_supplier_masterId_fkey";

-- AlterTable
ALTER TABLE "procurement" DROP COLUMN "supplier_masterId";

-- AlterTable
ALTER TABLE "supplier_master" ADD COLUMN     "procurement_no" TEXT;

-- AddForeignKey
ALTER TABLE "supplier_master" ADD CONSTRAINT "supplier_master_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE SET NULL ON UPDATE CASCADE;
