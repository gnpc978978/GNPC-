import { responseJson } from "@/services/api";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/advertisements`;
const authOptions = () => ({ credentials: "include" as RequestCredentials, headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` } });
export type Advertisement = { _id: string; title: string; sponsor: string; banner: string; url: string; startDate: string; endDate: string; status: "Active" | "Inactive" };
type AdvertisementMutationResponse = { success: boolean; message?: string; data?: Advertisement };
export const getAdvertisements = async (): Promise<Advertisement[]> => (await responseJson<{ data: Advertisement[] }>(await fetch(API_URL))).data || [];
export const createAdvertisement = async (formData: FormData) => responseJson<AdvertisementMutationResponse>(await fetch(API_URL, { method: "POST", ...authOptions(), body: formData }));
export const updateAdvertisement = async (id: string, formData: FormData) => responseJson<AdvertisementMutationResponse>(await fetch(`${API_URL}/${id}`, { method: "PUT", ...authOptions(), body: formData }));
export const deleteAdvertisement = async (id: string) => responseJson(await fetch(`${API_URL}/${id}`, { method: "DELETE", ...authOptions() }));
