"use client";

import { useRouter, useParams } from "next/navigation";
import AlbumForm from "@/components/admin/gallery/AlbumForm";
import { albums } from "@/data/albums";

export default function EditAlbumPage() {
  const router = useRouter();
  const params = useParams();

  const album = albums.find(
    (item) => item.id === Number(params.id)
  );

  if (!album) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-red-600">
        Album not found.
      </div>
    );
  }

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
          Edit Album
        </h1>

        <p className="mt-1 text-gray-500">
          Update gallery album details.
        </p>
      </div>

      <AlbumForm
        initialData={{
          title: album.title,
          category: album.category,
          description: "",
          coverImage: album.coverImage,
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}