/*
  Warnings:

  - You are about to drop the column `order_no` on the `dead_stock` table. All the data in the column will be lost.
  - You are about to drop the column `order_no` on the `dead_stock_image` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[procurement_no]` on the table `dead_stock` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[procurement_no]` on the table `dead_stock_image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `procurement_no` to the `dead_stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `procurement_no` to the `dead_stock_image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "dead_stock_image" DROP CONSTRAINT "dead_stock_image_order_no_fkey";

-- DropIndex
DROP INDEX "dead_stock_order_no_key";

-- DropIndex
DROP INDEX "dead_stock_image_order_no_key";

-- AlterTable
ALTER TABLE "dead_stock" DROP COLUMN "order_no",
ADD COLUMN     "procurement_no" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "dead_stock_image" DROP COLUMN "order_no",
ADD COLUMN     "procurement_no" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "dead_stock_procurement_no_key" ON "dead_stock"("procurement_no");

-- CreateIndex
CREATE UNIQUE INDEX "dead_stock_image_procurement_no_key" ON "dead_stock_image"("procurement_no");

-- AddForeignKey
ALTER TABLE "dead_stock_image" ADD CONSTRAINT "dead_stock_image_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "dead_stock"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;
