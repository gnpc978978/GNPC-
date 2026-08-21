"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/ui/Button";

import {
  apiFetch,
  responseJson,
} from "@/services/api";

type Conference = {
  _id: string;
  title: string;
  venue?: string;
  date?: string;
  description?: string;
  content?: string;
  featuredImage?: string;
  pdfFile?: string;
  createdAt?: string;
};

export default function PressConferenceDetailsPage() {
  const { id } =
    useParams<{ id: string }>();

  const [item, setItem] =
    useState<Conference | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!id) {
        return;
      }

      try {
        setLoading(true);
        setError(false);

        const response =
          await apiFetch(
            `/press-conferences/${encodeURIComponent(
              id
            )}`
          );

        const payload =
          await responseJson<{
            success: boolean;
            data: Conference;
          }>(response);

        if (!cancelled) {
          setItem(
            payload.data
          );
        }
      } catch (error) {
        console.error(
          "Failed to load press conference:",
          error
        );

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-24">
        <div className="animate-pulse">
          <div className="h-5 w-40 rounded bg-slate-200" />
          <div className="mt-8 h-12 w-3/4 rounded bg-slate-200" />
          <div className="mt-5 h-5 w-1/3 rounded bg-slate-200" />
          <div className="mt-8 aspect-video rounded-2xl bg-slate-200" />
        </div>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a7631]">
          Press Conference
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Press Conference Not Found
        </h1>

        <p className="mt-4 text-slate-500">
          The requested press conference could
          not be found or is no longer available.
        </p>

        <Link
          href="/press-conference"
          className="mt-6 inline-block text-[#9a7631]"
        >
          ← Back to Press Conferences
        </Link>
      </main>
    );
  }

  const date =
    item.date ||
    item.createdAt;

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
      <Link
        href="/press-conference"
        className="text-sm font-semibold text-[#9a7631]"
      >
        ← All Press Conferences
      </Link>

      <p className="mt-8 text-sm font-semibold text-[#9a7631]">
        PRESS CONFERENCE
      </p>

      <h1 className="mt-3 text-4xl font-extrabold text-slate-900 sm:text-5xl">
        {item.title}
      </h1>

      {date && (
        <p className="mt-4 text-slate-500">
          {new Date(
            date
          ).toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          )}
        </p>
      )}

      {item.venue && (
        <p className="mt-2 text-slate-500">
          📍 {item.venue}
        </p>
      )}

      {item.featuredImage && (
        <img
          src={item.featuredImage}
          alt={item.title}
          className="mt-8 max-h-[600px] w-full rounded-2xl object-cover"
        />
      )}

      {item.description && (
        <p className="mt-8 text-lg leading-8 text-slate-600">
          {item.description}
        </p>
      )}

      {item.content && (
        <article className="mt-8 whitespace-pre-line leading-8 text-slate-700">
          {item.content}
        </article>
      )}

      {item.pdfFile && (
        <Button href={item.pdfFile} target="_blank" rel="noopener noreferrer" size="lg" className="mt-8">View Press Conference PDF</Button>
      )}
    </main>
  );
}
