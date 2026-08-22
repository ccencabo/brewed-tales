import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ShelfMatchStatus,
  ShelfListingStatus,
} from '../generated/prisma/enums';
import { PrismaService } from '../database/prisma.service';
import { CreateSavedBookDto } from './dto/create-saved-book.dto';
import {
  presentSavedBook,
  presentShelfMatch,
  type LibraryItem,
  type SavedBookLibraryItem,
} from './library.presenter';

@Injectable()
export class LibraryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number): Promise<LibraryItem[]> {
    const [books, matches] = await Promise.all([
      this.prisma.savedBook.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.shelfMatch.findMany({
        where: {
          requesterId: userId,
          status: { in: [ShelfMatchStatus.ACTIVE, ShelfMatchStatus.COMPLETED] },
        },
        include: {
          listing: {
            include: {
              owner: { select: { displayName: true, email: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return [
      ...books.map(presentSavedBook),
      ...matches.map(presentShelfMatch),
    ].sort(
      (left, right) => right.createdAt.getTime() - left.createdAt.getTime(),
    );
  }

  async saveBook(
    userId: number,
    input: CreateSavedBookDto,
  ): Promise<SavedBookLibraryItem> {
    const book = await this.prisma.savedBook.upsert({
      where: {
        userId_externalBookId: {
          userId,
          externalBookId: input.externalBookId,
        },
      },
      create: {
        userId,
        externalBookId: input.externalBookId,
        title: input.title,
        author: input.author,
        emoji: input.emoji,
        coverColor: input.coverColor,
        coverUrl: input.coverUrl,
        clue1: input.clues[0],
        clue2: input.clues[1],
        clue3: input.clues[2],
        ingredients: input.ingredients,
      },
      update: {
        title: input.title,
        author: input.author,
        emoji: input.emoji,
        coverColor: input.coverColor,
        coverUrl: input.coverUrl,
        clue1: input.clues[0],
        clue2: input.clues[1],
        clue3: input.clues[2],
        ingredients: input.ingredients,
      },
    });

    return presentSavedBook(book);
  }

  async removeSavedBook(id: number, userId: number): Promise<void> {
    const removed = await this.prisma.savedBook.deleteMany({
      where: { id, userId },
    });
    if (removed.count !== 1) {
      throw new NotFoundException('Saved book not found');
    }
  }

  async removeShelfMatch(id: number, userId: number): Promise<void> {
    await this.prisma.$transaction(async (transaction) => {
      const match = await transaction.shelfMatch.findFirst({
        where: { id, requesterId: userId, status: ShelfMatchStatus.ACTIVE },
        select: { id: true, listingId: true },
      });
      if (!match) {
        throw new NotFoundException('Shelf match not found');
      }

      await transaction.shelfMatch.update({
        where: { id: match.id },
        data: { status: ShelfMatchStatus.CANCELLED, cancelledAt: new Date() },
      });
      await transaction.shelfListing.updateMany({
        where: { id: match.listingId, status: ShelfListingStatus.MATCHED },
        data: { status: ShelfListingStatus.AVAILABLE },
      });
    });
  }
}
