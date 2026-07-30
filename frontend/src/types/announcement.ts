export interface Announcement {
  _id: string;

  title: string;

  category: string;

  author?: string;

  date?: string;

  status: "Draft" | "Published";

  publishDate?: string;

  description?: string;

  content?: string;

  image?: string;

  createdAt?: string;

  updatedAt?: string;
}