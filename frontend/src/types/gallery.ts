export interface Gallery {
  _id: string;
  title: string;
  coverImage: string;
  images: string[];
  category: string;
  description: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryFormData {
  title: string;

  // File upload ke liye
  coverImage: File | null;

  // Multiple files
  images: File[];

  category: string;
  description: string;
  status: "active" | "inactive";
}

export interface GalleryImage {
  id: number;
  title: string;
  image: string;
  album: string;
  category: string;
  uploadedBy: string;
  date: string;
}
