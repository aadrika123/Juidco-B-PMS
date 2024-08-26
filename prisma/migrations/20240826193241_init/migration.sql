-- AlterTable
ALTER TABLE "procurement" ADD COLUMN     "rate_contract_procurement_no" TEXT;

-- AlterTable
ALTER TABLE "rate_contract" ADD COLUMN     "rate_contract_procurement_no" TEXT;
