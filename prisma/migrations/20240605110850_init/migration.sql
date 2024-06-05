-- CreateTable
CREATE TABLE "acc_pre_procurement_inbox" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "acc_pre_procurement_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acc_pre_procurement_outbox" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "acc_pre_procurement_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "acc_pre_procurement_inbox_procurement_no_key" ON "acc_pre_procurement_inbox"("procurement_no");

-- CreateIndex
CREATE UNIQUE INDEX "acc_pre_procurement_outbox_procurement_no_key" ON "acc_pre_procurement_outbox"("procurement_no");

-- AddForeignKey
ALTER TABLE "acc_pre_procurement_inbox" ADD CONSTRAINT "acc_pre_procurement_inbox_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acc_pre_procurement_outbox" ADD CONSTRAINT "acc_pre_procurement_outbox_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;
