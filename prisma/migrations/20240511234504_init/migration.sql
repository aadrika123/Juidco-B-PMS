-- CreateTable
CREATE TABLE "procurement_status" (
    "id" TEXT NOT NULL,
    "order_no" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "procurement_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sr_pre_procurement_inbox" (
    "id" TEXT NOT NULL,
    "order_no" TEXT NOT NULL,
    "category_masterId" TEXT NOT NULL,
    "subcategory_masterId" TEXT NOT NULL,
    "brand_masterId" TEXT,
    "processor_masterId" TEXT,
    "ram_masterId" TEXT,
    "os_masterId" TEXT,
    "rom_masterId" TEXT,
    "graphics_masterId" TEXT,
    "other_description" TEXT,
    "rate" INTEGER,
    "quantity" INTEGER,
    "total_rate" INTEGER,
    "statusId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sr_pre_procurement_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sr_pre_procurement_outbox" (
    "id" TEXT NOT NULL,
    "order_no" TEXT NOT NULL,
    "category_masterId" TEXT NOT NULL,
    "subcategory_masterId" TEXT NOT NULL,
    "brand_masterId" TEXT,
    "processor_masterId" TEXT,
    "ram_masterId" TEXT,
    "os_masterId" TEXT,
    "rom_masterId" TEXT,
    "graphics_masterId" TEXT,
    "other_description" TEXT,
    "rate" INTEGER,
    "quantity" INTEGER,
    "total_rate" INTEGER,
    "statusId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sr_pre_procurement_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "da_pre_procurement_inbox" (
    "id" TEXT NOT NULL,
    "order_no" TEXT NOT NULL,
    "category_masterId" TEXT NOT NULL,
    "subcategory_masterId" TEXT NOT NULL,
    "brand_masterId" TEXT,
    "processor_masterId" TEXT,
    "ram_masterId" TEXT,
    "os_masterId" TEXT,
    "rom_masterId" TEXT,
    "graphics_masterId" TEXT,
    "other_description" TEXT,
    "rate" INTEGER,
    "quantity" INTEGER,
    "total_rate" INTEGER,
    "statusId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "da_pre_procurement_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "da_pre_procurement_outbox" (
    "id" TEXT NOT NULL,
    "order_no" TEXT NOT NULL,
    "category_masterId" TEXT NOT NULL,
    "subcategory_masterId" TEXT NOT NULL,
    "brand_masterId" TEXT,
    "processor_masterId" TEXT,
    "ram_masterId" TEXT,
    "os_masterId" TEXT,
    "rom_masterId" TEXT,
    "graphics_masterId" TEXT,
    "other_description" TEXT,
    "rate" INTEGER,
    "quantity" INTEGER,
    "total_rate" INTEGER,
    "statusId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "da_pre_procurement_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "procurement_status_order_no_key" ON "procurement_status"("order_no");

-- CreateIndex
CREATE UNIQUE INDEX "sr_pre_procurement_inbox_order_no_key" ON "sr_pre_procurement_inbox"("order_no");

-- CreateIndex
CREATE UNIQUE INDEX "sr_pre_procurement_inbox_statusId_key" ON "sr_pre_procurement_inbox"("statusId");

-- CreateIndex
CREATE UNIQUE INDEX "sr_pre_procurement_outbox_order_no_key" ON "sr_pre_procurement_outbox"("order_no");

-- CreateIndex
CREATE UNIQUE INDEX "sr_pre_procurement_outbox_statusId_key" ON "sr_pre_procurement_outbox"("statusId");

-- CreateIndex
CREATE UNIQUE INDEX "da_pre_procurement_inbox_order_no_key" ON "da_pre_procurement_inbox"("order_no");

-- CreateIndex
CREATE UNIQUE INDEX "da_pre_procurement_inbox_statusId_key" ON "da_pre_procurement_inbox"("statusId");

-- CreateIndex
CREATE UNIQUE INDEX "da_pre_procurement_outbox_order_no_key" ON "da_pre_procurement_outbox"("order_no");

-- CreateIndex
CREATE UNIQUE INDEX "da_pre_procurement_outbox_statusId_key" ON "da_pre_procurement_outbox"("statusId");

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_inbox" ADD CONSTRAINT "sr_pre_procurement_inbox_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_inbox" ADD CONSTRAINT "sr_pre_procurement_inbox_subcategory_masterId_fkey" FOREIGN KEY ("subcategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_inbox" ADD CONSTRAINT "sr_pre_procurement_inbox_brand_masterId_fkey" FOREIGN KEY ("brand_masterId") REFERENCES "brand_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_inbox" ADD CONSTRAINT "sr_pre_procurement_inbox_processor_masterId_fkey" FOREIGN KEY ("processor_masterId") REFERENCES "processor_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_inbox" ADD CONSTRAINT "sr_pre_procurement_inbox_ram_masterId_fkey" FOREIGN KEY ("ram_masterId") REFERENCES "ram_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_inbox" ADD CONSTRAINT "sr_pre_procurement_inbox_os_masterId_fkey" FOREIGN KEY ("os_masterId") REFERENCES "os_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_inbox" ADD CONSTRAINT "sr_pre_procurement_inbox_rom_masterId_fkey" FOREIGN KEY ("rom_masterId") REFERENCES "rom_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_inbox" ADD CONSTRAINT "sr_pre_procurement_inbox_graphics_masterId_fkey" FOREIGN KEY ("graphics_masterId") REFERENCES "graphics_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_inbox" ADD CONSTRAINT "sr_pre_procurement_inbox_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "procurement_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_outbox" ADD CONSTRAINT "sr_pre_procurement_outbox_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_outbox" ADD CONSTRAINT "sr_pre_procurement_outbox_subcategory_masterId_fkey" FOREIGN KEY ("subcategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_outbox" ADD CONSTRAINT "sr_pre_procurement_outbox_brand_masterId_fkey" FOREIGN KEY ("brand_masterId") REFERENCES "brand_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_outbox" ADD CONSTRAINT "sr_pre_procurement_outbox_processor_masterId_fkey" FOREIGN KEY ("processor_masterId") REFERENCES "processor_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_outbox" ADD CONSTRAINT "sr_pre_procurement_outbox_ram_masterId_fkey" FOREIGN KEY ("ram_masterId") REFERENCES "ram_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_outbox" ADD CONSTRAINT "sr_pre_procurement_outbox_os_masterId_fkey" FOREIGN KEY ("os_masterId") REFERENCES "os_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_outbox" ADD CONSTRAINT "sr_pre_procurement_outbox_rom_masterId_fkey" FOREIGN KEY ("rom_masterId") REFERENCES "rom_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_outbox" ADD CONSTRAINT "sr_pre_procurement_outbox_graphics_masterId_fkey" FOREIGN KEY ("graphics_masterId") REFERENCES "graphics_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_outbox" ADD CONSTRAINT "sr_pre_procurement_outbox_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "procurement_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_inbox" ADD CONSTRAINT "da_pre_procurement_inbox_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_inbox" ADD CONSTRAINT "da_pre_procurement_inbox_subcategory_masterId_fkey" FOREIGN KEY ("subcategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_inbox" ADD CONSTRAINT "da_pre_procurement_inbox_brand_masterId_fkey" FOREIGN KEY ("brand_masterId") REFERENCES "brand_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_inbox" ADD CONSTRAINT "da_pre_procurement_inbox_processor_masterId_fkey" FOREIGN KEY ("processor_masterId") REFERENCES "processor_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_inbox" ADD CONSTRAINT "da_pre_procurement_inbox_ram_masterId_fkey" FOREIGN KEY ("ram_masterId") REFERENCES "ram_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_inbox" ADD CONSTRAINT "da_pre_procurement_inbox_os_masterId_fkey" FOREIGN KEY ("os_masterId") REFERENCES "os_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_inbox" ADD CONSTRAINT "da_pre_procurement_inbox_rom_masterId_fkey" FOREIGN KEY ("rom_masterId") REFERENCES "rom_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_inbox" ADD CONSTRAINT "da_pre_procurement_inbox_graphics_masterId_fkey" FOREIGN KEY ("graphics_masterId") REFERENCES "graphics_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_inbox" ADD CONSTRAINT "da_pre_procurement_inbox_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "procurement_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_outbox" ADD CONSTRAINT "da_pre_procurement_outbox_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_outbox" ADD CONSTRAINT "da_pre_procurement_outbox_subcategory_masterId_fkey" FOREIGN KEY ("subcategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_outbox" ADD CONSTRAINT "da_pre_procurement_outbox_brand_masterId_fkey" FOREIGN KEY ("brand_masterId") REFERENCES "brand_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_outbox" ADD CONSTRAINT "da_pre_procurement_outbox_processor_masterId_fkey" FOREIGN KEY ("processor_masterId") REFERENCES "processor_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_outbox" ADD CONSTRAINT "da_pre_procurement_outbox_ram_masterId_fkey" FOREIGN KEY ("ram_masterId") REFERENCES "ram_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_outbox" ADD CONSTRAINT "da_pre_procurement_outbox_os_masterId_fkey" FOREIGN KEY ("os_masterId") REFERENCES "os_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_outbox" ADD CONSTRAINT "da_pre_procurement_outbox_rom_masterId_fkey" FOREIGN KEY ("rom_masterId") REFERENCES "rom_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_outbox" ADD CONSTRAINT "da_pre_procurement_outbox_graphics_masterId_fkey" FOREIGN KEY ("graphics_masterId") REFERENCES "graphics_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_outbox" ADD CONSTRAINT "da_pre_procurement_outbox_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "procurement_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
