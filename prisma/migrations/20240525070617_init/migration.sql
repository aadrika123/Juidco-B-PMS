-- AlterTable
ALTER TABLE "receivings" ADD COLUMN     "da_received_inventory_outboxId" TEXT;

-- CreateTable
CREATE TABLE "da_received_inventory_outbox" (
    "id" TEXT NOT NULL,
    "order_no" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "da_pre_procurement_outboxId" TEXT NOT NULL,
    "supplier_name" TEXT,
    "gst_no" TEXT,
    "final_rate" DOUBLE PRECISION,
    "gst" DOUBLE PRECISION,
    "total_quantity" INTEGER,
    "total_price" DOUBLE PRECISION,
    "unit_price" DOUBLE PRECISION,
    "is_gst_added" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "da_received_inventory_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "da_received_inventory_outbox_order_no_key" ON "da_received_inventory_outbox"("order_no");

-- CreateIndex
CREATE UNIQUE INDEX "da_received_inventory_outbox_statusId_key" ON "da_received_inventory_outbox"("statusId");

-- CreateIndex
CREATE UNIQUE INDEX "da_received_inventory_outbox_da_pre_procurement_outboxId_key" ON "da_received_inventory_outbox"("da_pre_procurement_outboxId");

-- AddForeignKey
ALTER TABLE "receivings" ADD CONSTRAINT "receivings_da_received_inventory_outboxId_fkey" FOREIGN KEY ("da_received_inventory_outboxId") REFERENCES "da_received_inventory_outbox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_received_inventory_outbox" ADD CONSTRAINT "da_received_inventory_outbox_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "procurement_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_received_inventory_outbox" ADD CONSTRAINT "da_received_inventory_outbox_da_pre_procurement_outboxId_fkey" FOREIGN KEY ("da_pre_procurement_outboxId") REFERENCES "da_pre_procurement_outbox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
