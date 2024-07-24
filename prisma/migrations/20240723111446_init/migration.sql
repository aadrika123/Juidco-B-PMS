-- CreateTable
CREATE TABLE "stock_req_product" (
    "id" TEXT NOT NULL,
    "stock_handover_no" TEXT NOT NULL,
    "serial_no" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_req_product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stock_req_product_serial_no_key" ON "stock_req_product"("serial_no");

-- AddForeignKey
ALTER TABLE "stock_req_product" ADD CONSTRAINT "stock_req_product_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_req_product" ADD CONSTRAINT "stock_req_product_stock_handover_no_fkey" FOREIGN KEY ("stock_handover_no") REFERENCES "stock_request"("stock_handover_no") ON DELETE RESTRICT ON UPDATE CASCADE;
