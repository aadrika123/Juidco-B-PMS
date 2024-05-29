-- DropForeignKey
ALTER TABLE "inventory" DROP CONSTRAINT "inventory_brand_masterId_fkey";

-- AlterTable
ALTER TABLE "inventory" ALTER COLUMN "brand_masterId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_brand_masterId_fkey" FOREIGN KEY ("brand_masterId") REFERENCES "brand_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;
