"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  ArrowRight,
} from "lucide-react";

import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import PageHero from "@/components/ui/PageHero";

type PressConference = {
  _id: string;
  title: string;
  venue?: string;
  date?: string;
  description?: string;
  content?: string;
  featuredImage?: string;
  createdAt?: string;
};

const API = process.env.NEXT_PUBLIC_API_URL;

function formatDate(value?: string) {
  if (!value) {
    return "Recent update";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recent update";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function PressConferenceList({
  latestOnly = false,
}: {
  latestOnly?: boolean;
}) {
  const [items, setItems] = useState<PressConference[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(
          `${API}/press-conferences`
        );

        const data = await response
          .json()
          .catch(() => ({ data: [] }));

        setItems(
          Array.isArray(data.data)
            ? data.data.slice(0, latestOnly ? 1 : 12)
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load press conferences:",
          error
        );

        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [latestOnly]);

  const title = latestOnly
    ? "Latest Press Conference"
    : "Press Conferences";

  const description = latestOnly
    ? "The latest media interaction and official briefing from Greater Noida Press Club."
    : "Stay informed about media interactions, public briefings and official announcements from Greater Noida Press Club.";

  return (
    <main className="bg-white">
      {/* =====================================================
          PAGE HERO
          ===================================================== */}

      {!latestOnly && (
        <PageHero
          eyebrow="Media & Journalism"
          title="Press Conferences"
          description={description}
        />
      )}

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <section
        className={
          latestOnly
            ? "bg-white py-14 sm:py-20"
            : "bg-slate-50 py-14 sm:py-20"
        }
      >
        <Container>
          {/* Homepage / latest-only heading */}
          {latestOnly && (
            <div className="mb-10">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">
                Media & Journalism
              </p>

              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {title}
              </h2>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                {description}
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div
              className="flex min-h-[240px] items-center justify-center"
              aria-live="polite"
            >
              <p className="text-sm font-medium text-slate-500">
                Loading press conferences...
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading && items.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                No press conferences available
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                No press conferences have been published yet.
                Please check back later for new media updates.
              </p>
            </div>
          )}

          {/* Cards */}
          {!loading && items.length > 0 && (
            <div
              className={
                latestOnly
                  ? "grid gap-6"
                  : "grid gap-6 md:grid-cols-2"
              }
            >
              {items.map((item) => {
                const date = item.date || item.createdAt;

                return (
                  <Card
                    key={item._id}
                    className="group overflow-hidden border-slate-200 bg-white p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Image */}
                    {item.featuredImage && (
                      <div className="overflow-hidden">
                        <img
                          src={item.featuredImage}
                          alt={item.title}
                          className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                    )}

                    <div className="p-6 sm:p-7">
                      {/* Category */}
                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-700">
                        Press Conference
                      </p>

                      {/* Title */}
                      <h2 className="mt-2 text-xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-2xl">
                        {item.title}
                      </h2>

                      {/* Meta */}
                      <div className="mt-5 flex flex-col gap-3 text-sm text-slate-600">
                        <div className="flex items-start gap-2.5">
                          <CalendarDays
                            size={17}
                            className="mt-0.5 shrink-0 text-blue-700"
                            aria-hidden="true"
                          />

                          <span>
                            {formatDate(date)}
                          </span>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <MapPin
                            size={17}
                            className="mt-0.5 shrink-0 text-blue-700"
                            aria-hidden="true"
                          />

                          <span>
                            {item.venue ||
                              "Greater Noida Press Club"}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mt-5 line-clamp-3 text-sm leading-7 text-slate-600">
                        {item.description ||
                          item.content ||
                          "Read the latest press conference update."}
                      </p>

                      {/* Action */}
                      <Link
                        href={`/press-conference/${item._id}`}
                        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
                      >
                        View Details

                        <ArrowRight
                          size={17}
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
