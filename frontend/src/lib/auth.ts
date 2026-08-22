import { API_BASE_URL } from "./api";

export interface AuthUser {
  id: number;
  email: string;
  displayName: string;
  createdAt: string;
}

interface AuthResponse {
  user: AuthUser;
}

interface CurrentUserResponse {
  user: AuthUser | null;
}

interface ApiErrorBody {
  message?: string | string[];
}

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
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
      // The API may be unavailable or return a non-JSON proxy response.
    }

    const apiMessage = Array.isArray(body?.message)
      ? body.message[0]
      : body?.message;
    throw new AuthApiError(
      apiMessage ?? `Authentication request failed (${response.status})`,
      response.status,
    );
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function fetchCurrentUser(
  signal?: AbortSignal,
): Promise<AuthUser | null> {
  const response = await request<CurrentUserResponse>("/auth/me", { signal });
  return response.user;
}

export async function login(input: {
  email: string;
  password: string;
  rememberMe: boolean;
}): Promise<AuthUser> {
  const response = await request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.user;
}

export async function register(input: {
  email: string;
  displayName: string;
  password: string;
}): Promise<AuthUser> {
  const response = await request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.user;
}

export function logout(): Promise<void> {
  return request<void>("/auth/logout", { method: "POST" });
}

export function authErrorMessage(error: unknown): string {
  if (error instanceof AuthApiError) return error.message;
  if (error instanceof TypeError) {
    return "Could not reach the server. Make sure the backend is running.";
  }
  return "Something went wrong. Please try again.";
}
