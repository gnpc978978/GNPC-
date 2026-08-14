import axios from "axios";

export type AuthUser = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
};

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

export const API_BASE_URL = rawApiUrl
  ? rawApiUrl.replace(/\/+$/, "")
  : "";

const normalizePath = (path = ""): string => {
  if (!path) {
    return "";
  }

  return path.startsWith("/") ? path : `/${path}`;
};

/**
 * Builds an API URL from the single configured API base URL.
 *
 * NEXT_PUBLIC_API_URL must be configured, for example:
 * https://your-backend-domain.com/api
 */
export const apiUrl = (path = ""): string => {
  if (!API_BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured. Please configure the frontend API URL."
    );
  }

  return `${API_BASE_URL}${normalizePath(path)}`;
};

export const requireApiUrl = (): string => {
  if (!API_BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured. Please configure the frontend API URL."
    );
  }

  return API_BASE_URL;
};

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
};

export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

const mergeHeaders = (
  initHeaders?: HeadersInit,
  includeAuth = false
): Headers => {
  const headers = new Headers(initHeaders);

  if (includeAuth) {
    const token = getAuthToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return headers;
};

export const authenticatedFetch = (
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> => {
  const headers = mergeHeaders(init.headers, true);

  return fetch(input, {
    ...init,
    credentials: "include",
    headers,
  });
};

export const apiFetch = (
  path: string,
  init: RequestInit = {}
): Promise<Response> => {
  return fetch(apiUrl(path), {
    ...init,
    credentials: "include",
  });
};

export const authenticatedApiFetch = (
  path: string,
  init: RequestInit = {}
): Promise<Response> => {
  return authenticatedFetch(apiUrl(path), init);
};

export const clearExpiredSession = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  if (window.location.pathname !== "/admin/login") {
    window.location.replace("/admin/login");
  }
};

const fallbackMessages: Record<number, string> = {
  400:
    "The request is invalid. Please review the submitted information.",
  401:
    "Your session has expired. Please sign in again.",
  403:
    "You do not have permission to perform this action.",
  404:
    "The requested resource was not found.",
  409:
    "This request conflicts with existing data.",
  422:
    "The submitted information could not be processed.",
  500:
    "The server could not complete your request. Please try again later.",
};

export const apiErrorMessage = (
  status: number,
  payload?: {
    message?: unknown;
  }
): string => {
  if (typeof payload?.message === "string") {
    return payload.message;
  }

  return (
    fallbackMessages[status] ||
    "The request failed. Please try again."
  );
};

export const responseJson = async <T>(
  response: Response
): Promise<T> => {
  const payload = await response.json().catch(() => ({}));

  if (response.status === 401) {
    clearExpiredSession();
  }

  if (!response.ok) {
    throw new Error(
      apiErrorMessage(response.status, payload)
    );
  }

  return payload as T;
};

export const axiosErrorMessage = (
  error: unknown
): string => {
  if (axios.isAxiosError(error)) {
    return apiErrorMessage(
      error.response?.status || 0,
      error.response?.data
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to reach the server. Please check your connection and try again.";
};
