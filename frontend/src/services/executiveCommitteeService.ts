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
    String(
      data.displayOrder
    )
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

const queryString = (
  params: URLSearchParams
) => {
  const value =
    params.toString();

  return value
    ? `?${value}`
    : "";
};

export const getExecutiveCommittee =
  async (
    params = new URLSearchParams()
  ): Promise<PaginatedMembers> => {
    const response =
      await authenticatedApiFetch(
        `/executive-committee${queryString(
          params
        )}`
      );

    return responseJson<PaginatedMembers>(
      response
    );
  };

export const getPublicExecutiveCommittee =
  async (
    params = new URLSearchParams()
  ): Promise<
    ExecutiveCommittee[]
  > => {
    const response =
      await apiFetch(
        `/executive${queryString(
          params
        )}`
      );

    const payload =
      await responseJson<{
        data: ExecutiveCommittee[];
      }>(response);

    return payload.data;
  };

export const getExecutiveCommitteeMember =
  async (
    id: string
  ) => {
    const response =
      await authenticatedApiFetch(
        `/executive-committee/${id}`
      );

    const payload =
      await responseJson<{
        data: ExecutiveCommittee;
      }>(response);

    return payload.data;
  };

export const getExecutiveCommitteeStats =
  async () => {
    const response =
      await authenticatedApiFetch(
        "/executive-committee/stats"
      );

    const payload =
      await responseJson<{
        data: ExecutiveCommitteeStats;
      }>(response);

    return payload.data;
  };

export const createExecutiveCommittee =
  async (
    data: ExecutiveCommitteeFormData
  ) => {
    const response =
      await authenticatedApiFetch(
        "/executive-committee",
        {
          method: "POST",
          body: toFormData(
            data
          ),
        }
      );

    const payload =
      await responseJson<{
        data: ExecutiveCommittee;
      }>(response);

    return payload.data;
  };

export const updateExecutiveCommittee =
  async (
    id: string,
    data: ExecutiveCommitteeFormData
  ) => {
    const response =
      await authenticatedApiFetch(
        `/executive-committee/${id}`,
        {
          method: "PUT",
          body: toFormData(
            data
          ),
        }
      );

    const payload =
      await responseJson<{
        data: ExecutiveCommittee;
      }>(response);

    return payload.data;
  };

export const deleteExecutiveCommittee =
  async (
    id: string
  ) => {
    const response =
      await authenticatedApiFetch(
        `/executive-committee/${id}`,
        {
          method: "DELETE",
        }
      );

    return responseJson<unknown>(
      response
    );
  };

export const importExecutiveCommittee =
  async (
    file: File
  ) => {
    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const response =
      await authenticatedApiFetch(
        "/executive/import",
        {
          method: "POST",
          body: formData,
        }
      );

    const payload =
      await responseJson<{
        data: ImportSummary;
      }>(response);

    return payload.data;
  };

export const exportExecutiveCommittee =
  async (
    filters = new URLSearchParams()
  ) => {
    const response =
      await authenticatedApiFetch(
        `/executive-committee/export${queryString(
          filters
        )}`
      );

    if (!response.ok) {
      await responseJson(
        response
      );
    }

    const blob =
      await response.blob();

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;
    link.download =
      "executive-committee.xlsx";

    link.click();

    URL.revokeObjectURL(
      url
    );
  };
