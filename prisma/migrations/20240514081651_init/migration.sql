-- AlterTable
ALTER TABLE "da_pre_procurement_inbox" ADD COLUMN     "isEdited" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "da_pre_procurement_outbox" ADD COLUMN     "isEdited" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "sr_pre_procurement_inbox" ADD COLUMN     "isEdited" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "sr_pre_procurement_outbox" ADD COLUMN     "isEdited" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "sr_pre_procurement_inbox_history" (
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
    "remark" TEXT,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sr_pre_procurement_inbox_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sr_pre_procurement_inbox_history_statusId_key" ON "sr_pre_procurement_inbox_history"("statusId");

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_inbox_history" ADD CONSTRAINT "sr_pre_procurement_inbox_history_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_inbox_history" ADD CONSTRAINT "sr_pre_procurement_inbox_history_subcategory_masterId_fkey" FOREIGN KEY ("subcategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_inbox_history" ADD CONSTRAINT "sr_pre_procurement_inbox_history_brand_masterId_fkey" FOREIGN KEY ("brand_masterId") REFERENCES "brand_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_inbox_history" ADD CONSTRAINT "sr_pre_procurement_inbox_history_processor_masterId_fkey" FOREIGN KEY ("processor_masterId") REFERENCES "processor_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_inbox_history" ADD CONSTRAINT "sr_pre_procurement_inbox_history_ram_masterId_fkey" FOREIGN KEY ("ram_masterId") REFERENCES "ram_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_inbox_history" ADD CONSTRAINT "sr_pre_procurement_inbox_history_os_masterId_fkey" FOREIGN KEY ("os_masterId") REFERENCES "os_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_inbox_history" ADD CONSTRAINT "sr_pre_procurement_inbox_history_rom_masterId_fkey" FOREIGN KEY ("rom_masterId") REFERENCES "rom_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_inbox_history" ADD CONSTRAINT "sr_pre_procurement_inbox_history_graphics_masterId_fkey" FOREIGN KEY ("graphics_masterId") REFERENCES "graphics_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_inbox_history" ADD CONSTRAINT "sr_pre_procurement_inbox_history_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "procurement_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
