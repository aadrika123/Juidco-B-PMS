-- CreateTable
CREATE TABLE "category_master" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcategory_master" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category_masterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subcategory_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brand_master" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subcategory_masterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brand_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement_status" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "procurement_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sr_pre_procurement_inbox" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sr_pre_procurement_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sr_pre_procurement_outbox" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sr_pre_procurement_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "da_pre_procurement_inbox" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "da_pre_procurement_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "da_pre_procurement_outbox" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "da_pre_procurement_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "da_post_procurement_inbox" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "da_post_procurement_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "da_post_procurement_outbox" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "da_post_procurement_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sr_post_procurement_inbox" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sr_post_procurement_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receivings" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT,
    "receiving_no" TEXT NOT NULL,
    "date" DATE,
    "received_quantity" INTEGER,
    "remaining_quantity" INTEGER,
    "is_added" BOOLEAN NOT NULL DEFAULT false,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "procurementId" TEXT NOT NULL,

    CONSTRAINT "receivings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receiving_image" (
    "id" TEXT NOT NULL,
    "ReferenceNo" TEXT NOT NULL,
    "uniqueId" TEXT,
    "receiving_no" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receiving_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "da_received_inventory_inbox" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "da_received_inventory_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "da_received_inventory_outbox" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "da_received_inventory_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sr_received_inventory_inbox" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sr_received_inventory_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sr_received_inventory_outbox" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sr_received_inventory_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory" (
    "id" TEXT NOT NULL,
    "category_masterId" TEXT,
    "subcategory_masterId" TEXT,
    "brand_masterId" TEXT,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dead_stock" (
    "id" TEXT NOT NULL,
    "order_no" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dead_stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dead_stock_image" (
    "id" TEXT NOT NULL,
    "order_no" TEXT NOT NULL,
    "ReferenceNo" TEXT NOT NULL,
    "uniqueId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dead_stock_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "category_masterId" TEXT,
    "subcategory_masterId" TEXT,
    "brand_masterId" TEXT,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "is_partial" BOOLEAN NOT NULL DEFAULT true,
    "statusId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "procurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_procurement" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
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

    CONSTRAINT "post_procurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement_history" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "category_masterId" TEXT,
    "subcategory_masterId" TEXT,
    "brand_masterId" TEXT,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "status" INTEGER NOT NULL,
    "statusId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "procurement_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_master_name_key" ON "category_master"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subcategory_master_name_key" ON "subcategory_master"("name");

-- CreateIndex
CREATE UNIQUE INDEX "brand_master_name_key" ON "brand_master"("name");

-- CreateIndex
CREATE UNIQUE INDEX "procurement_status_procurement_no_key" ON "procurement_status"("procurement_no");

-- CreateIndex
CREATE UNIQUE INDEX "sr_pre_procurement_inbox_procurement_no_key" ON "sr_pre_procurement_inbox"("procurement_no");

-- CreateIndex
CREATE UNIQUE INDEX "sr_pre_procurement_outbox_procurement_no_key" ON "sr_pre_procurement_outbox"("procurement_no");

-- CreateIndex
CREATE UNIQUE INDEX "da_pre_procurement_inbox_procurement_no_key" ON "da_pre_procurement_inbox"("procurement_no");

-- CreateIndex
CREATE UNIQUE INDEX "da_pre_procurement_outbox_procurement_no_key" ON "da_pre_procurement_outbox"("procurement_no");

-- CreateIndex
CREATE UNIQUE INDEX "da_post_procurement_inbox_procurement_no_key" ON "da_post_procurement_inbox"("procurement_no");

-- CreateIndex
CREATE UNIQUE INDEX "da_post_procurement_outbox_procurement_no_key" ON "da_post_procurement_outbox"("procurement_no");

-- CreateIndex
CREATE UNIQUE INDEX "sr_post_procurement_inbox_procurement_no_key" ON "sr_post_procurement_inbox"("procurement_no");

-- CreateIndex
CREATE UNIQUE INDEX "receivings_receiving_no_key" ON "receivings"("receiving_no");

-- CreateIndex
CREATE UNIQUE INDEX "da_received_inventory_inbox_procurement_no_key" ON "da_received_inventory_inbox"("procurement_no");

-- CreateIndex
CREATE UNIQUE INDEX "da_received_inventory_outbox_procurement_no_key" ON "da_received_inventory_outbox"("procurement_no");

-- CreateIndex
CREATE UNIQUE INDEX "sr_received_inventory_inbox_procurement_no_key" ON "sr_received_inventory_inbox"("procurement_no");

-- CreateIndex
CREATE UNIQUE INDEX "sr_received_inventory_outbox_procurement_no_key" ON "sr_received_inventory_outbox"("procurement_no");

-- CreateIndex
CREATE UNIQUE INDEX "dead_stock_order_no_key" ON "dead_stock"("order_no");

-- CreateIndex
CREATE UNIQUE INDEX "dead_stock_image_order_no_key" ON "dead_stock_image"("order_no");

-- CreateIndex
CREATE UNIQUE INDEX "procurement_procurement_no_key" ON "procurement"("procurement_no");

-- CreateIndex
CREATE UNIQUE INDEX "post_procurement_procurement_no_key" ON "post_procurement"("procurement_no");

-- CreateIndex
CREATE UNIQUE INDEX "procurement_history_procurement_no_key" ON "procurement_history"("procurement_no");

-- AddForeignKey
ALTER TABLE "subcategory_master" ADD CONSTRAINT "subcategory_master_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brand_master" ADD CONSTRAINT "brand_master_subcategory_masterId_fkey" FOREIGN KEY ("subcategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_inbox" ADD CONSTRAINT "sr_pre_procurement_inbox_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_outbox" ADD CONSTRAINT "sr_pre_procurement_outbox_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_inbox" ADD CONSTRAINT "da_pre_procurement_inbox_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_outbox" ADD CONSTRAINT "da_pre_procurement_outbox_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_post_procurement_inbox" ADD CONSTRAINT "da_post_procurement_inbox_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_post_procurement_outbox" ADD CONSTRAINT "da_post_procurement_outbox_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_post_procurement_inbox" ADD CONSTRAINT "sr_post_procurement_inbox_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receivings" ADD CONSTRAINT "receivings_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receiving_image" ADD CONSTRAINT "receiving_image_receiving_no_fkey" FOREIGN KEY ("receiving_no") REFERENCES "receivings"("receiving_no") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_received_inventory_inbox" ADD CONSTRAINT "da_received_inventory_inbox_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_received_inventory_outbox" ADD CONSTRAINT "da_received_inventory_outbox_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_received_inventory_inbox" ADD CONSTRAINT "sr_received_inventory_inbox_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_received_inventory_outbox" ADD CONSTRAINT "sr_received_inventory_outbox_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_subcategory_masterId_fkey" FOREIGN KEY ("subcategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_brand_masterId_fkey" FOREIGN KEY ("brand_masterId") REFERENCES "brand_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dead_stock_image" ADD CONSTRAINT "dead_stock_image_order_no_fkey" FOREIGN KEY ("order_no") REFERENCES "dead_stock"("order_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement" ADD CONSTRAINT "procurement_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement" ADD CONSTRAINT "procurement_subcategory_masterId_fkey" FOREIGN KEY ("subcategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement" ADD CONSTRAINT "procurement_brand_masterId_fkey" FOREIGN KEY ("brand_masterId") REFERENCES "brand_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement" ADD CONSTRAINT "procurement_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "procurement_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_procurement" ADD CONSTRAINT "post_procurement_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_history" ADD CONSTRAINT "procurement_history_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_history" ADD CONSTRAINT "procurement_history_subcategory_masterId_fkey" FOREIGN KEY ("subcategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_history" ADD CONSTRAINT "procurement_history_brand_masterId_fkey" FOREIGN KEY ("brand_masterId") REFERENCES "brand_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;
