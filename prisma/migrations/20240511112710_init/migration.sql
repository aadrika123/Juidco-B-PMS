/*
  Warnings:

  - You are about to drop the column `name` on the `ram_master` table. All the data in the column will be lost.
  - Added the required column `capacity` to the `ram_master` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ram_master" DROP COLUMN "name",
ADD COLUMN     "capacity" TEXT NOT NULL;
