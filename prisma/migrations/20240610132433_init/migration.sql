/*
  Warnings:

  - You are about to drop the `tendeing_form` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "acc_pre_tender_inbox" DROP CONSTRAINT "acc_pre_tender_inbox_reference_no_fkey";

-- DropForeignKey
ALTER TABLE "acc_pre_tender_outbox" DROP CONSTRAINT "acc_pre_tender_outbox_reference_no_fkey";

-- DropForeignKey
ALTER TABLE "basic_details" DROP CONSTRAINT "basic_details_reference_no_fkey";

-- DropForeignKey
ALTER TABLE "bid_openers" DROP CONSTRAINT "bid_openers_reference_no_fkey";

-- DropForeignKey
ALTER TABLE "cover_details" DROP CONSTRAINT "cover_details_reference_no_fkey";

-- DropForeignKey
ALTER TABLE "critical_dates" DROP CONSTRAINT "critical_dates_reference_no_fkey";

-- DropForeignKey
ALTER TABLE "da_pre_tender_inbox" DROP CONSTRAINT "da_pre_tender_inbox_reference_no_fkey";

-- DropForeignKey
ALTER TABLE "da_pre_tender_outbox" DROP CONSTRAINT "da_pre_tender_outbox_reference_no_fkey";

-- DropForeignKey
ALTER TABLE "fee_details" DROP CONSTRAINT "fee_details_reference_no_fkey";

-- DropForeignKey
ALTER TABLE "tendeing_form" DROP CONSTRAINT "tendeing_form_reference_no_fkey";

-- DropForeignKey
ALTER TABLE "work_details" DROP CONSTRAINT "work_details_reference_no_fkey";

-- DropTable
DROP TABLE "tendeing_form";

-- CreateTable
CREATE TABLE "tendering_form" (
    "id" TEXT NOT NULL,
    "reference_no" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "isPartial" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tendering_form_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tendering_form_reference_no_key" ON "tendering_form"("reference_no");

-- AddForeignKey
ALTER TABLE "tendering_form" ADD CONSTRAINT "tendering_form_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "boq"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic_details" ADD CONSTRAINT "basic_details_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "tendering_form"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cover_details" ADD CONSTRAINT "cover_details_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "tendering_form"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_details" ADD CONSTRAINT "work_details_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "tendering_form"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_details" ADD CONSTRAINT "fee_details_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "tendering_form"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "critical_dates" ADD CONSTRAINT "critical_dates_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "tendering_form"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_openers" ADD CONSTRAINT "bid_openers_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "tendering_form"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acc_pre_tender_inbox" ADD CONSTRAINT "acc_pre_tender_inbox_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "tendering_form"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acc_pre_tender_outbox" ADD CONSTRAINT "acc_pre_tender_outbox_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "tendering_form"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_tender_inbox" ADD CONSTRAINT "da_pre_tender_inbox_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "tendering_form"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "da_pre_tender_outbox" ADD CONSTRAINT "da_pre_tender_outbox_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "tendering_form"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;
