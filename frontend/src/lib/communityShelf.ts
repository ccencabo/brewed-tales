import { API_BASE_URL } from "./api";

export interface CommunityShelfListingDto {
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
  status: "AVAILABLE" | "MATCHED";
  createdAt: string;
}

export interface CreateShelfListingInput {
  coverColor: string;
  emoji: string;
  hooks: [string, string, string];
  publicationYear: number;
  ingredients: string[];
}

export interface ShelfClaimDto {
  id: number;
  listingId: number;
  owner: {
    displayName: string;
  };
  status: "pending";
  createdAt: string;
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
      // Keep the status-based fallback for non-JSON server responses.
    }
    const message = Array.isArray(body?.message) ? body.message[0] : body?.message;
    throw new Error(message ?? `Shelf request failed (${response.status})`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function fetchCommunityShelfListings(
  signal?: AbortSignal,
): Promise<CommunityShelfListingDto[]> {
  return request<CommunityShelfListingDto[]>("/shelf-listings", { signal });
}

export function createShelfListing(
  input: CreateShelfListingInput,
): Promise<CommunityShelfListingDto> {
  return request<CommunityShelfListingDto>("/shelf-listings", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function removeShelfListing(id: number): Promise<void> {
  return request<void>(`/shelf-listings/${id}`, { method: "DELETE" });
}

export function claimShelfListing(
  id: number,
  preferenceTags: string[] = [],
): Promise<ShelfClaimDto> {
  return request<ShelfClaimDto>(`/shelf-listings/${id}/claim`, {
    method: "POST",
    body: JSON.stringify({ preferenceTags }),
  });
}
