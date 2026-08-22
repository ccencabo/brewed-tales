import type { ShelfListing, ShelfMatch } from '../generated/prisma/client';
import { ShelfMatchStatus } from '../generated/prisma/enums';

export type ExchangeRecord = ShelfMatch & {
  requester: {
    id: number;
    displayName: string;
    email: string;
  };
  listing: ShelfListing & {
    owner: {
      id: number;
      displayName: string;
      email: string;
    };
  };
};

export interface ExchangeResponse {
  id: number;
  role: 'owner' | 'requester';
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  listing: {
    id: number;
    emoji: string;
    coverColor: string;
    hooks: [string, string, string];
    ingredients: string[];
  };
  counterparty: {
    displayName: string;
    email: string | null;
  };
  completion: {
    owner: boolean;
    requester: boolean;
  };
  actionRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function presentStatus(status: ShelfMatchStatus): ExchangeResponse['status'] {
  if (status === ShelfMatchStatus.ACTIVE) return 'accepted';
  return status.toLowerCase() as ExchangeResponse['status'];
}

export function presentExchange(
  exchange: ExchangeRecord,
  currentUserId: number,
): ExchangeResponse {
  const role =
    exchange.listing.ownerId === currentUserId ? 'owner' : 'requester';
  const counterparty =
    role === 'owner' ? exchange.requester : exchange.listing.owner;
  const revealContact =
    exchange.status === ShelfMatchStatus.ACTIVE ||
    exchange.status === ShelfMatchStatus.COMPLETED;

  return {
    id: exchange.id,
    role,
    status: presentStatus(exchange.status),
    listing: {
      id: exchange.listing.id,
      emoji: exchange.listing.emoji,
      coverColor: exchange.listing.coverColor,
      hooks: [
        exchange.listing.hook1,
        exchange.listing.hook2,
        exchange.listing.hook3,
      ],
      ingredients: exchange.listing.ingredients,
    },
    counterparty: {
      displayName: counterparty.displayName,
      email: revealContact ? counterparty.email : null,
    },
    completion: {
      owner: Boolean(exchange.ownerCompletedAt),
      requester: Boolean(exchange.requesterCompletedAt),
    },
    actionRequired:
      role === 'owner' && exchange.status === ShelfMatchStatus.PENDING,
    createdAt: exchange.createdAt,
    updatedAt: exchange.updatedAt,
  };
}
