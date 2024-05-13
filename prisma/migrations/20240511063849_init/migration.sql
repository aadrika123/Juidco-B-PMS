-- CreateEnum
CREATE TYPE "RomType" AS ENUM ('HDD', 'SSD');

-- CreateTable
CREATE TABLE "item_master" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category_masterId" TEXT NOT NULL,
    "subcategory_masterId" TEXT NOT NULL,
    "brand_masterId" TEXT NOT NULL,
    "processor_masterId" TEXT,
    "ram_masterId" TEXT,
    "os_masterId" TEXT,
    "rom_masterId" TEXT,
    "graphics_masterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "item_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brand_master" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brand_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processor_master" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "processor_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ram_master" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ram_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "os_master" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "os_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rom_master" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "RomType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rom_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "graphics_master" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "graphics_master_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "item_master" ADD CONSTRAINT "item_master_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_master" ADD CONSTRAINT "item_master_subcategory_masterId_fkey" FOREIGN KEY ("subcategory_masterId") REFERENCES "subcategory_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_master" ADD CONSTRAINT "item_master_brand_masterId_fkey" FOREIGN KEY ("brand_masterId") REFERENCES "brand_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_master" ADD CONSTRAINT "item_master_processor_masterId_fkey" FOREIGN KEY ("processor_masterId") REFERENCES "processor_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_master" ADD CONSTRAINT "item_master_ram_masterId_fkey" FOREIGN KEY ("ram_masterId") REFERENCES "ram_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_master" ADD CONSTRAINT "item_master_os_masterId_fkey" FOREIGN KEY ("os_masterId") REFERENCES "os_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_master" ADD CONSTRAINT "item_master_rom_masterId_fkey" FOREIGN KEY ("rom_masterId") REFERENCES "rom_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_master" ADD CONSTRAINT "item_master_graphics_masterId_fkey" FOREIGN KEY ("graphics_masterId") REFERENCES "graphics_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;
