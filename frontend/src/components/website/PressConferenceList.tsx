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

export default function PressConferenceList({
  latestOnly = false,
}: {
  latestOnly?: boolean;
}) {
  const [items, setItems] =
    useState<Conference[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/press-conferences`
    )
      .then((response) => response.json())
      .then((data) => {
        const conferences = Array.isArray(data.data)
          ? data.data
          : [];

        setItems(
          conferences.slice(
            0,
            latestOnly ? 1 : 12
          )
        );
      })
      .catch(() => {
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
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
          description="Stay informed about our media interactions, public briefings and announcements."
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

            {items.map((item) => (
              <Card key={item._id}>

                {item.featuredImage && (
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    className="mb-5 h-56 w-full rounded-xl object-cover"
                  />
                )}

                <h2 className="text-2xl font-bold text-slate-900">
                  {item.title}
                </h2>

                <div className="mt-5 flex items-center gap-3 text-sm text-slate-600">
                  <FaCalendarAlt className="text-blue-600" />

                  {item.date
                    ? new Date(
                        item.date
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )
                    : "Date not available"}
                </div>

                <div className="mt-3 flex items-center gap-3 text-sm text-slate-600">
                  <FaMapMarkerAlt className="text-blue-600" />

                  {item.venue ||
                    "Greater Noida Press Club"}
                </div>

                <p className="mt-5 line-clamp-3 leading-7 text-slate-600">
                  {item.description ||
                    item.content ||
                    "Press conference details."}
                </p>

                <Link
                  href={`/press-conference/${item._id}`}
                  className="mt-7 inline-flex rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
                >
                  View Details
                </Link>

              </Card>
            ))}

          </div>
        )}

      </Container>
    </section>
  );
}
