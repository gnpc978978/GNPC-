export interface ContactMessage {

  id: string;

  name: string;

  email: string;

  phone?: string;

  subject: string;

  message: string;

  status:
    | "UNREAD"
    | "READ"
    | "REPLIED";

  createdAt: string;

  updatedAt?: string;

}