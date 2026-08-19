"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ImageOff,
  Newspaper,
  Users,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import Button from "@/components/ui/Button";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import {
  mergeHomeSettings,
  type HomeSettings,
} from "@/types/homeSettings";
import {
  apiFetch,
  responseJson,
} from "@/services/api";

type PublicStats = {
  members: number;
  pressReleases: number;
  events: number;
};

const emptyStats: PublicStats = {
  members: 0,
  pressReleases: 0,
  events: 0,
};

function AnimatedNumber({
  value,
}: {
  value: number;
}) {
  const ref =
    useRef<HTMLSpanElement>(null);

  const isInView = useInView(ref, {
    once: true,
    amount: 0.5,
  });

  const [display, setDisplay] =
    useState(0);

  useEffect(() => {
    if (!isInView) {
      return;
    }

    let frame = 0;

    const start =
      performance.now();

    const duration = 1500;

    const update = (
      now: number
    ) => {
      const progress = Math.min(
        (now - start) /
          duration,
        1
      );

      const eased =
        1 -
        Math.pow(
          1 - progress,
          3
        );

      setDisplay(
        Math.round(
          value * eased
        )
      );

      if (progress < 1) {
        frame =
          requestAnimationFrame(
            update
          );
      }
    };

    frame =
      requestAnimationFrame(
        update
      );

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {display}
    </span>
  );
}

function ImageBadge({
  siteName,
}: {
  siteName?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.5,
      }}
      transition={{
        duration: 0.6,
      }}
      className="absolute bottom-5 left-5 z-20 rounded-2xl border border-white/30 bg-black/55 px-4 py-3 text-white shadow-2xl backdrop-blur-md sm:bottom-7 sm:left-7"
    >
      <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/60">
        Greater Noida
      </p>

      <p className="mt-1 text-sm font-black sm:text-base">
        {siteName ||
          "Press Club"}
      </p>
    </motion.div>
  );
}

