-- CreateEnum
CREATE TYPE "offlineBabnksEnum" AS ENUM ('ss', 'bg', 'bc', 'dd');

-- AddForeignKey
ALTER TABLE "basic_details" ADD CONSTRAINT "basic_details_onlinePyment_mode_fkey" FOREIGN KEY ("onlinePyment_mode") REFERENCES "bank_master"("id") ON DELETE SET NULL ON UPDATE CASCADE;
