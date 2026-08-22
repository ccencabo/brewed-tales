import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  ShelfListingStatus,
  ShelfMatchStatus,
} from '../generated/prisma/enums';
import { LibraryService } from './library.service';

describe('LibraryService', () => {
  const savedBookFindMany = jest.fn();
  const savedBookUpsert = jest.fn();
  const savedBookDeleteMany = jest.fn();
  const shelfMatchFindMany = jest.fn();
  const shelfMatchFindFirst = jest.fn();
  const shelfMatchUpdate = jest.fn();
  const shelfListingUpdateMany = jest.fn();
  const transactionClient = {
    shelfMatch: { findFirst: shelfMatchFindFirst, update: shelfMatchUpdate },
    shelfListing: { updateMany: shelfListingUpdateMany },
  };
  const transaction = jest.fn(
    (callback: (client: typeof transactionClient) => unknown) =>
      Promise.resolve(callback(transactionClient)),
  );
  const prisma = {
    savedBook: {
      findMany: savedBookFindMany,
      upsert: savedBookUpsert,
      deleteMany: savedBookDeleteMany,
    },
    shelfMatch: { findMany: shelfMatchFindMany },
    $transaction: transaction,
  } as unknown as PrismaService;
  const service = new LibraryService(prisma);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('upserts a recommendation within the authenticated user library', async () => {
    const saved = {
      id: 3,
      userId: 42,
      externalBookId: 'google-123',
      title: 'A Book',
      author: 'An Author',
      emoji: '📖',
      coverColor: 'bg-primary',
      coverUrl: null,
      clue1: 'First clue',
      clue2: 'Second clue',
      clue3: 'Third clue',
      ingredients: ['honey'],
      createdAt: new Date('2026-08-22T00:00:00.000Z'),
      updatedAt: new Date('2026-08-22T00:00:00.000Z'),
    };
    savedBookUpsert.mockResolvedValue(saved);

    await service.saveBook(42, {
      externalBookId: saved.externalBookId,
      title: saved.title,
      author: saved.author,
      emoji: saved.emoji,
      coverColor: saved.coverColor,
      clues: [saved.clue1, saved.clue2, saved.clue3],
      ingredients: saved.ingredients,
    });

    expect(savedBookUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId_externalBookId: {
            userId: 42,
            externalBookId: saved.externalBookId,
          },
        },
      }),
    );
  });

  it('does not remove another user saved book', async () => {
    savedBookDeleteMany.mockResolvedValue({ count: 0 });

    await expect(service.removeSavedBook(3, 42)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(savedBookDeleteMany).toHaveBeenCalledWith({
      where: { id: 3, userId: 42 },
    });
  });

  it('cancels the requester match and returns the listing to the shelf', async () => {
    shelfMatchFindFirst.mockResolvedValue({ id: 8, listingId: 5 });
    shelfMatchUpdate.mockResolvedValue({ id: 8 });
    shelfListingUpdateMany.mockResolvedValue({ count: 1 });

    await service.removeShelfMatch(8, 42);

    expect(shelfMatchFindFirst).toHaveBeenCalledWith({
      where: { id: 8, requesterId: 42, status: ShelfMatchStatus.ACTIVE },
      select: { id: true, listingId: true },
    });
    expect(shelfMatchUpdate).toHaveBeenCalledWith({
      where: { id: 8 },
      data: {
        status: ShelfMatchStatus.CANCELLED,
        // Jest asymmetric matchers are intentionally untyped at runtime.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        cancelledAt: expect.any(Date),
      },
    });
    expect(shelfListingUpdateMany).toHaveBeenCalledWith({
      where: { id: 5, status: ShelfListingStatus.MATCHED },
      data: { status: ShelfListingStatus.AVAILABLE },
    });
  });
});
