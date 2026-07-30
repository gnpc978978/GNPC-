"use client";

import {
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import { Announcement } from "@/types/announcement";

interface AnnouncementActionsProps {
  announcement: Announcement;
  onView?: (announcement: Announcement) => void;
  onEdit?: (announcement: Announcement) => void;
  onDelete?: (id: string) => void;
}

export default function AnnouncementActions({
  announcement,
  onView,
  onEdit,
  onDelete,
}: AnnouncementActionsProps) {

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (confirmDelete) {
      onDelete?.(announcement._id);
    }
  };

  return (
    <div className="flex items-center gap-3">

      {/* View */}
      <button
        type="button"
        onClick={() => onView?.(announcement)}
        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
        title="View Announcement"
      >
        <FaEye size={16} />
      </button>

      {/* Edit */}
      <button
        type="button"
        onClick={() => onEdit?.(announcement)}
        className="rounded-lg p-2 text-green-600 transition hover:bg-green-50"
        title="Edit Announcement"
      >
        <FaEdit size={16} />
      </button>

      {/* Delete */}
      <button
        type="button"
        onClick={handleDelete}
        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
        title="Delete Announcement"
      >
        <FaTrash size={16} />
      </button>

    </div>
  );
}