/*
  Warnings:

  - Added the required column `procurement_stock_id` to the `stock_addition_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stock_addition_history" ADD COLUMN     "procurement_stock_id" TEXT NOT NULL;
