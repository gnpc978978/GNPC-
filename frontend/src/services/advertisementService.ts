import {
  apiFetch,
  authenticatedApiFetch,
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
  status:
    | "Active"
    | "Inactive";
};

type AdvertisementMutationResponse =
  {
    success: boolean;
    message?: string;
    data?: Advertisement;
  };

export const getAdvertisements =
  async (): Promise<
    Advertisement[]
  > => {
    const response =
      await apiFetch(
        "/advertisements"
      );

    const payload =
      await responseJson<{
        data?: Advertisement[];
      }>(response);

    return payload.data || [];
  };

export const getAdvertisement = async (id: string): Promise<Advertisement> => {
  const response = await authenticatedApiFetch(`/advertisements/${id}`);
  const payload = await responseJson<{ data: Advertisement }>(response);
  return payload.data;
};

export const createAdvertisement =
  async (
    formData: FormData
  ) =>
    responseJson<AdvertisementMutationResponse>(
      await authenticatedApiFetch(
        "/advertisements",
        {
          method: "POST",
          body: formData,
        }
      )
    );

export const updateAdvertisement =
  async (
    id: string,
    formData: FormData
  ) =>
    responseJson<AdvertisementMutationResponse>(
      await authenticatedApiFetch(
        `/advertisements/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      )
    );

export const deleteAdvertisement =
  async (
    id: string
  ) =>
    responseJson(
      await authenticatedApiFetch(
        `/advertisements/${id}`,
        {
          method: "DELETE",
        }
      )
    );
