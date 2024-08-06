-- AddForeignKey
ALTER TABLE "boq" ADD CONSTRAINT "boq_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE SET NULL ON UPDATE CASCADE;
