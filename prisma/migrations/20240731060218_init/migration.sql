/*
  Warnings:

  - A unique constraint covering the columns `[procurement_no]` on the table `boq` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "boq" ADD COLUMN     "procurement_no" TEXT;

-- AlterTable
ALTER TABLE "procurement_stocks" ADD COLUMN     "boq_procurement_no" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "boq_procurement_no_key" ON "boq"("procurement_no");

-- AddForeignKey
ALTER TABLE "procurement_stocks" ADD CONSTRAINT "procurement_stocks_boq_procurement_no_fkey" FOREIGN KEY ("boq_procurement_no") REFERENCES "boq"("procurement_no") ON DELETE SET NULL ON UPDATE CASCADE;
