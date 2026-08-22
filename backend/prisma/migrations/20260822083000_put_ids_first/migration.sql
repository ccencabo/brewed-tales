BEGIN;

-- PostgreSQL stores column order at table creation time and cannot reorder
-- columns in place. Rebuild the tables so their physical order matches the
-- Prisma models while preserving every row and the auto-increment behavior.

-- Remove relationship constraints and schema-wide index names before the old
-- tables are renamed. They are recreated on the new tables below.
ALTER TABLE "shelf_matches" DROP CONSTRAINT "shelf_matches_listing_id_fkey";
ALTER TABLE "shelf_matches" DROP CONSTRAINT "shelf_matches_requester_id_fkey";
ALTER TABLE "shelf_listings" DROP CONSTRAINT "shelf_listings_owner_id_fkey";

DROP INDEX "users_email_key";
DROP INDEX "shelf_listings_owner_id_idx";
DROP INDEX "shelf_listings_status_created_at_idx";
DROP INDEX "shelf_matches_listing_id_key";
DROP INDEX "shelf_matches_requester_id_created_at_idx";

ALTER TABLE "users" DROP CONSTRAINT "users_pkey";
ALTER TABLE "shelf_listings" DROP CONSTRAINT "shelf_listings_pkey";
ALTER TABLE "shelf_matches" DROP CONSTRAINT "shelf_matches_pkey";

ALTER TABLE "users" RENAME TO "users_before_column_reorder";
ALTER TABLE "shelf_listings" RENAME TO "shelf_listings_before_column_reorder";
ALTER TABLE "shelf_matches" RENAME TO "shelf_matches_before_column_reorder";

-- Free the standard sequence names for the replacement SERIAL columns. The
-- legacy sequences remain attached to the old tables until those are dropped.
ALTER SEQUENCE "users_id_seq" RENAME TO "users_before_column_reorder_id_seq";
ALTER SEQUENCE "shelf_listings_id_seq" RENAME TO "shelf_listings_before_column_reorder_id_seq";
ALTER SEQUENCE "shelf_matches_id_seq" RENAME TO "shelf_matches_before_column_reorder_id_seq";

CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "display_name" VARCHAR(80) NOT NULL,
    "password_hash" VARCHAR(255),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "shelf_listings" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "cover_color" VARCHAR(50) NOT NULL,
    "emoji" VARCHAR(16) NOT NULL,
    "hook1" VARCHAR(280) NOT NULL,
    "hook2" VARCHAR(280) NOT NULL,
    "hook3" VARCHAR(280) NOT NULL,
    "ingredients" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "match_tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "ShelfListingStatus" NOT NULL DEFAULT 'AVAILABLE',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "shelf_listings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "shelf_matches" (
    "id" SERIAL NOT NULL,
    "listing_id" INTEGER NOT NULL,
    "requester_id" INTEGER NOT NULL,
    "preference_tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "ShelfMatchStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "shelf_matches_pkey" PRIMARY KEY ("id")
);

INSERT INTO "users" (
    "id", "email", "display_name", "password_hash", "created_at", "updated_at"
)
SELECT
    "id", "email", "display_name", "password_hash", "created_at", "updated_at"
FROM "users_before_column_reorder";

INSERT INTO "shelf_listings" (
    "id", "owner_id", "cover_color", "emoji", "hook1", "hook2", "hook3",
    "ingredients", "match_tags", "status", "created_at", "updated_at"
)
SELECT
    "id", "owner_id", "cover_color", "emoji", "hook1", "hook2", "hook3",
    "ingredients", "match_tags", "status", "created_at", "updated_at"
FROM "shelf_listings_before_column_reorder";

INSERT INTO "shelf_matches" (
    "id", "listing_id", "requester_id", "preference_tags", "status", "created_at", "updated_at"
)
SELECT
    "id", "listing_id", "requester_id", "preference_tags", "status", "created_at", "updated_at"
FROM "shelf_matches_before_column_reorder";

-- Continue each sequence after the greatest preserved ID. The third argument
-- keeps an empty table's first generated value at 1.
SELECT setval(
    pg_get_serial_sequence('"users"', 'id'),
    COALESCE((SELECT MAX("id") FROM "users"), 1),
    EXISTS (SELECT 1 FROM "users")
);
SELECT setval(
    pg_get_serial_sequence('"shelf_listings"', 'id'),
    COALESCE((SELECT MAX("id") FROM "shelf_listings"), 1),
    EXISTS (SELECT 1 FROM "shelf_listings")
);
SELECT setval(
    pg_get_serial_sequence('"shelf_matches"', 'id'),
    COALESCE((SELECT MAX("id") FROM "shelf_matches"), 1),
    EXISTS (SELECT 1 FROM "shelf_matches")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "shelf_listings_owner_id_idx" ON "shelf_listings"("owner_id");
CREATE INDEX "shelf_listings_status_created_at_idx" ON "shelf_listings"("status", "created_at");
CREATE UNIQUE INDEX "shelf_matches_listing_id_key" ON "shelf_matches"("listing_id");
CREATE INDEX "shelf_matches_requester_id_created_at_idx" ON "shelf_matches"("requester_id", "created_at");

ALTER TABLE "shelf_listings"
ADD CONSTRAINT "shelf_listings_owner_id_fkey"
FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "shelf_matches"
ADD CONSTRAINT "shelf_matches_listing_id_fkey"
FOREIGN KEY ("listing_id") REFERENCES "shelf_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "shelf_matches"
ADD CONSTRAINT "shelf_matches_requester_id_fkey"
FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

DROP TABLE "shelf_matches_before_column_reorder";
DROP TABLE "shelf_listings_before_column_reorder";
DROP TABLE "users_before_column_reorder";

COMMIT;
