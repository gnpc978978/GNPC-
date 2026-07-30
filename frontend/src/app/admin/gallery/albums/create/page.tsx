"use client";

import { useRouter } from "next/navigation";
import AlbumForm from "@/components/admin/gallery/AlbumForm";

export default function CreateAlbumPage() {
  const router = useRouter();

  const handleSubmit = (data: {
    title: string;
    category: string;
    description: string;
    coverImage: File | null;
  }) => {
    console.log(data);

    // TODO: API Integration

    router.push("/admin/gallery/albums");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Create Album
        </h1>

        <p className="mt-1 text-gray-500">
          Create a new gallery album.
        </p>
      </div>

      <AlbumForm onSubmit={handleSubmit} />
    </div>
  );
}