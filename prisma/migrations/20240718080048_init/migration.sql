-- CreateTable
CREATE TABLE "level1_inbox" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "level1_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "level1_outbox" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "level1_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "level2_inbox" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "level2_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "level2_outbox" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "level2_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "level1_inbox_reference_no_key" ON "level1_inbox"("reference_no");

-- CreateIndex
CREATE UNIQUE INDEX "level1_outbox_reference_no_key" ON "level1_outbox"("reference_no");

-- CreateIndex
CREATE UNIQUE INDEX "level2_inbox_reference_no_key" ON "level2_inbox"("reference_no");

-- CreateIndex
CREATE UNIQUE INDEX "level2_outbox_reference_no_key" ON "level2_outbox"("reference_no");

-- AddForeignKey
ALTER TABLE "level1_inbox" ADD CONSTRAINT "level1_inbox_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "boq"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "level1_outbox" ADD CONSTRAINT "level1_outbox_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "boq"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "level2_inbox" ADD CONSTRAINT "level2_inbox_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "boq"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "level2_outbox" ADD CONSTRAINT "level2_outbox_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "boq"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;
