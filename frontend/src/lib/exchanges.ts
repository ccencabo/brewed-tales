import { API_BASE_URL } from "./api";

export interface Exchange {
  id: number;
  role: "owner" | "requester";
  status: "pending" | "accepted" | "completed" | "cancelled";
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
  createdAt: string;
  updatedAt: string;
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
      // Use the fallback message for a non-JSON response.
    }
    const message = Array.isArray(body?.message) ? body.message[0] : body?.message;
    throw new Error(message ?? `Exchange request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export function fetchExchanges(signal?: AbortSignal): Promise<Exchange[]> {
  return request<Exchange[]>("/exchanges", { signal });
}

export function acceptExchange(id: number): Promise<Exchange> {
  return request<Exchange>(`/exchanges/${id}/accept`, { method: "POST" });
}

export function declineExchange(id: number): Promise<Exchange> {
  return request<Exchange>(`/exchanges/${id}/decline`, { method: "POST" });
}

export function cancelExchange(id: number): Promise<Exchange> {
  return request<Exchange>(`/exchanges/${id}/cancel`, { method: "POST" });
}

export function completeExchange(id: number): Promise<Exchange> {
  return request<Exchange>(`/exchanges/${id}/complete`, { method: "POST" });
}
