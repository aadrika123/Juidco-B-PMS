-- AlterTable
ALTER TABLE "procurement" ADD COLUMN     "is_rate_contract" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "rate_contract" (
    "id" TEXT NOT NULL,
    "category_masterId" TEXT,
    "subcategory_masterId" TEXT,
    "description" TEXT,
    "rate" DOUBLE PRECISION,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "unit_masterId" TEXT,
    "supplier_masterId" TEXT,

    CONSTRAINT "rate_contract_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rate_contract" ADD CONSTRAINT "rate_contract_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate_contract" ADD CONSTRAINT "rate_contract_subcategory_masterId_fkey" FOREIGN KEY ("subcategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate_contract" ADD CONSTRAINT "rate_contract_unit_masterId_fkey" FOREIGN KEY ("unit_masterId") REFERENCES "unit_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate_contract" ADD CONSTRAINT "rate_contract_supplier_masterId_fkey" FOREIGN KEY ("supplier_masterId") REFERENCES "supplier_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;
