/*
  Warnings:

  - Added the required column `destination` to the `receiving_image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "receiving_image" ADD COLUMN     "destination" TEXT NOT NULL;
