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

type UpdateType =
  | "press-releases"
  | "announcements"
  | "events";

type Update = {
  _id?: string;
  slug?: string;
  title: string;
  content?: string;
  description?: string;
  image?: string;
  banner?: string;
  featuredImage?: string;
  category?: string;
  createdAt?: string;
  publishedAt?: string;
  date?: string;
  location?: string;
  venue?: string;
  status?: string;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  data?: Update;
};

type Props = {
  type: UpdateType;
  label: string;
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || ""
).replace(/\/+$/, "");

const formatDate = (
  value?: string
): string => {
  if (!value) {
    return "Date not available";
  }

  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "Date not available";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(date);
};

const getPageContent = (
  type: UpdateType,
  label: string
) => {
  switch (type) {
    case "events":
      return {
        eyebrow: "GNPC Events",
        title: "Event Details",
        description:
          "Explore events and activities organised by Greater Noida Press Club.",
      };

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

    default:
      return {
        eyebrow: label,
        title: label,
        description:
          "Latest information from Greater Noida Press Club.",
      };
  }
};

const getErrorMessage = (
  status: number
): string => {
  if (status === 404) {
    return "The requested content could not be found or may no longer be available.";
  }

  if (status >= 500) {
    return "The server could not load this content right now. Please try again later.";
  }

  if (status === 0) {
    return "Unable to connect to the server. Please check the website API configuration.";
  }

  return "We could not load this content. Please try again.";
};

const getContent = (
  item: Update
): string => {
  const value =
    item.content ||
    item.description ||
    "";

  return value.trim();
};

