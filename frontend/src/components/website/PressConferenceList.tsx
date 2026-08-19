"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Mic2,
  Sparkles,
} from "lucide-react";
import {
  motion,
  type Variants,
} from "framer-motion";

import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";

import type {
  PressConferencePageSettings,
} from "@/types/pageSettings";

import {
  mergeHomeSettings,
} from "@/types/homeSettings";

import {
  useWebsiteSettings,
} from "@/context/WebsiteSettingsContext";

import {
  getPressConferences,
} from "@/services/pressConferenceService";

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

type HomePressConferenceSettings = {
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  displayCount: number;
  media?: string[];
};

type Props = {
  latestOnly?: boolean;
  settings?: PressConferencePageSettings;
};

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
      ease: [
        0.22,
        1,
        0.36,
        1,
      ],
    },
  },
};

function formatDate(
  value?: string
) {
  if (!value) {
    return "Recent update";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Recent update";
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
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 1024px) 50vw, 100vw"
      className="object-cover transition duration-700 group-hover:scale-[1.04]"
    />
  );
}

function CmsMedia({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  if (!src) {
    return null;
  }

  return (
    <div className="group relative aspect-[16/7] overflow-hidden rounded-[1.75rem] border-[6px] border-white bg-white shadow-[0_22px_55px_rgba(38,32,23,0.12)]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover transition duration-700 group-hover:scale-[1.035]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5"
      />
    </div>
  );
}

function ConferenceCard({
  item,
  featured = false,
}: {
  item: PressConference;
  featured?: boolean;
}) {
  const date =
    item.date ||
    item.createdAt;

  return (
    <motion.article
      variants={
        cardVariants
      }
      className={[
        "group relative overflow-hidden rounded-[2rem] border shadow-[0_20px_60px_rgba(38,32,23,0.10)]",
        featured
          ? "min-h-[500px] border-white/10 bg-[#171717] text-white sm:min-h-[560px]"
          : "min-h-[300px] border-black/10 bg-white/60 text-[#171717] backdrop-blur-md",
      ].join(" ")}
    >
      {/* ===================================================
          IMAGE
          =================================================== */}

      <div className="absolute inset-0 overflow-hidden">
        <ConferenceImage
          src={
            item.featuredImage
          }
          alt={
            item.title
          }
        />
      </div>

      {/* ===================================================
          OVERLAY
          =================================================== */}

      <div
        className={[
          "absolute inset-0",
          featured
            ? "bg-gradient-to-t from-black via-black/45 to-black/5"
            : "bg-gradient-to-t from-black/90 via-black/25 to-transparent",
        ].join(" ")}
      />

      {/* ===================================================
          CATEGORY
          =================================================== */}

      <div className="absolute left-5 top-5 z-10 sm:left-7 sm:top-7">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-md">
          <Mic2 size={11} />

          Press Conference
        </span>
      </div>

      {/* ===================================================
          CONTENT
          =================================================== */}

      <div className="relative z-10 flex h-full min-h-[inherit] flex-col justify-end p-5 sm:p-7">
        <div className="max-w-[760px]">
          {/* Meta */}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={13} />

              {formatDate(
                date
              )}
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />

            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} />

              {item.venue ||
                "Greater Noida Press Club"}
            </span>
          </div>

          {/* Title */}

          <h3
            className={[
              "mt-3 font-black leading-[1.02] tracking-[-0.045em]",
              featured
                ? "text-3xl sm:text-4xl lg:text-[3rem]"
                : "text-2xl sm:text-[2rem]",
            ].join(" ")}
          >
            {item.title}
          </h3>

          {/* Description */}

          {(item.description ||
            item.content) && (
            <p className="mt-3 line-clamp-3 max-w-[720px] text-xs leading-6 text-white/60 sm:text-sm sm:leading-7">
              {item.description ||
                item.content}
            </p>
          )}

          {/* Individual route */}

          <Link
            href={`/press-conference/${item._id}`}
            className="relative z-30 mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-black text-[#171717] transition duration-300 hover:-translate-y-0.5 hover:bg-[#f4ede2]"
          >
            View Details

            <ArrowRight
              size={15}
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
}: Props) {
  const {
    settings: websiteSettings,
  } =
    useWebsiteSettings();

  const home =
    mergeHomeSettings(
      websiteSettings.home
    );

  /*
   * ==========================================================
   * CMS SOURCE
   * ==========================================================
   *
   * Homepage:
   * Website Settings → Home → Press Conferences
   *
   * Full page:
   * Existing PressConferencePageSettings
   */

  const homeSection =
    home.pressConferences as HomePressConferenceSettings;

  const [
    items,
    setItems,
  ] = useState<
    PressConference[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  /*
   * ==========================================================
   * DISPLAY COUNT
   * ==========================================================
   */

  const pageSize =
    latestOnly
      ? Math.max(
          1,
          Math.min(
            12,
            Number(
              homeSection.displayCount
            ) || 3
          )
        )
      : Math.max(
          1,
          Math.min(
            100,
            Number(
              settings?.pageSize
            ) || 12
          )
        );

  /*
   * ==========================================================
   * LIVE DATA
   * ==========================================================
   */

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getPressConferences();

        if (cancelled) {
          return;
        }

        setItems(
          (Array.isArray(data) ? data : []).slice(
            0,
            pageSize
          )
        );
      } catch (requestError) {
        console.error(
          "Failed to load press conferences:",
          requestError
        );

        if (!cancelled) {
          setItems([]);
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load press conferences."
          );
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

  /*
   * ==========================================================
   * CMS VALUES
   * ==========================================================
   */

  const title =
    latestOnly
      ? homeSection.title ||
        "Latest Press Conference"
      : settings?.pageTitle ||
        "Press Conferences";

  const description =
    latestOnly
      ? homeSection.description ||
        "The latest media interaction and official briefing from Greater Noida Press Club."
      : settings?.pageDescription ||
        "Stay informed about media interactions, public briefings and official announcements from Greater Noida Press Club.";

  const eyebrow =
    latestOnly
      ? homeSection.eyebrow ||
        "Media & Journalism"
      : settings?.pageEyebrow ||
        "Media & Journalism";

  const buttonLabel =
    latestOnly
      ? homeSection.buttonLabel
      : undefined;

  const buttonHref =
    latestOnly
      ? homeSection.buttonHref ||
        "/press-conference"
      : "/press-conference";

  /*
   * ==========================================================
   * CMS SECTION PHOTOS
   * ==========================================================
   */

  const media =
    latestOnly &&
    Array.isArray(
      homeSection.media
    )
      ? homeSection.media.filter(
          Boolean
        )
      : [];

  const visibleMedia =
    useMemo(
      () =>
        media.slice(
          0,
          4
        ),
      [media]
    );

  return (
    <main className="bg-[#f4ede2] text-[#171717]">
      {/* =====================================================
          FULL PRESS CONFERENCE PAGE HERO
          ===================================================== */}

      {!latestOnly && (
        <PageHero
          eyebrow={
            eyebrow
          }
          title={
            title
          }
          description={
            description
          }
        />
      )}

      {/* =====================================================
          SECTION
          ===================================================== */}

      <section className="relative overflow-hidden bg-[#f4ede2] py-16 sm:py-24 lg:py-28">
        {/* ===================================================
            BACKGROUND
            =================================================== */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-white/65 blur-3xl" />

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
                y: 22,
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
              className="relative mx-auto max-w-[900px] text-center"
            >
              <div className="flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-black/20 sm:w-12" />

                <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-black/45 sm:text-[10px]">
                  <Sparkles
                    size={11}
                  />

                  {
                    eyebrow
                  }
                </span>

                <span className="h-px w-8 bg-black/20 sm:w-12" />
              </div>

              <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-[4.5rem]">
                {
                  title
                }
              </h2>

              {description && (
                <p className="mx-auto mt-5 max-w-[700px] text-sm leading-6 text-black/50 sm:text-base sm:leading-7">
                  {
                    description
                  }
                </p>
              )}
            </motion.div>
          )}

          {/* =================================================
              CMS PHOTOS
              ================================================= */}

          {latestOnly &&
            visibleMedia.length >
              0 && (
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
                  amount: 0.15,
                }}
                transition={{
                  duration:
                    0.8,
                }}
                className={[
                  "relative mt-12 grid gap-4 sm:mt-16",
                  visibleMedia.length ===
                    1
                    ? "lg:grid-cols-1"
                    : "lg:grid-cols-2",
                ].join(" ")}
              >
                {visibleMedia.map(
                  (
                    image,
                    index
                  ) => (
                    <CmsMedia
                      key={`${image}-${index}`}
                      src={
                        image
                      }
                      alt={`${title} photo ${
                        index +
                        1
                      }`}
                    />
                  )
                )}
              </motion.div>
            )}

          {/* =================================================
              LOADING
              ================================================= */}

          {loading && (
            <div className="relative mt-12 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="min-h-[500px] animate-pulse rounded-[2rem] bg-black/5" />

              <div className="grid gap-4">
                <div className="min-h-[240px] animate-pulse rounded-[2rem] bg-black/5" />

                <div className="min-h-[240px] animate-pulse rounded-[2rem] bg-black/5" />
              </div>
            </div>
          )}

          {/* =================================================
              ERROR
              ================================================= */}

          {!loading &&
            error && (
              <div className="relative mt-12 rounded-[2rem] border border-red-200 bg-red-50 px-6 py-14 text-center">
                <Mic2
                  size={40}
                  className="mx-auto text-red-300"
                />

                <p className="mt-4 text-sm font-semibold text-red-700">
                  {
                    error
                  }
                </p>
              </div>
            )}

          {/* =================================================
              EMPTY
              ================================================= */}

          {!loading &&
            !error &&
            items.length ===
              0 && (
              <div className="relative mt-12 rounded-[2rem] border border-dashed border-black/15 bg-white/45 px-6 py-16 text-center">
                <Mic2
                  size={40}
                  className="mx-auto text-black/20"
                />

                <h3 className="mt-5 text-xl font-black tracking-[-0.03em]">
                  No press conferences
                  available
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/45">
                  No press conferences
                  have been published
                  yet.
                </p>
              </div>
            )}

          {/* =================================================
              PRESS CONFERENCE CONTENT
              ================================================= */}

          {!loading &&
            !error &&
            items.length >
              0 && (
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
                      staggerChildren:
                        0.1,
                    },
                  },
                }}
                className={
                  latestOnly
                    ? "relative mt-12 grid gap-4 lg:mt-16 lg:grid-cols-[1.3fr_0.7fr]"
                    : "relative mt-8 grid gap-5 md:mt-12 md:grid-cols-2"
                }
              >
                {latestOnly ? (
                  <>
                    {items[0] && (
                      <ConferenceCard
                        item={
                          items[0]
                        }
                        featured
                      />
                    )}

                    <div className="grid gap-4">
                      {items
                        .slice(
                          1
                        )
                        .map(
                          (
                            item
                          ) => (
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
                    (
                      item
                    ) => (
                      <ConferenceCard
                        key={
                          item._id
                        }
                        item={
                          item
                        }
                      />
                    )
                  )
                )}
              </motion.div>
            )}

          {/* =================================================
              BOTTOM CMS CTA
              ================================================= */}

          {latestOnly &&
            buttonLabel && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 16,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.4,
                }}
                transition={{
                  duration: 0.6,
                }}
                className="mt-10 flex justify-center sm:mt-12"
              >
                <Button
                  href={
                    buttonHref
                  }
                  variant="outline"
                  size="lg"
                  className="group rounded-full border-black/15 bg-white/60"
                >
                  {
                    buttonLabel
                  }

                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Button>
              </motion.div>
            )}
        </Container>
      </section>
    </main>
  );
}
