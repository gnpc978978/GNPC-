import type {
  Member,
  MemberFormData,
  MembersStats,
  ImportSummary,
  PaginatedMembers,
} from "@/types/member";

import {
  apiFetch,
  authenticatedApiFetch,
  responseJson,
} from "@/services/api";

const toFormData = (
  data: MemberFormData
) => {
  const formData = new FormData();

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

const queryString = (
  params: URLSearchParams
) => {
  const value = params.toString();

  return value
    ? `?${value}`
    : "";
};

/*
 * ==========================================================
 * ADMIN MEMBERS
 * ==========================================================
 */

export const getMembers =
  async (
    params = new URLSearchParams()
  ): Promise<PaginatedMembers> => {
    const response =
      await authenticatedApiFetch(
        `/members${queryString(
          params
        )}`
      );

    return responseJson<PaginatedMembers>(
      response
    );
  };

/*
 * ==========================================================
 * PUBLIC MEMBERS
 * ==========================================================
 *
 * Uses the dedicated public endpoint so the public website
 * does not inherit the admin endpoint's default limit of 10.
 */

export const getPublicMembers =
  async (
    params = new URLSearchParams()
  ): Promise<Member[]> => {
    const response =
      await apiFetch(
        `/members/public${queryString(
          params
        )}`
      );

    const payload =
      await responseJson<{
        data: Member[];
      }>(response);

    return payload.data;
  };

/*
 * ==========================================================
 * SINGLE MEMBER
 * ==========================================================
 */

export const getMember =
  async (
    id: string
  ) => {
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

/*
 * ==========================================================
 * MEMBER STATISTICS
 * ==========================================================
 */

export const getMembersStats =
  async () => {
    const response =
      await authenticatedApiFetch(
        "/members/stats"
      );

    const payload =
      await responseJson<{
        data: MembersStats;
      }>(response);

    return payload.data;
  };

/*
 * ==========================================================
 * CREATE MEMBER
 * ==========================================================
 */

export const createMember =
  async (
    data: MemberFormData
  ) => {
    const response =
      await authenticatedApiFetch(
        "/members",
        {
          method: "POST",
          body: toFormData(
            data
          ),
        }
      );

    const payload =
      await responseJson<{
        data: Member;
      }>(response);

    return payload.data;
  };

/*
 * ==========================================================
 * UPDATE MEMBER
 * ==========================================================
 */

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
          body: toFormData(
            data
          ),
        }
      );

    const payload =
      await responseJson<{
        data: Member;
      }>(response);

    return payload.data;
  };

/*
 * ==========================================================
 * DELETE MEMBER
 * ==========================================================
 */

export const deleteMember =
  async (
    id: string
  ) => {
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

/*
 * ==========================================================
 * IMPORT MEMBERS
 * ==========================================================
 */

export const importMembers =
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
        "/members/import",
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

/*
 * ==========================================================
 * EXPORT MEMBERS
 * ==========================================================
 */

export const exportMembers =
  async (
    filters = new URLSearchParams()
  ) => {
    const response =
      await authenticatedApiFetch(
        `/members/export${queryString(
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
      "members.xlsx";

    link.click();

    URL.revokeObjectURL(
      url
    );
  };
