export interface PressConference {
  _id: string;
  title: string;
  venue: string;
  date: string;
  description: string;
  content: string;
  featuredImage?: string;
  pdfFile?: string;
  status?: "DRAFT" | "PUBLISHED";
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PressConferenceFormData {
  title: string;
  venue: string;
  date: string;
  description: string;
  content: string;
  status: "DRAFT" | "PUBLISHED";
  featuredImage: File | null;
  pdfFile: File | null;
}
