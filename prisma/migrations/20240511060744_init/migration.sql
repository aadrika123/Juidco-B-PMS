-- CreateTable
CREATE TABLE "category_master" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcategory_master" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category_masterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subcategory_master_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subcategory_master" ADD CONSTRAINT "subcategory_master_category_masterId_fkey" FOREIGN KEY ("category_masterId") REFERENCES "category_master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
