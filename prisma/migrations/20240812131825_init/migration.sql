/*
  Warnings:

  - The values [rate_contract] on the enum `bid_type_enum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "bid_type_enum_new" AS ENUM ('technical', 'financial', 'fintech');
ALTER TABLE "bid_details" ALTER COLUMN "bid_type" TYPE "bid_type_enum_new" USING ("bid_type"::text::"bid_type_enum_new");
ALTER TYPE "bid_type_enum" RENAME TO "bid_type_enum_old";
ALTER TYPE "bid_type_enum_new" RENAME TO "bid_type_enum";
DROP TYPE "bid_type_enum_old";
COMMIT;
