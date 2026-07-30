import type { ExecutiveCommittee, ExecutiveCommitteeFormData, ExecutiveCommitteeStats, ImportSummary, PaginatedMembers } from "@/types/executiveCommittee";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/executive-committee`;
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token") || ""}` });

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, options);
  const payload = await response.json();
  if (!response.ok || !payload.success) throw new Error(payload.message || "Executive Committee request failed.");
  return payload.data as T;
};

const toFormData = (data: ExecutiveCommitteeFormData) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("designation", data.designation);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("organization", data.organization || "");
  formData.append("state", data.state || "");
  formData.append("displayOrder", String(data.displayOrder));
  formData.append("status", data.status);
  if (data.photo instanceof File) formData.append("photo", data.photo);
  return formData;
};

export const getExecutiveCommittee = async (params = new URLSearchParams()): Promise<PaginatedMembers> => {
  const response = await fetch(`${API_URL}?${params}`);
  const payload = await response.json();
  if (!response.ok || !payload.success) throw new Error(payload.message || "Failed to fetch members.");
  return { data: payload.data, pagination: payload.pagination };
};

export const getPublicExecutiveCommittee = async (params = new URLSearchParams()): Promise<ExecutiveCommittee[]> => {
  const query = params.toString() ? `?${params}` : "";
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/executive${query}`);
  const payload = await response.json();
  if (!response.ok || !payload.success) throw new Error(payload.message || "Failed to fetch members.");
  return payload.data;
};

export const getExecutiveCommitteeMember = (id: string) => request<ExecutiveCommittee>(`${API_URL}/${id}`, { headers: authHeaders() });
export const getExecutiveCommitteeStats = () => request<ExecutiveCommitteeStats>(`${API_URL}/stats`, { headers: authHeaders() });
export const createExecutiveCommittee = (data: ExecutiveCommitteeFormData) => request<ExecutiveCommittee>(API_URL, { method: "POST", headers: authHeaders(), body: toFormData(data) });
export const updateExecutiveCommittee = (id: string, data: ExecutiveCommitteeFormData) => request<ExecutiveCommittee>(`${API_URL}/${id}`, { method: "PUT", headers: authHeaders(), body: toFormData(data) });
export const deleteExecutiveCommittee = (id: string) => request<unknown>(`${API_URL}/${id}`, { method: "DELETE", headers: authHeaders() });
export const importExecutiveCommittee = (file: File) => { const formData = new FormData(); formData.append("file", file); return request<ImportSummary>(`${process.env.NEXT_PUBLIC_API_URL}/executive/import`, { method: "POST", headers: authHeaders(), body: formData }); };
export const exportExecutiveCommittee = async (filters = new URLSearchParams()) => {
  const response = await fetch(`${API_URL}/export?${filters}`, { headers: authHeaders() });
  if (!response.ok) throw new Error("Failed to export members.");
  const blob = await response.blob();
  const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "executive-committee.xlsx"; link.click(); URL.revokeObjectURL(url);
};
