/*
  Warnings:

  - A unique constraint covering the columns `[procurement_stocksId]` on the table `procurement_stocks_history` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "procurement_stocks_history_procurement_stocksId_key" ON "procurement_stocks_history"("procurement_stocksId");
