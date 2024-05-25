-- DropForeignKey
ALTER TABLE "receivings" DROP CONSTRAINT "receivings_order_no_fkey_inbox";

-- DropForeignKey
ALTER TABLE "receivings" DROP CONSTRAINT "receivings_order_no_fkey_outbox";
