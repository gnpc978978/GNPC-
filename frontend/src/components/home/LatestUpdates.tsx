"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

import { apiFetch, responseJson } from "@/services/api";
import Button from "@/components/ui/Button";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import { mergeHomeSettings } from "@/types/homeSettings";

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
  pressReleases?: LatestUpdate[];
  announcements?: LatestUpdate[];
  events?: LatestUpdate[];
  pressConferences?: LatestUpdate[];
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
      ease: [0.22, 1, 0.36, 1],
    },
  },
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
    return `/press-conference/${encodeURIComponent(
      item._id
    )}`;
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

function UpdateImage({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#ded0bb]">
        <Newspaper
          size={42}
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
      sizes="(min-width: 1024px) 40vw, 100vw"
      onError={() => setImageError(true)}
      className="object-cover transition duration-700 group-hover:scale-[1.04]"
    />
  );
}

function CmsImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return null;
  }

  return (
    <div
      className={[
        "relative overflow-hidden rounded-[1.75rem] border-[6px] border-white bg-white shadow-[0_22px_55px_rgba(38,32,23,0.12)]",
        className || "",
      ].join(" ")}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 35vw, 100vw"
        className="object-cover transition duration-700 hover:scale-[1.03]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5"
      />
    </div>
  );
}

function SkeletonFeatured() {
  return (
    <div className="min-h-[430px] animate-pulse rounded-[2rem] bg-black/5 sm:min-h-[520px]" />
  );
}

function SkeletonSecondary() {
  return (
    <div className="min-h-[220px] animate-pulse rounded-[2rem] bg-black/5" />
  );
}

