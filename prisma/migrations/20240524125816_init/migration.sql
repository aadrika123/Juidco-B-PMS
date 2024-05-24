/*
  Warnings:

  - You are about to drop the column `receivingsId` on the `receiving_image` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[receiving_no]` on the table `receivings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receiving_no` to the `receiving_image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "receiving_image" DROP CONSTRAINT "receiving_image_receivingsId_fkey";

-- AlterTable
ALTER TABLE "receiving_image" DROP COLUMN "receivingsId",
ADD COLUMN     "receiving_no" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "receivings_receiving_no_key" ON "receivings"("receiving_no");

-- AddForeignKey
ALTER TABLE "receiving_image" ADD CONSTRAINT "receiving_image_receiving_no_fkey" FOREIGN KEY ("receiving_no") REFERENCES "receivings"("receiving_no") ON DELETE RESTRICT ON UPDATE CASCADE;
