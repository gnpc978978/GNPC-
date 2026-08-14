import {
  authenticatedApiFetch,
  apiFetch,
  responseJson,
} from "@/services/api";

export type Advertisement = {
  _id: string;
  title: string;
  sponsor: string;
  banner: string;
  url: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Inactive";
};

type AdvertisementMutationResponse = {
  success: boolean;
  message?: string;
  data?: Advertisement;
};

export const getAdvertisements =
  async (): Promise<Advertisement[]> => {
    const response =
      await apiFetch("/advertisements");

    const result =
      await responseJson<{
        data: Advertisement[];
      }>(response);

    return result.data || [];
  };

export const createAdvertisement = async (
  formData: FormData
) => {
  const response =
    await authenticatedApiFetch(
      "/advertisements",
      {
        method: "POST",
        body: formData,
      }
    );

  return responseJson<AdvertisementMutationResponse>(
    response
  );
};

export const updateAdvertisement = async (
  id: string,
  formData: FormData
) => {
  const response =
    await authenticatedApiFetch(
      `/advertisements/${id}`,
      {
        method: "PUT",
        body: formData,
      }
    );

  return responseJson<AdvertisementMutationResponse>(
    response
  );
};

export const deleteAdvertisement = async (
  id: string
) => {
  const response =
    await authenticatedApiFetch(
      `/advertisements/${id}`,
      {
        method: "DELETE",
      }
    );

  return responseJson(response);
};
