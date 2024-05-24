/*
  Warnings:

  - You are about to drop the column `buffer` on the `receiving_image` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `receivings` table. All the data in the column will be lost.
  - Added the required column `path` to the `receiving_image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "receiving_image" DROP COLUMN "buffer",
ADD COLUMN     "path" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "receivings" DROP COLUMN "image";
