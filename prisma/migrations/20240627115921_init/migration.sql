-- AlterTable
ALTER TABLE "inventory" ADD COLUMN     "unit_masterId" TEXT;

-- AlterTable
ALTER TABLE "procurement" ADD COLUMN     "unit_masterId" TEXT;

-- AlterTable
ALTER TABLE "procurement_before_boq" ADD COLUMN     "unit_masterId" TEXT;

-- AlterTable
ALTER TABLE "procurement_history" ADD COLUMN     "unit_masterId" TEXT;

-- AlterTable
ALTER TABLE "stock_request" ADD COLUMN     "unit_masterId" TEXT;

-- AlterTable
ALTER TABLE "stock_request_history" ADD COLUMN     "unit_masterId" TEXT;

-- CreateTable
CREATE TABLE "unit_master" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unit_master_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_unit_masterId_fkey" FOREIGN KEY ("unit_masterId") REFERENCES "unit_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement" ADD CONSTRAINT "procurement_unit_masterId_fkey" FOREIGN KEY ("unit_masterId") REFERENCES "unit_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_before_boq" ADD CONSTRAINT "procurement_before_boq_unit_masterId_fkey" FOREIGN KEY ("unit_masterId") REFERENCES "unit_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_history" ADD CONSTRAINT "procurement_history_unit_masterId_fkey" FOREIGN KEY ("unit_masterId") REFERENCES "unit_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_request" ADD CONSTRAINT "stock_request_unit_masterId_fkey" FOREIGN KEY ("unit_masterId") REFERENCES "unit_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_request_history" ADD CONSTRAINT "stock_request_history_unit_masterId_fkey" FOREIGN KEY ("unit_masterId") REFERENCES "unit_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;
