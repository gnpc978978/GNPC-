"use client";

import { FaSearch, FaFilter } from "react-icons/fa";

interface AnnouncementFiltersProps {
  search: string;
  status: string;
  category: string;
  setSearch: (value: string) => void;
  setStatus: (value: string) => void;
  setCategory: (value: string) => void;
  onReset: () => void;
}

export default function AnnouncementFilters({
  search,
  status,
  category,
  setSearch,
  setStatus,
  setCategory,
  onReset,
}: AnnouncementFiltersProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <FaFilter className="text-blue-600" />
        <h3 className="font-semibold text-gray-800">
          Filter Announcements
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />

          <input
            type="text"
            placeholder="Search announcement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border py-2 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="">All Status</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Archived">Archived</option>
        </select>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="">All Categories</option>
          <option value="Event">Event</option>
          <option value="Notice">Notice</option>
          <option value="Press">Press Release</option>
          <option value="Other">Other</option>
        </select>

        {/* Reset */}
        <button
          onClick={onReset}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}