import { responseJson } from "@/services/api";

const API = process.env.NEXT_PUBLIC_API_URL;
const request = async <T = { success: boolean; data?: any; message?: string }>(url: string, token: string, init: RequestInit = {}) =>
  responseJson<T>(await fetch(url, { ...init, headers: { Authorization: `Bearer ${token}`, ...init.headers } }));
export const getAnnouncements = (token: string, search = "", status = "") => { const query = new URLSearchParams(); if (search) query.set("search", search); if (status) query.set("status", status); return request(`${API}/announcements?${query}`, token); };
export const createAnnouncement = (data: FormData, token: string) => request(`${API}/announcements`, token, { method: "POST", body: data });
export const updateAnnouncement = (id: string, data: FormData, token: string) => request(`${API}/announcements/${id}`, token, { method: "PUT", body: data });
export const deleteAnnouncement = (id: string, token: string) => request(`${API}/announcements/${id}`, token, { method: "DELETE" });
