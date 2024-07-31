-- CreateTable
CREATE TABLE "da_stock_req_inbox" (
    "id" TEXT NOT NULL,
    "stock_handover_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "da_stock_req_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "da_stock_req_outbox" (
    "id" TEXT NOT NULL,
    "stock_handover_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "da_stock_req_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "da_stock_req_inbox_stock_handover_no_key" ON "da_stock_req_inbox"("stock_handover_no");

-- CreateIndex
CREATE UNIQUE INDEX "da_stock_req_outbox_stock_handover_no_key" ON "da_stock_req_outbox"("stock_handover_no");

-- AddForeignKey
ALTER TABLE "da_stock_req_inbox" ADD CONSTRAINT "da_stock_req_inbox_stock_handover_no_fkey" FOREIGN KEY ("stock_handover_no") REFERENCES "stock_request"("stock_handover_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_stock_req_outbox" ADD CONSTRAINT "da_stock_req_outbox_stock_handover_no_fkey" FOREIGN KEY ("stock_handover_no") REFERENCES "stock_request"("stock_handover_no") ON DELETE RESTRICT ON UPDATE CASCADE;
