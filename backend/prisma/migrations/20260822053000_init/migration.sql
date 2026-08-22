-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ShelfListingStatus" AS ENUM ('AVAILABLE', 'MATCHED', 'REMOVED');

-- CreateEnum
CREATE TYPE "ShelfMatchStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "display_name" VARCHAR(80) NOT NULL,
    "password_hash" VARCHAR(255),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shelf_listings" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
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

-- CreateTable
CREATE TABLE "shelf_matches" (
    "id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "requester_id" UUID NOT NULL,
    "preference_tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "ShelfMatchStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "shelf_matches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "shelf_listings_owner_id_idx" ON "shelf_listings"("owner_id");

-- CreateIndex
CREATE INDEX "shelf_listings_status_created_at_idx" ON "shelf_listings"("status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "shelf_matches_listing_id_key" ON "shelf_matches"("listing_id");

-- CreateIndex
CREATE INDEX "shelf_matches_requester_id_created_at_idx" ON "shelf_matches"("requester_id", "created_at");

-- AddForeignKey
ALTER TABLE "shelf_listings" ADD CONSTRAINT "shelf_listings_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelf_matches" ADD CONSTRAINT "shelf_matches_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "shelf_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelf_matches" ADD CONSTRAINT "shelf_matches_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
