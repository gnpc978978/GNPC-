"use client";

import { FaSearch } from "react-icons/fa";

interface GalleryFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  album: string;
  setAlbum: (value: string) => void;
  categories: string[];
  albums: string[];
}

export default function GalleryFilters({
  search,
  setSearch,
  category,
  setCategory,
  album,
  setAlbum,
  categories,
  albums,
}: GalleryFiltersProps) {
  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search images..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-11 pr-4 outline-none transition focus:border-blue-500"
          />
        </div>

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500"
        >
          <option value="All">All Categories</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* Album Filter */}
        <select
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500"
        >
          <option value="All">All Albums</option>

          {albums.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}