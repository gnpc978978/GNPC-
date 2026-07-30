"use client";

import GalleryCard from "./GalleryCard";
import { GalleryImage } from "@/types/gallery";

interface GalleryGridProps {
  images: GalleryImage[];
  onDelete?: (id: number) => void;
}

export default function GalleryGrid({
  images,
  onDelete,
}: GalleryGridProps) {
  if (images.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700">
            No Images Found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Try changing the search or filter options.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {images.map((image) => (
        <GalleryCard
          key={image.id}
          image={image}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}