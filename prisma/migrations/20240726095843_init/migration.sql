-- CreateTable
CREATE TABLE "inventory_warranty" (
    "id" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "serial_no" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "remark1" TEXT,
    "remark2" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_warranty_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "inventory_warranty" ADD CONSTRAINT "inventory_warranty_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
