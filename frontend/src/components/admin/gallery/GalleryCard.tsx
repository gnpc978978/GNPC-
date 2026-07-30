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
            href={`/admin/gallery/edit/${image.id}`}
            className="rounded-lg bg-yellow-500 p-2 text-white transition hover:bg-yellow-600"
          >
            <FaEdit />
          </Link>

          <button
            onClick={() => onDelete?.(image.id)}
            className="rounded-lg bg-red-500 p-2 text-white transition hover:bg-red-600"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}