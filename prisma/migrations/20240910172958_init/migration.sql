-- AlterTable
ALTER TABLE "bidder_master" ADD COLUMN     "bg_bank" TEXT,
ADD COLUMN     "bg_date" TIMESTAMP(3),
ADD COLUMN     "bg_no" TEXT,
ADD COLUMN     "bg_transaction_no" TEXT,
ADD COLUMN     "dd_bank" TEXT,
ADD COLUMN     "dd_date" TIMESTAMP(3),
ADD COLUMN     "dd_transaction_no" TEXT;
