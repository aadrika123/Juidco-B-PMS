-- CreateTable
CREATE TABLE "stock_handover" (
    "id" TEXT NOT NULL,
    "stock_handover_no" TEXT NOT NULL,
    "emp_id" TEXT NOT NULL,
    "emp_name" TEXT,
    "ulb_id" INTEGER,
    "serial_no" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "return_date" TIMESTAMP(3),
    "is_alloted" BOOLEAN NOT NULL DEFAULT true,
    "inventoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_handover_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stock_handover_emp_id_serial_no_key" ON "stock_handover"("emp_id", "serial_no");

-- AddForeignKey
ALTER TABLE "stock_handover" ADD CONSTRAINT "stock_handover_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_handover" ADD CONSTRAINT "stock_handover_stock_handover_no_fkey" FOREIGN KEY ("stock_handover_no") REFERENCES "stock_request"("stock_handover_no") ON DELETE RESTRICT ON UPDATE CASCADE;
