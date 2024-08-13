-- AlterTable
ALTER TABLE "supplier_master" ADD COLUMN     "reference_no" TEXT;

-- AddForeignKey
ALTER TABLE "supplier_master" ADD CONSTRAINT "supplier_master_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "bid_details"("reference_no") ON DELETE SET NULL ON UPDATE CASCADE;
