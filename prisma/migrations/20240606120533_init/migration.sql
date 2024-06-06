-- CreateTable
CREATE TABLE "acc_boq_inbox" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "acc_boq_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acc_boq_outbox" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "acc_boq_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "da_boq_inbox" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "da_boq_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "da_boq_outbox" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "da_boq_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "acc_boq_inbox_reference_no_key" ON "acc_boq_inbox"("reference_no");

-- CreateIndex
CREATE UNIQUE INDEX "acc_boq_outbox_reference_no_key" ON "acc_boq_outbox"("reference_no");

-- CreateIndex
CREATE UNIQUE INDEX "da_boq_inbox_reference_no_key" ON "da_boq_inbox"("reference_no");

-- CreateIndex
CREATE UNIQUE INDEX "da_boq_outbox_reference_no_key" ON "da_boq_outbox"("reference_no");

-- AddForeignKey
ALTER TABLE "acc_boq_inbox" ADD CONSTRAINT "acc_boq_inbox_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "boq"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acc_boq_outbox" ADD CONSTRAINT "acc_boq_outbox_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "boq"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_boq_inbox" ADD CONSTRAINT "da_boq_inbox_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "boq"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_boq_outbox" ADD CONSTRAINT "da_boq_outbox_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "boq"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;
