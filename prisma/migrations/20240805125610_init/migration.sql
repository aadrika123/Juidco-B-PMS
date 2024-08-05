-- CreateEnum
CREATE TYPE "bid_type_enum" AS ENUM ('technical', 'financial', 'fintech', 'rate_contract');

-- CreateEnum
CREATE TYPE "offline_mode_enum" AS ENUM ('online', 'offline');

-- CreateEnum
CREATE TYPE "comparison_type_enum" AS ENUM ('numeric', 'symbolic');

-- CreateTable
CREATE TABLE "ta_inbox" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ta_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ta_outbox" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ta_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bid_details" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "bid_type" "bid_type_enum" NOT NULL,
    "no_of_bidders" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bid_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "criteria" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bidder_master" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gst_no" TEXT NOT NULL,
    "pan_no" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "account_no" TEXT NOT NULL,
    "ifsc" TEXT NOT NULL,
    "emd" BOOLEAN NOT NULL,
    "emd_doc" TEXT NOT NULL,
    "payment_mode" "payment_mode_enum",
    "offline_mode" "offline_mode_enum",
    "dd_no" TEXT,
    "transaction_no" TEXT,
    "bidder_doc" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bidder_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comparison" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "comparison_type" "comparison_type_enum" NOT NULL,
    "bidder_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comparison_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comparison_criteria" (
    "id" TEXT NOT NULL,
    "criteria_id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "bidder_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comparison_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ta_inbox_reference_no_key" ON "ta_inbox"("reference_no");

-- CreateIndex
CREATE UNIQUE INDEX "ta_outbox_reference_no_key" ON "ta_outbox"("reference_no");

-- CreateIndex
CREATE UNIQUE INDEX "bid_details_reference_no_key" ON "bid_details"("reference_no");

-- CreateIndex
CREATE UNIQUE INDEX "comparison_bidder_id_key" ON "comparison"("bidder_id");

-- AddForeignKey
ALTER TABLE "ta_inbox" ADD CONSTRAINT "ta_inbox_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "bid_details"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ta_outbox" ADD CONSTRAINT "ta_outbox_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "bid_details"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_details" ADD CONSTRAINT "bid_details_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "boq"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criteria" ADD CONSTRAINT "criteria_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "bid_details"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bidder_master" ADD CONSTRAINT "bidder_master_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "bid_details"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparison" ADD CONSTRAINT "comparison_bidder_id_fkey" FOREIGN KEY ("bidder_id") REFERENCES "bidder_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparison" ADD CONSTRAINT "comparison_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "bid_details"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparison_criteria" ADD CONSTRAINT "comparison_criteria_bidder_id_fkey" FOREIGN KEY ("bidder_id") REFERENCES "comparison"("bidder_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparison_criteria" ADD CONSTRAINT "comparison_criteria_criteria_id_fkey" FOREIGN KEY ("criteria_id") REFERENCES "criteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
