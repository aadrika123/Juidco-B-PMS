-- AlterTable
ALTER TABLE "critical_dates" ALTER COLUMN "publishingDate" DROP NOT NULL,
ALTER COLUMN "bidOpeningDate" DROP NOT NULL,
ALTER COLUMN "docSaleStartDate" DROP NOT NULL,
ALTER COLUMN "docSaleEndDate" DROP NOT NULL,
ALTER COLUMN "seekClariStrtDate" DROP NOT NULL,
ALTER COLUMN "seekClariEndDate" DROP NOT NULL,
ALTER COLUMN "bidSubStrtDate" DROP NOT NULL,
ALTER COLUMN "bidSubEndDate" DROP NOT NULL;
