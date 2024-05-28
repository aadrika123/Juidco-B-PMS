-- CreateTable
CREATE TABLE "dead_stock_image" (
    "id" TEXT NOT NULL,
    "order_no" TEXT NOT NULL,
    "ReferenceNo" TEXT NOT NULL,
    "uniqueId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dead_stockId" TEXT NOT NULL,

    CONSTRAINT "dead_stock_image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dead_stock_image_order_no_key" ON "dead_stock_image"("order_no");

-- AddForeignKey
ALTER TABLE "dead_stock_image" ADD CONSTRAINT "dead_stock_image_order_no_fkey" FOREIGN KEY ("order_no") REFERENCES "dead_stock"("order_no") ON DELETE RESTRICT ON UPDATE CASCADE;
