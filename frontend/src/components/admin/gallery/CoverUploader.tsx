"use client";

import { useEffect, useState } from "react";
import { UploadCloud } from "lucide-react";

interface Props {
  image: File | string | null;
  setImage: (image: File | null) => void;
}

export default function CoverUploader({
  image,
  setImage,
}: Props) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (typeof image === "string") {
      setPreview(image);
    } else if (!image) {
      setPreview("");
    }
  }, [image]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;

    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        Cover Image
      </label>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50">
        <UploadCloud className="mb-3 h-10 w-10 text-blue-500" />

        <p className="font-medium text-gray-700">
          Click to upload cover image
        </p>

        <p className="mt-1 text-xs text-gray-500">
          PNG, JPG or WEBP
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </label>

      {preview && (
        <img
          src={preview}
          alt="Cover Preview"
          className="h-48 w-full rounded-xl border object-cover shadow-md"
        />
      )}
    </div>
  );
}