/*
  Warnings:

  - You are about to drop the column `unit` on the `procurement` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `procurement_before_boq` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "procurement" DROP COLUMN "unit";

-- AlterTable
ALTER TABLE "procurement_before_boq" DROP COLUMN "unit";
