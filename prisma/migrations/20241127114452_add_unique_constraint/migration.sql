/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `category_master` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "category_master_name_ulb_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "category_master_name_key" ON "category_master"("name");