export default function LatestUpdates() {
  const { settings } = useWebsiteSettings();

  const home = mergeHomeSettings(settings.home);

  const section = home.latestUpdates;

  const [items, setItems] = useState<LatestUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /*
   * ==========================================================
   * LIVE UPDATE DATA
   * ==========================================================
   */

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFetch("/latest-updates", { cache: "no-store" });

        const payload =
          await responseJson<LatestUpdatesResponse>(response);

        if (cancelled) {
          return;
        }

        const normalizedData = Array.isArray(payload.data) && payload.data.length > 0
          ? payload.data
          : [
              ...(Array.isArray(payload.pressReleases)
                ? payload.pressReleases.map((item) => ({
                    ...item,
                    type: item.type || "Press Release",
                    featuredImage: item.featuredImage || item.image,
                  }))
                : []),
              ...(Array.isArray(payload.announcements)
                ? payload.announcements.map((item) => ({
                    ...item,
                    type: item.type || "Announcement",
                    featuredImage: item.featuredImage || item.image,
                  }))
                : []),
              ...(Array.isArray(payload.events)
                ? payload.events.map((item) => ({
                    ...item,
                    type: item.type || "Event",
                    featuredImage: item.featuredImage || item.image,
                  }))
                : []),
              ...(Array.isArray(payload.pressConferences)
                ? payload.pressConferences.map((item) => ({
                    ...item,
                    type: item.type || "Press Conference",
                  }))
                : []),
            ];

        const uniqueItems = Array.from(
          new Map(
            normalizedData
              .filter((item) => item?._id)
              .map((item) => [`${item.type || "update"}:${item._id}`, item])
          ).values()
        ).sort((a, b) => {
          const getTime = (item: LatestUpdate) => {
            const value =
              item.publishedAt || item.date || item.createdAt;
            const time = value ? new Date(value).getTime() : 0;
            return Number.isNaN(time) ? 0 : time;
          };

          return getTime(b) - getTime(a);
        });

        setItems(uniqueItems);
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

  /*
   * ==========================================================
   * CMS DISPLAY COUNT
   * ==========================================================
   */

  const displayCount = Math.max(
    1,
    section.displayCount || 3
  );

  const visibleItems = useMemo(
    () => items.slice(0, displayCount),
    [displayCount, items]
  );

  const featured = visibleItems[0];

  const secondary = visibleItems.slice(1);

  /*
   * ==========================================================
   * CMS SECTION PHOTOS
   * ==========================================================
   *
   * These are independent from the actual Latest Update
   * records. They are controlled from:
   *
   * Website Settings → Home → Latest Updates → Photos
   */

  const media = Array.isArray(section.media)
    ? section.media.filter(Boolean)
    : [];

  return (
    <section
      id="latest-updates"
      className="relative overflow-hidden bg-[#f4ede2] py-16 text-[#171717] sm:py-24 lg:py-28"
    >
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
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* ===================================================
            CMS HEADER
            =================================================== */}

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
          className="gnpc-section-heading mx-auto max-w-[900px] text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-black/20 sm:w-12" />

            <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-black/45 sm:text-[10px]">
              <Sparkles size={11} />

              {section.eyebrow || "Latest Updates"}
            </span>

            <span className="h-px w-8 bg-black/20 sm:w-12" />
          </div>

          <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-[4.5rem]">
            {section.title}
          </h2>

          {section.description && (
            <p className="mx-auto mt-5 max-w-[700px] text-sm leading-6 text-black/50 sm:text-base sm:leading-7">
              {section.description}
            </p>
          )}
        </motion.div>

        {/* ===================================================
            CMS MEDIA
            =================================================== */}

        {media.length > 0 && (
          <motion.div
            initial={{
              opacity: 0,
              y: 24,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.12,
            }}
            transition={{
              duration: 0.8,
            }}
            className="mt-12 grid gap-4 sm:mt-16 lg:grid-cols-2"
          >
            {media.slice(0, 2).map((image, index) => (
              <CmsImage
                key={`${image}-${index}`}
                src={image}
                alt={`${section.title} photo ${index + 1}`}
                className="aspect-[16/7] min-h-[180px] sm:min-h-[220px]"
              />
            ))}
          </motion.div>
        )}

        {/* ===================================================
            LOADING
            =================================================== */}

        {loading && (
          <div className="mt-10 grid gap-4 lg:mt-12 lg:grid-cols-[1.35fr_0.65fr]">
            <SkeletonFeatured />

            <div className="grid gap-4">
              <SkeletonSecondary />
              <SkeletonSecondary />
            </div>
          </div>
        )}

        {/* ===================================================
            ERROR
            =================================================== */}

        {!loading && error && (
          <div
            role="status"
            className="mx-auto mt-12 max-w-2xl rounded-[2rem] border border-red-200 bg-red-50 px-6 py-12 text-center"
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
          visibleItems.length === 0 && (
            <div className="mx-auto mt-12 max-w-2xl rounded-[2rem] border border-dashed border-black/15 bg-white/45 px-6 py-14 text-center">
              <Newspaper
                size={40}
                className="mx-auto text-black/20"
              />

              <h3 className="mt-5 text-xl font-black tracking-[-0.03em]">
                No latest updates
              </h3>

              <p className="mt-2 text-sm leading-6 text-black/45">
                New updates will appear here when they
                are published.
              </p>
            </div>
          )}

        {/* ===================================================
            LIVE UPDATE CONTENT
            =================================================== */}

        {!loading &&
          !error &&
          featured && (
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
                  href={getDetailHref(featured)}
                  className="absolute inset-0 z-20"
                  aria-label={`Read ${featured.title}`}
                />

                <div className="absolute inset-0">
                  <UpdateImage
                    src={
                      featured.featuredImage ||
                      featured.image
                    }
                    alt={featured.title}
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-2 sm:left-7 sm:top-7">
                  <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-md">
                    {featured.type ||
                      featured.category ||
                      section.eyebrow ||
                      "Update"}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-10 p-5 sm:p-7 lg:p-9">
                  {(featured.publishedAt ||
                    featured.date ||
                    featured.createdAt) && (
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/55">
                      <CalendarDays size={13} />

                      {formatDate(
                        featured.publishedAt ||
                          featured.date ||
                          featured.createdAt
                      )}
                    </div>
                  )}

                  <h3 className="mt-3 max-w-[820px] text-2xl font-black leading-[1.02] tracking-[-0.04em] sm:text-3xl lg:text-[2.7rem]">
                    {featured.title}
                  </h3>

                  {(featured.excerpt ||
                    featured.description) && (
                    <p className="mt-3 line-clamp-2 max-w-[700px] text-xs leading-6 text-white/60 sm:text-sm sm:leading-7">
                      {featured.excerpt ||
                        featured.description}
                    </p>
                  )}

                  <div className="mt-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-white">
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
                {secondary.map((item) => {
                  const image =
                    item.featuredImage ||
                    item.image;

                  const date =
                    item.publishedAt ||
                    item.date ||
                    item.createdAt;

                  return (
                    <motion.article
                      key={item._id}
                      variants={cardVariants}
                      className="group relative min-h-[220px] overflow-hidden rounded-[2rem] border border-black/10 bg-white/60 p-1 shadow-[0_18px_50px_rgba(38,32,23,0.08)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white"
                    >
                      <Link
                        href={getDetailHref(item)}
                        className="absolute inset-0 z-20"
                        aria-label={`Read ${item.title}`}
                      />

                      <div className="relative h-full overflow-hidden rounded-[1.75rem]">
                        {image ? (
                          <div className="absolute inset-0">
                            <UpdateImage
                              src={image}
                              alt={item.title}
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-[#ded0bb]">
                            <div className="absolute right-5 top-5 text-black/15">
                              <Newspaper
                                size={70}
                                strokeWidth={1}
                              />
                            </div>
                          </div>
                        )}

                        <div className="relative z-10 flex min-h-[220px] flex-col justify-end p-5 sm:p-6">
                          <div
                            className={[
                              "flex flex-wrap items-center gap-x-2 gap-y-2 text-[9px] font-black uppercase tracking-[0.14em]",
                              image
                                ? "text-white/55"
                                : "text-black/40",
                            ].join(" ")}
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
                                  <CalendarDays size={12} />
                                  {formatDate(date)}
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
                            ].join(" ")}
                          >
                            {item.title}
                          </h3>

                          <div
                            className={[
                              "mt-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em]",
                              image
                                ? "text-white/75"
                                : "text-black/55",
                            ].join(" ")}
                          >
                            Read Story

                            <ArrowRight
                              size={14}
                              className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </motion.div>
          )}

        {/* ===================================================
            BOTTOM CMS CTA
            =================================================== */}

        {section.buttonLabel && (
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
                section.buttonHref ||
                "/latest-updates"
              }
              variant="outline"
              size="lg"
              className="group rounded-full border-black/15 bg-white/60"
            >
              {section.buttonLabel}

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
