"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import GalleryForm from "@/components/admin/gallery/GalleryForm";
import { createGallery } from "@/services/galleryService";
import { GalleryFormData } from "@/types/gallery";

export default function UploadGalleryPage() {
  const router = useRouter();

  const handleSubmit = async (data: GalleryFormData) => {
    if (!data.coverImage) {
      toast.error("Please select a cover image.");
      return;
    }

    if (data.images.length === 0) {
      toast.error("Please select at least one gallery image.");
      return;
    }

    if (data.images.length > 10) {
      toast.error("You can upload up to 10 gallery images at once.");
      return;
    }

    const files = [data.coverImage, ...data.images];
    if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      toast.error("Each image must be 5 MB or smaller.");
      return;
    }

    try {
      const response = await createGallery(data);

      if (!response.success) {
        toast.error(response.message || "Gallery upload failed.");
        return;
      }

      toast.success("Gallery uploaded successfully.");
      router.push("/admin/gallery");
    } catch {
      toast.error("Unable to upload the gallery. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Gallery</h1>
        <p className="mt-1 text-gray-500">
          Add a cover image and up to 10 images to create a gallery album.
        </p>
      </div>

      <GalleryForm
        onSubmit={handleSubmit}
        onCancel={() => router.push("/admin/gallery")}
      />
    </div>
  );
}
