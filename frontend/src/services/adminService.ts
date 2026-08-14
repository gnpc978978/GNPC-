import {
  authenticatedApiFetch,
  responseJson,
} from "@/services/api";

export type AdminAccount = {
  _id: string;
  name: string;
  username?: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
  status: "ACTIVE" | "INACTIVE";
  lastLogin?: string;
  createdAt: string;
};

export const getAdmins = async (): Promise<
  AdminAccount[]
> => {
  const response =
    await authenticatedApiFetch("/admins");

  const result = await responseJson<{
    data: AdminAccount[];
  }>(response);

  return result.data;
};

export const getAdminById = async (
  id: string
): Promise<AdminAccount> => {
  const response =
    await authenticatedApiFetch(
      `/admins/${id}`
    );

  const result =
    await responseJson<{
      data: AdminAccount;
    }>(response);

  return result.data;
};

export const createAdmin = async (
  adminData: unknown
) => {
  const response =
    await authenticatedApiFetch(
      "/admins",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );

  return responseJson(response);
};

export const updateAdmin = async (
  id: string,
  adminData: unknown
) => {
  const response =
    await authenticatedApiFetch(
      `/admins/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );

  return responseJson(response);
};

export const deleteAdmin = async (
  id: string
) => {
  const response =
    await authenticatedApiFetch(
      `/admins/${id}`,
      {
        method: "DELETE",
      }
    );

  return responseJson(response);
};

export const changeAdminStatus = async (
  id: string,
  status: "ACTIVE" | "INACTIVE"
) => {
  const action =
    status === "ACTIVE"
      ? "activate"
      : "deactivate";

  const response =
    await authenticatedApiFetch(
      `/admins/${id}/${action}`,
      {
        method: "PATCH",
      }
    );

  return responseJson(response);
};

export const resetAdminPassword = async (
  id: string,
  password: string
) => {
  const response =
    await authenticatedApiFetch(
      `/admins/${id}/reset-password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
        }),
      }
    );

  return responseJson(response);
};
