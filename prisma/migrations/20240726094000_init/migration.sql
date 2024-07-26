-- AlterTable
ALTER TABLE "service_req_product" ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "stock_req_product" ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1;
