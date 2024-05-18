-- AlterTable
ALTER TABLE "da_pre_procurement_inbox" ADD COLUMN     "bristle" TEXT,
ADD COLUMN     "colour" TEXT,
ADD COLUMN     "dimension" TEXT,
ADD COLUMN     "included_components" TEXT,
ADD COLUMN     "material" TEXT,
ADD COLUMN     "recomended_uses" TEXT,
ADD COLUMN     "room_type" TEXT,
ADD COLUMN     "size" TEXT,
ADD COLUMN     "weight" TEXT;

-- AlterTable
ALTER TABLE "da_pre_procurement_outbox" ADD COLUMN     "bristle" TEXT,
ADD COLUMN     "colour" TEXT,
ADD COLUMN     "dimension" TEXT,
ADD COLUMN     "included_components" TEXT,
ADD COLUMN     "material" TEXT,
ADD COLUMN     "recomended_uses" TEXT,
ADD COLUMN     "room_type" TEXT,
ADD COLUMN     "size" TEXT,
ADD COLUMN     "weight" TEXT;

-- AlterTable
ALTER TABLE "pre_procurement_history" ADD COLUMN     "bristle" TEXT,
ADD COLUMN     "colour" TEXT,
ADD COLUMN     "dimension" TEXT,
ADD COLUMN     "included_components" TEXT,
ADD COLUMN     "material" TEXT,
ADD COLUMN     "recomended_uses" TEXT,
ADD COLUMN     "room_type" TEXT,
ADD COLUMN     "size" TEXT,
ADD COLUMN     "weight" TEXT;

-- AlterTable
ALTER TABLE "sr_pre_procurement_inbox" ADD COLUMN     "bristle" TEXT,
ADD COLUMN     "colour" TEXT,
ADD COLUMN     "dimension" TEXT,
ADD COLUMN     "included_components" TEXT,
ADD COLUMN     "material" TEXT,
ADD COLUMN     "recomended_uses" TEXT,
ADD COLUMN     "room_type" TEXT,
ADD COLUMN     "size" TEXT,
ADD COLUMN     "weight" TEXT;

-- AlterTable
ALTER TABLE "sr_pre_procurement_outbox" ADD COLUMN     "bristle" TEXT,
ADD COLUMN     "colour" TEXT,
ADD COLUMN     "dimension" TEXT,
ADD COLUMN     "included_components" TEXT,
ADD COLUMN     "material" TEXT,
ADD COLUMN     "recomended_uses" TEXT,
ADD COLUMN     "room_type" TEXT,
ADD COLUMN     "size" TEXT,
ADD COLUMN     "weight" TEXT;
