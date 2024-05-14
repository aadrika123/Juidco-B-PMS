/*
  Warnings:

  - A unique constraint covering the columns `[order_no]` on the table `pre_procurement_history` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "pre_procurement_history_order_no_key" ON "pre_procurement_history"("order_no");
