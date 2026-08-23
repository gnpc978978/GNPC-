import type {
  ImportSummary,
  OfficeBearer,
  OfficeBearerFormData,
  OfficeBearerListResponse,
} from "@/types/officeBearer";

import {
  apiFetch,
  authenticatedApiFetch,
  responseJson,
} from "@/services/api";

const toForm = (
  data: OfficeBearerFormData
) => {
  const form = new FormData();

  form.append(
    "fullName",
    data.fullName
  );

  form.append(
    "email",
    data.email || ""
  );

  form.append(
    "phone",
    data.phone || ""
  );

  form.append(
    "designation",
    data.designation || ""
  );

  form.append(
    "organization",
    data.organization || ""
  );

  form.append(
    "state",
    data.state || ""
  );

  form.append(
    "district",
    data.district || ""
  );

  form.append(
    "displayOrder",
    String(data.displayOrder)
  );

  if (data.photo) {
    form.append(
      "photo",
      data.photo
    );
  }

  return form;
};

export type OfficeBearerDirectoryFilters = {
  search?: string;
  organization?: string;
  designation?: string;
  state?: string;
  district?: string;
  sort?: "az" | "za" | "recent";
};

export const getPublicOfficeBearers =
  async (
    page = 1,
    limit = 12,
    filters: OfficeBearerDirectoryFilters = {},
    all = false
  ): Promise<OfficeBearerListResponse> => {
    const params =
      new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

    if (all) {
      params.set(
        "all",
        "true"
      );
    }

    Object.entries(filters).forEach(
      ([key, value]) => {
        if (value) {
          params.set(
            key,
            value
          );
        }
      }
    );

    const response =
      await apiFetch(
        `/office-bearers/public?${params.toString()}`
      );

    const payload =
      await responseJson<{
        data: OfficeBearer[];
        pagination?: OfficeBearerListResponse["pagination"];
        stats?: OfficeBearerListResponse["stats"];
      }>(response);

    return {
      data: payload.data,
      pagination: payload.pagination ?? {
        page,
        limit,
        total: payload.data.length,
        pages: 1,
      },
      stats: payload.stats,
    };
  };

export const getOfficeBearers =
  async (
    page = 1,
    limit = 10,
    search = ""
  ): Promise<OfficeBearerListResponse> => {
    const params =
      new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

    if (search) {
      params.set(
        "search",
        search
      );
    }

    const response =
      await authenticatedApiFetch(
        `/office-bearers?${params.toString()}`
      );

    const payload =
      await responseJson<{
        data: OfficeBearer[];
        pagination?: OfficeBearerListResponse["pagination"];
        stats?: OfficeBearerListResponse["stats"];
      }>(response);

    return {
      data: payload.data,
      pagination: payload.pagination ?? {
        page,
        limit,
        total: payload.data.length,
        pages: 1,
      },
      stats: payload.stats,
    };
  };

export const getOfficeBearer =
  async (id: string) => {
    const response =
      await authenticatedApiFetch(
        `/office-bearers/${id}`
      );

    const payload =
      await responseJson<{
        data: OfficeBearer;
      }>(response);

    return payload.data;
  };

export const createOfficeBearer =
  async (
    data: OfficeBearerFormData
  ) => {
    const response =
      await authenticatedApiFetch(
        "/office-bearers",
        {
          method: "POST",
          body: toForm(data),
        }
      );

    const payload =
      await responseJson<{
        data: OfficeBearer;
      }>(response);

    return payload.data;
  };

export const updateOfficeBearer =
  async (
    id: string,
    data: OfficeBearerFormData
  ) => {
    const response =
      await authenticatedApiFetch(
        `/office-bearers/${id}`,
        {
          method: "PUT",
          body: toForm(data),
        }
      );

    const payload =
      await responseJson<{
        data: OfficeBearer;
      }>(response);

    return payload.data;
  };

export const deleteOfficeBearer =
  async (id: string) => {
    const response =
      await authenticatedApiFetch(
        `/office-bearers/${id}`,
        {
          method: "DELETE",
        }
      );

    return responseJson<unknown>(
      response
    );
  };

export const importOfficeBearers =
  async (file: File) => {
    const form =
      new FormData();

    form.append(
      "file",
      file
    );

    const response =
      await authenticatedApiFetch(
        "/office-bearers/import",
        {
          method: "POST",
          body: form,
        }
      );

    const payload =
      await responseJson<{
        data: ImportSummary;
      }>(response);

    return payload.data;
  };

export const exportOfficeBearers =
  async (
    format: "xlsx" | "csv"
  ) => {
    const response =
      await authenticatedApiFetch(
        `/office-bearers/export?format=${encodeURIComponent(
          format
        )}`
      );

    if (!response.ok) {
      await responseJson(
        response
      );
    }

    const url =
      URL.createObjectURL(
        await response.blob()
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;
    link.download =
      `office-bearers.${format}`;

    link.click();

    URL.revokeObjectURL(
      url
    );
  };
