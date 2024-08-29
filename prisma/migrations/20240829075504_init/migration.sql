-- CreateTable
CREATE TABLE "emp_service_request" (
    "id" TEXT NOT NULL,
    "emp_id" INTEGER NOT NULL,
    "stock_handover_no" TEXT NOT NULL,
    "service_no" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "service" "service_enum" NOT NULL,
    "inventoryId" TEXT,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emp_service_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emp_service_req_product" (
    "id" TEXT NOT NULL,
    "service_no" TEXT NOT NULL,
    "serial_no" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "status" INTEGER NOT NULL DEFAULT 0,
    "inventoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emp_service_req_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emp_service_history" (
    "id" TEXT NOT NULL,
    "stock_handover_no" TEXT NOT NULL,
    "service_no" TEXT NOT NULL,
    "serial_no" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "service" "service_enum" NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emp_service_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dist_emp_service_req_inbox" (
    "id" TEXT NOT NULL,
    "service_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dist_emp_service_req_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dist_emp_service_req_outbox" (
    "id" TEXT NOT NULL,
    "service_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dist_emp_service_req_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emp_service_req_inbox" (
    "id" TEXT NOT NULL,
    "service_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emp_service_req_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emp_service_req_outbox" (
    "id" TEXT NOT NULL,
    "service_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emp_service_req_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "emp_service_request_service_no_key" ON "emp_service_request"("service_no");

-- CreateIndex
CREATE UNIQUE INDEX "emp_service_req_product_serial_no_key" ON "emp_service_req_product"("serial_no");

-- CreateIndex
CREATE UNIQUE INDEX "emp_service_history_service_no_key" ON "emp_service_history"("service_no");

-- CreateIndex
CREATE UNIQUE INDEX "dist_emp_service_req_inbox_service_no_key" ON "dist_emp_service_req_inbox"("service_no");

-- CreateIndex
CREATE UNIQUE INDEX "dist_emp_service_req_outbox_service_no_key" ON "dist_emp_service_req_outbox"("service_no");

-- CreateIndex
CREATE UNIQUE INDEX "emp_service_req_inbox_service_no_key" ON "emp_service_req_inbox"("service_no");

-- CreateIndex
CREATE UNIQUE INDEX "emp_service_req_outbox_service_no_key" ON "emp_service_req_outbox"("service_no");

-- AddForeignKey
ALTER TABLE "emp_service_request" ADD CONSTRAINT "emp_service_request_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emp_service_req_product" ADD CONSTRAINT "emp_service_req_product_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emp_service_req_product" ADD CONSTRAINT "emp_service_req_product_service_no_fkey" FOREIGN KEY ("service_no") REFERENCES "emp_service_request"("service_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emp_service_history" ADD CONSTRAINT "emp_service_history_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emp_service_history" ADD CONSTRAINT "emp_service_history_service_no_fkey" FOREIGN KEY ("service_no") REFERENCES "emp_service_request"("service_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dist_emp_service_req_inbox" ADD CONSTRAINT "dist_emp_service_req_inbox_service_no_fkey" FOREIGN KEY ("service_no") REFERENCES "emp_service_request"("service_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dist_emp_service_req_outbox" ADD CONSTRAINT "dist_emp_service_req_outbox_service_no_fkey" FOREIGN KEY ("service_no") REFERENCES "emp_service_request"("service_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emp_service_req_inbox" ADD CONSTRAINT "emp_service_req_inbox_service_no_fkey" FOREIGN KEY ("service_no") REFERENCES "emp_service_request"("service_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emp_service_req_outbox" ADD CONSTRAINT "emp_service_req_outbox_service_no_fkey" FOREIGN KEY ("service_no") REFERENCES "emp_service_request"("service_no") ON DELETE RESTRICT ON UPDATE CASCADE;