function AboutStat({
  value,
  label,
  icon: Icon,
  href,
  loading,
  unavailable,
}: {
  value: number;
  label: string;
  icon: typeof Users;
  href?: string;
  loading: boolean;
  unavailable: boolean;
}) {
  const content = (
    <div className="px-2 py-5 sm:px-6 sm:py-7">
      {loading ? (
        <>
          <div className="mx-auto h-8 w-16 animate-pulse rounded bg-black/5" />

          <div className="mx-auto mt-3 h-4 w-20 animate-pulse rounded bg-black/5" />
        </>
      ) : unavailable ? (
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-black/40 sm:text-xs">
            Statistics
            unavailable
          </p>
        </div>
      ) : (
        <>
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#171717] text-white sm:h-10 sm:w-10">
            <Icon
              size={16}
            />
          </div>

          <p className="mt-3 text-2xl font-black tracking-[-0.04em] text-black sm:text-4xl">
            <AnimatedNumber
              value={value}
            />

            <span className="text-[#c8102e]">
              +
            </span>
          </p>

          <p className="mt-1 text-[9px] font-black uppercase tracking-[0.12em] text-black/45 sm:text-xs">
            {label}
          </p>
        </>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="rounded-[1.5rem] transition hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
      >
        {content}
      </Link>
    );
  }

  return (
    <div>
      {content}
    </div>
  );
}

export default function About() {
  const {
    settings,
  } = useWebsiteSettings();

  /*
   * ----------------------------------------------------------
   * CMS HOME SETTINGS
   * ----------------------------------------------------------
   *
   * IMPORTANT:
   *
   * The homepage About section now uses:
   *
   * Website Settings → Home → About
   *
   * as its source of truth.
   *
   * We no longer fetch /settings/about for this section.
   */

  const home: HomeSettings =
    mergeHomeSettings(
      settings.home
    );

  const about =
    home.about;

  const [
    stats,
    setStats,
  ] = useState<PublicStats>(
    emptyStats
  );

  const [loadingStats, setLoadingStats] =
    useState(true);

  const [
    statsUnavailable,
    setStatsUnavailable,
  ] = useState(false);

  const [
    imageLoaded,
    setImageLoaded,
  ] = useState(false);

  /*
   * ----------------------------------------------------------
   * PUBLIC STATISTICS
   * ----------------------------------------------------------
   *
   * Numbers remain live API data.
   * CMS controls:
   *
   * - whether statistics are shown
   * - labels
   */

  useEffect(() => {
    let cancelled = false;

    const loadStats =
      async () => {
        try {
          setLoadingStats(true);

          const response =
            await apiFetch(
              "/dashboard/public-stats",
              {
                cache:
                  "no-store",
              }
            );

          const payload =
            await responseJson<{
              success?: boolean;
              data?: PublicStats;
            }>(response);

          if (
            cancelled
          ) {
            return;
          }

          if (
            payload.success ===
              false ||
            !payload.data
          ) {
            throw new Error(
              "Statistics unavailable."
            );
          }

          setStats({
            ...emptyStats,
            ...payload.data,
          });

          setStatsUnavailable(
            false
          );
        } catch (error) {
          console.error(
            "Failed to load public statistics:",
            error
          );

          if (!cancelled) {
            setStatsUnavailable(
              true
            );
          }
        } finally {
          if (!cancelled) {
            setLoadingStats(
              false
            );
          }
        }
      };

    void loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * ----------------------------------------------------------
   * CMS IMAGE
   * ----------------------------------------------------------
   *
   * About image comes from:
   *
   * Website Settings → Home → About Image
   */

  const aboutImage =
    settings.aboutImage ||
    "";

  /*
   * ----------------------------------------------------------
   * CMS STAT LABELS
   * ----------------------------------------------------------
   */

  const statsLabels =
    about.statsLabels;

  const statItems = [
    {
      value:
        stats.members,
      label:
        statsLabels[0] ||
        "Members",
      icon: Users,
      href: "/committee",
    },
    {
      value:
        stats.pressReleases,
      label:
        statsLabels[1] ||
        "Press Releases",
      icon: Newspaper,
    },
    {
      value:
        stats.events,
      label:
        statsLabels[2] ||
        "Active Events",
      icon: CalendarDays,
    },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#f4ede2] py-16 text-[#171717] sm:py-24 lg:py-28"
    >
      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-40 top-20 h-[25rem] w-[25rem] rounded-full bg-white/70 blur-3xl" />

        <div className="absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-[#d8c7af]/35 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.12]"
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
            CMS SECTION INTRO
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
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="gnpc-section-heading mx-auto max-w-[900px] text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-8 bg-black/20 sm:w-12"
            />

            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-black/45 sm:text-[10px]">
              {about.eyebrow ||
                "About Us"}
            </span>

            <span
              aria-hidden="true"
              className="h-px w-8 bg-black/20 sm:w-12"
            />
          </div>

          <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-[4.4rem]">
            {about.title ||
              settings.siteName ||
              "Greater Noida Press Club"}
          </h2>

          {about.description && (
            <p className="mx-auto mt-5 max-w-[700px] text-sm leading-6 text-black/50 sm:text-base sm:leading-7">
              {about.description}
            </p>
          )}
        </motion.div>

        {/* ===================================================
            MAIN ABOUT
            =================================================== */}

        <div className="mt-14 grid items-center gap-10 lg:mt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* =================================================
              IMAGE
              ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: -35,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.8,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="relative"
          >
            {/* Decorative back card */}

            <div
              aria-hidden="true"
              className="absolute -bottom-5 -left-5 h-full w-full rounded-[2rem] border border-black/5 bg-[#d8c7af]/45 sm:-bottom-7 sm:-left-7"
            />

            {/* Decorative top card */}

            <div
              aria-hidden="true"
              className="absolute -right-3 -top-3 z-0 h-24 w-24 rounded-[1.5rem] border border-white/70 bg-white/55 backdrop-blur-md sm:-right-5 sm:-top-5 sm:h-32 sm:w-32"
            />

            <div className="relative z-10 overflow-hidden rounded-[2rem] border-[7px] border-white bg-white shadow-[0_30px_80px_rgba(38,32,23,0.18)]">
              {aboutImage ? (
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity:
                      imageLoaded
                        ? 1
                        : 0,
                  }}
                  transition={{
                    duration: 0.6,
                  }}
                  className="relative aspect-[6/5] overflow-hidden bg-black/5"
                >
                  <Image
                    src={
                      aboutImage
                    }
                    alt={
                      about.title ||
                      settings.siteName ||
                      "Greater Noida Press Club"
                    }
                    fill
                    priority={false}
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    onLoad={() =>
                      setImageLoaded(
                        true
                      )
                    }
                    className="object-cover transition duration-700 hover:scale-[1.025]"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-white/5"
                  />

                  <ImageBadge
                    siteName={
                      settings.siteName
                    }
                  />
                </motion.div>
              ) : (
                <div className="relative flex aspect-[6/5] items-center justify-center bg-gradient-to-br from-[#e6d8c5] via-[#f4ede2] to-white">
                  <div className="text-center text-black/40">
                    <ImageOff
                      className="mx-auto"
                      size={42}
                    />

                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.15em]">
                      About image coming soon
                    </p>
                  </div>

                  <ImageBadge
                    siteName={
                      settings.siteName
                    }
                  />
                </div>
              )}
            </div>

            {/* Floating identity label */}

            <div className="absolute -bottom-5 right-3 z-20 rounded-2xl border border-black/10 bg-white/85 px-4 py-3 shadow-xl backdrop-blur-md sm:-bottom-6 sm:right-6">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-black/40">
                GNPC
              </p>

              <p className="mt-1 text-xs font-black text-black sm:text-sm">
                Journalism • Community
              </p>
            </div>
          </motion.div>

          {/* =================================================
              CMS CONTENT
              ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: 35,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.8,
              delay: 0.08,
              ease: [
                0.22,
              1,
                0.36,
                1,
              ],
            }}
          >
            <span className="inline-flex rounded-full border border-black/10 bg-white/55 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-black/50 backdrop-blur-md">
              {about.eyebrow ||
                "Who We Are"}
            </span>

            <h3 className="mt-5 max-w-[650px] text-3xl font-black leading-[1.02] tracking-[-0.045em] sm:text-4xl lg:text-[3.3rem]">
              {about.title ||
                settings.siteName ||
                "Greater Noida Press Club"}
            </h3>

            <p className="mt-6 max-w-[650px] text-sm leading-7 text-black/55 sm:text-base sm:leading-8">
              {about.description ||
                "Greater Noida Press Club is a professional platform supporting journalists, media professionals and the wider community."}
            </p>

            {/* =================================================
                CMS FEATURES
                ================================================= */}

            {about.features
              .length > 0 && (
              <div className="mt-7 grid gap-3 sm:mt-9 sm:grid-cols-2">
                {about.features.map(
                  (
                    feature,
                    index
                  ) => (
                    <motion.div
                      key={`${feature}-${index}`}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration:
                          0.45,
                        delay:
                          index *
                          0.06,
                      }}
                      className="group rounded-2xl border border-black/10 bg-white/55 p-4 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#171717] text-white">
                          <Check
                            size={14}
                            strokeWidth={
                              3
                            }
                          />
                        </span>

                        <p className="pt-0.5 text-xs font-bold leading-5 text-black/70 sm:text-sm">
                          {
                            feature
                          }
                        </p>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            )}

            {/* =================================================
                CMS BUTTON
                ================================================= */}

            {about.buttonLabel && (
              <div className="mt-8 sm:mt-10">
                <Button
                  href={
                    about.buttonHref ||
                    "/about"
                  }
                  variant="outline"
                  size="lg"
                  className="group rounded-full border-black/15 bg-white/50"
                >
                  {about.buttonLabel}

                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Button>
              </div>
            )}
          </motion.div>
        </div>

        {/* ===================================================
            CMS-CONTROLLED STATISTICS
            =================================================== */}

        {about.showStats && (
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
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
            }}
            className="mt-20 sm:mt-24"
          >
            <div className="rounded-[2rem] border border-black/10 bg-white/55 p-3 shadow-[0_20px_60px_rgba(38,32,23,0.08)] backdrop-blur-md sm:p-4">
              <div className="grid grid-cols-3 divide-x divide-black/10">
                {statItems.map(
                  (stat) => (
                    <AboutStat
                      key={
                        stat.label
                      }
                      value={
                        stat.value
                      }
                      label={
                        stat.label
                      }
                      icon={
                        stat.icon
                      }
                      href={
                        stat.href
                      }
                      loading={
                        loadingStats
                      }
                      unavailable={
                        statsUnavailable
                      }
                    />
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
