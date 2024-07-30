/*
  Warnings:

  - You are about to drop the column `reference_no` on the `level1_inbox` table. All the data in the column will be lost.
  - You are about to drop the column `reference_no` on the `level1_outbox` table. All the data in the column will be lost.
  - You are about to drop the column `reference_no` on the `level2_inbox` table. All the data in the column will be lost.
  - You are about to drop the column `reference_no` on the `level2_outbox` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[procurement_no]` on the table `level1_inbox` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[procurement_no]` on the table `level1_outbox` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[procurement_no]` on the table `level2_inbox` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[procurement_no]` on the table `level2_outbox` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `procurement_no` to the `level1_inbox` table without a default value. This is not possible if the table is not empty.
  - Added the required column `procurement_no` to the `level1_outbox` table without a default value. This is not possible if the table is not empty.
  - Added the required column `procurement_no` to the `level2_inbox` table without a default value. This is not possible if the table is not empty.
  - Added the required column `procurement_no` to the `level2_outbox` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "level1_inbox" DROP CONSTRAINT "level1_inbox_reference_no_fkey";

-- DropForeignKey
ALTER TABLE "level1_outbox" DROP CONSTRAINT "level1_outbox_reference_no_fkey";

-- DropForeignKey
ALTER TABLE "level2_inbox" DROP CONSTRAINT "level2_inbox_reference_no_fkey";

-- DropForeignKey
ALTER TABLE "level2_outbox" DROP CONSTRAINT "level2_outbox_reference_no_fkey";

-- DropIndex
DROP INDEX "level1_inbox_reference_no_key";

-- DropIndex
DROP INDEX "level1_outbox_reference_no_key";

-- DropIndex
DROP INDEX "level2_inbox_reference_no_key";

-- DropIndex
DROP INDEX "level2_outbox_reference_no_key";

-- AlterTable
ALTER TABLE "level1_inbox" DROP COLUMN "reference_no",
ADD COLUMN     "procurement_no" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "level1_outbox" DROP COLUMN "reference_no",
ADD COLUMN     "procurement_no" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "level2_inbox" DROP COLUMN "reference_no",
ADD COLUMN     "procurement_no" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "level2_outbox" DROP COLUMN "reference_no",
ADD COLUMN     "procurement_no" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "level1_inbox_procurement_no_key" ON "level1_inbox"("procurement_no");

-- CreateIndex
CREATE UNIQUE INDEX "level1_outbox_procurement_no_key" ON "level1_outbox"("procurement_no");

-- CreateIndex
CREATE UNIQUE INDEX "level2_inbox_procurement_no_key" ON "level2_inbox"("procurement_no");

-- CreateIndex
CREATE UNIQUE INDEX "level2_outbox_procurement_no_key" ON "level2_outbox"("procurement_no");

-- AddForeignKey
ALTER TABLE "level1_inbox" ADD CONSTRAINT "level1_inbox_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "level1_outbox" ADD CONSTRAINT "level1_outbox_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "level2_inbox" ADD CONSTRAINT "level2_inbox_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "level2_outbox" ADD CONSTRAINT "level2_outbox_procurement_no_fkey" FOREIGN KEY ("procurement_no") REFERENCES "procurement"("procurement_no") ON DELETE RESTRICT ON UPDATE CASCADE;
