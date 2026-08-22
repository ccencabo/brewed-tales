import { API_BASE_URL } from "./api";

interface SavedBookDto {
  id: number;
  kind: "book";
  externalBookId: string;
  title: string;
  author: string;
  emoji: string;
  coverColor: string;
  coverUrl: string | null;
  clues: [string, string, string];
  ingredients: string[];
  createdAt: string;
}

interface ShelfMatchDto {
  id: number;
  kind: "shelfMatch";
  listingId: number;
  emoji: string;
  coverColor: string;
  hooks: [string, string, string];
  ingredients: string[];
  owner: {
    displayName: string;
    email: string;
  };
  status: "accepted" | "completed";
  createdAt: string;
}

type LibraryDto = SavedBookDto | ShelfMatchDto;

export interface LibrarySave {
  id: string;
  record_id: number;
  kind: "blind_date" | "shelf_match";
  book_id: string | null;
  title: string | null;
  author: string | null;
  emoji: string | null;
  cover_color: string | null;
  cover_url: string | null;
  clue1: string | null;
  clue2: string | null;
  clue3: string | null;
  ingredients: string[];
  shelf_listing_id: string | null;
  owner_email: string | null;
  owner_name: string | null;
  hooks: string[];
  created_at: string;
  exchange_status: "accepted" | "completed" | null;
}

interface ApiErrorBody {
  message?: string | string[];
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let body: ApiErrorBody | null = null;
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      // Use the fallback message below for non-JSON responses.
    }
    const message = Array.isArray(body?.message) ? body.message[0] : body?.message;
    throw new Error(message ?? `Library request failed (${response.status})`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function toLibrarySave(item: LibraryDto): LibrarySave {
  if (item.kind === "book") {
    return {
      id: `book:${item.id}`,
      record_id: item.id,
      kind: "blind_date",
      book_id: item.externalBookId,
      title: item.title,
      author: item.author,
      emoji: item.emoji,
      cover_color: item.coverColor,
      cover_url: item.coverUrl,
      clue1: item.clues[0],
      clue2: item.clues[1],
      clue3: item.clues[2],
      ingredients: item.ingredients,
      shelf_listing_id: null,
      owner_email: null,
      owner_name: null,
      hooks: [],
      created_at: item.createdAt,
      exchange_status: null,
    };
  }

  return {
    id: `match:${item.id}`,
    record_id: item.id,
    kind: "shelf_match",
    book_id: null,
    title: null,
    author: null,
    emoji: item.emoji,
    cover_color: item.coverColor,
    cover_url: null,
    clue1: null,
    clue2: null,
    clue3: null,
    ingredients: item.ingredients,
    shelf_listing_id: String(item.listingId),
    owner_email: item.owner.email,
    owner_name: item.owner.displayName,
    hooks: item.hooks,
    created_at: item.createdAt,
    exchange_status: item.status,
  };
}

export async function fetchLibrary(signal?: AbortSignal): Promise<LibrarySave[]> {
  const items = await request<LibraryDto[]>("/library", { signal });
  return items.map(toLibrarySave);
}

export function saveRecommendedBook(input: {
  externalBookId: string;
  title: string;
  author: string;
  emoji: string;
  coverColor: string;
  coverUrl?: string;
  clues: [string, string, string];
  ingredients: string[];
}): Promise<SavedBookDto> {
  return request<SavedBookDto>("/library/books", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function removeLibrarySave(save: LibrarySave): Promise<void> {
  const path =
    save.kind === "blind_date"
      ? `/library/books/${save.record_id}`
      : `/library/shelf-matches/${save.record_id}`;
  return request<void>(path, { method: "DELETE" });
}
