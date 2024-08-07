/*
  Warnings:

  - You are about to drop the column `bidder_doc` on the `bidder_master` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bidder_master" DROP COLUMN "bidder_doc";

-- CreateTable
CREATE TABLE "bidder_doc" (
    "id" TEXT NOT NULL,
    "criteria_type" "criteria_type_enum" NOT NULL,
    "doc_path" TEXT NOT NULL,
    "bidder_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bidder_doc_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bidder_doc" ADD CONSTRAINT "bidder_doc_bidder_id_fkey" FOREIGN KEY ("bidder_id") REFERENCES "bidder_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
