"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Conference = {
  title: string;
  venue?: string;
  date?: string;
  description?: string;
  content?: string;
  featuredImage?: string;
  image?: string;
  createdAt?: string;
};

export default function PressConferenceDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [item, setItem] =
    useState<Conference | null>(null);

  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        /*
         * First use the proper Press Conference API.
         */
        const conferenceResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/press-conferences/${id}`
        );

        if (conferenceResponse.ok) {
          const conferenceData =
            await conferenceResponse.json();

          if (conferenceData.success) {
            setItem(conferenceData.data);
            return;
          }
        }

        /*
         * Backward compatibility:
         * old Press Release records can still
         * be opened through Press Conference URLs.
         */
        const releaseResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/press-releases/${id}`
        );

        if (!releaseResponse.ok) {
          throw new Error();
        }

        const releaseData =
          await releaseResponse.json();

        if (!releaseData.success) {
          throw new Error();
        }

        setItem({
          title: releaseData.data.title,
          content: releaseData.data.content,
          description:
            releaseData.data.description,
          image: releaseData.data.image,
          createdAt: releaseData.data.createdAt,
          venue: "Greater Noida Press Club",
          date: releaseData.data.createdAt,
        });
      } catch (error) {
        console.error(
          "Failed to load press conference:",
          error
        );

        setError(true);
      }
    };

    void load();
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

  const image =
    item.featuredImage || item.image;

  const date =
    item.date || item.createdAt;

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
      <Link
        href="/press-conference"
        className="text-sm font-semibold text-blue-700"
      >
        ← All Press Conferences
      </Link>

      <p className="mt-8 text-sm font-semibold text-blue-700">
        PRESS CONFERENCE
      </p>

      <h1 className="mt-3 text-4xl font-extrabold text-slate-900">
        {item.title}
      </h1>

      {date && (
        <p className="mt-4 text-slate-500">
          {new Date(date).toLocaleDateString(
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

      {image && (
        <img
          src={image}
          alt={item.title}
          className="mt-8 max-h-[500px] w-full rounded-2xl object-cover"
        />
      )}

      {item.description && (
        <p className="mt-8 text-lg leading-8 text-slate-600">
          {item.description}
        </p>
      )}

      <article className="mt-8 whitespace-pre-line leading-8 text-slate-700">
        {item.content}
      </article>
    </main>
  );
}
