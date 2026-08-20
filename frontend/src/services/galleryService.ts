import {
  Gallery,
  GalleryFormData,
} from "@/types/gallery";

import {
  apiFetch,
  authenticatedApiFetch,
  responseJson,
} from "@/services/api";

type GalleryMutationResponse = {
  success: boolean;
  message?: string;
  gallery?: Gallery;
};

export const getGallery =
  async (): Promise<Gallery[]> => {
    const response = await apiFetch("/gallery", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const result = await responseJson<{
      success?: boolean;
      gallery?: Gallery[];
      data?: Gallery[];
    }>(response);

    return Array.isArray(result.gallery)
      ? result.gallery
      : Array.isArray(result.data)
        ? result.data
        : [];
  };

export const createGallery = async (
  galleryData: GalleryFormData
): Promise<GalleryMutationResponse> => {
  const formData =
    new FormData();

  formData.append(
    "title",
    galleryData.title
  );

  formData.append(
    "category",
    galleryData.category
  );

  formData.append(
    "description",
    galleryData.description
  );

  formData.append(
    "status",
    galleryData.status
  );

  if (galleryData.coverImage) {
    formData.append(
      "coverImage",
      galleryData.coverImage
    );
  }

  galleryData.images.forEach(
    (image) => {
      formData.append(
        "images",
        image
      );
    }
  );

  const response =
    await authenticatedApiFetch(
      "/gallery",
      {
        method: "POST",
        body: formData,
      }
    );

  return responseJson<GalleryMutationResponse>(
    response
  );
};

export const updateGallery = async (
  id: string,
  galleryData: Partial<GalleryFormData>
): Promise<GalleryMutationResponse> => {
  const formData =
    new FormData();

  if (
    galleryData.title !==
    undefined
  ) {
    formData.append(
      "title",
      galleryData.title
    );
  }

  if (
    galleryData.category !==
    undefined
  ) {
    formData.append(
      "category",
      galleryData.category
    );
  }

  if (
    galleryData.description !==
    undefined
  ) {
    formData.append(
      "description",
      galleryData.description
    );
  }

  if (
    galleryData.status !==
    undefined
  ) {
    formData.append(
      "status",
      galleryData.status
    );
  }

  if (galleryData.coverImage) {
    formData.append(
      "coverImage",
      galleryData.coverImage
    );
  }

  galleryData.images?.forEach(
    (image) => {
      formData.append(
        "images",
        image
      );
    }
  );

  const response =
    await authenticatedApiFetch(
      `/gallery/${id}`,
      {
        method: "PUT",
        body: formData,
      }
    );

  return responseJson<GalleryMutationResponse>(
    response
  );
};

export const deleteGallery = async (
  id: string
): Promise<GalleryMutationResponse> => {
  const response =
    await authenticatedApiFetch(
      `/gallery/${id}`,
      {
        method: "DELETE",
      }
    );

  return responseJson<GalleryMutationResponse>(
    response
  );
};
