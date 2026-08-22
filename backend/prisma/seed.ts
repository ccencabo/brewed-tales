import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to seed the database');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

const readers = [
  { email: 'reader1@example.com', displayName: 'Alice' },
  { email: 'reader2@example.com', displayName: 'Ben' },
  { email: 'reader3@example.com', displayName: 'Mina' },
];

const listingProfiles = [
  {
    ownerEmail: readers[0].email,
    coverColor: 'bg-sage',
    emoji: '🌿',
    hook1: 'A secluded cabin in the woods...',
    hook2: 'Someone is watching from the trees.',
    hook3: 'The protagonist has a dark secret.',
    ingredients: ['matcha', 'honey'],
    matchTags: ['mystery', 'tense', 'secrets', 'atmospheric', 'twisty'],
  },
  {
    ownerEmail: readers[1].email,
    coverColor: 'bg-dusty-rose',
    emoji: '💌',
    hook1: 'Enemies who must share one horse.',
    hook2: 'A kingdom on the brink of war.',
    hook3: 'They slowly realize they are soulmates.',
    ingredients: ['earl grey', 'lavender'],
    matchTags: ['romance', 'heartfelt', 'adventure', 'character', 'slow-burn'],
  },
  {
    ownerEmail: readers[2].email,
    coverColor: 'bg-warm',
    emoji: '🐉',
    hook1: 'A map that redraws itself every midnight.',
    hook2: 'A reluctant hero with a very opinionated dragon.',
    hook3: 'The last door home may already be closing.',
    ingredients: ['spiced chai', 'orange peel'],
    matchTags: ['fantasy', 'adventure', 'escape', 'fast', 'witty'],
  },
];

async function seed(): Promise<void> {
  const readerIds = new Map<string, number>();

  for (const reader of readers) {
    const savedReader = await prisma.user.upsert({
      where: { email: reader.email },
      update: { displayName: reader.displayName },
      create: reader,
    });
    readerIds.set(savedReader.email, savedReader.id);
  }

  for (const profile of listingProfiles) {
    const ownerId = readerIds.get(profile.ownerEmail);
    if (!ownerId)
      throw new Error(`Seed owner not found: ${profile.ownerEmail}`);

    const data = {
      ownerId,
      coverColor: profile.coverColor,
      emoji: profile.emoji,
      hook1: profile.hook1,
      hook2: profile.hook2,
      hook3: profile.hook3,
      ingredients: profile.ingredients,
      matchTags: profile.matchTags,
    };
    const existing = await prisma.shelfListing.findFirst({
      where: { ownerId, hook1: profile.hook1 },
      select: { id: true },
    });

    if (existing) {
      await prisma.shelfListing.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await prisma.shelfListing.create({ data });
    }
  }

  console.log(
    `Seeded ${readers.length} readers and ${listingProfiles.length} shelf listings.`,
  );
}

seed()
  .then(() => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exitCode = 1;
  });
