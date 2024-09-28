/*
  Warnings:

  - The `offline_banks` column on the `basic_details` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "offline_banks_enum" AS ENUM ('ss', 'bg', 'bc', 'dd');

-- AlterTable
ALTER TABLE "basic_details" DROP COLUMN "offline_banks",
ADD COLUMN     "offline_banks" "offline_banks_enum";

-- DropEnum
DROP TYPE "offlineBabnksEnum";
