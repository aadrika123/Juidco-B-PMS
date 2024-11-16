/*
  Warnings:

  - You are about to drop the column `gstChecked` on the `boq` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "boq" DROP COLUMN "gstChecked",
ADD COLUMN     "gstchecked" BOOLEAN DEFAULT false;
