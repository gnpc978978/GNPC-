import type {
  PressConference,
  PressConferenceFormData,
} from "@/types/pressConference";

import {
  apiFetch,
  authenticatedApiFetch,
  responseJson,
} from "@/services/api";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

const toFormData = (
  data: PressConferenceFormData
) => {
  const formData =
    new FormData();

  formData.append(
    "title",
    data.title
  );

  formData.append(
    "venue",
    data.venue
  );

  formData.append(
    "date",
    data.date
  );

  formData.append(
    "description",
    data.description
  );

  formData.append(
    "content",
    data.content
  );

  if (data.featuredImage) {
    formData.append(
      "featuredImage",
      data.featuredImage
    );
  }

  if (data.pdfFile) {
    formData.append(
      "pdfFile",
      data.pdfFile
    );
  }

  return formData;
};

export const getPressConferences =
  async (): Promise<
    PressConference[]
  > => {
    const response =
      await apiFetch(
        "/press-conferences",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

    const payload =
      await responseJson<
        ApiResponse<PressConference[]>
      >(response);

    return payload.data || [];
  };

export const getPressConference =
  async (
    id: string
  ): Promise<PressConference> => {
    const response =
      await apiFetch(
        `/press-conferences/${encodeURIComponent(
          id
        )}`
      );

    const payload =
      await responseJson<
        ApiResponse<PressConference>
      >(response);

    return payload.data;
  };

export const createPressConference =
  async (
    data: PressConferenceFormData
  ): Promise<PressConference> => {
    const response =
      await authenticatedApiFetch(
        "/press-conferences",
        {
          method: "POST",
          body: toFormData(data),
        }
      );

    const payload =
      await responseJson<
        ApiResponse<PressConference>
      >(response);

    return payload.data;
  };

export const updatePressConference =
  async (
    id: string,
    data: PressConferenceFormData
  ): Promise<PressConference> => {
    const response =
      await authenticatedApiFetch(
        `/press-conferences/${encodeURIComponent(
          id
        )}`,
        {
          method: "PUT",
          body: toFormData(data),
        }
      );

    const payload =
      await responseJson<
        ApiResponse<PressConference>
      >(response);

    return payload.data;
  };

export const deletePressConference =
  async (
    id: string
  ): Promise<void> => {
    const response =
      await authenticatedApiFetch(
        `/press-conferences/${encodeURIComponent(
          id
        )}`,
        {
          method: "DELETE",
        }
      );

    await responseJson(response);
  };
