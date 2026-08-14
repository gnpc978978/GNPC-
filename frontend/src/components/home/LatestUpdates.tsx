"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Newspaper,
} from "lucide-react";

import {
  apiFetch,
  responseJson,
} from "@/services/api";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

type LatestUpdate = {
  _id: string;
  title: string;
  slug?: string;
  type?: string;
  category?: string;
  excerpt?: string;
  description?: string;
  featuredImage?: string;
  image?: string;
  publishedAt?: string;
  date?: string;
  createdAt?: string;
};

type LatestUpdatesResponse = {
  success?: boolean;
  data?: LatestUpdate[];
};

function formatDate(value?: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getDetailHref(item: LatestUpdate) {
  const type = (
    item.type ||
    item.category ||
    ""
  ).toLowerCase();

  if (
    type.includes("press conference") ||
    type.includes("press-conference") ||
    type === "pressconference"
  ) {
    return `/press-conference/${encodeURIComponent(item._id)}`;
  }

  if (type.includes("announcement")) {
    return `/announcements/${encodeURIComponent(
      item.slug || item._id
    )}`;
  }

  if (type.includes("event")) {
    return `/events/${encodeURIComponent(
      item.slug || item._id
    )}`;
  }

  return `/press-releases/${encodeURIComponent(
    item.slug || item._id
  )}`;
}

export default function LatestUpdates() {
  const [items, setItems] = useState<LatestUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFetch("/latest-updates");

        const payload =
          await responseJson<LatestUpdatesResponse>(response);

        if (cancelled) {
          return;
        }

        const data = Array.isArray(payload.data)
          ? payload.data
          : [];

        setItems(data.slice(0, 3));
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        setItems([]);

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load latest updates."
        );
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
  }, []);

  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          align="left"
          badge="Latest Updates"
          title="News from Greater Noida Press Club"
          description="Stay updated with the latest announcements, events, press releases and press conferences."
          action={<Button href="/latest-updates" variant="outline" size="lg">View All Updates <ArrowRight size={17} /></Button>}
        />

        {loading && (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="aspect-[16/9] animate-pulse bg-slate-200" />

                <div className="space-y-3 p-3 sm:p-6">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
                  <div className="h-6 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div
            role="status"
            className="mx-auto mt-10 max-w-2xl rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
            <Newspaper
              className="mx-auto text-slate-400"
              size={38}
            />

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              No latest updates
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              New updates will appear here when they are published.
            </p>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
            {items.map((item) => {
              const image =
                item.featuredImage || item.image;

              const date =
                item.publishedAt ||
                item.date ||
                item.createdAt;

              return (
                <article
                  key={item._id}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {image ? (
                    <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                      <img
                        src={image}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
                      <Newspaper
                        size={40}
                        className="text-blue-300"
                      />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-3 sm:p-6">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-blue-700 sm:text-xs">
                      <span>
                        {item.type ||
                          item.category ||
                          "Update"}
                      </span>

                      {date && (
                        <span className="inline-flex items-center gap-1 text-slate-400">
                          <CalendarDays size={14} />
                          {formatDate(date)}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-tight text-slate-900 sm:mt-3 sm:text-xl">
                      {item.title}
                    </h3>

                    <p className="mt-2 line-clamp-3 flex-1 text-xs leading-5 text-slate-600 sm:mt-3 sm:text-sm sm:leading-6">
                      {item.excerpt ||
                        item.description ||
                        "Read the latest update from Greater Noida Press Club."}
                    </p>

                    <Link
                      href={getDetailHref(item)}
                      className="mt-3 inline-flex min-h-8 items-center gap-1 text-xs font-semibold text-blue-700 transition hover:text-blue-900 sm:mt-6 sm:min-h-11 sm:gap-2 sm:text-base"
                    >
                      Read More

                      <ArrowRight
                        size={17}
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
