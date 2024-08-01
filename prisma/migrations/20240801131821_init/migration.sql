-- CreateEnum
CREATE TYPE "pre_tendering_details_enum" AS ENUM ('percentage', 'fixed');

-- CreateEnum
CREATE TYPE "tendering_type_enum" AS ENUM ('least_cost', 'qcbs', 'rate_contract');

-- CreateTable
CREATE TABLE "pre_tendering_details" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "emd" BOOLEAN NOT NULL,
    "estimated_amount" DOUBLE PRECISION NOT NULL,
    "emd_type" "pre_tendering_details_enum" NOT NULL,
    "emd_value" DOUBLE PRECISION NOT NULL,
    "pbg_type" "pre_tendering_details_enum" NOT NULL,
    "pbg_value" DOUBLE PRECISION NOT NULL,
    "tendering_type" "tendering_type_enum" NOT NULL,
    "tenure" DOUBLE PRECISION,
    "min_supplier" INTEGER,
    "max_supplier" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pre_tendering_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pre_tendering_details_reference_no_key" ON "pre_tendering_details"("reference_no");

-- AddForeignKey
ALTER TABLE "pre_tendering_details" ADD CONSTRAINT "pre_tendering_details_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "boq"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;
