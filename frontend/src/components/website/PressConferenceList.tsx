"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";

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

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          badge="Press Conference"
          title={
            latestOnly
              ? "Latest Press Conference"
              : "Press Conferences & Media Events"
          }
          description="Stay informed about our media interactions, public briefings and official announcements."
        />

        {loading ? (
          <p className="mt-10 text-center text-slate-500">
            Loading press conferences...
          </p>
        ) : items.length === 0 ? (
          <p className="mt-10 text-center text-slate-500">
            No press conferences have been published yet.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {items.map((item) => {
              const date =
                item.date || item.createdAt;

              return (
                <Card key={item._id}>
                  <p className="text-sm font-semibold text-blue-700">
                    Press Conference
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {item.title}
                  </h2>

                  <div className="mt-5 flex items-center gap-3 text-sm text-slate-600">
                    <FaCalendarAlt className="text-blue-600" />

                    {date
                      ? new Date(date).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "Recent update"}
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-sm text-slate-600">
                    <FaMapMarkerAlt className="text-blue-600" />

                    {item.venue ||
                      "Greater Noida Press Club"}
                  </div>

                  {item.featuredImage && (
                    <img
                      src={item.featuredImage}
                      alt={item.title}
                      className="mt-5 h-48 w-full rounded-xl object-cover"
                    />
                  )}

                  <p className="mt-5 line-clamp-3 leading-7 text-slate-600">
                    {item.description ||
                      item.content ||
                      "Read the latest press conference update."}
                  </p>

                  <Link
                    href={`/press-conference/${item._id}`}
                    className="mt-7 inline-flex rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
                  >
                    View Details
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
