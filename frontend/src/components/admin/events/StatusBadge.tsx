"use client";

import clsx from "clsx";

interface StatusBadgeProps {
  status: "draft" | "published";
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        {
          "bg-yellow-100 text-yellow-700":
            status === "draft",

          "bg-green-100 text-green-700":
            status === "published",
        }
      )}
    >
      {status === "draft"
        ? "Draft"
        : "Published"}
    </span>
  );
}