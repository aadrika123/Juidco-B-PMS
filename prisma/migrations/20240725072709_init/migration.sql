/*
  Warnings:

  - You are about to drop the column `serial_no` on the `service_request` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "service_request_serial_no_key";

-- AlterTable
ALTER TABLE "service_request" DROP COLUMN "serial_no";
