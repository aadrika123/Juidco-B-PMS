/*
  Warnings:

  - Added the required column `stock_handover_no` to the `service_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "service_history" ADD COLUMN     "stock_handover_no" TEXT NOT NULL;
