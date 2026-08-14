import {
  authenticatedApiFetch,
  responseJson,
} from "@/services/api";

export type AdminAccount = {
  _id: string;
  name: string;
  username?: string;
  email: string;
  role:
    | "ADMIN"
    | "SUPER_ADMIN";
  status:
    | "ACTIVE"
    | "INACTIVE";
  lastLogin?: string;
  createdAt: string;
};

export const getAdmins =
  async (): Promise<
    AdminAccount[]
  > => {
    const response =
      await authenticatedApiFetch(
        "/admins"
      );

    return (
      await responseJson<{
        data: AdminAccount[];
      }>(response)
    ).data;
  };

export const getAdminById =
  async (
    id: string
  ): Promise<AdminAccount> => {
    const response =
      await authenticatedApiFetch(
        `/admins/${id}`
      );

    return (
      await responseJson<{
        data: AdminAccount;
      }>(response)
    ).data;
  };

export const createAdmin =
  async (
    adminData: unknown
  ) =>
    responseJson(
      await authenticatedApiFetch(
        "/admins",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            adminData
          ),
        }
      )
    );

export const updateAdmin =
  async (
    id: string,
    adminData: unknown
  ) =>
    responseJson(
      await authenticatedApiFetch(
        `/admins/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            adminData
          ),
        }
      )
    );

export const deleteAdmin =
  async (
    id: string
  ) =>
    responseJson(
      await authenticatedApiFetch(
        `/admins/${id}`,
        {
          method: "DELETE",
        }
      )
    );

export const changeAdminStatus =
  async (
    id: string,
    status:
      | "ACTIVE"
      | "INACTIVE"
  ) =>
    responseJson(
      await authenticatedApiFetch(
        `/admins/${id}/${
          status === "ACTIVE"
            ? "activate"
            : "deactivate"
        }`,
        {
          method: "PATCH",
        }
      )
    );

export const resetAdminPassword =
  async (
    id: string,
    password: string
  ) =>
    responseJson(
      await authenticatedApiFetch(
        `/admins/${id}/reset-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            password,
          }),
        }
      )
    );
