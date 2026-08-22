import type { ShelfListing } from '../generated/prisma/client';

type ShelfListingWithOwner = ShelfListing & {
  owner: {
    id: number;
    displayName: string;
  };
};

export interface ShelfListingResponse {
  id: number;
  coverColor: string;
  emoji: string;
  hooks: [string, string, string];
  publicationYear: number | null;
  ingredients: string[];
  owner: {
    displayName: string;
  };
  isOwner: boolean;
  status: ShelfListing['status'];
  createdAt: Date;
}

export function presentShelfListing(
  listing: ShelfListingWithOwner,
  currentUserId: number,
): ShelfListingResponse {
  return {
    id: listing.id,
    coverColor: listing.coverColor,
    emoji: listing.emoji,
    hooks: [listing.hook1, listing.hook2, listing.hook3],
    publicationYear: listing.publicationYear,
    ingredients: listing.ingredients,
    owner: {
      displayName: listing.owner.displayName,
    },
    isOwner: listing.owner.id === currentUserId,
    status: listing.status,
    createdAt: listing.createdAt,
  };
}
