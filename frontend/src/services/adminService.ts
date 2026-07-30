import { responseJson } from "@/services/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const options = (init: RequestInit = {}) => ({ credentials: "include" as RequestCredentials, headers: { Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""}`, ...init.headers }, ...init });

export type AdminAccount = { _id: string; name: string; username?: string; email: string; role: "ADMIN" | "SUPER_ADMIN"; status: "ACTIVE" | "INACTIVE"; lastLogin?: string; createdAt: string };

export const getAdmins = async (): Promise<AdminAccount[]> => (await responseJson<{ data: AdminAccount[] }>(await fetch(`${API_URL}/admins`, options()))).data;
export const getAdminById = async (id: string): Promise<AdminAccount> => (await responseJson<{ data: AdminAccount }>(await fetch(`${API_URL}/admins/${id}`, options()))).data;
export const createAdmin = async (adminData: unknown) => responseJson(await fetch(`${API_URL}/admins`, options({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(adminData) })));
export const updateAdmin = async (id: string, adminData: unknown) => responseJson(await fetch(`${API_URL}/admins/${id}`, options({ method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(adminData) })));
export const deleteAdmin = async (id: string) => responseJson(await fetch(`${API_URL}/admins/${id}`, options({ method: "DELETE" })));
export const changeAdminStatus = async (id: string, status: "ACTIVE" | "INACTIVE") => responseJson(await fetch(`${API_URL}/admins/${id}/${status === "ACTIVE" ? "activate" : "deactivate"}`, options({ method: "PATCH" })));
export const resetAdminPassword = async (id: string, password: string) => responseJson(await fetch(`${API_URL}/admins/${id}/reset-password`, options({ method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) })));
