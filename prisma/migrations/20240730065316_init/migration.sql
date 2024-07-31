-- CreateTable
CREATE TABLE "service_history" (
    "id" TEXT NOT NULL,
    "service_no" TEXT NOT NULL,
    "serial_no" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "service" "service_enum" NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "service_history_service_no_key" ON "service_history"("service_no");

-- AddForeignKey
ALTER TABLE "service_history" ADD CONSTRAINT "service_history_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_history" ADD CONSTRAINT "service_history_service_no_fkey" FOREIGN KEY ("service_no") REFERENCES "service_request"("service_no") ON DELETE RESTRICT ON UPDATE CASCADE;
