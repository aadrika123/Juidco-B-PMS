-- CreateTable
CREATE TABLE "dead_stock" (
    "id" TEXT NOT NULL,
    "order_no" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dead_stock_pkey" PRIMARY KEY ("id")
);
