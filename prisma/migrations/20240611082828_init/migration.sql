/*
  Warnings:

  - A unique constraint covering the columns `[procurement_no]` on the table `boq_procurement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "boq_procurement_procurement_no_key" ON "boq_procurement"("procurement_no");
