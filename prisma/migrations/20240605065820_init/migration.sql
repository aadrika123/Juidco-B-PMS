-- CreateTable
CREATE TABLE "boq" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "gst" DOUBLE PRECISION,
    "estimated_cost" DOUBLE PRECISION,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boq_procurement" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "quantity" INTEGER,
    "unit" TEXT,
    "rate" DOUBLE PRECISION,
    "amoount" DOUBLE PRECISION,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boq_procurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boq_doc" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "ReferenceNo" TEXT NOT NULL,
    "uniqueId" TEXT,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boq_doc_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "boq_reference_no_key" ON "boq"("reference_no");

-- AddForeignKey
ALTER TABLE "boq_procurement" ADD CONSTRAINT "boq_procurement_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boq_procurement" ADD CONSTRAINT "boq_procurement_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "boq"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boq_doc" ADD CONSTRAINT "boq_doc_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "boq"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;
