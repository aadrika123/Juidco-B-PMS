-- CreateTable
CREATE TABLE "receivings" (
    "id" TEXT NOT NULL,
    "order_no" TEXT NOT NULL,
    "receiving_no" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "received_quantity" INTEGER,
    "remaining_quantity" INTEGER,
    "image" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receivings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "da_received_inventory_inbox" (
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

    CONSTRAINT "da_received_inventory_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "da_received_inventory_inbox_order_no_key" ON "da_received_inventory_inbox"("order_no");

-- CreateIndex
CREATE UNIQUE INDEX "da_received_inventory_inbox_statusId_key" ON "da_received_inventory_inbox"("statusId");

-- CreateIndex
CREATE UNIQUE INDEX "da_received_inventory_inbox_da_pre_procurement_outboxId_key" ON "da_received_inventory_inbox"("da_pre_procurement_outboxId");

-- AddForeignKey
ALTER TABLE "receivings" ADD CONSTRAINT "receivings_order_no_fkey" FOREIGN KEY ("order_no") REFERENCES "da_received_inventory_inbox"("order_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_received_inventory_inbox" ADD CONSTRAINT "da_received_inventory_inbox_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "procurement_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_received_inventory_inbox" ADD CONSTRAINT "da_received_inventory_inbox_da_pre_procurement_outboxId_fkey" FOREIGN KEY ("da_pre_procurement_outboxId") REFERENCES "da_pre_procurement_outbox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
