import type { Banner } from "@/types/banner";

import {
  apiFetch,
  authenticatedApiFetch,
  responseJson,
} from "@/services/api";

export const getBanners =
  async (): Promise<Banner[]> => {
    const response =
      await apiFetch("/banner");

    const result =
      await responseJson<{
        data: Banner[];
      }>(response);

    return result.data || [];
  };

export const createBanners = async (
  files: File[]
) => {
  const formData =
    new FormData();

  files.forEach((file) => {
    formData.append(
      "images",
      file
    );
  });

  const response =
    await authenticatedApiFetch(
      "/banner",
      {
        method: "POST",
        body: formData,
      }
    );

  return responseJson<{
    data: Banner[];
  }>(response);
};

export const updateBanner = async (
  id: string,
  data: {
    image?: File;
    active?: boolean;
  }
) => {
  const formData =
    new FormData();

  if (data.image) {
    formData.append(
      "image",
      data.image
    );
  }

  if (
    typeof data.active ===
    "boolean"
  ) {
    formData.append(
      "active",
      String(data.active)
    );
  }

  const response =
    await authenticatedApiFetch(
      `/banner/${id}`,
      {
        method: "PUT",
        body: formData,
      }
    );

  return responseJson<{
    data: Banner;
  }>(response);
};

export const deleteBanner = async (
  id: string
) => {
  const response =
    await authenticatedApiFetch(
      `/banner/${id}`,
      {
        method: "DELETE",
      }
    );

  return responseJson(response);
};

export const reorderBanners = async (
  banners: Banner[]
) => {
  const response =
    await authenticatedApiFetch(
      "/banner/reorder",
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          items: banners.map(
            (banner, order) => ({
              id: banner._id,
              order,
            })
          ),
        }),
      }
    );

  return responseJson<{
    data: Banner[];
  }>(response);
};
