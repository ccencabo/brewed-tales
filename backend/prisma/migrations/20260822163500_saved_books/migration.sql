CREATE TABLE "saved_books" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "external_book_id" VARCHAR(255) NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "author" VARCHAR(200) NOT NULL,
    "emoji" VARCHAR(16) NOT NULL,
    "cover_color" VARCHAR(50) NOT NULL,
    "cover_url" VARCHAR(1000),
    "clue1" VARCHAR(500) NOT NULL,
    "clue2" VARCHAR(500) NOT NULL,
    "clue3" VARCHAR(500) NOT NULL,
    "ingredients" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "saved_books_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "saved_books_user_id_external_book_id_key"
ON "saved_books"("user_id", "external_book_id");

CREATE INDEX "saved_books_user_id_created_at_idx"
ON "saved_books"("user_id", "created_at");

ALTER TABLE "saved_books"
ADD CONSTRAINT "saved_books_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
