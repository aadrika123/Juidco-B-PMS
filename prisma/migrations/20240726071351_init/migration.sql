-- CreateEnum
CREATE TYPE "dead_stock_role" AS ENUM ('DD', 'IA');

-- AlterTable
ALTER TABLE "inventory_dead_stock" ADD COLUMN     "remark1" TEXT,
ADD COLUMN     "remark2" TEXT;

-- AlterTable
ALTER TABLE "inventory_dead_stock_image" ADD COLUMN     "uploader" "dead_stock_role";
