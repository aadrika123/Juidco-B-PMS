/*
  Warnings:

  - Added the required column `rate_contract_supplierId` to the `procurement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "procurement" ADD COLUMN     "rate_contract_supplierId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "procurement" ADD CONSTRAINT "procurement_rate_contract_supplier_fkey" FOREIGN KEY ("rate_contract_supplier") REFERENCES "rate_contract_supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
