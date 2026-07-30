"use client";

import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Category } from "@/types/category";

interface Props {
  categories: Category[];
  onDelete: (id: number) => void;
}

export default function CategoryTable({
  categories,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-4 text-left">Category</th>
            <th className="px-6 py-4 text-left">Images</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-6 py-4">{item.name}</td>
              <td className="px-6 py-4">{item.totalImages}</td>

              <td className="px-6 py-4">
                <div className="flex justify-center gap-2">
                  <Link
                    href={`/admin/gallery/categories/edit/${item.id}`}
                    className="rounded bg-yellow-500 p-2 text-white"
                  >
                    <FaEdit />
                  </Link>

                  <button
                    onClick={() => onDelete(item.id)}
                    className="rounded bg-red-500 p-2 text-white"
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
  );
}