export default function UpdateDetailsPage({
  type,
  label,
}: Props) {
  const params =
    useParams<{
      slug?: string;
    }>();

  const rawSlug =
    params?.slug;

  const slug = Array.isArray(
    rawSlug
  )
    ? rawSlug[0]
    : rawSlug;

  const [
    item,
    setItem,
  ] =
    useState<Update | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  useEffect(() => {
    let cancelled = false;

    const loadUpdate =
      async () => {
        if (!slug) {
          if (!cancelled) {
            setLoading(false);
            setError(
              "The requested page does not have a valid identifier."
            );
          }

          return;
        }

        if (!API_URL) {
          if (!cancelled) {
            setLoading(false);
            setError(
              "NEXT_PUBLIC_API_URL is not configured."
            );
          }

          return;
        }

        try {
          setLoading(true);
          setError(null);
          setItem(null);

          const encodedSlug =
            encodeURIComponent(
              slug
            );

          const endpoint =
            `${API_URL}/${type}/${encodedSlug}`;

          const response =
            await fetch(
              endpoint,
              {
                method: "GET",
                headers: {
                  Accept:
                    "application/json",
                },
                cache: "no-store",
              }
            );

          const payload =
            (await response
              .json()
              .catch(
                () =>
                  ({
                    success: false,
                  }) as ApiResponse
              )) as ApiResponse;

          if (
            !response.ok
          ) {
            throw new Error(
              getErrorMessage(
                response.status
              )
            );
          }

          if (
            !payload.data
          ) {
            throw new Error(
              payload.message ||
                "The requested content was not returned by the server."
            );
          }

          if (!cancelled) {
            setItem(
              payload.data
            );
          }
        } catch (err) {
          console.error(
            `Failed to load ${type} detail page:`,
            err
          );

          if (!cancelled) {
            setItem(null);

            setError(
              err instanceof Error
                ? err.message
                : "We could not load this content. Please try again."
            );
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

    void loadUpdate();

    return () => {
      cancelled = true;
    };
  }, [slug, type]);

  const pageContent =
    getPageContent(
      type,
      label
    );

  if (loading) {
    return (
      <main className="bg-white">
        <PageHero
          eyebrow={
            pageContent.eyebrow
          }
          title={
            pageContent.title
          }
          description={
            pageContent.description
          }
          breadcrumbs={[
            {
              label: "Home",
              href: "/",
            },
            {
              label:
                pageContent.title,
            },
          ]}
        />

        <Container>
          <section className="py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-4xl animate-pulse">
              <div className="h-4 w-32 rounded bg-slate-200" />

              <div className="mt-5 h-10 w-full max-w-3xl rounded bg-slate-200 sm:h-12" />

              <div className="mt-4 h-5 w-64 rounded bg-slate-100" />

              <div className="mt-8 aspect-[16/9] w-full rounded-2xl bg-slate-100" />

              <div className="mt-8 space-y-3">
                <div className="h-4 w-full rounded bg-slate-100" />
                <div className="h-4 w-[94%] rounded bg-slate-100" />
                <div className="h-4 w-[88%] rounded bg-slate-100" />
                <div className="h-4 w-[76%] rounded bg-slate-100" />
              </div>
            </div>
          </section>
        </Container>
      </main>
    );
  }

  if (
    error ||
    !item
  ) {
    return (
      <main className="bg-white">
        <PageHero
          eyebrow={
            pageContent.eyebrow
          }
          title={
            pageContent.title
          }
          description={
            pageContent.description
          }
          breadcrumbs={[
            {
              label: "Home",
              href: "/",
            },
            {
              label:
                pageContent.title,
            },
          ]}
        />

        <Container>
          <section className="py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                <span className="text-xl font-black">
                  !
                </span>
              </div>

              <h1 className="mt-5 text-2xl font-extrabold text-slate-900">
                Update not found
              </h1>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
                {error ||
                  "The requested content could not be found."}
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    window.location.reload()
                  }
                  className="gnpc-btn gnpc-btn-primary gnpc-btn-md"
                >
                  Try Again
                </button>

                <Link
                  href="/latest-updates"
                  className="gnpc-btn gnpc-btn-secondary gnpc-btn-md"
                >
                  Back to Latest Updates
                </Link>
              </div>
            </div>
          </section>
        </Container>
      </main>
    );
  }

  const image =
    item.image ||
    item.banner ||
    item.featuredImage;

  const date =
    item.publishedAt ||
    item.date ||
    item.createdAt;

  const location =
    item.location ||
    item.venue;

  const content =
    getContent(item);

  return (
    <main className="bg-white">
      <PageHero
        eyebrow={
          pageContent.eyebrow
        }
        title={
          pageContent.title
        }
        description={
          pageContent.description
        }
        breadcrumbs={[
          {
            label: "Home",
            href: "/",
          },
          {
            label:
              pageContent.title,
            href: "/latest-updates",
          },
          {
            label: item.title,
          },
        ]}
      />

      <section className="bg-slate-50 py-8 sm:py-12 lg:py-16">
        <Container>
          <article className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-8">
              <Link
                href="/latest-updates"
                className="inline-flex items-center text-sm font-bold text-[#155eef] transition-colors hover:text-[#0f4c81]"
              >
                ← Back to latest updates
              </Link>
            </div>

            <div className="px-5 pb-7 pt-7 sm:px-8 sm:pb-9 sm:pt-9">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#155eef]">
                {item.category ||
                  label}
              </p>

              <h1 className="mt-3 text-3xl font-black leading-tight tracking-[-0.025em] text-[#101828] sm:text-4xl lg:text-5xl">
                {item.title}
              </h1>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays
                    size={17}
                    className="shrink-0 text-[#155eef]"
                    aria-hidden="true"
                  />

                  <span>
                    {formatDate(
                      date
                    )}
                  </span>
                </span>

                {location && (
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <MapPin
                      size={17}
                      className="shrink-0 text-[#155eef]"
                      aria-hidden="true"
                    />

                    <span className="break-words">
                      {location}
                    </span>
                  </span>
                )}
              </div>
            </div>

            {image && (
              <div className="px-5 sm:px-8">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <img
                    src={image}
                    alt={item.title}
                    className="block h-auto max-h-[520px] w-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="px-5 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-10">
              {content ? (
                <div className="whitespace-pre-line break-words text-base leading-8 text-slate-700 sm:text-[17px] sm:leading-8">
                  {content}
                </div>
              ) : (
                <p className="text-base leading-8 text-slate-500">
                  No additional information is available
                  for this update.
                </p>
              )}
            </div>
          </article>
        </Container>
      </section>
    </main>
  );
}
