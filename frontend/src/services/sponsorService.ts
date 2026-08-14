import { Sponsor } from "@/types/sponsor";
import {
  authenticatedApiFetch,
  apiFetch,
  responseJson,
} from "@/services/api";

// GET ALL SPONSORS
export const getSponsors = async (): Promise<Sponsor[]> => {
  const response = await apiFetch("/sponsors");

  const data = await responseJson<{
    success: boolean;
    data: Sponsor[];
  }>(response);

  return data.data;
};

// GET SINGLE SPONSOR
export const getSponsor = async (
  id: string
): Promise<Sponsor> => {
  const response = await apiFetch(`/sponsors/${id}`);

  const data = await responseJson<{
    success: boolean;
    data: Sponsor;
  }>(response);

  return data.data;
};

// CREATE SPONSOR
export const createSponsor = async (
  formData: FormData
) => {
  const response = await authenticatedApiFetch(
    "/sponsors",
    {
      method: "POST",
      body: formData,
    }
  );

  return responseJson(response);
};

// UPDATE SPONSOR
export const updateSponsor = async (
  id: string,
  formData: FormData
) => {
  const response = await authenticatedApiFetch(
    `/sponsors/${id}`,
    {
      method: "PUT",
      body: formData,
    }
  );

  return responseJson(response);
};

// UPDATE SPONSOR STATUS
export const updateSponsorStatus = async (
  id: string,
  status: Sponsor["status"]
) => {
  const response =
    await authenticatedApiFetch(
      `/sponsors/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      }
    );

  return responseJson(response);
};

// DELETE SPONSOR
export const deleteSponsor = async (
  id: string
) => {
  const response =
    await authenticatedApiFetch(
      `/sponsors/${id}`,
      {
        method: "DELETE",
      }
    );

  return responseJson(response);
};
