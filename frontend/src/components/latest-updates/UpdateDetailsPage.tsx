"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CalendarDays,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";

import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";

type Update = {
  title: string;
  content?: string;
  description?: string;
  image?: string;
  banner?: string;
  category?: string;
  createdAt?: string;
  publishedAt?: string;
  date?: string;
  location?: string;
};

type Props = {
  type:
    | "press-releases"
    | "announcements"
    | "events";
  label: string;
};

const formatDate = (value?: string) => {
  if (!value) {
    return "Recently published";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
};

const getPageContent = (
  type: Props["type"],
  label: string
) => {
  switch (type) {
    case "announcements":
      return {
        eyebrow: "Announcements",
        title: "Announcements",
        description:
          "Stay informed about important announcements and updates from Greater Noida Press Club.",
      };

    case "press-releases":
      return {
        eyebrow: "News & Updates",
        title: "Press Release",
        description:
          "Read official press releases and updates from Greater Noida Press Club.",
      };

    case "events":
      return {
        eyebrow: "GNPC Events",
        title: "Event Details",
        description:
          "Explore events and activities organised by Greater Noida Press Club.",
      };

    default:
      return {
        eyebrow: label,
        title: label,
        description:
          "Latest information from Greater Noida Press Club.",
      };
  }
};

export default function UpdateDetailsPage({
  type,
  label,
}: Props) {
  const { slug } =
    useParams<{ slug: string }>();

  const [item, setItem] =
    useState<Update | null>(null);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadUpdate = async () => {
      try {
        setError(false);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/${type}/${slug}`
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to load update"
          );
        }

        if (!cancelled) {
          setItem(data.data);
        }
      } catch (error) {
        console.error(
          "Failed to load update:",
          error
        );

        if (!cancelled) {
          setError(true);
        }
      }
    };

    if (slug) {
      loadUpdate();
    }

    return () => {
      cancelled = true;
    };
  }, [slug, type]);

  const pageContent = getPageContent(
    type,
    label
  );

  if (error) {
    return (
      <main className="bg-white">
        <PageHero
          eyebrow={pageContent.eyebrow}
          title={pageContent.title}
          description={pageContent.description}
          breadcrumbs={[
            {
              label: "Home",
              href: "/",
            },
            {
              label: pageContent.title,
            },
          ]}
        />

        <Container>
          <section className="py-20 sm:py-24">
            <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                <span className="text-xl font-black">
                  !
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-extrabold text-slate-900">
                Update not found
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                The requested content could not be
                found or may no longer be available.
              </p>

              <Link
                href="/latest-updates"
                className="gnpc-btn gnpc-btn-primary gnpc-btn-md mt-7"
              >
                Back to Latest Updates
              </Link>
            </div>
          </section>
        </Container>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="bg-white">
        <PageHero
          eyebrow={pageContent.eyebrow}
          title={pageContent.title}
          description={pageContent.description}
          breadcrumbs={[
            {
              label: "Home",
              href: "/",
            },
            {
              label: pageContent.title,
            },
          ]}
        />

        <Container>
          <section className="py-20 sm:py-24">
            <div
              className={[
                "mx-auto",
                "max-w-4xl",
                "animate-pulse",
              ].join(" ")}
            >
              <div className="h-5 w-32 rounded bg-slate-200" />

              <div className="mt-5 h-10 w-3/4 rounded bg-slate-200" />

              <div className="mt-4 h-5 w-1/2 rounded bg-slate-100" />

              <div className="mt-8 h-[280px] rounded-2xl bg-slate-100 sm:h-[420px]" />

              <div className="mt-8 space-y-3">
                <div className="h-4 w-full rounded bg-slate-100" />
                <div className="h-4 w-11/12 rounded bg-slate-100" />
                <div className="h-4 w-10/12 rounded bg-slate-100" />
              </div>
            </div>
          </section>
        </Container>
      </main>
    );
  }

  const image =
    item.image || item.banner;

  const date =
    item.publishedAt ||
    item.date ||
    item.createdAt;

  return (
    <main className="bg-white">
      {/* =====================================================
          STANDARD PAGE HERO
          ===================================================== */}

      <PageHero
        eyebrow={pageContent.eyebrow}
        title={pageContent.title}
        description={pageContent.description}
        breadcrumbs={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: pageContent.title,
            href: "/latest-updates",
          },
          {
            label: item.title,
          },
        ]}
      />

      {/* =====================================================
          ARTICLE
          ===================================================== */}

      <section className="bg-slate-50 py-10 sm:py-14 lg:py-16">
        <Container>
          <article className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Back navigation */}

            <div className="border-b border-slate-100 px-5 py-4 sm:px-8">
              <Link
                href="/latest-updates"
                className={[
                  "inline-flex",
                  "items-center",
                  "text-sm",
                  "font-bold",
                  "text-[#155eef]",
                  "transition-colors",
                  "hover:text-[#0f4c81]",
                ].join(" ")}
              >
                ← Back to latest updates
              </Link>
            </div>

            {/* Article header */}

            <div className="px-5 pb-8 pt-7 sm:px-8 sm:pb-10 sm:pt-9">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#155eef]">
                {item.category || label}
              </p>

              <h2
                className={[
                  "mt-3",
                  "text-3xl",
                  "font-black",
                  "leading-tight",
                  "tracking-[-0.025em]",
                  "text-[#101828]",
                  "sm:text-4xl",
                  "lg:text-5xl",
                ].join(" ")}
              >
                {item.title}
              </h2>

              {/* Metadata */}

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays
                    size={17}
                    className="text-[#155eef]"
                    aria-hidden="true"
                  />

                  {formatDate(date)}
                </span>

                {item.location && (
                  <span className="inline-flex items-center gap-2">
                    <MapPin
                      size={17}
                      className="text-[#155eef]"
                      aria-hidden="true"
                    />

                    {item.location}
                  </span>
                )}
              </div>
            </div>

            {/* Image */}

            {image && (
              <div className="px-5 sm:px-8">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <img
                    src={image}
                    alt={item.title}
                    className={[
                      "block",
                      "h-auto",
                      "max-h-[480px]",
                      "w-full",
                      "object-cover",
                    ].join(" ")}
                  />
                </div>
              </div>
            )}

            {/* Content */}

            <div className="px-5 pb-10 pt-8 sm:px-8 sm:pb-12">
              <div
                className={[
                  "whitespace-pre-line",
                  "text-base",
                  "leading-8",
                  "text-slate-700",
                  "sm:text-[17px]",
                  "sm:leading-8",
                ].join(" ")}
              >
                {item.content ||
                  item.description ||
                  "No additional information is available."}
              </div>
            </div>
          </article>
        </Container>
      </section>
    </main>
  );
}
