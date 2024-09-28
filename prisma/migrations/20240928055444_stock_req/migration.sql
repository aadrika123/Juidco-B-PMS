-- AddForeignKey
ALTER TABLE "emp_service_request" ADD CONSTRAINT "emp_service_request_stock_handover_no_fkey" FOREIGN KEY ("stock_handover_no") REFERENCES "stock_request"("stock_handover_no") ON DELETE RESTRICT ON UPDATE CASCADE;
