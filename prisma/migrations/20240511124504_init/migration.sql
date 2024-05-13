-- DropForeignKey
ALTER TABLE "item_master" DROP CONSTRAINT "item_master_brand_masterId_fkey";

-- AlterTable
ALTER TABLE "item_master" ALTER COLUMN "brand_masterId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "item_master" ADD CONSTRAINT "item_master_brand_masterId_fkey" FOREIGN KEY ("brand_masterId") REFERENCES "brand_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;
