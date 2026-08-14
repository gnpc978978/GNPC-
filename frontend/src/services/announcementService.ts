import {
  apiUrl,
  responseJson,
} from "@/services/api";

type AnnouncementResponse = {
  success: boolean;
  data?: unknown;
  message?: string;
};

const request = async <
  T = AnnouncementResponse
>(
  path: string,
  token: string,
  init: RequestInit = {}
): Promise<T> => {
  const headers = new Headers(
    init.headers
  );

  const effectiveToken =
    token ||
    (typeof window !== "undefined"
      ? localStorage.getItem("token") || ""
      : "");

  if (effectiveToken) {
    headers.set(
      "Authorization",
      `Bearer ${effectiveToken}`
    );
  }

  const response = await fetch(
    apiUrl(path),
    {
      ...init,
      credentials: "include",
      headers,
    }
  );

  return responseJson<T>(response);
};

export const getAnnouncements = (
  token: string,
  search = "",
  status = ""
) => {
  const query =
    new URLSearchParams();

  if (search) {
    query.set("search", search);
  }

  if (status) {
    query.set("status", status);
  }

  const queryString =
    query.toString();

  return request(
    `/announcements${
      queryString
        ? `?${queryString}`
        : ""
    }`,
    token
  );
};

export const createAnnouncement = (
  data: FormData,
  token: string
) =>
  request(
    "/announcements",
    token,
    {
      method: "POST",
      body: data,
    }
  );

export const updateAnnouncement = (
  id: string,
  data: FormData,
  token: string
) =>
  request(
    `/announcements/${id}`,
    token,
    {
      method: "PUT",
      body: data,
    }
  );

export const deleteAnnouncement = (
  id: string,
  token: string
) =>
  request(
    `/announcements/${id}`,
    token,
    {
      method: "DELETE",
    }
  );
