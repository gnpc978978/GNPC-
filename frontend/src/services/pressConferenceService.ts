import type { PressConference, PressConferenceFormData } from "@/types/pressConference";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/press-conferences`;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

const getResponseData = async <T>(response: Response): Promise<T> => {
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Press conference request failed.");
  }

  return data.data as T;
};

const toFormData = (data: PressConferenceFormData) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("venue", data.venue);
  formData.append("date", data.date);
  formData.append("description", data.description);
  formData.append("content", data.content);

  if (data.featuredImage) formData.append("featuredImage", data.featuredImage);
  if (data.pdfFile) formData.append("pdfFile", data.pdfFile);

  return formData;
};

export const getPressConferences = async (): Promise<PressConference[]> =>
  getResponseData<PressConference[]>(await fetch(API_URL));

export const getPressConference = async (id: string): Promise<PressConference> =>
  getResponseData<PressConference>(await fetch(`${API_URL}/${id}`));

export const createPressConference = async (data: PressConferenceFormData): Promise<PressConference> =>
  getResponseData<PressConference>(
    await fetch(API_URL, { method: "POST", headers: authHeaders(), body: toFormData(data) })
  );

export const updatePressConference = async (
  id: string,
  data: PressConferenceFormData
): Promise<PressConference> =>
  getResponseData<PressConference>(
    await fetch(`${API_URL}/${id}`, { method: "PUT", headers: authHeaders(), body: toFormData(data) })
  );

export const deletePressConference = async (id: string): Promise<void> => {
  await getResponseData<unknown>(
    await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: authHeaders() })
  );
};
