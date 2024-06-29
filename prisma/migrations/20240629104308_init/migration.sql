-- AlterTable
ALTER TABLE "inventory" ADD COLUMN     "supplier_masterId" TEXT;

-- AlterTable
ALTER TABLE "procurement" ADD COLUMN     "supplier_masterId" TEXT;

-- AlterTable
ALTER TABLE "procurement_before_boq" ADD COLUMN     "supplier_masterId" TEXT;

-- AlterTable
ALTER TABLE "procurement_history" ADD COLUMN     "supplier_masterId" TEXT;

-- AlterTable
ALTER TABLE "stock_request" ADD COLUMN     "supplier_masterId" TEXT;

-- AlterTable
ALTER TABLE "stock_request_history" ADD COLUMN     "supplier_masterId" TEXT;

-- CreateTable
CREATE TABLE "supplier_master" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gst_no" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_master_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_supplier_masterId_fkey" FOREIGN KEY ("supplier_masterId") REFERENCES "supplier_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement" ADD CONSTRAINT "procurement_supplier_masterId_fkey" FOREIGN KEY ("supplier_masterId") REFERENCES "supplier_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_before_boq" ADD CONSTRAINT "procurement_before_boq_supplier_masterId_fkey" FOREIGN KEY ("supplier_masterId") REFERENCES "supplier_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_history" ADD CONSTRAINT "procurement_history_supplier_masterId_fkey" FOREIGN KEY ("supplier_masterId") REFERENCES "supplier_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_request" ADD CONSTRAINT "stock_request_supplier_masterId_fkey" FOREIGN KEY ("supplier_masterId") REFERENCES "supplier_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_request_history" ADD CONSTRAINT "stock_request_history_supplier_masterId_fkey" FOREIGN KEY ("supplier_masterId") REFERENCES "supplier_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;
