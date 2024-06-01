-- CreateTable
CREATE TABLE "note_sheet" (
    "id" TEXT NOT NULL,
    "procurement_no" TEXT NOT NULL,
    "operation" INTEGER NOT NULL,
    "ReferenceNo" TEXT NOT NULL,
    "uniqueId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "note_sheet_pkey" PRIMARY KEY ("id")
);
