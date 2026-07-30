"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPressConference } from "@/services/pressConferenceService";
import type { PressConference } from "@/types/pressConference";

export default function PressConferenceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [pressConference, setPressConference] = useState<PressConference | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getPressConference(id)
      .then(setPressConference)
      .catch((error) => setError(error instanceof Error ? error.message : "Failed to load press conference."));
  }, [id]);

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!pressConference) return <p className="p-6 text-gray-500">Loading press conference...</p>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{pressConference.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{pressConference.venue} · {new Date(pressConference.date).toLocaleDateString("en-IN")}</p>
        </div>
        <Link href={`/admin/press-conferences/${pressConference._id}/edit`} className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Edit</Link>
      </div>
      {pressConference.featuredImage && <img src={pressConference.featuredImage} alt={pressConference.title} className="max-h-80 w-full rounded-lg object-cover" />}
      {pressConference.description && <p className="text-gray-700">{pressConference.description}</p>}
      {pressConference.content && <article className="prose max-w-none" dangerouslySetInnerHTML={{ __html: pressConference.content }} />}
      {pressConference.pdfFile && <a href={pressConference.pdfFile} target="_blank" rel="noreferrer" className="inline-block text-blue-700 hover:underline">View attached PDF</a>}
    </div>
  );
}
