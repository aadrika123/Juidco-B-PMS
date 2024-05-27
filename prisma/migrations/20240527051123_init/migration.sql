-- DropForeignKey
ALTER TABLE "receiving_image" DROP CONSTRAINT "receiving_image_receiving_no_fkey";

-- AlterTable
ALTER TABLE "receiving_image" ALTER COLUMN "receiving_no" DROP NOT NULL,
ALTER COLUMN "uniqueId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "receiving_image" ADD CONSTRAINT "receiving_image_receiving_no_fkey" FOREIGN KEY ("receiving_no") REFERENCES "receivings"("receiving_no") ON DELETE SET NULL ON UPDATE CASCADE;
