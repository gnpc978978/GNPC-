"use client";

import AnnouncementActions from "./AnnouncementActions";
import StatusBadge from "./StatusBadge";

import { Announcement } from "@/types/announcement";

interface AnnouncementTableProps {
  announcements: Announcement[];
  loading?: boolean;
  onView?: (announcement: Announcement) => void;
  onEdit?: (announcement: Announcement) => void;
  onDelete?: (id: string) => void;
}

export default function AnnouncementTable({
  announcements,
  loading = false,
  onView,
  onEdit,
  onDelete,
}: AnnouncementTableProps) {
  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        Loading announcements...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="w-full min-w-[900px] text-left">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Title
            </th>

            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Category
            </th>

            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Author
            </th>

            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Date
            </th>

            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Status
            </th>

            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <tr
                key={announcement._id}
                className="border-b last:border-none hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-800">
                    {announcement.title}
                  </p>

                  {announcement.publishDate && (
                    <p className="mt-1 text-xs text-gray-500">
                      Publish: {announcement.publishDate}
                    </p>
                  )}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {announcement.category}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {announcement.author ?? "-"}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {announcement.date ?? "-"}
                </td>

                <td className="px-6 py-4">
                  <StatusBadge status={announcement.status} />
                </td>

                <td className="px-6 py-4">
                  <AnnouncementActions
                    announcement={announcement}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-10 text-center text-gray-500"
              >
                No announcements found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}