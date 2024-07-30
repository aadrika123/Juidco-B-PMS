-- AlterTable
ALTER TABLE "procurement" ADD COLUMN     "brand_masterId" TEXT,
ADD COLUMN     "category_masterId" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "rate" TEXT,
ADD COLUMN     "subCategory_masterId" TEXT,
ADD COLUMN     "unit_masterId" TEXT;

-- AddForeignKey
ALTER TABLE "procurement" ADD CONSTRAINT "procurement_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement" ADD CONSTRAINT "procurement_subCategory_masterId_fkey" FOREIGN KEY ("subCategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement" ADD CONSTRAINT "procurement_brand_masterId_fkey" FOREIGN KEY ("brand_masterId") REFERENCES "brand_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement" ADD CONSTRAINT "procurement_unit_masterId_fkey" FOREIGN KEY ("unit_masterId") REFERENCES "unit_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;
