"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Newspaper,
  Sparkles,
} from "lucide-react";
import {
  motion,
  type Variants,
} from "framer-motion";

import {
  apiFetch,
  responseJson,
} from "@/services/api";
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

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

function getDetailHref(
  item: LatestUpdate
) {
  const type = (
    item.type ||
    item.category ||
    ""
  ).toLowerCase();

  if (
    type.includes(
      "press conference"
    ) ||
    type.includes(
      "press-conference"
    ) ||
    type === "pressconference"
  ) {
    return `/press-conference/${encodeURIComponent(
      item._id
    )}`;
  }

  if (
    type.includes("announcement")
  ) {
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

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [
        0.22,
        1,
        0.36,
        1,
      ],
    },
  },
};

function UpdateImage({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  const [imageError, setImageError] =
    useState(false);

  if (!src || imageError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#ded0bb]">
        <Newspaper
          size={42}
          strokeWidth={1.5}
          className="text-black/20"
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 1024px) 38vw, 100vw"
      onError={() =>
        setImageError(true)
      }
      className="object-cover transition duration-700 group-hover:scale-[1.04]"
    />
  );
}

export default function LatestUpdates() {
  const [items, setItems] =
    useState<LatestUpdate[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await apiFetch(
            "/latest-updates"
          );

        const payload =
          await responseJson<LatestUpdatesResponse>(
            response
          );

        if (cancelled) {
          return;
        }

        const data =
          Array.isArray(
            payload.data
          )
            ? payload.data
            : [];

        setItems(
          data.slice(0, 3)
        );
      } catch (
        requestError
      ) {
        if (cancelled) {
          return;
        }

        setItems([]);

        setError(
          requestError instanceof
            Error
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

  const first =
    items[0];

  const secondary =
    items.slice(1, 3);

  return (
    <section className="relative overflow-hidden bg-[#f4ede2] py-16 text-[#171717] sm:py-24 lg:py-28">
      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-white/70 blur-3xl" />

        <div className="absolute -bottom-40 right-0 h-[30rem] w-[30rem] rounded-full bg-[#d8c7af]/30 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(23,23,23,0.14) 1px, transparent 1px)",
            backgroundSize:
              "24px 24px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* ===================================================
            HEADER
            =================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.7,
          }}
          className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-[780px]">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-black/20 sm:w-12" />

              <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-black/45 sm:text-[10px]">
                <Sparkles
                  size={11}
                />

                Latest Updates
              </span>
            </div>

            <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-[4.5rem]">
              News,
              <br />
              announcements &amp;
              <br />
              stories.
            </h2>

            <p className="mt-5 max-w-[650px] text-sm leading-6 text-black/50 sm:text-base sm:leading-7">
              Stay connected with the latest
              announcements, events, press
              releases and activities from
              Greater Noida Press Club.
            </p>
          </div>

          <Button
            href="/latest-updates"
            variant="outline"
            size="lg"
            className="group w-fit rounded-full border-black/15 bg-white/55"
          >
            View All Updates

            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Button>
        </motion.div>

        {/* ===================================================
            LOADING
            =================================================== */}

        {loading && (
          <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="aspect-[16/10] animate-pulse rounded-[2rem] bg-black/5" />

            <div className="grid gap-4">
              <div className="min-h-[220px] animate-pulse rounded-[2rem] bg-black/5" />

              <div className="min-h-[220px] animate-pulse rounded-[2rem] bg-black/5" />
            </div>
          </div>
        )}

        {/* ===================================================
            ERROR
            =================================================== */}

        {!loading &&
          error && (
            <div
              role="status"
              className="mx-auto mt-12 max-w-2xl rounded-[2rem] border border-red-200 bg-red-50 px-6 py-12 text-center sm:mt-16"
            >
              <Newspaper
                size={38}
                className="mx-auto text-red-300"
              />

              <p className="mt-4 text-sm font-semibold text-red-700">
                {error}
              </p>
            </div>
          )}

        {/* ===================================================
            EMPTY
            =================================================== */}

        {!loading &&
          !error &&
          items.length === 0 && (
            <div className="mx-auto mt-12 max-w-2xl rounded-[2rem] border border-dashed border-black/15 bg-white/45 px-6 py-14 text-center sm:mt-16">
              <Newspaper
                size={40}
                className="mx-auto text-black/20"
              />

              <h3 className="mt-5 text-xl font-black tracking-[-0.03em]">
                No latest updates
              </h3>

              <p className="mt-2 text-sm leading-6 text-black/45">
                New updates will appear here
                when they are published.
              </p>
            </div>
          )}

        {/* ===================================================
            BENTO CONTENT
            =================================================== */}

        {!loading &&
          !error &&
          first && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.12,
              }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-[1.35fr_0.65fr]"
            >
              {/* =============================================
                  FEATURED UPDATE
                  ============================================= */}

              <motion.article
                variants={cardVariants}
                className="group relative min-h-[440px] overflow-hidden rounded-[2rem] border border-black/10 bg-[#171717] text-white shadow-[0_25px_70px_rgba(38,32,23,0.14)] sm:min-h-[540px]"
              >
                <Link
                  href={getDetailHref(
                    first
                  )}
                  className="absolute inset-0 z-20"
                  aria-label={`Read ${first.title}`}
                />

                <div className="absolute inset-0">
                  <UpdateImage
                    src={
                      first.featuredImage ||
                      first.image
                    }
                    alt={
                      first.title
                    }
                  />
                </div>

                {/* Image overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

                <div className="absolute left-5 top-5 z-10 flex flex-wrap items-center gap-2 sm:left-7 sm:top-7">
                  <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-md">
                    Featured
                  </span>

                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-white/70 backdrop-blur-md">
                    {first.type ||
                      first.category ||
                      "Update"}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-10 p-5 sm:p-7 lg:p-9">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/55">
                    {(first.publishedAt ||
                      first.date ||
                      first.createdAt) && (
                      <>
                        <CalendarDays
                          size={13}
                        />

                        {formatDate(
                          first.publishedAt ||
                            first.date ||
                            first.createdAt
                        )}
                      </>
                    )}
                  </div>

                  <h3 className="mt-3 max-w-[800px] text-2xl font-black leading-[1.02] tracking-[-0.04em] sm:text-3xl lg:text-[2.7rem]">
                    {first.title}
                  </h3>

                  <p className="mt-3 line-clamp-2 max-w-[680px] text-xs leading-6 text-white/60 sm:text-sm sm:leading-7">
                    {first.excerpt ||
                      first.description ||
                      "Read the latest update from Greater Noida Press Club."}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-white sm:text-sm">
                    Read Story

                    <ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </motion.article>

              {/* =============================================
                  SECONDARY UPDATES
                  ============================================= */}

              <div className="grid gap-4">
                {secondary.map(
                  (
                    item,
                    index
                  ) => {
                    const image =
                      item.featuredImage ||
                      item.image;

                    const date =
                      item.publishedAt ||
                      item.date ||
                      item.createdAt;

                    return (
                      <motion.article
                        key={
                          item._id
                        }
                        variants={
                          cardVariants
                        }
                        className="group relative min-h-[220px] overflow-hidden rounded-[2rem] border border-black/10 bg-white/60 p-1 shadow-[0_18px_50px_rgba(38,32,23,0.08)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white"
                      >
                        <Link
                          href={getDetailHref(
                            item
                          )}
                          className="absolute inset-0 z-20"
                          aria-label={`Read ${item.title}`}
                        />

                        <div className="relative h-full overflow-hidden rounded-[1.75rem]">
                          {image ? (
                            <div className="absolute inset-0">
                              <UpdateImage
                                src={
                                  image
                                }
                                alt={
                                  item.title
                                }
                              />

                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                            </div>
                          ) : (
                            <div className="absolute inset-0 bg-[#ded0bb]">
                              <div className="absolute right-5 top-5 text-black/15">
                                <Newspaper
                                  size={
                                    70
                                  }
                                  strokeWidth={
                                    1
                                  }
                                />
                              </div>
                            </div>
                          )}

                          <div className="relative z-10 flex min-h-[220px] flex-col justify-end p-5 sm:p-6">
                            <div
                              className={[
                                "flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.14em]",
                                image
                                  ? "text-white/55"
                                  : "text-black/40",
                              ].join(
                                " "
                              )}
                            >
                              <span>
                                {item.type ||
                                  item.category ||
                                  "Update"}
                              </span>

                              {date && (
                                <>
                                  <span className="h-1 w-1 rounded-full bg-current opacity-50" />

                                  <span className="inline-flex items-center gap-1">
                                    <CalendarDays
                                      size={
                                        12
                                      }
                                    />

                                    {formatDate(
                                      date
                                    )}
                                  </span>
                                </>
                              )}
                            </div>

                            <h3
                              className={[
                                "mt-2 line-clamp-2 text-lg font-black leading-[1.05] tracking-[-0.03em] sm:text-xl",
                                image
                                  ? "text-white"
                                  : "text-[#171717]",
                              ].join(
                                " "
                              )}
                            >
                              {
                                item.title
                              }
                            </h3>

                            <div
                              className={[
                                "mt-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em]",
                                image
                                  ? "text-white/75"
                                  : "text-black/55",
                              ].join(
                                " "
                              )}
                            >
                              Read More

                              <ArrowRight
                                size={
                                  14
                                }
                                className="transition-transform duration-300 group-hover:translate-x-1"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    );
                  }
                )}
              </div>
            </motion.div>
          )}
      </div>
    </section>
  );
}
