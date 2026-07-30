"use client";

import { Gallery } from "@/types/gallery";

interface Props {
  galleries: Gallery[];
  onEdit: (gallery: Gallery) => void;
  onDelete: (id: string) => void;
}

export default function GalleryTable({
  galleries,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto">

      <table className="w-full border-collapse">

        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">
              Title
            </th>

            <th className="p-3 text-left">
              Category
            </th>

            <th className="p-3 text-left">
              Status
            </th>

            <th className="p-3 text-left">
              Actions
            </th>
          </tr>
        </thead>


        <tbody>

          {galleries.map((gallery) => (

            <tr
              key={gallery._id}
              className="border-b"
            >

              <td className="p-3">
                {gallery.title}
              </td>


              <td className="p-3">
                {gallery.category}
              </td>


              <td className="p-3">
                {gallery.status}
              </td>


              <td className="p-3 flex gap-3">

                <button
                  onClick={() =>
                    onEdit(gallery)
                  }
                  className="text-blue-600"
                >
                  Edit
                </button>


                <button
                  onClick={() =>
                    onDelete(gallery._id)
                  }
                  className="text-red-600"
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}