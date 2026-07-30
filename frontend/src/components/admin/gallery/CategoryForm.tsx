"use client";

import { useState } from "react";
import Link from "next/link";

interface Props {
  initialName?: string;
  onSubmit: (name: string) => void;
}

export default function CategoryForm({
  initialName = "",
  onSubmit,
}: Props) {
  const [name, setName] = useState(initialName);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(name);
      }}
      className="rounded-xl border bg-white p-6 shadow-sm"
    >
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category Name"
        className="mb-6 w-full rounded-lg border px-4 py-3"
      />

      <div className="flex justify-end gap-3">
        <Link
          href="/admin/gallery/categories"
          className="rounded-lg border px-5 py-2.5"
        >
          Cancel
        </Link>

        <button className="rounded-lg bg-blue-600 px-6 py-2.5 text-white">
          Save
        </button>
      </div>
    </form>
  );
}