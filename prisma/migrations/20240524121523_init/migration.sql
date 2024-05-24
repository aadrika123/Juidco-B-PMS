-- CreateTable
CREATE TABLE "receiving_image" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "buffer" BYTEA NOT NULL,
    "size" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "receivingsId" TEXT NOT NULL,

    CONSTRAINT "receiving_image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "receiving_image" ADD CONSTRAINT "receiving_image_receivingsId_fkey" FOREIGN KEY ("receivingsId") REFERENCES "receivings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
