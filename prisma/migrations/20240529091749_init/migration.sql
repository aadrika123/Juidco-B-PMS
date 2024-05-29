/*
  Warnings:

  - You are about to drop the column `name` on the `inventory` table. All the data in the column will be lost.
  - Added the required column `brand_masterId` to the `inventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inventory" DROP COLUMN "name",
ADD COLUMN     "brand_masterId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_brand_masterId_fkey" FOREIGN KEY ("brand_masterId") REFERENCES "brand_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
