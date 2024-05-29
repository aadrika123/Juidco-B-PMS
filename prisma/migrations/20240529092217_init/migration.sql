-- AlterTable
ALTER TABLE "brand_master" ADD COLUMN     "subcategory_masterId" TEXT;

-- AddForeignKey
ALTER TABLE "brand_master" ADD CONSTRAINT "brand_master_subcategory_masterId_fkey" FOREIGN KEY ("subcategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;
