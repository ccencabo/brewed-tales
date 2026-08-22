BEGIN;

-- Add generated integer IDs while preserving the existing UUID identifiers.
ALTER TABLE "users" ADD COLUMN "new_id" SERIAL NOT NULL;
ALTER TABLE "shelf_listings" ADD COLUMN "new_id" SERIAL NOT NULL;
ALTER TABLE "shelf_matches" ADD COLUMN "new_id" SERIAL NOT NULL;

-- Remap every relationship to the new integer IDs before removing UUID columns.
ALTER TABLE "shelf_listings" ADD COLUMN "new_owner_id" INTEGER;
UPDATE "shelf_listings" AS listing
SET "new_owner_id" = owner."new_id"
FROM "users" AS owner
WHERE listing."owner_id" = owner."id";
ALTER TABLE "shelf_listings" ALTER COLUMN "new_owner_id" SET NOT NULL;

ALTER TABLE "shelf_matches" ADD COLUMN "new_listing_id" INTEGER;
ALTER TABLE "shelf_matches" ADD COLUMN "new_requester_id" INTEGER;
UPDATE "shelf_matches" AS match
SET "new_listing_id" = listing."new_id"
FROM "shelf_listings" AS listing
WHERE match."listing_id" = listing."id";
UPDATE "shelf_matches" AS match
SET "new_requester_id" = requester."new_id"
FROM "users" AS requester
WHERE match."requester_id" = requester."id";
ALTER TABLE "shelf_matches" ALTER COLUMN "new_listing_id" SET NOT NULL;
ALTER TABLE "shelf_matches" ALTER COLUMN "new_requester_id" SET NOT NULL;

-- Remove constraints and indexes that reference the UUID columns.
ALTER TABLE "shelf_matches" DROP CONSTRAINT "shelf_matches_listing_id_fkey";
ALTER TABLE "shelf_matches" DROP CONSTRAINT "shelf_matches_requester_id_fkey";
ALTER TABLE "shelf_listings" DROP CONSTRAINT "shelf_listings_owner_id_fkey";
ALTER TABLE "shelf_matches" DROP CONSTRAINT "shelf_matches_pkey";
ALTER TABLE "shelf_listings" DROP CONSTRAINT "shelf_listings_pkey";
ALTER TABLE "users" DROP CONSTRAINT "users_pkey";
DROP INDEX "shelf_matches_listing_id_key";
DROP INDEX "shelf_matches_requester_id_created_at_idx";
DROP INDEX "shelf_listings_owner_id_idx";
DROP INDEX "shelf_listings_status_created_at_idx";

-- Replace UUID IDs and foreign keys with the generated integer columns.
ALTER TABLE "shelf_matches"
  DROP COLUMN "id",
  DROP COLUMN "listing_id",
  DROP COLUMN "requester_id";
ALTER TABLE "shelf_listings"
  DROP COLUMN "id",
  DROP COLUMN "owner_id";
ALTER TABLE "users" DROP COLUMN "id";

ALTER TABLE "users" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "shelf_listings" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "shelf_listings" RENAME COLUMN "new_owner_id" TO "owner_id";
ALTER TABLE "shelf_matches" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "shelf_matches" RENAME COLUMN "new_listing_id" TO "listing_id";
ALTER TABLE "shelf_matches" RENAME COLUMN "new_requester_id" TO "requester_id";

ALTER SEQUENCE "users_new_id_seq" RENAME TO "users_id_seq";
ALTER SEQUENCE "shelf_listings_new_id_seq" RENAME TO "shelf_listings_id_seq";
ALTER SEQUENCE "shelf_matches_new_id_seq" RENAME TO "shelf_matches_id_seq";

-- Restore the Prisma constraints and indexes using their original names.
ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
ALTER TABLE "shelf_listings" ADD CONSTRAINT "shelf_listings_pkey" PRIMARY KEY ("id");
ALTER TABLE "shelf_matches" ADD CONSTRAINT "shelf_matches_pkey" PRIMARY KEY ("id");
CREATE INDEX "shelf_listings_owner_id_idx" ON "shelf_listings"("owner_id");
CREATE INDEX "shelf_listings_status_created_at_idx" ON "shelf_listings"("status", "created_at");
CREATE UNIQUE INDEX "shelf_matches_listing_id_key" ON "shelf_matches"("listing_id");
CREATE INDEX "shelf_matches_requester_id_created_at_idx" ON "shelf_matches"("requester_id", "created_at");
ALTER TABLE "shelf_listings" ADD CONSTRAINT "shelf_listings_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "shelf_matches" ADD CONSTRAINT "shelf_matches_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "shelf_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "shelf_matches" ADD CONSTRAINT "shelf_matches_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
