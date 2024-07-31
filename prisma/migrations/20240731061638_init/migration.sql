-- AlterTable
ALTER TABLE "procurement_stocks" ADD COLUMN     "gst" DOUBLE PRECISION,
ADD COLUMN     "remark" TEXT;

-- CreateTable
CREATE TABLE "procurement_stocks_history" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "category_masterId" TEXT,
    "subCategory_masterId" TEXT,
    "brand_masterId" TEXT,
    "unit_masterId" TEXT,
    "gst" DOUBLE PRECISION,
    "remark" TEXT,
    "rate" DOUBLE PRECISION,
    "quantity" DOUBLE PRECISION,
    "description" TEXT,
    "total_rate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "procurement_stocksId" TEXT NOT NULL,

    CONSTRAINT "procurement_stocks_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "procurement_stocks_history" ADD CONSTRAINT "procurement_stocks_history_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_stocks_history" ADD CONSTRAINT "procurement_stocks_history_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_stocks_history" ADD CONSTRAINT "procurement_stocks_history_subCategory_masterId_fkey" FOREIGN KEY ("subCategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_stocks_history" ADD CONSTRAINT "procurement_stocks_history_brand_masterId_fkey" FOREIGN KEY ("brand_masterId") REFERENCES "brand_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_stocks_history" ADD CONSTRAINT "procurement_stocks_history_unit_masterId_fkey" FOREIGN KEY ("unit_masterId") REFERENCES "unit_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_stocks_history" ADD CONSTRAINT "procurement_stocks_history_procurement_stocksId_fkey" FOREIGN KEY ("procurement_stocksId") REFERENCES "procurement_stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
