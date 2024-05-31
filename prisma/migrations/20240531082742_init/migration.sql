-- DropIndex
DROP INDEX "brand_master_name_key";

-- CreateTable
CREATE TABLE "stock_addition_history" (
    "id" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_addition_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stock_addition_history_procurement_no_key" ON "stock_addition_history"("procurement_no");

-- AddForeignKey
ALTER TABLE "stock_addition_history" ADD CONSTRAINT "stock_addition_history_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
