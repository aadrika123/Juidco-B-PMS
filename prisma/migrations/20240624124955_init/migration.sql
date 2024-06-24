-- CreateTable
CREATE TABLE "inventory_buffer" (
    "id" TEXT NOT NULL,
    "stock_handover_no" TEXT NOT NULL,
    "reserved_quantity" DOUBLE PRECISION NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_buffer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inventory_buffer_stock_handover_no_key" ON "inventory_buffer"("stock_handover_no");

-- AddForeignKey
ALTER TABLE "inventory_buffer" ADD CONSTRAINT "inventory_buffer_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
