"use client";

import Image from "next/image";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Album } from "@/types/album";

interface AlbumTableProps {
  albums: Album[];
  onDelete?: (id: number) => void;
}

export default function AlbumTable({
  albums,
  onDelete,
}: AlbumTableProps) {
  if (albums.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-700">
          No Albums Found
        </h2>
        <p className="mt-2 text-gray-500">
          Create your first gallery album.
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
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Cover
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Album
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Category
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Images
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Created By
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Created At
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {albums.map((album) => (
              <tr
                key={album.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="relative h-14 w-20 overflow-hidden rounded-lg">
                    <Image
                      src={album.coverImage}
                      alt={album.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>

                <td className="px-6 py-4 font-medium text-gray-900">
                  {album.title}
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {album.category}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {album.totalImages}
                </td>

                <td className="px-6 py-4">
                  {album.createdBy}
                </td>

                <td className="px-6 py-4">
                  {album.createdAt}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <Link
                      href={`/admin/gallery/albums/edit/${album.id}`}
                      className="rounded-lg bg-yellow-500 p-2 text-white transition hover:bg-yellow-600"
                    >
                      <FaEdit />
                    </Link>

                    <button
                      onClick={() => onDelete?.(album.id)}
                      className="rounded-lg bg-red-500 p-2 text-white transition hover:bg-red-600"
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