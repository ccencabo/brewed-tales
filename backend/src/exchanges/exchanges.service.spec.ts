import { ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  ShelfListingStatus,
  ShelfMatchStatus,
} from '../generated/prisma/enums';
import { presentExchange, type ExchangeRecord } from './exchange.presenter';
import { ExchangesService } from './exchanges.service';

const now = new Date('2026-08-22T00:00:00.000Z');
const exchange: ExchangeRecord = {
  id: 5,
  listingId: 11,
  requesterId: 20,
  preferenceTags: ['cozy'],
  status: ShelfMatchStatus.PENDING,
  respondedAt: null,
  ownerCompletedAt: null,
  requesterCompletedAt: null,
  cancelledAt: null,
  createdAt: now,
  updatedAt: now,
  requester: {
    id: 20,
    displayName: 'Requester',
    email: 'requester@example.com',
  },
  listing: {
    id: 11,
    ownerId: 10,
    coverColor: 'bg-sage',
    emoji: '📗',
    hook1: 'First hook',
    hook2: 'Second hook',
    hook3: 'Third hook',
    ingredients: ['honey'],
    matchTags: ['cozy'],
    status: ShelfListingStatus.MATCHED,
    createdAt: now,
    updatedAt: now,
    owner: { id: 10, displayName: 'Owner', email: 'owner@example.com' },
  },
};

describe('ExchangesService', () => {
  const findMany = jest.fn();
  const findUnique = jest.fn();
  const findUniqueOrThrow = jest.fn();
  const updateMatch = jest.fn();
  const updateMatches = jest.fn();
  const updateListing = jest.fn();
  const updateListings = jest.fn();
  const transactionClient = {
    shelfMatch: {
      findUnique,
      findUniqueOrThrow,
      update: updateMatch,
      updateMany: updateMatches,
    },
    shelfListing: { update: updateListing, updateMany: updateListings },
  };
  const transaction = jest.fn(
    (callback: (client: typeof transactionClient) => unknown) =>
      Promise.resolve(callback(transactionClient)),
  );
  const prisma = {
    shelfMatch: { findMany },
    $transaction: transaction,
  } as unknown as PrismaService;
  const service = new ExchangesService(prisma);

  beforeEach(() => jest.clearAllMocks());

  it('hides contact details while an exchange is pending', () => {
    const response = presentExchange(exchange, exchange.listing.ownerId);
    expect(response.counterparty).toEqual({
      displayName: 'Requester',
      email: null,
    });
    expect(response.actionRequired).toBe(true);
  });

  it('prevents the requester from accepting their own request', async () => {
    findUnique.mockResolvedValue(exchange);
    await expect(
      service.accept(exchange.id, exchange.requesterId),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(updateMatches).not.toHaveBeenCalled();
  });

  it('lets the owner accept and then reveals contact details', async () => {
    findUnique.mockResolvedValue(exchange);
    updateMatches.mockResolvedValue({ count: 1 });
    findUniqueOrThrow.mockResolvedValue({
      ...exchange,
      status: ShelfMatchStatus.ACTIVE,
    });

    const response = await service.accept(
      exchange.id,
      exchange.listing.ownerId,
    );
    expect(response.status).toBe('accepted');
    expect(response.counterparty.email).toBe(exchange.requester.email);
  });

  it('prevents a non-participant from cancelling an exchange', async () => {
    findUnique.mockResolvedValue(exchange);
    await expect(service.cancel(exchange.id, 999)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('completes the exchange after both readers confirm', async () => {
    const accepted = {
      ...exchange,
      status: ShelfMatchStatus.ACTIVE,
      ownerCompletedAt: now,
    };
    const bothConfirmed = { ...accepted, requesterCompletedAt: now };
    findUnique.mockResolvedValue(accepted);
    findUniqueOrThrow.mockResolvedValue(bothConfirmed);
    updateMatches.mockResolvedValue({ count: 1 });
    updateMatch.mockResolvedValue({
      ...bothConfirmed,
      status: ShelfMatchStatus.COMPLETED,
    });
    updateListing.mockResolvedValue({});

    const response = await service.complete(exchange.id, exchange.requesterId);
    expect(response.status).toBe('completed');
    expect(updateListing).toHaveBeenCalledWith({
      where: { id: exchange.listingId },
      data: { status: ShelfListingStatus.REMOVED },
    });
  });
});
