-- AlterTable
ALTER TABLE "dead_stock" ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "inventory" ALTER COLUMN "quantity" SET DEFAULT 0,
ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "inventory_dead_stock" ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "warranty" (
    "id" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "serial_no" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warranty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "warranty_serial_no_key" ON "warranty"("serial_no");
