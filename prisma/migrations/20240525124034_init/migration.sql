-- DropForeignKey
ALTER TABLE "receivings" DROP CONSTRAINT "receivings_order_no_fkey_inbox";

-- DropForeignKey
ALTER TABLE "receivings" DROP CONSTRAINT "receivings_order_no_fkey_outbox";

-- AlterTable
ALTER TABLE "receivings" ALTER COLUMN "order_no" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "receivings_order_no_idx" ON "receivings"("order_no");

-- AddForeignKey
ALTER TABLE "receivings" ADD CONSTRAINT "receivings_order_no_fkey_inbox" FOREIGN KEY ("order_no") REFERENCES "da_received_inventory_inbox"("order_no") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receivings" ADD CONSTRAINT "receivings_order_no_fkey_outbox" FOREIGN KEY ("order_no") REFERENCES "da_received_inventory_outbox"("order_no") ON DELETE SET NULL ON UPDATE CASCADE;
