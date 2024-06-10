/*
  Warnings:

  - You are about to drop the column `tendeing_formId` on the `basic_details` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reference_no]` on the table `basic_details` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reference_no` to the `basic_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `tendeing_form` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "bid_openers_docs_enum" AS ENUM ('B01', 'B02');

-- DropForeignKey
ALTER TABLE "basic_details" DROP CONSTRAINT "basic_details_tendeing_formId_fkey";

-- DropIndex
DROP INDEX "basic_details_tendeing_formId_key";

-- AlterTable
ALTER TABLE "basic_details" DROP COLUMN "tendeing_formId",
ADD COLUMN     "reference_no" TEXT NOT NULL,
ALTER COLUMN "onlinePyment_mode" DROP NOT NULL,
ALTER COLUMN "offline_banks" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tendeing_form" ADD COLUMN     "isEdited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPartial" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "status" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "cover_details_docs" (
    "id" TEXT NOT NULL,
    "cover_detailsId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ReferenceNo" TEXT NOT NULL,
    "uniqueId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cover_details_docs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cover_details" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "noOfCovers" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cover_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_details" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "workDiscription" TEXT NOT NULL,
    "pre_qualification_details" TEXT NOT NULL,
    "product_category" TEXT[],
    "productSubCategory" TEXT NOT NULL,
    "contract_type" TEXT NOT NULL,
    "tender_values" TEXT NOT NULL,
    "bid_validity" TEXT NOT NULL,
    "completionPeriod" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "pinCode" TEXT NOT NULL,
    "pre_bid" BOOLEAN NOT NULL,
    "preBidMeeting" TEXT,
    "preBidMeetingAdd" TEXT,
    "bidOpeningPlace" TEXT NOT NULL,
    "tenderer_class" TEXT[],
    "invstOffName" TEXT NOT NULL,
    "invstOffAdd" TEXT NOT NULL,
    "invstOffEmail_Ph" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_details" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "tenderFee" DOUBLE PRECISION NOT NULL,
    "processingFee" DOUBLE PRECISION NOT NULL,
    "tenderFeePayableTo" TEXT NOT NULL,
    "tenderFeePayableAt" TEXT NOT NULL,
    "surcharges" DOUBLE PRECISION NOT NULL,
    "otherCharges" DOUBLE PRECISION NOT NULL,
    "emd_exemption" BOOLEAN NOT NULL,
    "emd_fee" TEXT,
    "emdPercentage" DOUBLE PRECISION,
    "emdAmount" DOUBLE PRECISION,
    "emdFeePayableTo" TEXT NOT NULL,
    "emdFeePayableAt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "critical_dates" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "publishingDate" TIMESTAMP(3) NOT NULL,
    "bidOpeningDate" TIMESTAMP(3) NOT NULL,
    "docSaleStartDate" TIMESTAMP(3) NOT NULL,
    "docSaleEndDate" TIMESTAMP(3) NOT NULL,
    "seekClariStrtDate" TIMESTAMP(3) NOT NULL,
    "seekClariEndDate" TIMESTAMP(3) NOT NULL,
    "bidSubStrtDate" TIMESTAMP(3) NOT NULL,
    "bidSubEndDate" TIMESTAMP(3) NOT NULL,
    "preBidMettingDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "critical_dates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bid_openers_docs" (
    "id" TEXT NOT NULL,
    "bid_openersId" TEXT NOT NULL,
    "type" "bid_openers_docs_enum" NOT NULL,
    "ReferenceNo" TEXT NOT NULL,
    "uniqueId" TEXT,
    "nameDesig" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "docSize" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bid_openers_docs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bid_openers" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "b01NameDesig" TEXT NOT NULL,
    "b01Email" TEXT NOT NULL,
    "b02NameDesig" TEXT NOT NULL,
    "b02Email" TEXT NOT NULL,
    "b03NameDesig" TEXT,
    "b03Email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bid_openers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cover_details_reference_no_key" ON "cover_details"("reference_no");

-- CreateIndex
CREATE UNIQUE INDEX "work_details_reference_no_key" ON "work_details"("reference_no");

-- CreateIndex
CREATE UNIQUE INDEX "fee_details_reference_no_key" ON "fee_details"("reference_no");

-- CreateIndex
CREATE UNIQUE INDEX "critical_dates_reference_no_key" ON "critical_dates"("reference_no");

-- CreateIndex
CREATE UNIQUE INDEX "bid_openers_reference_no_key" ON "bid_openers"("reference_no");

-- CreateIndex
CREATE UNIQUE INDEX "basic_details_reference_no_key" ON "basic_details"("reference_no");

-- AddForeignKey
ALTER TABLE "basic_details" ADD CONSTRAINT "basic_details_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "tendeing_form"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cover_details_docs" ADD CONSTRAINT "cover_details_docs_cover_detailsId_fkey" FOREIGN KEY ("cover_detailsId") REFERENCES "cover_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cover_details" ADD CONSTRAINT "cover_details_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "tendeing_form"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_details" ADD CONSTRAINT "work_details_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "tendeing_form"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_details" ADD CONSTRAINT "fee_details_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "tendeing_form"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "critical_dates" ADD CONSTRAINT "critical_dates_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "tendeing_form"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_openers_docs" ADD CONSTRAINT "bid_openers_docs_bid_openersId_fkey" FOREIGN KEY ("bid_openersId") REFERENCES "bid_openers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_openers" ADD CONSTRAINT "bid_openers_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "tendeing_form"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;
