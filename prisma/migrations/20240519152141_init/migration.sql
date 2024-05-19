/*
  Warnings:

  - You are about to drop the column `brand_masterId` on the `da_pre_procurement_inbox` table. All the data in the column will be lost.
  - You are about to drop the column `graphics_masterId` on the `da_pre_procurement_inbox` table. All the data in the column will be lost.
  - You are about to drop the column `os_masterId` on the `da_pre_procurement_inbox` table. All the data in the column will be lost.
  - You are about to drop the column `processor_masterId` on the `da_pre_procurement_inbox` table. All the data in the column will be lost.
  - You are about to drop the column `ram_masterId` on the `da_pre_procurement_inbox` table. All the data in the column will be lost.
  - You are about to drop the column `rom_masterId` on the `da_pre_procurement_inbox` table. All the data in the column will be lost.
  - You are about to drop the column `brand_masterId` on the `da_pre_procurement_outbox` table. All the data in the column will be lost.
  - You are about to drop the column `graphics_masterId` on the `da_pre_procurement_outbox` table. All the data in the column will be lost.
  - You are about to drop the column `os_masterId` on the `da_pre_procurement_outbox` table. All the data in the column will be lost.
  - You are about to drop the column `processor_masterId` on the `da_pre_procurement_outbox` table. All the data in the column will be lost.
  - You are about to drop the column `ram_masterId` on the `da_pre_procurement_outbox` table. All the data in the column will be lost.
  - You are about to drop the column `rom_masterId` on the `da_pre_procurement_outbox` table. All the data in the column will be lost.
  - You are about to drop the column `brand_masterId` on the `pre_procurement_history` table. All the data in the column will be lost.
  - You are about to drop the column `graphics_masterId` on the `pre_procurement_history` table. All the data in the column will be lost.
  - You are about to drop the column `os_masterId` on the `pre_procurement_history` table. All the data in the column will be lost.
  - You are about to drop the column `processor_masterId` on the `pre_procurement_history` table. All the data in the column will be lost.
  - You are about to drop the column `ram_masterId` on the `pre_procurement_history` table. All the data in the column will be lost.
  - You are about to drop the column `rom_masterId` on the `pre_procurement_history` table. All the data in the column will be lost.
  - You are about to drop the column `brand_masterId` on the `sr_pre_procurement_inbox` table. All the data in the column will be lost.
  - You are about to drop the column `graphics_masterId` on the `sr_pre_procurement_inbox` table. All the data in the column will be lost.
  - You are about to drop the column `os_masterId` on the `sr_pre_procurement_inbox` table. All the data in the column will be lost.
  - You are about to drop the column `processor_masterId` on the `sr_pre_procurement_inbox` table. All the data in the column will be lost.
  - You are about to drop the column `ram_masterId` on the `sr_pre_procurement_inbox` table. All the data in the column will be lost.
  - You are about to drop the column `rom_masterId` on the `sr_pre_procurement_inbox` table. All the data in the column will be lost.
  - You are about to drop the column `brand_masterId` on the `sr_pre_procurement_outbox` table. All the data in the column will be lost.
  - You are about to drop the column `graphics_masterId` on the `sr_pre_procurement_outbox` table. All the data in the column will be lost.
  - You are about to drop the column `os_masterId` on the `sr_pre_procurement_outbox` table. All the data in the column will be lost.
  - You are about to drop the column `processor_masterId` on the `sr_pre_procurement_outbox` table. All the data in the column will be lost.
  - You are about to drop the column `ram_masterId` on the `sr_pre_procurement_outbox` table. All the data in the column will be lost.
  - You are about to drop the column `rom_masterId` on the `sr_pre_procurement_outbox` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "da_pre_procurement_inbox" DROP CONSTRAINT "da_pre_procurement_inbox_brand_masterId_fkey";

-- DropForeignKey
ALTER TABLE "da_pre_procurement_inbox" DROP CONSTRAINT "da_pre_procurement_inbox_graphics_masterId_fkey";

-- DropForeignKey
ALTER TABLE "da_pre_procurement_inbox" DROP CONSTRAINT "da_pre_procurement_inbox_os_masterId_fkey";

-- DropForeignKey
ALTER TABLE "da_pre_procurement_inbox" DROP CONSTRAINT "da_pre_procurement_inbox_processor_masterId_fkey";

-- DropForeignKey
ALTER TABLE "da_pre_procurement_inbox" DROP CONSTRAINT "da_pre_procurement_inbox_ram_masterId_fkey";

-- DropForeignKey
ALTER TABLE "da_pre_procurement_inbox" DROP CONSTRAINT "da_pre_procurement_inbox_rom_masterId_fkey";

-- DropForeignKey
ALTER TABLE "da_pre_procurement_outbox" DROP CONSTRAINT "da_pre_procurement_outbox_brand_masterId_fkey";

-- DropForeignKey
ALTER TABLE "da_pre_procurement_outbox" DROP CONSTRAINT "da_pre_procurement_outbox_graphics_masterId_fkey";

-- DropForeignKey
ALTER TABLE "da_pre_procurement_outbox" DROP CONSTRAINT "da_pre_procurement_outbox_os_masterId_fkey";

-- DropForeignKey
ALTER TABLE "da_pre_procurement_outbox" DROP CONSTRAINT "da_pre_procurement_outbox_processor_masterId_fkey";

-- DropForeignKey
ALTER TABLE "da_pre_procurement_outbox" DROP CONSTRAINT "da_pre_procurement_outbox_ram_masterId_fkey";

-- DropForeignKey
ALTER TABLE "da_pre_procurement_outbox" DROP CONSTRAINT "da_pre_procurement_outbox_rom_masterId_fkey";

-- DropForeignKey
ALTER TABLE "pre_procurement_history" DROP CONSTRAINT "pre_procurement_history_brand_masterId_fkey";

-- DropForeignKey
ALTER TABLE "pre_procurement_history" DROP CONSTRAINT "pre_procurement_history_graphics_masterId_fkey";

-- DropForeignKey
ALTER TABLE "pre_procurement_history" DROP CONSTRAINT "pre_procurement_history_os_masterId_fkey";

-- DropForeignKey
ALTER TABLE "pre_procurement_history" DROP CONSTRAINT "pre_procurement_history_processor_masterId_fkey";

-- DropForeignKey
ALTER TABLE "pre_procurement_history" DROP CONSTRAINT "pre_procurement_history_ram_masterId_fkey";

-- DropForeignKey
ALTER TABLE "pre_procurement_history" DROP CONSTRAINT "pre_procurement_history_rom_masterId_fkey";

-- DropForeignKey
ALTER TABLE "sr_pre_procurement_inbox" DROP CONSTRAINT "sr_pre_procurement_inbox_brand_masterId_fkey";

-- DropForeignKey
ALTER TABLE "sr_pre_procurement_inbox" DROP CONSTRAINT "sr_pre_procurement_inbox_category_masterId_fkey";

-- DropForeignKey
ALTER TABLE "sr_pre_procurement_inbox" DROP CONSTRAINT "sr_pre_procurement_inbox_graphics_masterId_fkey";

-- DropForeignKey
ALTER TABLE "sr_pre_procurement_inbox" DROP CONSTRAINT "sr_pre_procurement_inbox_os_masterId_fkey";

-- DropForeignKey
ALTER TABLE "sr_pre_procurement_inbox" DROP CONSTRAINT "sr_pre_procurement_inbox_processor_masterId_fkey";

-- DropForeignKey
ALTER TABLE "sr_pre_procurement_inbox" DROP CONSTRAINT "sr_pre_procurement_inbox_ram_masterId_fkey";

-- DropForeignKey
ALTER TABLE "sr_pre_procurement_inbox" DROP CONSTRAINT "sr_pre_procurement_inbox_rom_masterId_fkey";

-- DropForeignKey
ALTER TABLE "sr_pre_procurement_inbox" DROP CONSTRAINT "sr_pre_procurement_inbox_subcategory_masterId_fkey";

-- DropForeignKey
ALTER TABLE "sr_pre_procurement_outbox" DROP CONSTRAINT "sr_pre_procurement_outbox_brand_masterId_fkey";

-- DropForeignKey
ALTER TABLE "sr_pre_procurement_outbox" DROP CONSTRAINT "sr_pre_procurement_outbox_graphics_masterId_fkey";

-- DropForeignKey
ALTER TABLE "sr_pre_procurement_outbox" DROP CONSTRAINT "sr_pre_procurement_outbox_os_masterId_fkey";

-- DropForeignKey
ALTER TABLE "sr_pre_procurement_outbox" DROP CONSTRAINT "sr_pre_procurement_outbox_processor_masterId_fkey";

-- DropForeignKey
ALTER TABLE "sr_pre_procurement_outbox" DROP CONSTRAINT "sr_pre_procurement_outbox_ram_masterId_fkey";

-- DropForeignKey
ALTER TABLE "sr_pre_procurement_outbox" DROP CONSTRAINT "sr_pre_procurement_outbox_rom_masterId_fkey";

-- AlterTable
ALTER TABLE "da_pre_procurement_inbox" DROP COLUMN "brand_masterId",
DROP COLUMN "graphics_masterId",
DROP COLUMN "os_masterId",
DROP COLUMN "processor_masterId",
DROP COLUMN "ram_masterId",
DROP COLUMN "rom_masterId",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "graphics" TEXT,
ADD COLUMN     "os" TEXT,
ADD COLUMN     "processor" TEXT,
ADD COLUMN     "ram" TEXT,
ADD COLUMN     "rom" TEXT;

-- AlterTable
ALTER TABLE "da_pre_procurement_outbox" DROP COLUMN "brand_masterId",
DROP COLUMN "graphics_masterId",
DROP COLUMN "os_masterId",
DROP COLUMN "processor_masterId",
DROP COLUMN "ram_masterId",
DROP COLUMN "rom_masterId",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "graphics" TEXT,
ADD COLUMN     "os" TEXT,
ADD COLUMN     "processor" TEXT,
ADD COLUMN     "ram" TEXT,
ADD COLUMN     "rom" TEXT;

-- AlterTable
ALTER TABLE "pre_procurement_history" DROP COLUMN "brand_masterId",
DROP COLUMN "graphics_masterId",
DROP COLUMN "os_masterId",
DROP COLUMN "processor_masterId",
DROP COLUMN "ram_masterId",
DROP COLUMN "rom_masterId",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "graphics" TEXT,
ADD COLUMN     "os" TEXT,
ADD COLUMN     "processor" TEXT,
ADD COLUMN     "ram" TEXT,
ADD COLUMN     "rom" TEXT;

-- AlterTable
ALTER TABLE "sr_pre_procurement_inbox" DROP COLUMN "brand_masterId",
DROP COLUMN "graphics_masterId",
DROP COLUMN "os_masterId",
DROP COLUMN "processor_masterId",
DROP COLUMN "ram_masterId",
DROP COLUMN "rom_masterId",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "graphics" TEXT,
ADD COLUMN     "os" TEXT,
ADD COLUMN     "processor" TEXT,
ADD COLUMN     "ram" TEXT,
ADD COLUMN     "rom" TEXT,
ALTER COLUMN "category_masterId" DROP NOT NULL,
ALTER COLUMN "subcategory_masterId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "sr_pre_procurement_outbox" DROP COLUMN "brand_masterId",
DROP COLUMN "graphics_masterId",
DROP COLUMN "os_masterId",
DROP COLUMN "processor_masterId",
DROP COLUMN "ram_masterId",
DROP COLUMN "rom_masterId",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "graphics" TEXT,
ADD COLUMN     "os" TEXT,
ADD COLUMN     "processor" TEXT,
ADD COLUMN     "ram" TEXT,
ADD COLUMN     "rom" TEXT;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_inbox" ADD CONSTRAINT "sr_pre_procurement_inbox_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sr_pre_procurement_inbox" ADD CONSTRAINT "sr_pre_procurement_inbox_subcategory_masterId_fkey" FOREIGN KEY ("subcategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;
