/*
  Warnings:

  - You are about to drop the column `emp_id` on the `emp_service_request` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `emp_service_request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "emp_service_request" DROP COLUMN "emp_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;
