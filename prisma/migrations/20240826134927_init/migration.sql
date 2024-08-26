-- CreateTable
CREATE TABLE "rate_contract_supplier" (
    "id" TEXT NOT NULL,
    "rate_contract_id" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "supplier_masterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rate_contract_supplier_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rate_contract_supplier" ADD CONSTRAINT "rate_contract_supplier_rate_contract_id_fkey" FOREIGN KEY ("rate_contract_id") REFERENCES "rate_contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate_contract_supplier" ADD CONSTRAINT "rate_contract_supplier_supplier_masterId_fkey" FOREIGN KEY ("supplier_masterId") REFERENCES "supplier_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;
