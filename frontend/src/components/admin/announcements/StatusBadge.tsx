interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyles: Record<string, string> = {
    Published:
      "bg-green-100 text-green-700 border-green-200",
    Draft:
      "bg-gray-100 text-gray-700 border-gray-200",
    Scheduled:
      "bg-blue-100 text-blue-700 border-blue-200",
    Archived:
      "bg-yellow-100 text-yellow-700 border-yellow-200",
  };

  const defaultStyle =
    "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
        statusStyles[status] || defaultStyle
      }`}
    >
      {status}
    </span>
  );
}