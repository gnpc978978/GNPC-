"use client";

import Image from "next/image";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
import { GalleryImage } from "@/types/gallery-image";

interface ImageTableProps {
  images: GalleryImage[];
  onDelete?: (id: number) => void;
}

export default function ImageTable({
  images,
  onDelete,
}: ImageTableProps) {
  if (images.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-700">
          No Images Found
        </h2>
        <p className="mt-2 text-gray-500">
          Upload your first image.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">Image</th>
              <th className="px-6 py-4 text-left">Title</th>
              <th className="px-6 py-4 text-left">Album</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Uploaded By</th>
              <th className="px-6 py-4 text-left">Uploaded At</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {images.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="relative h-14 w-20 overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>

                <td className="px-6 py-4 font-medium">
                  {item.title}
                </td>

                <td className="px-6 py-4">
                  {item.album}
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                    {item.category}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {item.uploadedBy}
                </td>

                <td className="px-6 py-4">
                  {item.uploadedAt}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <Link
                      href={`/admin/gallery/images/edit/${item.id}`}
                      className="rounded-lg bg-yellow-500 p-2 text-white hover:bg-yellow-600"
                    >
                      <FaEdit />
                    </Link>

                    <button
                      onClick={() => onDelete?.(item.id)}
                      className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}