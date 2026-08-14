"use client";

import Image from "next/image";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";

import { GalleryImage } from "@/types/gallery";

interface GalleryCardProps {
  image: GalleryImage;
  onDelete?: (id: number) => void;
}

export default function GalleryCard({
  image,
  onDelete,
}: GalleryCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-52 w-full">
        <Image
          src={image.image}
          alt={image.title}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="space-y-3 p-5">
        <div>
          <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">
            {image.title}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Uploaded by {image.uploadedBy}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            {image.album}
          </span>

          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            {image.category}
          </span>
        </div>

        <p className="text-sm text-gray-500">
          {image.date}
        </p>

        <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
          <Link
            href={`/admin/gallery/images/edit/${image.id}`}
            aria-label={`Edit ${image.title}`}
            title="Edit image"
            className="rounded-lg bg-yellow-500 p-2 text-white transition hover:bg-yellow-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
          >
            <FaEdit aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => onDelete?.(image.id)}
            aria-label={`Delete ${image.title}`}
            title="Delete image"
            className="rounded-lg bg-red-500 p-2 text-white transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            <FaTrash aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
