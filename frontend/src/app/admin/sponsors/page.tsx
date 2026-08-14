"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import Link from "next/link";

import SponsorTable from "@/components/admin/sponsors/SponsorTable";

import {
  getSponsors,
  deleteSponsor,
  updateSponsorStatus,
} from "@/services/sponsorService";

import { Sponsor } from "@/types/sponsor";

type SponsorStatus =
  | "ACTIVE"
  | "INACTIVE";

export default function SponsorPage() {
  const [loading, setLoading] =
    useState(true);

  const [sponsors, setSponsors] =
    useState<Sponsor[]>([]);

  const fetchSponsors =
    useCallback(async () => {
      try {
        setLoading(true);

        const data =
          await getSponsors();

        setSponsors(data);
      } catch (error) {
        console.error(
          "[Sponsors] Failed to load sponsors:",
          error
        );

        setSponsors([]);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void fetchSponsors();
  }, [fetchSponsors]);

  const handleDelete = async (
    id: string
  ) => {
    const confirmDelete =
      confirm(
        "Are you sure you want to delete this sponsor?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteSponsor(id);
      await fetchSponsors();
    } catch (error) {
      console.error(
        "[Sponsors] Failed to delete sponsor:",
        error
      );
    }
  };

  const handleStatusChange = async (
    id: string,
    status: SponsorStatus
  ) => {
    try {
      await updateSponsorStatus(
        id,
        status
      );

      await fetchSponsors();
    } catch (error) {
      console.error(
        "[Sponsors] Failed to update sponsor status:",
        error
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading Sponsors...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div
        className="
          mb-6
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <h1 className="text-3xl font-bold">
          Sponsor Management
        </h1>

        <Link
          href="/admin/sponsors/add"
          className="
            rounded-lg
            bg-blue-600
            px-5
            py-3
            text-center
            text-white
            hover:bg-blue-700
          "
        >
          + Add Sponsor
        </Link>
      </div>

      <SponsorTable
        sponsors={sponsors}
        onDelete={handleDelete}
        onStatusChange={
          handleStatusChange
        }
      />
    </div>
  );
}
