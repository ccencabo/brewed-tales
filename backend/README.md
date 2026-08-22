# Brewed Tales API

NestJS and PostgreSQL backend for Brewed Tales. Prisma owns the database schema and migrations.

## Requirements

- Node.js 20 or newer
- Docker Desktop

## Local setup

```powershell
npm install
Copy-Item .env.example .env
docker compose up -d database
npm run db:deploy
npm run db:seed
npm run start:dev
```

The API is available at `http://localhost:3000/api/v1` and accepts requests from the Vite frontend at `http://localhost:5173` by default.

## Database commands

```powershell
npm run db:generate
npm run db:migrate -- --name describe_your_change
npm run db:deploy
npm run db:seed
npm run db:studio
```

- `db:generate` regenerates the typed Prisma client after schema changes.
- `db:migrate` creates and applies a migration during local development.
- `db:deploy` applies committed migrations without creating new ones.
- `db:seed` upserts the local sample readers and shelf listings.
- `db:studio` opens Prisma's local database browser.

## Public shelf endpoints

```text
GET /api/v1/shelf-listings
GET /api/v1/shelf-listings/:id
```

The list endpoint returns available listings by default. Pass a valid `status` query value to request another state. Public responses exclude owner IDs, email addresses, password hashes, and internal matching tags.

## Initial data model

- `User` owns shelf listings and requests shelf matches.
- `ShelfListing` stores the three spoiler-free hooks, visual wrapping data, tea notes, matching tags, and availability status.
- `ShelfMatch` records one unique claim per listing and the preference tags used to select it.

Public listing responses must not expose the owner's email. Contact information should only be returned after an authenticated match is successfully claimed.
