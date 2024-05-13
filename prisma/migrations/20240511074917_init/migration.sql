/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `brand_master` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `category_master` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `subcategory_master` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "brand_master_name_key" ON "brand_master"("name");

-- CreateIndex
CREATE UNIQUE INDEX "category_master_name_key" ON "category_master"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subcategory_master_name_key" ON "subcategory_master"("name");
