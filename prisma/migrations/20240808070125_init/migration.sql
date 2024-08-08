/*
  Warnings:

  - You are about to drop the column `comparison_type` on the `comparison` table. All the data in the column will be lost.
  - Added the required column `comparison_type` to the `comparison_criteria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comparison" DROP COLUMN "comparison_type";

-- AlterTable
ALTER TABLE "comparison_criteria" ADD COLUMN     "comparison_type" "comparison_type_enum" NOT NULL;
