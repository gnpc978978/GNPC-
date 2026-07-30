import Link from "next/link";
import {
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

interface PressConferenceActionsProps {
  id: string;
  onDelete: (id: string) => void;
}

export default function PressConferenceActions({
  id,
  onDelete,
}: PressConferenceActionsProps) {
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this press conference?"
    );

    if (confirmDelete) {
      onDelete(id);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/admin/press-conferences/${id}`}
        className="text-blue-600 hover:text-blue-800"
        title="View"
      >
        <FaEye />
      </Link>

      <Link
        href={`/admin/press-conferences/${id}/edit`}
        className="text-green-600 hover:text-green-800"
        title="Edit"
      >
        <FaEdit />
      </Link>

      <button
        onClick={handleDelete}
        className="text-red-600 hover:text-red-800"
        title="Delete"
      >
        <FaTrash />
      </button>
    </div>
  );
}
