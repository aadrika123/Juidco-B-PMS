/*
  Warnings:

  - You are about to drop the `sr_service_req_inbox` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sr_service_req_outbox` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "sr_service_req_inbox" DROP CONSTRAINT "sr_service_req_inbox_serial_no_fkey";

-- DropForeignKey
ALTER TABLE "sr_service_req_outbox" DROP CONSTRAINT "sr_service_req_outbox_serial_no_fkey";

-- DropTable
DROP TABLE "sr_service_req_inbox";

-- DropTable
DROP TABLE "sr_service_req_outbox";

-- CreateTable
CREATE TABLE "dist_service_req_inbox" (
    "id" TEXT NOT NULL,
    "stock_handover_no" TEXT NOT NULL,
    "serial_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stock_req_productId" TEXT NOT NULL,

    CONSTRAINT "dist_service_req_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dist_service_req_outbox" (
    "id" TEXT NOT NULL,
    "stock_handover_no" TEXT NOT NULL,
    "serial_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stock_req_productId" TEXT NOT NULL,

    CONSTRAINT "dist_service_req_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ia_service_req_inbox" (
    "id" TEXT NOT NULL,
    "stock_handover_no" TEXT NOT NULL,
    "serial_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stock_req_productId" TEXT NOT NULL,

    CONSTRAINT "ia_service_req_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ia_service_req_outbox" (
    "id" TEXT NOT NULL,
    "stock_handover_no" TEXT NOT NULL,
    "serial_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stock_req_productId" TEXT NOT NULL,

    CONSTRAINT "ia_service_req_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dist_service_req_inbox_serial_no_key" ON "dist_service_req_inbox"("serial_no");

-- CreateIndex
CREATE UNIQUE INDEX "dist_service_req_outbox_serial_no_key" ON "dist_service_req_outbox"("serial_no");

-- CreateIndex
CREATE UNIQUE INDEX "ia_service_req_inbox_serial_no_key" ON "ia_service_req_inbox"("serial_no");

-- CreateIndex
CREATE UNIQUE INDEX "ia_service_req_outbox_serial_no_key" ON "ia_service_req_outbox"("serial_no");

-- AddForeignKey
ALTER TABLE "dist_service_req_inbox" ADD CONSTRAINT "dist_service_req_inbox_serial_no_fkey" FOREIGN KEY ("serial_no") REFERENCES "stock_req_product"("serial_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dist_service_req_outbox" ADD CONSTRAINT "dist_service_req_outbox_serial_no_fkey" FOREIGN KEY ("serial_no") REFERENCES "stock_req_product"("serial_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ia_service_req_inbox" ADD CONSTRAINT "ia_service_req_inbox_serial_no_fkey" FOREIGN KEY ("serial_no") REFERENCES "stock_req_product"("serial_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ia_service_req_outbox" ADD CONSTRAINT "ia_service_req_outbox_serial_no_fkey" FOREIGN KEY ("serial_no") REFERENCES "stock_req_product"("serial_no") ON DELETE RESTRICT ON UPDATE CASCADE;
