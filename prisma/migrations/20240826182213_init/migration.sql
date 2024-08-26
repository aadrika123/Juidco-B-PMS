/*
  Warnings:

  - You are about to drop the column `supplier_masterId` on the `rate_contract` table. All the data in the column will be lost.
  - You are about to drop the column `unit_price` on the `rate_contract` table. All the data in the column will be lost.
  - You are about to drop the column `rate` on the `rate_contract_supplier` table. All the data in the column will be lost.
  - Added the required column `unit_price` to the `rate_contract_supplier` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "rate_contract" DROP CONSTRAINT "rate_contract_supplier_masterId_fkey";

-- AlterTable
ALTER TABLE "rate_contract" DROP COLUMN "supplier_masterId",
DROP COLUMN "unit_price";

-- AlterTable
ALTER TABLE "rate_contract_supplier" DROP COLUMN "rate",
ADD COLUMN     "unit_price" DOUBLE PRECISION NOT NULL;
