"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

interface AlbumFormProps {
  initialData?: {
    title: string;
    category: string;
    description: string;
    coverImage: string;
  };
  onSubmit: (data: {
    title: string;
    category: string;
    description: string;
    coverImage: File | null;
  }) => void;
}

export default function AlbumForm({
  initialData,
  onSubmit,
}: AlbumFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState(
    initialData?.category || "Events"
  );
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  const [coverImage, setCoverImage] = useState<File | null>(null);

  const [preview, setPreview] = useState(
    initialData?.coverImage || ""
  );

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setCoverImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    onSubmit({
      title,
      category,
      description,
      coverImage,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Album Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter album title"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option>Events</option>
            <option>Press Conference</option>
            <option>Meetings</option>
            <option>Awards</option>
            <option>Seminars</option>
            <option>Media</option>
            <option>Others</option>
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Description
          </label>

          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Album description..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Cover Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded-lg border border-gray-300 p-3"
          />

          {preview && (
            <div className="relative mt-4 h-56 w-80 overflow-hidden rounded-lg border">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <Link
          href="/admin/gallery/albums"
          className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium hover:bg-gray-100"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          Save Album
        </button>
      </div>
    </form>
  );
}