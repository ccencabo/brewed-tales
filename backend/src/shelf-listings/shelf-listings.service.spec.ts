import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ShelfListingStatus } from '../generated/prisma/enums';
import { presentShelfListing } from './shelf-listing.presenter';
import { ShelfListingsService } from './shelf-listings.service';

const listing = {
  id: 1,
  ownerId: 10,
  coverColor: 'bg-sage',
  emoji: '🌿',
  hook1: 'First hint',
  hook2: 'Second hint',
  hook3: 'Third hint',
  publicationYear: 1994,
  ingredients: ['matcha', 'honey'],
  matchTags: ['mystery', 'atmospheric'],
  status: ShelfListingStatus.AVAILABLE,
  createdAt: new Date('2026-08-22T00:00:00.000Z'),
  updatedAt: new Date('2026-08-22T00:00:00.000Z'),
  owner: {
    id: 10,
    displayName: 'Alice',
  },
};

describe('ShelfListingsService', () => {
  const findMany = jest.fn();
  const findFirst = jest.fn();
  const findUnique = jest.fn();
  const createListing = jest.fn();
  const update = jest.fn();
  const updateMany = jest.fn();
  const createMatch = jest.fn();
  const transactionClient = {
    shelfListing: { findUnique, updateMany },
    shelfMatch: { create: createMatch },
  };
  const transaction = jest.fn(
    (callback: (client: typeof transactionClient) => unknown) =>
      Promise.resolve(callback(transactionClient)),
  );
  const prisma = {
    shelfListing: {
      findMany,
      findFirst,
      findUnique,
      create: createListing,
      update,
      updateMany,
    },
    shelfMatch: { create: createMatch },
    $transaction: transaction,
  } as unknown as PrismaService;
  const service = new ShelfListingsService(prisma);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists available shelf books by default', async () => {
    findMany.mockResolvedValue([listing]);

    await expect(service.findAll({})).resolves.toEqual([listing]);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: ShelfListingStatus.AVAILABLE },
      }),
    );
  });

  it('throws when a shelf listing cannot be found', async () => {
    findFirst.mockResolvedValue(null);

    await expect(service.findOne(listing.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('presents public fields and current-user ownership', () => {
    const response = presentShelfListing(listing, listing.ownerId);

    expect(response).toEqual({
      id: listing.id,
      coverColor: listing.coverColor,
      emoji: listing.emoji,
      hooks: [listing.hook1, listing.hook2, listing.hook3],
      publicationYear: listing.publicationYear,
      ingredients: listing.ingredients,
      owner: { displayName: listing.owner.displayName },
      isOwner: true,
      status: listing.status,
      createdAt: listing.createdAt,
    });
    expect(response).not.toHaveProperty('ownerId');
    expect(response).not.toHaveProperty('matchTags');
  });

  it('creates a listing for the authenticated owner', async () => {
    createListing.mockResolvedValue(listing);

    await service.create(listing.ownerId, {
      coverColor: listing.coverColor,
      emoji: listing.emoji,
      hooks: [listing.hook1, listing.hook2, listing.hook3],
      publicationYear: listing.publicationYear,
      ingredients: listing.ingredients,
    });

    expect(createListing).toHaveBeenCalledWith(
      expect.objectContaining({
        // Jest asymmetric matchers are intentionally untyped at runtime.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: expect.objectContaining({ ownerId: listing.ownerId }),
      }),
    );
  });

  it('prevents a different user from removing a listing', async () => {
    findUnique.mockResolvedValue({
      ownerId: listing.ownerId,
      status: ShelfListingStatus.AVAILABLE,
    });

    await expect(service.remove(listing.id, 99)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(update).not.toHaveBeenCalled();
  });

  it('prevents an owner from removing a matched listing', async () => {
    findUnique.mockResolvedValue({
      ownerId: listing.ownerId,
      status: ShelfListingStatus.MATCHED,
    });

    await expect(
      service.remove(listing.id, listing.ownerId),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('prevents a reader from claiming their own listing', async () => {
    findUnique.mockResolvedValue({
      ...listing,
      owner: { ...listing.owner, email: 'alice@example.com' },
    });

    await expect(
      service.claim(listing.id, listing.ownerId, {}),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(updateMany).not.toHaveBeenCalled();
  });

  it('creates a pending claim without revealing owner contact', async () => {
    findUnique.mockResolvedValue({
      ...listing,
      owner: { ...listing.owner, email: 'alice@example.com' },
    });
    updateMany.mockResolvedValue({ count: 1 });
    createMatch.mockResolvedValue({
      id: 7,
      listingId: listing.id,
      requesterId: 99,
      preferenceTags: ['cozy'],
      status: 'PENDING',
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
    });

    await expect(
      service.claim(listing.id, 99, { preferenceTags: ['cozy'] }),
    ).resolves.toEqual({
      id: 7,
      listingId: listing.id,
      owner: { displayName: 'Alice' },
      status: 'pending',
      createdAt: listing.createdAt,
    });
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: listing.id, status: ShelfListingStatus.AVAILABLE },
      data: { status: ShelfListingStatus.MATCHED },
    });
  });
});
