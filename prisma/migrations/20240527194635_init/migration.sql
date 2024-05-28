/*
  Warnings:

  - A unique constraint covering the columns `[order_no]` on the table `dead_stock` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "dead_stock_order_no_key" ON "dead_stock"("order_no");
