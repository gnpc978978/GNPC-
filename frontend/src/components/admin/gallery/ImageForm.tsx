"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  initialData?: {
    title: string;
    album: string;
    category: string;
    image: string;
  };

  onSubmit: (data: {
    title: string;
    album: string;
    category: string;
    image: File | null;
  }) => void;
}

export default function ImageForm({
  initialData,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [album, setAlbum] = useState(initialData?.album || "");
  const [category, setCategory] = useState(
    initialData?.category || "Events"
  );

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState(
    initialData?.image || ""
  );

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    onSubmit({
      title,
      album,
      category,
      image,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border bg-white p-6 shadow-sm"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Image title"
          className="rounded-lg border px-4 py-3"
        />

        <input
          required
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          placeholder="Album"
          className="rounded-lg border px-4 py-3"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border px-4 py-3"
        >
          <option>Events</option>
          <option>Press Conference</option>
          <option>Meetings</option>
          <option>Awards</option>
          <option>Seminars</option>
          <option>Media</option>
          <option>Others</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="rounded-lg border p-3"
        />

        {preview && (
          <div className="relative h-60 w-full lg:col-span-2">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="rounded-lg object-cover"
            />
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Link
          href="/admin/gallery/images"
          className="rounded-lg border px-5 py-2.5"
        >
          Cancel
        </Link>

        <button
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-white"
        >
          Save Image
        </button>
      </div>
    </form>
  );
}