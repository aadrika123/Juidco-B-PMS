/*
  Warnings:

  - You are about to drop the column `destination` on the `receiving_image` table. All the data in the column will be lost.
  - You are about to drop the column `mime_type` on the `receiving_image` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `receiving_image` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `receiving_image` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `receiving_image` table. All the data in the column will be lost.
  - Added the required column `ReferenceNo` to the `receiving_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uniqueId` to the `receiving_image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "receiving_image" DROP COLUMN "destination",
DROP COLUMN "mime_type",
DROP COLUMN "name",
DROP COLUMN "path",
DROP COLUMN "size",
ADD COLUMN     "ReferenceNo" TEXT NOT NULL,
ADD COLUMN     "uniqueId" TEXT NOT NULL;
