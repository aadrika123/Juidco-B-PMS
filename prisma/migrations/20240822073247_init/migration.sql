-- AlterTable
ALTER TABLE "receivings" ADD COLUMN     "procurement_stock_id" TEXT;

-- AddForeignKey
ALTER TABLE "receivings" ADD CONSTRAINT "receivings_procurement_stock_id_fkey" FOREIGN KEY ("procurement_stock_id") REFERENCES "procurement_stocks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
