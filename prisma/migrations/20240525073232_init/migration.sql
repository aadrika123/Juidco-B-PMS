-- AlterTable
ALTER TABLE "da_received_inventory_inbox" ADD COLUMN     "is_partial" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "da_received_inventory_outbox" ADD COLUMN     "is_partial" BOOLEAN NOT NULL DEFAULT true;
