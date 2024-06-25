-- AlterTable
ALTER TABLE "stock_request" ADD COLUMN     "inventoryId" TEXT;

-- AddForeignKey
ALTER TABLE "stock_request" ADD CONSTRAINT "stock_request_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
