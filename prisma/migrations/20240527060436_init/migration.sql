-- CreateTable
CREATE TABLE "sr_post_procurement_inbox" (
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

    CONSTRAINT "sr_post_procurement_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sr_post_procurement_inbox_order_no_key" ON "sr_post_procurement_inbox"("order_no");

-- CreateIndex
CREATE UNIQUE INDEX "sr_post_procurement_inbox_statusId_key" ON "sr_post_procurement_inbox"("statusId");

-- CreateIndex
CREATE UNIQUE INDEX "sr_post_procurement_inbox_da_pre_procurement_outboxId_key" ON "sr_post_procurement_inbox"("da_pre_procurement_outboxId");

-- AddForeignKey
ALTER TABLE "sr_post_procurement_inbox" ADD CONSTRAINT "sr_post_procurement_inbox_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "procurement_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_post_procurement_inbox" ADD CONSTRAINT "sr_post_procurement_inbox_da_pre_procurement_outboxId_fkey" FOREIGN KEY ("da_pre_procurement_outboxId") REFERENCES "da_pre_procurement_outbox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
