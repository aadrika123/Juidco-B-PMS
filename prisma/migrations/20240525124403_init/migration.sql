/*
  Warnings:

  - Made the column `order_no` on table `receivings` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "receivings" DROP CONSTRAINT "receivings_order_no_fkey_inbox";

-- DropForeignKey
ALTER TABLE "receivings" DROP CONSTRAINT "receivings_order_no_fkey_outbox";

-- AlterTable
ALTER TABLE "receivings" ALTER COLUMN "order_no" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "receivings" ADD CONSTRAINT "receivings_order_no_fkey_inbox" FOREIGN KEY ("order_no") REFERENCES "da_received_inventory_inbox"("order_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receivings" ADD CONSTRAINT "receivings_order_no_fkey_outbox" FOREIGN KEY ("order_no") REFERENCES "da_received_inventory_outbox"("order_no") ON DELETE RESTRICT ON UPDATE CASCADE;
