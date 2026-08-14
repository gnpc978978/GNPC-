import {
  apiFetch,
  authenticatedApiFetch,
  responseJson,
} from "@/services/api";

import {
  ContactMessage,
} from "@/types/contactMessage";

type ContactMessageApi = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactMessage["status"];
  createdAt: string;
  updatedAt?: string;
};

const mapContactMessage = (
  item: ContactMessageApi
): ContactMessage => ({
  id: item._id,
  name: item.name,
  email: item.email,
  phone: item.phone,
  subject: item.subject,
  message: item.message,
  status: item.status,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

export const getContactMessages =
  async (): Promise<
    ContactMessage[]
  > => {
    const response =
      await authenticatedApiFetch(
        "/contact-messages"
      );

    const result =
      await responseJson<{
        data: ContactMessageApi[];
      }>(response);

    return result.data.map(
      mapContactMessage
    );
  };

export const getContactMessageById =
  async (
    id: string
  ): Promise<ContactMessage> => {
    const response =
      await authenticatedApiFetch(
        `/contact-messages/${id}`
      );

    const result =
      await responseJson<{
        data: ContactMessageApi;
      }>(response);

    return mapContactMessage(
      result.data
    );
  };

export const updateContactMessageStatus =
  async (
    id: string,
    status:
      | "UNREAD"
      | "READ"
      | "REPLIED"
  ) => {
    const response =
      await authenticatedApiFetch(
        `/contact-messages/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

    return responseJson(response);
  };

export const deleteContactMessage =
  async (
    id: string
  ) => {
    const response =
      await authenticatedApiFetch(
        `/contact-messages/${id}`,
        {
          method: "DELETE",
        }
      );

    return responseJson(response);
  };
