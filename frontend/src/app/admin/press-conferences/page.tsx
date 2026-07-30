"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

import PressConferenceFilters from "@/components/admin/press-conferences/PressConferenceFilters";
import PressConferenceTable from "@/components/admin/press-conferences/PressConferenceTable";

import { PressConference } from "@/types/pressConference";
import { deletePressConference, getPressConferences } from "@/services/pressConferenceService";


export default function PressConferencesPage() {
  const [search, setSearch] = useState("");
  const [venue, setVenue] = useState("");
  const [pressConferences, setPressConferences] = useState<PressConference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPressConferences = async () => {
    try {
      setError("");
      setPressConferences(await getPressConferences());
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load press conferences.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPressConferences();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deletePressConference(id);
      setPressConferences((items) => items.filter((item) => item._id !== id));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete press conference.");
    }
  };


  const filteredData = useMemo(() => pressConferences.filter(
    (item) =>
      item.title
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (venue === "" || item.venue === venue)
  ), [pressConferences, search, venue]);


  return (
    <div className="space-y-6 p-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold">
            Press Conferences
          </h1>

          <p className="text-sm text-gray-500">
            Manage press conference records
          </p>
        </div>


        <Link
          href="/admin/press-conferences/create"
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <FaPlus />
          Add New
        </Link>

      </div>


      <PressConferenceFilters
        search={search}
        setSearch={setSearch}
        venue={venue}
        setVenue={setVenue}
      />

      {loading ? <p className="py-10 text-center text-gray-500">Loading press conferences...</p> : error ? <p className="py-10 text-center text-red-600">{error}</p> : <PressConferenceTable data={filteredData} onDelete={handleDelete} />}

    </div>
  );
}
