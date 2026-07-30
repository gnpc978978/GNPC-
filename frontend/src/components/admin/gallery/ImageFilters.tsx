"use client";

import Link from "next/link";
import { FaPlus, FaSearch } from "react-icons/fa";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  album: string;
  setAlbum: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  albums: string[];
  categories: string[];
}

export default function ImageFilters({
  search,
  setSearch,
  album,
  setAlbum,
  category,
  setCategory,
  albums,
  categories,
}: Props) {
  return (
    <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-4">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search images..."
            className="w-full rounded-lg border py-2.5 pl-10 pr-4"
          />
        </div>

        <select
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          className="rounded-lg border px-4"
        >
          <option value="All">All Albums</option>

          {albums.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border px-4"
        >
          <option value="All">All Categories</option>

          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <Link
          href="/admin/gallery/images/create"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          <FaPlus />
          Upload Image
        </Link>
      </div>
    </div>
  );
}