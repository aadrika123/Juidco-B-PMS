/*
  Warnings:

  - You are about to drop the column `searial_no` on the `stock_request` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[serial_no]` on the table `stock_request` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "stock_request_searial_no_key";

-- AlterTable
ALTER TABLE "stock_request" DROP COLUMN "searial_no",
ADD COLUMN     "serial_no" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "stock_request_serial_no_key" ON "stock_request"("serial_no");
