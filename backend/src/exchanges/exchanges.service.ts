import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  ShelfListingStatus,
  ShelfMatchStatus,
} from '../generated/prisma/enums';
import {
  presentExchange,
  type ExchangeRecord,
  type ExchangeResponse,
} from './exchange.presenter';

const exchangeInclude = {
  requester: { select: { id: true, displayName: true, email: true } },
  listing: {
    include: {
      owner: { select: { id: true, displayName: true, email: true } },
    },
  },
} as const;

@Injectable()
export class ExchangesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number): Promise<ExchangeResponse[]> {
    const exchanges = await this.prisma.shelfMatch.findMany({
      where: {
        OR: [{ requesterId: userId }, { listing: { ownerId: userId } }],
      },
      include: exchangeInclude,
      orderBy: { createdAt: 'desc' },
    });
    return exchanges.map((exchange) => presentExchange(exchange, userId));
  }

  accept(id: number, userId: number): Promise<ExchangeResponse> {
    return this.prisma.$transaction(async (transaction) => {
      const exchange = await transaction.shelfMatch.findUnique({
        where: { id },
        include: exchangeInclude,
      });
      this.requireOwnerPending(exchange, userId);

      const changed = await transaction.shelfMatch.updateMany({
        where: { id, status: ShelfMatchStatus.PENDING },
        data: { status: ShelfMatchStatus.ACTIVE, respondedAt: new Date() },
      });
      if (changed.count !== 1) {
        throw new ConflictException(
          'This exchange request has already been answered',
        );
      }
      const updated = await transaction.shelfMatch.findUniqueOrThrow({
        where: { id },
        include: exchangeInclude,
      });
      return presentExchange(updated, userId);
    });
  }

  decline(id: number, userId: number): Promise<ExchangeResponse> {
    return this.prisma.$transaction(async (transaction) => {
      const exchange = await transaction.shelfMatch.findUnique({
        where: { id },
        include: exchangeInclude,
      });
      this.requireOwnerPending(exchange, userId);

      const now = new Date();
      const changed = await transaction.shelfMatch.updateMany({
        where: { id, status: ShelfMatchStatus.PENDING },
        data: {
          status: ShelfMatchStatus.CANCELLED,
          respondedAt: now,
          cancelledAt: now,
        },
      });
      if (changed.count !== 1) {
        throw new ConflictException(
          'This exchange request has already been answered',
        );
      }
      const updated = await transaction.shelfMatch.findUniqueOrThrow({
        where: { id },
        include: exchangeInclude,
      });
      await transaction.shelfListing.updateMany({
        where: { id: updated.listingId, status: ShelfListingStatus.MATCHED },
        data: { status: ShelfListingStatus.AVAILABLE },
      });
      return presentExchange(updated, userId);
    });
  }

  cancel(id: number, userId: number): Promise<ExchangeResponse> {
    return this.prisma.$transaction(async (transaction) => {
      const exchange = await transaction.shelfMatch.findUnique({
        where: { id },
        include: exchangeInclude,
      });
      this.requireParticipant(exchange, userId);
      if (
        exchange.status !== ShelfMatchStatus.PENDING &&
        exchange.status !== ShelfMatchStatus.ACTIVE
      ) {
        throw new ConflictException('This exchange can no longer be cancelled');
      }

      const changed = await transaction.shelfMatch.updateMany({
        where: {
          id,
          status: { in: [ShelfMatchStatus.PENDING, ShelfMatchStatus.ACTIVE] },
        },
        data: { status: ShelfMatchStatus.CANCELLED, cancelledAt: new Date() },
      });
      if (changed.count !== 1) {
        throw new ConflictException('This exchange can no longer be cancelled');
      }
      const updated = await transaction.shelfMatch.findUniqueOrThrow({
        where: { id },
        include: exchangeInclude,
      });
      await transaction.shelfListing.updateMany({
        where: { id: updated.listingId, status: ShelfListingStatus.MATCHED },
        data: { status: ShelfListingStatus.AVAILABLE },
      });
      return presentExchange(updated, userId);
    });
  }

  complete(id: number, userId: number): Promise<ExchangeResponse> {
    return this.prisma.$transaction(async (transaction) => {
      const exchange = await transaction.shelfMatch.findUnique({
        where: { id },
        include: exchangeInclude,
      });
      this.requireParticipant(exchange, userId);
      if (exchange.status !== ShelfMatchStatus.ACTIVE) {
        throw new ConflictException(
          'Only an accepted exchange can be completed',
        );
      }

      const isOwner = exchange.listing.ownerId === userId;
      const changed = await transaction.shelfMatch.updateMany({
        where: { id, status: ShelfMatchStatus.ACTIVE },
        data: isOwner
          ? { ownerCompletedAt: exchange.ownerCompletedAt ?? new Date() }
          : {
              requesterCompletedAt: exchange.requesterCompletedAt ?? new Date(),
            },
      });
      if (changed.count !== 1) {
        throw new ConflictException(
          'Only an accepted exchange can be completed',
        );
      }

      const completion = await transaction.shelfMatch.findUniqueOrThrow({
        where: { id },
        include: exchangeInclude,
      });
      if (completion.ownerCompletedAt && completion.requesterCompletedAt) {
        const completed = await transaction.shelfMatch.update({
          where: { id },
          data: { status: ShelfMatchStatus.COMPLETED },
          include: exchangeInclude,
        });
        await transaction.shelfListing.update({
          where: { id: completed.listingId },
          data: { status: ShelfListingStatus.REMOVED },
        });
        return presentExchange(completed, userId);
      }

      return presentExchange(completion, userId);
    });
  }

  private requireOwnerPending(
    exchange: ExchangeRecord | null,
    userId: number,
  ): asserts exchange is ExchangeRecord {
    if (!exchange) throw new NotFoundException('Exchange not found');
    if (exchange.listing.ownerId !== userId) {
      throw new ForbiddenException('Only the book owner can respond');
    }
    if (exchange.status !== ShelfMatchStatus.PENDING) {
      throw new ConflictException(
        'This exchange request has already been answered',
      );
    }
  }

  private requireParticipant(
    exchange: ExchangeRecord | null,
    userId: number,
  ): asserts exchange is ExchangeRecord {
    if (!exchange) throw new NotFoundException('Exchange not found');
    if (
      exchange.requesterId !== userId &&
      exchange.listing.ownerId !== userId
    ) {
      throw new ForbiddenException('You are not part of this exchange');
    }
  }
}
