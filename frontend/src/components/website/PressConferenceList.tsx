"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Mic2,
  Play,
} from "lucide-react";
import {
  motion,
  type Variants,
} from "framer-motion";

import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import type { PressConferencePageSettings } from "@/types/pageSettings";

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
    month: "short",
    year: "numeric",
  }).format(date);
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function ConferenceImage({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#d9cbb7]">
        <Mic2
          size={46}
          strokeWidth={1.4}
          className="text-black/20"
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
    />
  );
}

function ConferenceCard({
  item,
  featured = false,
}: {
  item: PressConference;
  featured?: boolean;
}) {
  const date = item.date || item.createdAt;

  return (
    <motion.article
      variants={cardVariants}
      className={[
        "group relative overflow-hidden rounded-[2rem] border shadow-[0_20px_60px_rgba(38,32,23,0.10)]",
        featured
          ? "min-h-[500px] border-white/10 bg-[#171717] text-white"
          : "min-h-[300px] border-black/10 bg-white/60 text-[#171717] backdrop-blur-md",
      ].join(" ")}
    >
      {/* Image */}

      <div className="absolute inset-0 overflow-hidden">
        <ConferenceImage
          src={item.featuredImage}
          alt={item.title}
        />
      </div>

      {/* Overlay */}

      <div
        className={[
          "absolute inset-0",
          featured
            ? "bg-gradient-to-t from-black via-black/45 to-black/5"
            : "bg-gradient-to-t from-black/85 via-black/25 to-transparent",
        ].join(" ")}
      />

      {/* Category */}

      <div className="absolute left-5 top-5 z-10 sm:left-7 sm:top-7">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-md">
          <Mic2 size={11} />
          Press Conference
        </span>
      </div>

      {/* Content */}

      <div className="relative z-10 flex min-h-full flex-col justify-end p-5 sm:p-7">
        <div className="max-w-[760px]">
          {/* Meta */}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={13} />
              {formatDate(date)}
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />

            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} />
              {item.venue ||
                "Greater Noida Press Club"}
            </span>
          </div>

          {/* Title */}

          <h2
            className={[
              "mt-3 font-black leading-[1.02] tracking-[-0.045em]",
              featured
                ? "text-3xl sm:text-4xl lg:text-[3rem]"
                : "text-2xl sm:text-[2rem]",
            ].join(" ")}
          >
            {item.title}
          </h2>

          {/* Description */}

          <p className="mt-3 line-clamp-3 max-w-[720px] text-xs leading-6 text-white/60 sm:text-sm sm:leading-7">
            {item.description ||
              item.content ||
              "Read the latest press conference update."}
          </p>

          {/* Action */}

          <Link
            href={`/press-conference/${item._id}`}
            className="relative z-30 mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-black text-[#171717] transition duration-300 hover:-translate-y-0.5 hover:bg-[#f4ede2]"
          >
            View Details
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function PressConferenceList({
  latestOnly = false,
  settings,
}: {
  latestOnly?: boolean;
  settings?: PressConferencePageSettings;
}) {
  const [items, setItems] = useState<
    PressConference[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const pageSize = latestOnly
    ? 3
    : Math.max(
        1,
        Math.min(
          100,
          Number(settings?.pageSize) || 12
        )
      );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL ||
            ""
          }/api/press-conferences`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load press conferences."
          );
        }

        const data =
          (await response.json()) as {
            data?: PressConference[];
          };

        if (!cancelled) {
          setItems(
            Array.isArray(data.data)
              ? data.data.slice(
                  0,
                  pageSize
                )
              : []
          );
        }
      } catch (error) {
        console.error(
          "Failed to load press conferences:",
          error
        );

        if (!cancelled) {
          setItems([]);
        }
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
  }, [pageSize]);

  const title = latestOnly
    ? "Latest Press Conference"
    : settings?.pageTitle ||
      "Press Conferences";

  const description = latestOnly
    ? "The latest media interaction and official briefing from Greater Noida Press Club."
    : settings?.pageDescription ||
      "Stay informed about media interactions, public briefings and official announcements from Greater Noida Press Club.";

  return (
    <main className="bg-[#f4ede2] text-[#171717]">
      {/* =====================================================
          FULL PAGE HERO
          ===================================================== */}

      {!latestOnly && (
        <PageHero
          eyebrow={
            settings?.pageEyebrow ||
            "Media & Journalism"
          }
          title={title}
          description={description}
        />
      )}

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <section
        className={
          latestOnly
            ? "relative overflow-hidden bg-[#f4ede2] py-16 sm:py-24 lg:py-28"
            : "relative overflow-hidden bg-[#f4ede2] py-16 sm:py-24"
        }
      >
        {/* Background */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-white/60 blur-3xl" />

          <div className="absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-[#d8c7af]/30 blur-3xl" />

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

        <Container>
          {/* =================================================
              HOMEPAGE HEADER
              ================================================= */}

          {latestOnly && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
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
              className="relative mb-12 flex flex-col gap-7 lg:mb-16 lg:flex-row lg:items-end lg:justify-between"
            >
              <div className="max-w-[780px]">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-black/20 sm:w-12" />

                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-black/45 sm:text-[10px]">
                    Media & Journalism
                  </span>
                </div>

                <h1 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-[4.5rem]">
                  Latest
                  <br />
                  press conference.
                </h1>

                <p className="mt-5 max-w-[650px] text-sm leading-6 text-black/50 sm:text-base sm:leading-7">
                  {description}
                </p>
              </div>

              <Button
                href="/press-conference"
                variant="outline"
                size="lg"
                className="group w-fit rounded-full border-black/15 bg-white/55"
              >
                View All

                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Button>
            </motion.div>
          )}

          {/* =================================================
              LOADING
              ================================================= */}

          {loading && (
            <div className="relative grid gap-4 lg:grid-cols-2">
              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className={[
                      "animate-pulse rounded-[2rem] bg-black/5",
                      item === 1
                        ? "min-h-[500px] lg:row-span-2"
                        : "min-h-[240px]",
                    ].join(" ")}
                  />
                )
              )}
            </div>
          )}

          {/* =================================================
              EMPTY
              ================================================= */}

          {!loading &&
            items.length === 0 && (
              <div className="relative rounded-[2rem] border border-dashed border-black/15 bg-white/45 px-6 py-16 text-center">
                <Mic2
                  size={40}
                  className="mx-auto text-black/20"
                />

                <h2 className="mt-5 text-xl font-black tracking-[-0.03em]">
                  No press conferences available
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/45">
                  No press conferences have
                  been published yet. Please
                  check back later for new
                  media updates.
                </p>
              </div>
            )}

          {/* =================================================
              CARDS
              ================================================= */}

          {!loading &&
            items.length > 0 && (
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
                className={
                  latestOnly
                    ? "relative grid gap-4 lg:grid-cols-[1.3fr_0.7fr]"
                    : "relative grid gap-5 md:grid-cols-2"
                }
              >
                {latestOnly ? (
                  <>
                    {items[0] && (
                      <ConferenceCard
                        item={items[0]}
                        featured
                      />
                    )}

                    <div className="grid gap-4">
                      {items
                        .slice(1, 3)
                        .map(
                          (item) => (
                            <ConferenceCard
                              key={
                                item._id
                              }
                              item={
                                item
                              }
                            />
                          )
                        )}
                    </div>
                  </>
                ) : (
                  items.map(
                    (item) => (
                      <ConferenceCard
                        key={
                          item._id
                        }
                        item={item}
                      />
                    )
                  )
                )}
              </motion.div>
            )}
        </Container>
      </section>
    </main>
  );
}
