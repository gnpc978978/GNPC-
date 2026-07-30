import axios from "axios";

export type AuthUser = { id?: string; _id?: string; name: string; email: string; role: "ADMIN" | "SUPER_ADMIN" };

export const clearExpiredSession = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  if (window.location.pathname !== "/admin/login") window.location.replace("/admin/login");
};

export const getAuthToken = (): string | null =>
  typeof window === "undefined" ? null : localStorage.getItem("token");

export const authenticatedFetch = (input: RequestInfo | URL, init: RequestInit = {}) => {
  const headers = new Headers(init.headers);
  const token = getAuthToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, credentials: "include", headers });
};

const fallbackMessages: Record<number, string> = {
  400: "The request is invalid. Please review the submitted information.",
  401: "Your session has expired. Please sign in again.",
  403: "You do not have permission to perform this action.",
  404: "The requested resource was not found.",
  500: "The server could not complete your request. Please try again later.",
};

export const apiErrorMessage = (status: number, payload?: { message?: unknown }) =>
  typeof payload?.message === "string" ? payload.message : fallbackMessages[status] || "The request failed. Please try again.";

export const responseJson = async <T>(response: Response): Promise<T> => {
  const payload = await response.json().catch(() => ({}));
  if (response.status === 401) clearExpiredSession();
  if (!response.ok) throw new Error(apiErrorMessage(response.status, payload));
  return payload as T;
};

export const axiosErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) return apiErrorMessage(error.response?.status || 0, error.response?.data);
  return "Unable to reach the server. Please check your connection and try again.";
};
