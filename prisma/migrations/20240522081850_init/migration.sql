-- AlterTable
ALTER TABLE "da_post_procurement_inbox" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "da_post_procurement_outbox" ALTER COLUMN "updatedAt" DROP DEFAULT;
