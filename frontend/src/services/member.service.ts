import type {
  ImportSummary,
  Member,
  MemberFormData,
  MemberListResponse,
} from "@/types/member";

import {
  apiFetch,
  authenticatedApiFetch,
  responseJson,
} from "@/services/api";

const toForm = (
  data: MemberFormData
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

export type MemberDirectoryFilters = {
  search?: string;
  organization?: string;
  designation?: string;
  state?: string;
  district?: string;
  sort?: "az" | "za" | "recent";
};

export const getPublicMembers =
  async (
    page = 1,
    limit = 12,
    filters: MemberDirectoryFilters = {},
    all = false
  ): Promise<MemberListResponse> => {
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
        `/members/public?${params.toString()}`
      );

    const payload =
      await responseJson<{
        data: Member[];
        pagination?: MemberListResponse["pagination"];
        stats?: MemberListResponse["stats"];
      }>(response);

    return {
      data: payload.data,
      pagination:
        payload.pagination,
      stats: payload.stats,
    };
  };

export const getMembers =
  async (
    page = 1,
    limit = 10,
    search = ""
  ): Promise<MemberListResponse> => {
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
        `/members?${params.toString()}`
      );

    const payload =
      await responseJson<{
        data: Member[];
        pagination?: MemberListResponse["pagination"];
        stats?: MemberListResponse["stats"];
      }>(response);

    return {
      data: payload.data,
      pagination:
        payload.pagination,
      stats: payload.stats,
    };
  };

export const getMember =
  async (id: string) => {
    const response =
      await authenticatedApiFetch(
        `/members/${id}`
      );

    const payload =
      await responseJson<{
        data: Member;
      }>(response);

    return payload.data;
  };

export const createMember =
  async (
    data: MemberFormData
  ) => {
    const response =
      await authenticatedApiFetch(
        "/members",
        {
          method: "POST",
          body: toForm(data),
        }
      );

    const payload =
      await responseJson<{
        data: Member;
      }>(response);

    return payload.data;
  };

export const updateMember =
  async (
    id: string,
    data: MemberFormData
  ) => {
    const response =
      await authenticatedApiFetch(
        `/members/${id}`,
        {
          method: "PUT",
          body: toForm(data),
        }
      );

    const payload =
      await responseJson<{
        data: Member;
      }>(response);

    return payload.data;
  };

export const deleteMember =
  async (id: string) => {
    const response =
      await authenticatedApiFetch(
        `/members/${id}`,
        {
          method: "DELETE",
        }
      );

    return responseJson<unknown>(
      response
    );
  };

export const importMembers =
  async (file: File) => {
    const form =
      new FormData();

    form.append(
      "file",
      file
    );

    const response =
      await authenticatedApiFetch(
        "/members/import",
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

export const exportMembers =
  async (
    format: "xlsx" | "csv"
  ) => {
    const response =
      await authenticatedApiFetch(
        `/members/export?format=${encodeURIComponent(
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
      `members.${format}`;

    link.click();

    URL.revokeObjectURL(
      url
    );
  };
