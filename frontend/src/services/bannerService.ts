import { responseJson } from "@/services/api";
import type { Banner } from "@/types/banner";

const API = `${process.env.NEXT_PUBLIC_API_URL}/banner`;
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token") || ""}` });

export const getBanners = async () => {
  const response = await fetch(API);
  return (await responseJson<{ data: Banner[] }>(response)).data;
};

export const createBanners = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  return responseJson<{ data: Banner[] }>(await fetch(API, { method: "POST", credentials: "include", headers: authHeaders(), body: formData }));
};

export const updateBanner = async (id: string, data: { image?: File; active?: boolean }) => {
  const formData = new FormData();
  if (data.image) formData.append("image", data.image);
  if (typeof data.active === "boolean") formData.append("active", String(data.active));
  return responseJson<{ data: Banner }>(await fetch(`${API}/${id}`, { method: "PUT", credentials: "include", headers: authHeaders(), body: formData }));
};

export const deleteBanner = async (id: string) => responseJson(await fetch(`${API}/${id}`, { method: "DELETE", credentials: "include", headers: authHeaders() }));

export const reorderBanners = async (banners: Banner[]) => responseJson<{ data: Banner[] }>(await fetch(`${API}/reorder`, {
  method: "PUT",
  credentials: "include",
  headers: { "Content-Type": "application/json", ...authHeaders() },
  body: JSON.stringify({ items: banners.map((banner, order) => ({ id: banner._id, order })) }),
}));
