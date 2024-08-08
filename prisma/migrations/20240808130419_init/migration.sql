/*
  Warnings:

  - The values [online,offline] on the enum `offline_mode_enum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "offline_mode_enum_new" AS ENUM ('dd', 'cash');
ALTER TABLE "bidder_master" ALTER COLUMN "offline_mode" TYPE "offline_mode_enum_new" USING ("offline_mode"::text::"offline_mode_enum_new");
ALTER TYPE "offline_mode_enum" RENAME TO "offline_mode_enum_old";
ALTER TYPE "offline_mode_enum_new" RENAME TO "offline_mode_enum";
DROP TYPE "offline_mode_enum_old";
COMMIT;
