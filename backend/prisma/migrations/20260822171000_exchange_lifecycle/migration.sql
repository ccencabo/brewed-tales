ALTER TYPE "ShelfMatchStatus" ADD VALUE IF NOT EXISTS 'PENDING' BEFORE 'ACTIVE';

ALTER TABLE "shelf_matches"
  ALTER COLUMN "status" SET DEFAULT 'PENDING',
  ADD COLUMN "responded_at" TIMESTAMPTZ(3),
  ADD COLUMN "owner_completed_at" TIMESTAMPTZ(3),
  ADD COLUMN "requester_completed_at" TIMESTAMPTZ(3),
  ADD COLUMN "cancelled_at" TIMESTAMPTZ(3);

DROP INDEX "shelf_matches_listing_id_key";
CREATE INDEX "shelf_matches_listing_id_idx" ON "shelf_matches"("listing_id");
