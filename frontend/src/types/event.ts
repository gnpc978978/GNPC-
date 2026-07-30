export interface Event {
  _id: string;
  title: string;
  banner: string;
  gallery: string[];
  description: string;
  content?: string;
  location: string;
  date: string;
  time?: string;
  organizer?: string;
  slug?: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}
