/*
  Warnings:

  - A unique constraint covering the columns `[stock_handover_no,serial_no]` on the table `stock_req_product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "stock_req_product_stock_handover_no_serial_no_key" ON "stock_req_product"("stock_handover_no", "serial_no");
