"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PressConferenceForm from "@/components/admin/press-conferences/PressConferenceForm";
import { createPressConference } from "@/services/pressConferenceService";
import type { PressConferenceFormData } from "@/types/pressConference";

export default function CreatePressConferencePage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: PressConferenceFormData) => {
    try {
      setSubmitting(true);
      setError("");
      await createPressConference(data);
      router.push("/admin/press-conferences");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create press conference.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">
          Create Press Conference
        </h1>

        <p className="text-sm text-gray-500">
          Add a new press conference record
        </p>
      </div>

      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <PressConferenceForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
