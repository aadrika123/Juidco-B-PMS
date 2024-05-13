/*
  Warnings:

  - You are about to drop the column `name` on the `rom_master` table. All the data in the column will be lost.
  - Added the required column `capacity` to the `rom_master` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rom_master" DROP COLUMN "name",
ADD COLUMN     "capacity" TEXT NOT NULL;
