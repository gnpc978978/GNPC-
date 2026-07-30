"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PressConferenceForm from "@/components/admin/press-conferences/PressConferenceForm";
import { getPressConference, updatePressConference } from "@/services/pressConferenceService";
import type { PressConference, PressConferenceFormData } from "@/types/pressConference";

export default function EditPressConferencePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [pressConference, setPressConference] = useState<PressConference | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getPressConference(id)
      .then(setPressConference)
      .catch((error) => setError(error instanceof Error ? error.message : "Failed to load press conference."));
  }, [id]);

  const handleSubmit = async (data: PressConferenceFormData) => {
    try {
      setSubmitting(true);
      setError("");
      await updatePressConference(id, data);
      router.push("/admin/press-conferences");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update press conference.");
    } finally {
      setSubmitting(false);
    }
  };

  if (error && !pressConference) return <p className="p-6 text-red-600">{error}</p>;
  if (!pressConference) return <p className="p-6 text-gray-500">Loading press conference...</p>;

  return (
    <div className="space-y-6 p-6">
      <div><h1 className="text-2xl font-bold">Edit Press Conference</h1><p className="text-sm text-gray-500">Update press conference details</p></div>
      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <PressConferenceForm initialData={pressConference} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
