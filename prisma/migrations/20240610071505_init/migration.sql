-- CreateEnum
CREATE TYPE "payment_mode_enum" AS ENUM ('online', 'offline');

-- CreateEnum
CREATE TYPE "tendering_form_docs_enum" AS ENUM ('basic_details');

-- AlterTable
ALTER TABLE "boq_procurement" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "tendering_form_docs" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "form" "tendering_form_docs_enum" NOT NULL,
    "ReferenceNo" TEXT NOT NULL,
    "uniqueId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tendering_form_docs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tendeing_form" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tendeing_form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "basic_details" (
    "id" TEXT NOT NULL,
    "tendeing_formId" TEXT NOT NULL,
    "allow_offline_submission" BOOLEAN NOT NULL,
    "allow_resubmission" BOOLEAN NOT NULL,
    "allow_withdrawl" BOOLEAN NOT NULL,
    "payment_mode" "payment_mode_enum" NOT NULL,
    "onlinePyment_mode" TEXT NOT NULL,
    "offline_banks" TEXT NOT NULL,
    "contract_form" TEXT[],
    "tender_category" TEXT[],
    "tender_type" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "basic_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tendeing_form_reference_no_key" ON "tendeing_form"("reference_no");

-- CreateIndex
CREATE UNIQUE INDEX "basic_details_tendeing_formId_key" ON "basic_details"("tendeing_formId");

-- AddForeignKey
ALTER TABLE "tendeing_form" ADD CONSTRAINT "tendeing_form_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "boq"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic_details" ADD CONSTRAINT "basic_details_tendeing_formId_fkey" FOREIGN KEY ("tendeing_formId") REFERENCES "tendeing_form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
