/*
  Warnings:

  - You are about to drop the column `serial_no` on the `stock_request` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "stock_request_serial_no_key";

-- AlterTable
ALTER TABLE "stock_request" DROP COLUMN "serial_no";
