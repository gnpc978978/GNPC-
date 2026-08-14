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
  : process.env.NODE_ENV === "development"
    ? "http://localhost:5001/api"
    : "";

export const apiUrl = (path = ""): string => {
  if (!API_BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured. Configure the frontend API base URL before making API requests."
    );
  }

  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${API_BASE_URL}${normalizedPath}`;
};

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
};

export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const authenticatedFetch = (
  input: RequestInfo | URL,
  init: RequestInit = {}
) => {
  const headers = new Headers(init.headers);
  const token = getAuthToken();

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  return fetch(input, {
    ...init,
    credentials: "include",
    headers,
  });
};

export const apiFetch = (
  path: string,
  init: RequestInit = {}
) => {
  return fetch(apiUrl(path), {
    ...init,
    credentials: "include",
  });
};

export const authenticatedApiFetch = (
  path: string,
  init: RequestInit = {}
) => {
  return authenticatedFetch(
    apiUrl(path),
    init
  );
};

export const clearExpiredSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  if (
    window.location.pathname !==
    "/admin/login"
  ) {
    window.location.replace(
      "/admin/login"
    );
  }
};

const fallbackMessages: Record<
  number,
  string
> = {
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
) => {
  if (
    typeof payload?.message ===
    "string"
  ) {
    return payload.message;
  }

  return (
    fallbackMessages[status] ||
    "The request failed. Please try again."
  );
};

export const responseJson =
  async <T>(
    response: Response
  ): Promise<T> => {
    const payload =
      await response
        .json()
        .catch(() => ({}));

    if (response.status === 401) {
      clearExpiredSession();
    }

    if (!response.ok) {
      throw new Error(
        apiErrorMessage(
          response.status,
          payload
        )
      );
    }

    return payload as T;
  };

export const requireApiUrl = () => {
  if (!API_BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured."
    );
  }

  return API_BASE_URL;
};

export const axiosErrorMessage = (
  error: unknown
) => {
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
