/*
  Warnings:

  - You are about to drop the column `rate_contract_procurement_no` on the `procurement` table. All the data in the column will be lost.
  - You are about to drop the column `rate_contract_procurement_no` on the `rate_contract` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "procurement" DROP COLUMN "rate_contract_procurement_no",
ADD COLUMN     "rate_contract_supplier" TEXT;

-- AlterTable
ALTER TABLE "rate_contract" DROP COLUMN "rate_contract_procurement_no";
