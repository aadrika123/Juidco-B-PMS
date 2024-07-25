-- CreateEnum
CREATE TYPE "service_enum" AS ENUM ('warranty', 'return', 'dead');

-- CreateTable
CREATE TABLE "service_request" (
    "id" TEXT NOT NULL,
    "stock_handover_no" TEXT NOT NULL,
    "service_no" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "service" "service_enum" NOT NULL,
    "inventoryId" TEXT,
    "serial_no" TEXT NOT NULL,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_req_product" (
    "id" TEXT NOT NULL,
    "service_no" TEXT NOT NULL,
    "serial_no" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_req_product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "service_request_service_no_key" ON "service_request"("service_no");

-- CreateIndex
CREATE UNIQUE INDEX "service_request_serial_no_key" ON "service_request"("serial_no");

-- CreateIndex
CREATE UNIQUE INDEX "service_req_product_serial_no_key" ON "service_req_product"("serial_no");

-- AddForeignKey
ALTER TABLE "service_request" ADD CONSTRAINT "service_request_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_request" ADD CONSTRAINT "service_request_stock_handover_no_fkey" FOREIGN KEY ("stock_handover_no") REFERENCES "stock_request"("stock_handover_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_req_product" ADD CONSTRAINT "service_req_product_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_req_product" ADD CONSTRAINT "service_req_product_service_no_fkey" FOREIGN KEY ("service_no") REFERENCES "service_request"("service_no") ON DELETE RESTRICT ON UPDATE CASCADE;
