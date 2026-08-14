"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Check, ImageOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import Button from "@/components/ui/Button";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import { apiFetch, responseJson } from "@/services/api";

type AboutSettings = {
  image?: string;
  heading: string;
  description: string;
  features: string[];
};

type PublicStats = {
  members: number;
  pressReleases: number;
  events: number;
};

const emptyAbout: AboutSettings = {
  image: "",
  heading: "",
  description: "",
  features: [],
};

const emptyStats: PublicStats = {
  members: 0,
  pressReleases: 0,
  events: 0,
};

function GnpcOverlay() {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCycle((current) => current + 1);
    }, 2500);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <motion.div
      key={cycle}
      initial="hidden"
      animate="visible"
      className="absolute bottom-5 left-5 flex gap-1 rounded-2xl border border-white/30 bg-slate-950/35 px-4 py-3 shadow-2xl backdrop-blur-md sm:bottom-7 sm:left-7"
    >
      <span className="mr-2 self-center text-xs font-bold tracking-[0.18em] text-white/70">
        GNPC
      </span>

      {["G", "N", "P", "C"].map((letter, index) => (
        <motion.span
          key={letter}
          variants={{
            hidden: {
              opacity: 0,
              y: 14,
            },
            visible: {
              opacity: 1,
              y: 0,
            },
          }}
          transition={{
            duration: 0.35,
            delay: index * 0.3,
          }}
          className="text-xl font-black text-white sm:text-2xl"
        >
          {letter}
        </motion.span>
      ))}
    </motion.div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  const isInView = useInView(ref, {
    once: true,
    amount: 0.5,
  });

  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) {
      return;
    }

    let frame = 0;

    const start = performance.now();
    const duration = 2000;

    const update = (now: number) => {
      const progress = Math.min(
        (now - start) / duration,
        1
      );

      setDisplay(
        Math.round(
          value *
            (1 -
              Math.pow(
                1 - progress,
                3
              ))
        )
      );

      if (progress < 1) {
        frame = requestAnimationFrame(update);
      }
    };

    frame = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [isInView, value]);

  return <span ref={ref}>{display}</span>;
}

export default function About() {
  const { settings } = useWebsiteSettings();

  const [about, setAbout] =
    useState<AboutSettings>(emptyAbout);

  const [stats, setStats] =
    useState<PublicStats>(emptyStats);

  const [loading, setLoading] =
    useState(true);

  const [statsUnavailable, setStatsUnavailable] =
    useState(false);

  const [imageLoaded, setImageLoaded] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([
      apiFetch("/settings/about", {
        cache: "no-store",
      }).then((response) =>
        responseJson<{
          data?: AboutSettings;
        }>(response)
      ),

      apiFetch("/dashboard/public-stats", {
        cache: "no-store",
      }).then((response) =>
        responseJson<{
          success: boolean;
          data: PublicStats;
        }>(response)
      ),
    ])
      .then(
        ([aboutResult, statsResult]) => {
          if (cancelled) {
            return;
          }

          if (
            aboutResult.status ===
            "fulfilled"
          ) {
            const data =
              aboutResult.value.data;

            if (data) {
              setAbout({
                ...emptyAbout,
                ...data,
                image:
                  data.image ||
                  settings.aboutImage ||
                  "",
                features:
                  Array.isArray(
                    data.features
                  )
                    ? data.features
                    : [],
              });
            } else {
              setAbout({
                ...emptyAbout,
                image:
                  settings.aboutImage ||
                  "",
              });
            }
          } else if (
            settings.aboutImage
          ) {
            setAbout({
              ...emptyAbout,
              image:
                settings.aboutImage,
            });
          }

          if (
            statsResult.status ===
            "fulfilled"
          ) {
            setStatsUnavailable(false);
            setStats({
              ...emptyStats,
              ...statsResult.value.data,
            });
          } else {
            setStatsUnavailable(true);
          }
        }
      )
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [settings.aboutImage]);

  const statItems = [
    {
      value: stats.members,
      label: "Members",
      href: "/committee",
    },
    {
      value: stats.pressReleases,
      label: "Press Release",
    },
    {
      value: stats.events,
      label: "Active Events",
    },
  ];

  return (
    <section
      id="about"
      className="bg-white py-14 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-9 flex flex-col gap-5 text-center sm:mb-14 sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <span className="gnpc-eyebrow">About Us</span>
            <h2 className="gnpc-section-title mt-3 text-3xl sm:text-4xl lg:text-5xl">{settings.siteName || "Press Club"}</h2>
          </div>
          <Button href="/about" variant="outline" size="lg" className="self-center sm:self-auto">Learn More</Button>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="absolute -left-6 -top-6 -z-10 h-64 w-64 rounded-full bg-blue-100 blur-3xl" />

            {loading ? (
              <div className="aspect-[6/5] animate-pulse rounded-3xl bg-slate-200" />
            ) : about.image ? (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: imageLoaded
                    ? 1
                    : 0,
                }}
                transition={{
                  duration: 0.6,
                }}
                className="relative aspect-[6/5] overflow-hidden rounded-3xl bg-slate-100 shadow-2xl"
              >
                <Image
                  src={about.image}
                  alt="Greater Noida Press Club"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  onLoad={() =>
                    setImageLoaded(true)
                  }
                  className="object-cover"
                />

                <GnpcOverlay />
              </motion.div>
            ) : (
              <div className="relative flex aspect-[6/5] items-center justify-center rounded-3xl bg-gradient-to-br from-blue-100 via-slate-100 to-blue-50 shadow-2xl">
                <div className="text-center text-blue-700">
                  <ImageOff
                    className="mx-auto"
                    size={42}
                  />

                  <p className="mt-3 text-sm font-semibold">
                    About image coming soon
                  </p>
                </div>

                <GnpcOverlay />
              </div>
            )}
          </div>

          <div>
            {loading ? (
              <div className="space-y-4">
                <div className="h-10 w-4/5 animate-pulse rounded bg-slate-200" />

                <div className="h-5 animate-pulse rounded bg-slate-200" />

                <div className="h-5 w-5/6 animate-pulse rounded bg-slate-200" />
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {about.heading}
                </h3>

                <p className="mt-4 text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
                  {about.description}
                </p>

                {about.features.length >
                  0 && (
                  <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
                    {about.features.map(
                      (feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-3"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <Check
                              size={17}
                              strokeWidth={3}
                            />
                          </div>

                          <p className="text-sm font-medium text-slate-700 sm:text-base">
                            {feature}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}

              </>
            )}
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-slate-50 p-5 sm:mt-16 sm:rounded-3xl sm:p-8">
          <div className="grid grid-cols-3 gap-3 text-center sm:gap-8">
            {statItems.map(
              (stat) => (
                <Link
                  key={stat.label}
                  href={stat.href || "/"}
                  className={stat.href ? "rounded-xl transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" : "pointer-events-none"}
                >
                  {loading ? (
                    <>
                      <div className="mx-auto h-10 w-20 animate-pulse rounded bg-slate-200" />

                      <div className="mx-auto mt-3 h-5 w-24 animate-pulse rounded bg-slate-200" />
                    </>
                  ) : statsUnavailable ? (
                    <p className="pt-2 text-xs font-medium text-slate-500 sm:text-sm">
                      Statistics unavailable
                    </p>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-blue-600 sm:text-4xl">
                        <AnimatedNumber
                          value={
                            stat.value
                          }
                        />
                      </h3>

                      <p className="mt-1 text-xs font-medium text-slate-600 sm:mt-2 sm:text-base">
                        {stat.label}
                      </p>
                    </>
                  )}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
