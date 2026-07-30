"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

interface Props {
  images: (File | string)[];
  setImages: (images: File[]) => void;
}

export default function ImageUploader({
  images,
  setImages,
}: Props) {
  const [previews, setPreviews] =
    useState<string[]>([]);

  const inputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    const urls = images.map((image) =>
      typeof image === "string"
        ? image
        : URL.createObjectURL(image)
    );

    setPreviews(urls);

    // Clear file input when images are reset
    if (
      images.length === 0 &&
      inputRef.current
    ) {
      inputRef.current.value = "";
    }

    return () => {
      urls.forEach((url, index) => {
        if (
          typeof images[index] !== "string"
        ) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [images]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      e.target.files || []
    );

    setImages(files);
  };

  return (
    <div className="space-y-3">
      <label className="block font-medium">
        Gallery Images
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="block w-full text-sm"
      />

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {previews.map(
            (preview, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg border"
              >
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="h-28 w-full object-cover"
                />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}