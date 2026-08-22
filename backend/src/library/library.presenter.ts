import type {
  SavedBook,
  ShelfListing,
  ShelfMatch,
} from '../generated/prisma/client';
import { ShelfMatchStatus } from '../generated/prisma/enums';

interface MatchWithListing extends ShelfMatch {
  listing: ShelfListing & {
    owner: {
      displayName: string;
      email: string;
    };
  };
}

export interface SavedBookLibraryItem {
  id: number;
  kind: 'book';
  externalBookId: string;
  title: string;
  author: string;
  emoji: string;
  coverColor: string;
  coverUrl: string | null;
  clues: [string, string, string];
  ingredients: string[];
  createdAt: Date;
}

export interface ShelfMatchLibraryItem {
  id: number;
  kind: 'shelfMatch';
  listingId: number;
  emoji: string;
  coverColor: string;
  hooks: [string, string, string];
  ingredients: string[];
  owner: {
    displayName: string;
    email: string;
  };
  status: 'accepted' | 'completed';
  createdAt: Date;
}

export type LibraryItem = SavedBookLibraryItem | ShelfMatchLibraryItem;

export function presentSavedBook(book: SavedBook): SavedBookLibraryItem {
  return {
    id: book.id,
    kind: 'book',
    externalBookId: book.externalBookId,
    title: book.title,
    author: book.author,
    emoji: book.emoji,
    coverColor: book.coverColor,
    coverUrl: book.coverUrl,
    clues: [book.clue1, book.clue2, book.clue3],
    ingredients: book.ingredients,
    createdAt: book.createdAt,
  };
}

export function presentShelfMatch(
  match: MatchWithListing,
): ShelfMatchLibraryItem {
  return {
    id: match.id,
    kind: 'shelfMatch',
    listingId: match.listingId,
    emoji: match.listing.emoji,
    coverColor: match.listing.coverColor,
    hooks: [match.listing.hook1, match.listing.hook2, match.listing.hook3],
    ingredients: match.listing.ingredients,
    owner: match.listing.owner,
    status:
      match.status === ShelfMatchStatus.COMPLETED ? 'completed' : 'accepted',
    createdAt: match.createdAt,
  };
}
