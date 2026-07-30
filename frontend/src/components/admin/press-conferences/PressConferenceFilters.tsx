import { FaSearch } from "react-icons/fa";

interface PressConferenceFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  venue: string;
  setVenue: (value: string) => void;
}

export default function PressConferenceFilters({
  search,
  setSearch,
  venue,
  setVenue,
}: PressConferenceFiltersProps) {
  return (
    <div className="mb-6 grid gap-4 rounded-lg border bg-white p-4 md:grid-cols-2">
      <div className="relative">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />

        <input
          type="text"
          placeholder="Search press conference..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border px-10 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <select
        value={venue}
        onChange={(e) => setVenue(e.target.value)}
        className="rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">
          All Venues
        </option>

        <option value="Press Club Auditorium">
          Press Club Auditorium
        </option>

        <option value="Conference Hall">
          Conference Hall
        </option>
      </select>
    </div>
  );
}