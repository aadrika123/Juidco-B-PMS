-- AlterTable
ALTER TABLE "procurement_history" ALTER COLUMN "isEdited" SET DEFAULT true;

-- CreateTable
CREATE TABLE "stock_request" (
    "id" TEXT NOT NULL,
    "stock_handover_no" TEXT NOT NULL,
    "emp_id" TEXT NOT NULL,
    "category_masterId" TEXT,
    "subcategory_masterId" TEXT,
    "brand_masterId" TEXT NOT NULL,
    "allotted_quantity" DOUBLE PRECISION NOT NULL,
    "status" INTEGER NOT NULL,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_request_history" (
    "id" TEXT NOT NULL,
    "stock_handover_no" TEXT NOT NULL,
    "emp_id" TEXT NOT NULL,
    "category_masterId" TEXT,
    "subcategory_masterId" TEXT,
    "brand_masterId" TEXT NOT NULL,
    "allotted_quantity" DOUBLE PRECISION NOT NULL,
    "status" INTEGER NOT NULL,
    "isEdited" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_request_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dist_stock_req_inbox" (
    "id" TEXT NOT NULL,
    "stock_handover_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dist_stock_req_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dist_stock_req_outbox" (
    "id" TEXT NOT NULL,
    "stock_handover_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dist_stock_req_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sr_stock_req_inbox" (
    "id" TEXT NOT NULL,
    "stock_handover_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sr_stock_req_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sr_stock_req_outbox" (
    "id" TEXT NOT NULL,
    "stock_handover_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sr_stock_req_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stock_request_stock_handover_no_key" ON "stock_request"("stock_handover_no");

-- CreateIndex
CREATE UNIQUE INDEX "stock_request_history_stock_handover_no_key" ON "stock_request_history"("stock_handover_no");

-- CreateIndex
CREATE UNIQUE INDEX "dist_stock_req_inbox_stock_handover_no_key" ON "dist_stock_req_inbox"("stock_handover_no");

-- CreateIndex
CREATE UNIQUE INDEX "dist_stock_req_outbox_stock_handover_no_key" ON "dist_stock_req_outbox"("stock_handover_no");

-- CreateIndex
CREATE UNIQUE INDEX "sr_stock_req_inbox_stock_handover_no_key" ON "sr_stock_req_inbox"("stock_handover_no");

-- CreateIndex
CREATE UNIQUE INDEX "sr_stock_req_outbox_stock_handover_no_key" ON "sr_stock_req_outbox"("stock_handover_no");

-- AddForeignKey
ALTER TABLE "stock_request" ADD CONSTRAINT "stock_request_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_request" ADD CONSTRAINT "stock_request_subcategory_masterId_fkey" FOREIGN KEY ("subcategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_request" ADD CONSTRAINT "stock_request_brand_masterId_fkey" FOREIGN KEY ("brand_masterId") REFERENCES "brand_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_request_history" ADD CONSTRAINT "stock_request_history_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_request_history" ADD CONSTRAINT "stock_request_history_subcategory_masterId_fkey" FOREIGN KEY ("subcategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_request_history" ADD CONSTRAINT "stock_request_history_brand_masterId_fkey" FOREIGN KEY ("brand_masterId") REFERENCES "brand_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dist_stock_req_inbox" ADD CONSTRAINT "dist_stock_req_inbox_stock_handover_no_fkey" FOREIGN KEY ("stock_handover_no") REFERENCES "stock_request"("stock_handover_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dist_stock_req_outbox" ADD CONSTRAINT "dist_stock_req_outbox_stock_handover_no_fkey" FOREIGN KEY ("stock_handover_no") REFERENCES "stock_request"("stock_handover_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_stock_req_inbox" ADD CONSTRAINT "sr_stock_req_inbox_stock_handover_no_fkey" FOREIGN KEY ("stock_handover_no") REFERENCES "stock_request"("stock_handover_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_stock_req_outbox" ADD CONSTRAINT "sr_stock_req_outbox_stock_handover_no_fkey" FOREIGN KEY ("stock_handover_no") REFERENCES "stock_request"("stock_handover_no") ON DELETE RESTRICT ON UPDATE CASCADE;
