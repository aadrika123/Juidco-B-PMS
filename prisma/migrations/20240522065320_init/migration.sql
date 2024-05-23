-- CreateTable
CREATE TABLE "da_post_procurement_inbox" (
    "id" TEXT NOT NULL,
    "order_no" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "da_pre_procurement_outboxId" TEXT NOT NULL,
    "supplier_name" TEXT,
    "gst_no" TEXT,
    "final_rate" INTEGER,
    "gst" INTEGER,
    "total_quantity" INTEGER,
    "total_price" INTEGER,
    "unit_price" INTEGER,
    "is_gst_added" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "da_post_procurement_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "da_post_procurement_outbox" (
    "id" TEXT NOT NULL,
    "order_no" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "da_pre_procurement_outboxId" TEXT NOT NULL,
    "supplier_name" TEXT,
    "gst_no" TEXT,
    "final_rate" INTEGER,
    "gst" INTEGER,
    "total_quantity" INTEGER,
    "total_price" INTEGER,
    "unit_price" INTEGER,
    "is_gst_added" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "da_post_procurement_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "da_post_procurement_inbox_order_no_key" ON "da_post_procurement_inbox"("order_no");

-- CreateIndex
CREATE UNIQUE INDEX "da_post_procurement_inbox_statusId_key" ON "da_post_procurement_inbox"("statusId");

-- CreateIndex
CREATE UNIQUE INDEX "da_post_procurement_inbox_da_pre_procurement_outboxId_key" ON "da_post_procurement_inbox"("da_pre_procurement_outboxId");

-- CreateIndex
CREATE UNIQUE INDEX "da_post_procurement_outbox_order_no_key" ON "da_post_procurement_outbox"("order_no");

-- CreateIndex
CREATE UNIQUE INDEX "da_post_procurement_outbox_statusId_key" ON "da_post_procurement_outbox"("statusId");

-- CreateIndex
CREATE UNIQUE INDEX "da_post_procurement_outbox_da_pre_procurement_outboxId_key" ON "da_post_procurement_outbox"("da_pre_procurement_outboxId");

-- AddForeignKey
ALTER TABLE "da_post_procurement_inbox" ADD CONSTRAINT "da_post_procurement_inbox_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "procurement_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_post_procurement_inbox" ADD CONSTRAINT "da_post_procurement_inbox_da_pre_procurement_outboxId_fkey" FOREIGN KEY ("da_pre_procurement_outboxId") REFERENCES "da_pre_procurement_outbox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_post_procurement_outbox" ADD CONSTRAINT "da_post_procurement_outbox_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "procurement_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_post_procurement_outbox" ADD CONSTRAINT "da_post_procurement_outbox_da_pre_procurement_outboxId_fkey" FOREIGN KEY ("da_pre_procurement_outboxId") REFERENCES "da_pre_procurement_outbox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
