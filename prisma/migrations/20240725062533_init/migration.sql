/*
  Warnings:

  - You are about to drop the column `serial_no` on the `dist_service_req_inbox` table. All the data in the column will be lost.
  - You are about to drop the column `stock_handover_no` on the `dist_service_req_inbox` table. All the data in the column will be lost.
  - You are about to drop the column `stock_req_productId` on the `dist_service_req_inbox` table. All the data in the column will be lost.
  - You are about to drop the column `serial_no` on the `dist_service_req_outbox` table. All the data in the column will be lost.
  - You are about to drop the column `stock_handover_no` on the `dist_service_req_outbox` table. All the data in the column will be lost.
  - You are about to drop the column `stock_req_productId` on the `dist_service_req_outbox` table. All the data in the column will be lost.
  - You are about to drop the column `serial_no` on the `ia_service_req_inbox` table. All the data in the column will be lost.
  - You are about to drop the column `stock_handover_no` on the `ia_service_req_inbox` table. All the data in the column will be lost.
  - You are about to drop the column `stock_req_productId` on the `ia_service_req_inbox` table. All the data in the column will be lost.
  - You are about to drop the column `serial_no` on the `ia_service_req_outbox` table. All the data in the column will be lost.
  - You are about to drop the column `stock_handover_no` on the `ia_service_req_outbox` table. All the data in the column will be lost.
  - You are about to drop the column `stock_req_productId` on the `ia_service_req_outbox` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[service_no]` on the table `dist_service_req_inbox` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[service_no]` on the table `dist_service_req_outbox` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[service_no]` on the table `ia_service_req_inbox` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[service_no]` on the table `ia_service_req_outbox` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `service_no` to the `dist_service_req_inbox` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_no` to the `dist_service_req_outbox` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_no` to the `ia_service_req_inbox` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_no` to the `ia_service_req_outbox` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "dist_service_req_inbox" DROP CONSTRAINT "dist_service_req_inbox_serial_no_fkey";

-- DropForeignKey
ALTER TABLE "dist_service_req_outbox" DROP CONSTRAINT "dist_service_req_outbox_serial_no_fkey";

-- DropForeignKey
ALTER TABLE "ia_service_req_inbox" DROP CONSTRAINT "ia_service_req_inbox_serial_no_fkey";

-- DropForeignKey
ALTER TABLE "ia_service_req_outbox" DROP CONSTRAINT "ia_service_req_outbox_serial_no_fkey";

-- DropIndex
DROP INDEX "dist_service_req_inbox_serial_no_key";

-- DropIndex
DROP INDEX "dist_service_req_outbox_serial_no_key";

-- DropIndex
DROP INDEX "ia_service_req_inbox_serial_no_key";

-- DropIndex
DROP INDEX "ia_service_req_outbox_serial_no_key";

-- AlterTable
ALTER TABLE "dist_service_req_inbox" DROP COLUMN "serial_no",
DROP COLUMN "stock_handover_no",
DROP COLUMN "stock_req_productId",
ADD COLUMN     "service_no" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "dist_service_req_outbox" DROP COLUMN "serial_no",
DROP COLUMN "stock_handover_no",
DROP COLUMN "stock_req_productId",
ADD COLUMN     "service_no" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ia_service_req_inbox" DROP COLUMN "serial_no",
DROP COLUMN "stock_handover_no",
DROP COLUMN "stock_req_productId",
ADD COLUMN     "service_no" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ia_service_req_outbox" DROP COLUMN "serial_no",
DROP COLUMN "stock_handover_no",
DROP COLUMN "stock_req_productId",
ADD COLUMN     "service_no" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "dist_service_req_inbox_service_no_key" ON "dist_service_req_inbox"("service_no");

-- CreateIndex
CREATE UNIQUE INDEX "dist_service_req_outbox_service_no_key" ON "dist_service_req_outbox"("service_no");

-- CreateIndex
CREATE UNIQUE INDEX "ia_service_req_inbox_service_no_key" ON "ia_service_req_inbox"("service_no");

-- CreateIndex
CREATE UNIQUE INDEX "ia_service_req_outbox_service_no_key" ON "ia_service_req_outbox"("service_no");

-- AddForeignKey
ALTER TABLE "dist_service_req_inbox" ADD CONSTRAINT "dist_service_req_inbox_service_no_fkey" FOREIGN KEY ("service_no") REFERENCES "service_request"("service_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dist_service_req_outbox" ADD CONSTRAINT "dist_service_req_outbox_service_no_fkey" FOREIGN KEY ("service_no") REFERENCES "service_request"("service_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ia_service_req_inbox" ADD CONSTRAINT "ia_service_req_inbox_service_no_fkey" FOREIGN KEY ("service_no") REFERENCES "service_request"("service_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ia_service_req_outbox" ADD CONSTRAINT "ia_service_req_outbox_service_no_fkey" FOREIGN KEY ("service_no") REFERENCES "service_request"("service_no") ON DELETE RESTRICT ON UPDATE CASCADE;
