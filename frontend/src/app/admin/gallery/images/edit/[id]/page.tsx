"use client";

import { useParams, useRouter } from "next/navigation";
import ImageForm from "@/components/admin/gallery/ImageForm";
import { galleryImages } from "@/data/gallery-images";

export default function EditImagePage() {
  const router = useRouter();
  const params = useParams();

  const image = galleryImages.find(
    (item) => item.id === Number(params.id)
  );

  if (!image) return <p>Image not found.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Edit Image
      </h1>

      <ImageForm
        initialData={{
          title: image.title,
          album: image.album,
          category: image.category,
          image: image.image,
        }}
        onSubmit={(data) => {
          console.log(data);
          router.push("/admin/gallery/images");
        }}
      />
    </div>
  );
}