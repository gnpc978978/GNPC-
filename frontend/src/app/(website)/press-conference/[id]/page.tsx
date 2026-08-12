"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Conference = {
  _id: string;
  title: string;
  venue?: string;
  date?: string;
  description?: string;
  content?: string;
  featuredImage?: string;
  pdfFile?: string;
};

export default function PressConferenceDetailsPage() {
  const { id } =
    useParams<{ id: string }>();

  const [item, setItem] =
    useState<Conference | null>(null);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/press-conferences/${id}`
    )
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Press conference not found"
          );
        }

        return data;
      })
      .then((data) => {
        setItem(data.data);
      })
      .catch(() => {
        setError(true);
      });
  }, [id]);

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24">

        <h1 className="text-3xl font-bold">
          Press Conference Not Found
        </h1>

        <Link
          href="/press-conference"
          className="mt-6 inline-block text-blue-700"
        >
          Back to Press Conferences
        </Link>

      </main>
    );
  }

  if (!item) {
    return (
      <main className="py-24 text-center text-slate-500">
        Loading press conference...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 sm:py-24">

      <Link
        href="/press-conference"
        className="text-sm font-semibold text-blue-700"
      >
        ← All Press Conferences
      </Link>

      {item.featuredImage && (
        <img
          src={item.featuredImage}
          alt={item.title}
          className="mt-8 max-h-[500px] w-full rounded-2xl object-cover"
        />
      )}

      <h1 className="mt-8 text-4xl font-extrabold text-slate-900">
        {item.title}
      </h1>

      <div className="mt-5 space-y-2 text-slate-600">

        {item.date && (
          <p>
            <strong>Date:</strong>{" "}
            {new Date(
              item.date
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
          <p>
            <strong>Venue:</strong>{" "}
            {item.venue}
          </p>
        )}

      </div>

      <article className="mt-8 whitespace-pre-line leading-8 text-slate-700">
        {item.content ||
          item.description ||
          "No details available."}
      </article>

      {item.pdfFile && (
        <a
          href={item.pdfFile}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white"
        >
          View / Download PDF
        </a>
      )}

    </main>
  );
}
