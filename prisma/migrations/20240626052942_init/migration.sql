/*
  Warnings:

  - Made the column `subcategory_masterId` on table `brand_master` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "brand_master" DROP CONSTRAINT "brand_master_subcategory_masterId_fkey";

-- AlterTable
ALTER TABLE "brand_master" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "subcategory_masterId" SET NOT NULL;

-- AlterTable
ALTER TABLE "category_master" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "subcategory_master" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "brand_master" ADD CONSTRAINT "brand_master_subcategory_masterId_fkey" FOREIGN KEY ("subcategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
