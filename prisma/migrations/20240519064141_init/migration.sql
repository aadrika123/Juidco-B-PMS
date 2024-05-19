-- AlterTable
ALTER TABLE "da_pre_procurement_inbox" ADD COLUMN     "number_of_items" INTEGER;

-- AlterTable
ALTER TABLE "da_pre_procurement_outbox" ADD COLUMN     "number_of_items" INTEGER;

-- AlterTable
ALTER TABLE "pre_procurement_history" ADD COLUMN     "number_of_items" INTEGER;

-- AlterTable
ALTER TABLE "sr_pre_procurement_inbox" ADD COLUMN     "number_of_items" INTEGER;

-- AlterTable
ALTER TABLE "sr_pre_procurement_outbox" ADD COLUMN     "number_of_items" INTEGER;
