/*
  Warnings:

  - A unique constraint covering the columns `[searial_no]` on the table `stock_request` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "stock_request" ADD COLUMN     "searial_no" TEXT;

-- CreateTable
CREATE TABLE "inventory_dead_stock" (
    "id" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "serial_no" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_dead_stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_dead_stock_image" (
    "id" TEXT NOT NULL,
    "doc_path" TEXT NOT NULL,
    "inventory_dead_stockId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_dead_stock_image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stock_request_searial_no_key" ON "stock_request"("searial_no");

-- AddForeignKey
ALTER TABLE "inventory_dead_stock" ADD CONSTRAINT "inventory_dead_stock_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_dead_stock_image" ADD CONSTRAINT "inventory_dead_stock_image_inventory_dead_stockId_fkey" FOREIGN KEY ("inventory_dead_stockId") REFERENCES "inventory_dead_stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
