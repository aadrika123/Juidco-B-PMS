/*
  Warnings:

  - Added the required column `ulb_id` to the `stock_request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stock_request" ADD COLUMN     "ulb_id" INTEGER NOT NULL;
