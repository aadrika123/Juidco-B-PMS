-- DropForeignKey
ALTER TABLE "da_pre_procurement_inbox" DROP CONSTRAINT "da_pre_procurement_inbox_category_masterId_fkey";

-- DropForeignKey
ALTER TABLE "da_pre_procurement_inbox" DROP CONSTRAINT "da_pre_procurement_inbox_subcategory_masterId_fkey";

-- DropForeignKey
ALTER TABLE "da_pre_procurement_outbox" DROP CONSTRAINT "da_pre_procurement_outbox_category_masterId_fkey";

-- DropForeignKey
ALTER TABLE "da_pre_procurement_outbox" DROP CONSTRAINT "da_pre_procurement_outbox_subcategory_masterId_fkey";

-- DropForeignKey
ALTER TABLE "pre_procurement_history" DROP CONSTRAINT "pre_procurement_history_category_masterId_fkey";

-- DropForeignKey
ALTER TABLE "pre_procurement_history" DROP CONSTRAINT "pre_procurement_history_subcategory_masterId_fkey";

-- DropForeignKey
ALTER TABLE "sr_pre_procurement_outbox" DROP CONSTRAINT "sr_pre_procurement_outbox_category_masterId_fkey";

-- DropForeignKey
ALTER TABLE "sr_pre_procurement_outbox" DROP CONSTRAINT "sr_pre_procurement_outbox_subcategory_masterId_fkey";

-- AlterTable
ALTER TABLE "da_pre_procurement_inbox" ALTER COLUMN "category_masterId" DROP NOT NULL,
ALTER COLUMN "subcategory_masterId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "da_pre_procurement_outbox" ALTER COLUMN "category_masterId" DROP NOT NULL,
ALTER COLUMN "subcategory_masterId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "pre_procurement_history" ALTER COLUMN "category_masterId" DROP NOT NULL,
ALTER COLUMN "subcategory_masterId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "sr_pre_procurement_outbox" ALTER COLUMN "category_masterId" DROP NOT NULL,
ALTER COLUMN "subcategory_masterId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "pre_procurement_history" ADD CONSTRAINT "pre_procurement_history_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pre_procurement_history" ADD CONSTRAINT "pre_procurement_history_subcategory_masterId_fkey" FOREIGN KEY ("subcategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_outbox" ADD CONSTRAINT "sr_pre_procurement_outbox_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_outbox" ADD CONSTRAINT "sr_pre_procurement_outbox_subcategory_masterId_fkey" FOREIGN KEY ("subcategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_inbox" ADD CONSTRAINT "da_pre_procurement_inbox_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_inbox" ADD CONSTRAINT "da_pre_procurement_inbox_subcategory_masterId_fkey" FOREIGN KEY ("subcategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_outbox" ADD CONSTRAINT "da_pre_procurement_outbox_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_procurement_outbox" ADD CONSTRAINT "da_pre_procurement_outbox_subcategory_masterId_fkey" FOREIGN KEY ("subcategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;
