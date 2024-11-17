-- AlterTable
ALTER TABLE "bank_master" ADD COLUMN     "ulb_id" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "boq" ADD COLUMN     "ulb_id" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "brand_master" ADD COLUMN     "ulb_id" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "category_master" ADD COLUMN     "ulb_id" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "emp_service_request" ADD COLUMN     "ulb_id" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "inventory" ADD COLUMN     "ulb_id" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "ulb_id" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "procurement" ADD COLUMN     "ulb_id" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "rate_contract" ADD COLUMN     "ulb_id" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "service_request" ADD COLUMN     "ulb_id" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "subcategory_master" ADD COLUMN     "ulb_id" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "supplier_master" ADD COLUMN     "ulb_id" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "unit_master" ADD COLUMN     "ulb_id" INTEGER NOT NULL DEFAULT 2;
