-- DropIndex
DROP INDEX "receivings_order_no_idx";

-- AlterTable
ALTER TABLE "da_received_inventory_outbox" ALTER COLUMN "order_no" DROP NOT NULL;
