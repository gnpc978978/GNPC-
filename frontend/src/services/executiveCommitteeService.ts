import type {
  ExecutiveCommittee,
  ExecutiveCommitteeFormData,
  ExecutiveCommitteeStats,
  ImportSummary,
  PaginatedMembers,
} from "@/types/executiveCommittee";

import {
  apiFetch,
  authenticatedApiFetch,
  responseJson,
} from "@/services/api";

const toFormData = (
  data: ExecutiveCommitteeFormData
) => {
  const formData =
    new FormData();

  formData.append(
    "name",
    data.name
  );

  formData.append(
    "designation",
    data.designation
  );

  formData.append(
    "email",
    data.email
  );

  formData.append(
    "phone",
    data.phone
  );

  formData.append(
    "organization",
    data.organization || ""
  );

  formData.append(
    "state",
    data.state || ""
  );

  formData.append(
    "displayOrder",
    String(data.displayOrder)
  );

  formData.append(
    "status",
    data.status
  );

  if (
    data.photo instanceof File
  ) {
    formData.append(
      "photo",
      data.photo
    );
  }

  return formData;
};

const request = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const response =
    await authenticatedApiFetch(
      path,
      options
    );

  const payload =
    await responseJson<{
      success: boolean;
      data: T;
      message?: string;
    }>(response);

  return payload.data;
};

export const getExecutiveCommittee =
  async (
    params = new URLSearchParams()
  ): Promise<PaginatedMembers> => {
    const query =
      params.toString();

    const response =
      await apiFetch(
        `/executive-committee${
          query ? `?${query}` : ""
        }`
      );

    const payload =
      await responseJson<{
        success: boolean;
        data: ExecutiveCommittee[];
        pagination: PaginatedMembers["pagination"];
        message?: string;
      }>(response);

    return {
      data: payload.data,
      pagination:
        payload.pagination,
    };
  };

export const getPublicExecutiveCommittee =
  async (
    params = new URLSearchParams()
  ): Promise<
    ExecutiveCommittee[]
  > => {
    const query =
      params.toString();

    const response =
      await apiFetch(
        `/executive${
          query ? `?${query}` : ""
        }`
      );

    const payload =
      await responseJson<{
        success: boolean;
        data: ExecutiveCommittee[];
        message?: string;
      }>(response);

    return payload.data;
  };

export const getExecutiveCommitteeMember =
  async (
    id: string
  ): Promise<ExecutiveCommittee> =>
    request<ExecutiveCommittee>(
      `/executive-committee/${id}`
    );

export const getExecutiveCommitteeStats =
  async (): Promise<ExecutiveCommitteeStats> =>
    request<ExecutiveCommitteeStats>(
      "/executive-committee/stats"
    );

export const createExecutiveCommittee =
  async (
    data: ExecutiveCommitteeFormData
  ): Promise<ExecutiveCommittee> =>
    request<ExecutiveCommittee>(
      "/executive-committee",
      {
        method: "POST",
        body: toFormData(data),
      }
    );

export const updateExecutiveCommittee =
  async (
    id: string,
    data: ExecutiveCommitteeFormData
  ): Promise<ExecutiveCommittee> =>
    request<ExecutiveCommittee>(
      `/executive-committee/${id}`,
      {
        method: "PUT",
        body: toFormData(data),
      }
    );

export const deleteExecutiveCommittee =
  async (
    id: string
  ) =>
    request<unknown>(
      `/executive-committee/${id}`,
      {
        method: "DELETE",
      }
    );

export const importExecutiveCommittee =
  async (
    file: File
  ): Promise<ImportSummary> => {
    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    return request<ImportSummary>(
      "/executive-committee/import",
      {
        method: "POST",
        body: formData,
      }
    );
  };

export const exportExecutiveCommittee =
  async (
    filters = new URLSearchParams()
  ) => {
    const query =
      filters.toString();

    const response =
      await authenticatedApiFetch(
        `/executive-committee/export${
          query ? `?${query}` : ""
        }`
      );

    if (!response.ok) {
      await responseJson(response);
    }

    const blob =
      await response.blob();

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "executive-committee.xlsx";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };
