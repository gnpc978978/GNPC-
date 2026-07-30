"use client";

import { useState } from "react";

interface FileUploadProps {
  type: "image" | "pdf";
  value?: string;
  onChange: (file: File | null) => void;
}

export default function FileUpload({
  type,
  value,
  onChange,
}: FileUploadProps) {
  const [fileName, setFileName] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFileName(file.name);
    onChange(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        Upload {type === "image" ? "Featured Image" : "PDF"}
      </label>

      <input
        type="file"
        accept={
          type === "image"
            ? "image/*"
            : "application/pdf"
        }
        onChange={handleChange}
        className="w-full rounded-md border p-2"
      />

      {fileName && (
        <p className="text-sm text-gray-600">
          Selected: {fileName}
        </p>
      )}

      {value && (
        <a
          href={value}
          target="_blank"
          className="text-sm text-blue-600 hover:underline"
        >
          View Uploaded File
        </a>
      )}
    </div>
  );
}