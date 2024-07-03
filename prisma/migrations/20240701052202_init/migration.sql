-- AlterTable
ALTER TABLE "stock_request" ADD COLUMN     "allotment_date" TIMESTAMP(3),
ADD COLUMN     "is_alloted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "release_date" TIMESTAMP(3);
