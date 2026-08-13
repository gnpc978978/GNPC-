import type { Event } from "@/types/event";

import {
  apiFetch,
  authenticatedApiFetch,
  responseJson,
} from "@/services/api";

export const getEvents =
  async () => {
    const response =
      await apiFetch("/events");

    return responseJson<{
      success: boolean;
      count?: number;
      data: Event[];
    }>(response);
  };

export const getEvent =
  async (
    idOrSlug: string
  ) => {
    const response =
      await apiFetch(
        `/events/${encodeURIComponent(
          idOrSlug
        )}`
      );

    const payload =
      await responseJson<{
        success: boolean;
        data: Event;
      }>(response);

    return payload.data;
  };

export const createEvent =
  async (
    formData: FormData
  ) => {
    const response =
      await authenticatedApiFetch(
        "/events",
        {
          method: "POST",
          body: formData,
        }
      );

    return responseJson(response);
  };

export const updateEvent =
  async (
    id: string,
    formData: FormData
  ) => {
    const response =
      await authenticatedApiFetch(
        `/events/${encodeURIComponent(
          id
        )}`,
        {
          method: "PUT",
          body: formData,
        }
      );

    return responseJson(response);
  };

export const deleteEvent =
  async (
    id: string
  ) => {
    const response =
      await authenticatedApiFetch(
        `/events/${encodeURIComponent(
          id
        )}`,
        {
          method: "DELETE",
        }
      );

    return responseJson(response);
  };
