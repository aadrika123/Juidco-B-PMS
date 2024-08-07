-- DropForeignKey
ALTER TABLE "ta_inbox" DROP CONSTRAINT "ta_inbox_reference_no_fkey";

-- DropForeignKey
ALTER TABLE "ta_outbox" DROP CONSTRAINT "ta_outbox_reference_no_fkey";

-- AddForeignKey
ALTER TABLE "ta_inbox" ADD CONSTRAINT "ta_inbox_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "boq"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ta_outbox" ADD CONSTRAINT "ta_outbox_reference_no_fkey" FOREIGN KEY ("reference_no") REFERENCES "boq"("reference_no") ON DELETE RESTRICT ON UPDATE CASCADE;
