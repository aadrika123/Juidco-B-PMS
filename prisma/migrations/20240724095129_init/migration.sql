-- CreateTable
CREATE TABLE "sr_service_req_inbox" (
    "id" TEXT NOT NULL,
    "stock_handover_no" TEXT NOT NULL,
    "serial_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stock_req_productId" TEXT NOT NULL,

    CONSTRAINT "sr_service_req_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sr_service_req_outbox" (
    "id" TEXT NOT NULL,
    "stock_handover_no" TEXT NOT NULL,
    "serial_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stock_req_productId" TEXT NOT NULL,

    CONSTRAINT "sr_service_req_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sr_service_req_inbox_serial_no_key" ON "sr_service_req_inbox"("serial_no");

-- CreateIndex
CREATE UNIQUE INDEX "sr_service_req_outbox_serial_no_key" ON "sr_service_req_outbox"("serial_no");

-- AddForeignKey
ALTER TABLE "sr_service_req_inbox" ADD CONSTRAINT "sr_service_req_inbox_serial_no_fkey" FOREIGN KEY ("serial_no") REFERENCES "stock_req_product"("serial_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_service_req_outbox" ADD CONSTRAINT "sr_service_req_outbox_serial_no_fkey" FOREIGN KEY ("serial_no") REFERENCES "stock_req_product"("serial_no") ON DELETE RESTRICT ON UPDATE CASCADE;
