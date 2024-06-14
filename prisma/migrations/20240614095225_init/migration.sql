-- CreateTable
CREATE TABLE "procurement_before_boq" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "category_masterId" TEXT,
    "subcategory_masterId" TEXT,
    "brand_masterId" TEXT,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "rate" DOUBLE PRECISION,
    "unit" TEXT,
    "total_rate" DOUBLE PRECISION,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "procurement_before_boq_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "procurement_before_boq_procurement_no_key" ON "procurement_before_boq"("procurement_no");

-- AddForeignKey
ALTER TABLE "procurement_before_boq" ADD CONSTRAINT "procurement_before_boq_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_before_boq" ADD CONSTRAINT "procurement_before_boq_subcategory_masterId_fkey" FOREIGN KEY ("subcategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_before_boq" ADD CONSTRAINT "procurement_before_boq_brand_masterId_fkey" FOREIGN KEY ("brand_masterId") REFERENCES "brand_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;
