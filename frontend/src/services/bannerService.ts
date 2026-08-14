import {
  apiFetch,
  authenticatedApiFetch,
  responseJson,
} from "@/services/api";

import type {
  Banner,
} from "@/types/banner";

export const getBanners =
  async () => {
    const response =
      await apiFetch(
        "/banner"
      );

    return (
      await responseJson<{
        data: Banner[];
      }>(response)
    ).data;
  };

export const createBanners =
  async (
    files: File[]
  ) => {
    const formData =
      new FormData();

    files.forEach(
      (file) =>
        formData.append(
          "images",
          file
        )
    );

    return responseJson<{
      data: Banner[];
    }>(
      await authenticatedApiFetch(
        "/banner",
        {
          method: "POST",
          body: formData,
        }
      )
    );
  };

export const updateBanner =
  async (
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
        String(
          data.active
        )
      );
    }

    return responseJson<{
      data: Banner;
    }>(
      await authenticatedApiFetch(
        `/banner/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      )
    );
  };

export const deleteBanner =
  async (
    id: string
  ) =>
    responseJson(
      await authenticatedApiFetch(
        `/banner/${id}`,
        {
          method: "DELETE",
        }
      )
    );

export const reorderBanners =
  async (
    banners: Banner[]
  ) =>
    responseJson<{
      data: Banner[];
    }>(
      await authenticatedApiFetch(
        "/banner/reorder",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            items:
              banners.map(
                (
                  banner,
                  order
                ) => ({
                  id: banner._id,
                  order,
                })
              ),
          }),
        }
      )
    );
