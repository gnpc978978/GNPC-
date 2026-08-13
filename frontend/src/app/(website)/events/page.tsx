"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";

import {
  apiFetch,
  responseJson,
} from "@/services/api";

type EventItem = {
  _id: string;
  slug?: string;
  title: string;
  description?: string;
  banner?: string;
  date?: string;
  location?: string;
  venue?: string;
};

export default function EventsPage() {
  const [events, setEvents] =
    useState<EventItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(false);

        const response =
          await apiFetch(
            "/events"
          );

        const payload =
          await responseJson<{
            success: boolean;
            data: EventItem[];
          }>(response);

        if (!cancelled) {
          setEvents(
            Array.isArray(
              payload.data
            )
              ? payload.data
              : []
          );
        }
      } catch (error) {
        console.error(
          "Failed to load events:",
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

    void loadEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="bg-white">
      <PageHero
        eyebrow="GNPC Events"
        title="Events"
        description="Explore events and activities organised by Greater Noida Press Club."
        breadcrumbs={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Events",
          },
        ]}
      />

      <Container>
        <section className="py-14 sm:py-20">
          {loading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({
                length: 6,
              }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-2xl border border-slate-200"
                >
                  <div className="aspect-[16/9] bg-slate-200" />

                  <div className="space-y-3 p-6">
                    <div className="h-6 w-3/4 rounded bg-slate-200" />

                    <div className="h-4 w-full rounded bg-slate-200" />

                    <div className="h-4 w-2/3 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <h2 className="text-xl font-bold text-red-900">
                Unable to load events
              </h2>

              <p className="mt-2 text-sm text-red-700">
                Please try again later.
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            events.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center">
                <h2 className="text-xl font-bold text-slate-900">
                  No events available
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  There are currently no published events.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            events.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map(
                  (event) => {
                    const identifier =
                      event.slug ||
                      event._id;

                    return (
                      <Link
                        key={event._id}
                        href={`/events/${encodeURIComponent(
                          identifier
                        )}`}
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                      >
                        {event.banner ? (
                          <img
                            src={event.banner}
                            alt={event.title}
                            className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="aspect-[16/9] bg-slate-100" />
                        )}

                        <div className="p-6">
                          {event.date && (
                            <p className="text-sm font-semibold text-blue-700">
                              {new Date(
                                event.date
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

                          <h2 className="mt-2 text-xl font-bold text-slate-900">
                            {event.title}
                          </h2>

                          {(event.location ||
                            event.venue) && (
                            <p className="mt-2 text-sm text-slate-500">
                              {event.location ||
                                event.venue}
                            </p>
                          )}

                          {event.description && (
                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                              {event.description}
                            </p>
                          )}

                          <span className="mt-5 inline-block text-sm font-semibold text-blue-700">
                            View Event →
                          </span>
                        </div>
                      </Link>
                    );
                  }
                )}
              </div>
            )}
        </section>
      </Container>
    </main>
  );
}
