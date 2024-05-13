/*
  Warnings:

  - Added the required column `vram` to the `graphics_master` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "graphics_master" ADD COLUMN     "vram" TEXT NOT NULL;
