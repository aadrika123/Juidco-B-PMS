/*
  Warnings:

  - You are about to drop the column `da_received_inventory_outboxId` on the `receivings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "receivings" DROP CONSTRAINT "receivings_da_received_inventory_outboxId_fkey";

-- AlterTable
ALTER TABLE "receivings" DROP COLUMN "da_received_inventory_outboxId";

-- RenameForeignKey
ALTER TABLE "receivings" RENAME CONSTRAINT "receivings_order_no_fkey" TO "receivings_order_no_fkey_inbox";

-- AddForeignKey
ALTER TABLE "receivings" ADD CONSTRAINT "receivings_order_no_fkey_outbox" FOREIGN KEY ("order_no") REFERENCES "da_received_inventory_outbox"("order_no") ON DELETE RESTRICT ON UPDATE CASCADE;
