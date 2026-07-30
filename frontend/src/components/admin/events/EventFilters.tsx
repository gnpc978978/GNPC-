"use client";

import Link from "next/link";
import { FaPlus, FaSearch, FaRedo } from "react-icons/fa";

export default function EventFilters() {
  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}
        <div className="flex flex-1 flex-col gap-3 md:flex-row">

          {/* Search */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search events..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>


          {/* Status */}
          <select
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option>All Status</option>
            <option>Draft</option>
            <option>Published</option>
          </select>


          {/* Date */}
          <input
            type="date"
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />


          {/* Reset */}
          <button
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium transition hover:bg-gray-100"
          >
            <FaRedo size={13} />
            Reset
          </button>

        </div>


        {/* Right */}
        <Link
          href="/admin/events"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <FaPlus />
          Add Event
        </Link>

      </div>
    </div>
  );
}