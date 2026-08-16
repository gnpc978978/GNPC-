"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Award,
  ArrowRight,
  BookOpen,
  CalendarDays,
  GraduationCap,
  ImageOff,
  Images,
  MapPin,
  Mic,
  Newspaper,
  SearchX,
  ShieldCheck,
  Star,
  Target,
  Users,
} from "lucide-react";

import { motion } from "framer-motion";

import HeroCarousel from "@/components/home/HeroCarousel";
import MembershipFormLink from "@/components/membership/MembershipFormLink";
import AboutCTA from "@/components/about/AboutCTA";

import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";

import OfficeBearerCard from "@/components/office-bearers/OfficeBearerCard";
import OfficeBearersSkeleton from "@/components/office-bearers/OfficeBearersSkeleton";

import { usePublicMembers } from "@/hooks/useMembers";

import {
  getPublicExecutiveCommittee,
} from "@/services/executiveCommitteeService";

import {
  apiFetch,
  responseJson,
} from "@/services/api";

import {
  useWebsiteSettings,
} from "@/context/WebsiteSettingsContext";

import {
  mergeHomeSettings,
} from "@/types/homeSettings";

import type {
  ExecutiveCommittee,
} from "@/types/executiveCommittee";

const iconMap: Record<
  string,
  React.ComponentType<{
    className?: string;
  }>
> = {
  Award,
  BookOpen,
  GraduationCap,
  Images,
  Mic,
  Newspaper,
  ShieldCheck,
  Star,
  Target,
  Users,
};

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

type GalleryItem = {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  image?: string;
  imageUrl?: string;
  url?: string;
  category?: string;
};

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

type PublicStats = {
  members: number;
  pressReleases: number;
  events: number;
};

function formatDate(value?: string) {
  if (!value) return "";

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

function detailHref(item: LatestUpdate) {
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
    return `/press-conference/${encodeURIComponent(item._id)}`;
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

function PageSection({
  children,
  background,
}: {
  children: React.ReactNode;
  background: "white" | "slate";
}) {
  return (
    <div
      className={
        background === "slate"
          ? "bg-[#f5f7fa]"
          : "bg-white"
      }
    >
      {children}
    </div>
  );
}

/* =========================================================
   HERO
   ========================================================= */

function HeroSection() {
  const { settings } = useWebsiteSettings();
  const home = mergeHomeSettings(settings.home);

  const buttonClass =
    "group inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/95 px-6 py-3.5 text-sm font-bold text-slate-900 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 sm:px-7";

  return (
    <section className="relative min-h-[720px] overflow-hidden bg-slate-950 sm:min-h-[820px] lg:min-h-[900px]">
      <div className="absolute inset-0">
        <HeroCarousel
          fallbackImage={settings.heroImage || "/Logo.png"}
          alt={home.hero.title || settings.siteName || "Greater Noida Press Club"}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-900/15 to-slate-950/70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.10)_48%,rgba(0,0,0,0.48)_100%)]" />

      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[720px] max-w-[1500px] items-center px-4 pb-16 pt-24 sm:min-h-[820px] sm:px-8 sm:pb-20 sm:pt-28 lg:min-h-[900px] lg:px-10 lg:pt-32">
        {/* No second navbar here. The global website Navbar is the only navbar. */}
        <div className="w-full translate-y-8 sm:translate-y-12 lg:translate-y-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto w-full max-w-5xl text-center"
          >
            <div className="mb-5 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-bold text-white shadow-xl backdrop-blur-xl sm:text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#155eef]">
                  <Newspaper size={13} />
                </span>
                {home.hero.identityLabel}
              </div>
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/85 drop-shadow-lg sm:text-sm">
              {home.hero.eyebrow}
            </p>

            <h1 className="mx-auto mt-5 max-w-5xl text-[2.7rem] font-medium leading-[0.98] tracking-[-0.055em] text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.45)] sm:text-6xl md:text-7xl lg:text-[5.8rem] xl:text-[6.5rem]">
              {home.hero.title || settings.heroTitle}
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-sm leading-6 text-white/90 drop-shadow-lg sm:text-lg sm:leading-8">
              {home.hero.description || settings.heroDescription}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row">
              <MembershipFormLink
                className={buttonClass}
                unavailableClassName={`${buttonClass} cursor-not-allowed opacity-60`}
              >
                {home.hero.primaryLabel}
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight size={15} />
                </span>
              </MembershipFormLink>

              <Link
                href="/latest-updates"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 sm:px-7"
              >
                {home.hero.secondaryLabel}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {home.hero.quickLinks.length > 0 && (
              <div className="mx-auto mt-9 flex max-w-2xl flex-wrap justify-center gap-2">
                {home.hero.quickLinks.map((item) => (
                  <Link
                    key={`${item.label}-${item.href}`}
                    href={item.href || "/"}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/15 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur-md transition hover:bg-white/15 hover:text-white"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   ABOUT
   ========================================================= */

function AboutSection() {
  const { settings } = useWebsiteSettings();

  const home = mergeHomeSettings(settings.home);

  const [data, setData] = useState<{
    image?: string;
    heading?: string;
    description?: string;
  }>({});

  const [stats, setStats] =
    useState<PublicStats>({
      members: 0,
      pressReleases: 0,
      events: 0,
    });

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([
      apiFetch("/settings/about", {
        cache: "no-store",
      }).then((response) =>
        responseJson<{
          data?: {
            image?: string;
            heading?: string;
            description?: string;
          };
        }>(response)
      ),

      apiFetch("/dashboard/public-stats", {
        cache: "no-store",
      }).then((response) =>
        responseJson<{
          data: PublicStats;
        }>(response)
      ),
    ]).then(
      ([
        about,
        publicStats,
      ]) => {
        if (cancelled) return;

        if (about.status === "fulfilled") {
          setData(about.value.data || {});
        }

        if (
          publicStats.status ===
          "fulfilled"
        ) {
          setStats(
            publicStats.value.data
          );
        }

        setLoading(false);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [settings.aboutImage]);

  const image =
    data.image || settings.aboutImage;

  const statItems = [
    [
      stats.members,
      home.about.statsLabels[0],
    ],
    [
      stats.pressReleases,
      home.about.statsLabels[1],
    ],
    [
      stats.events,
      home.about.statsLabels[2],
    ],
  ];

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute -right-48 top-20 h-96 w-96 rounded-full bg-blue-50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="gnpc-eyebrow">
              {home.about.eyebrow}
            </span>

            <h2 className="gnpc-section-title mt-4 text-4xl sm:text-5xl lg:text-6xl">
              {home.about.title ||
                data.heading ||
                settings.siteName}
            </h2>
          </div>

          <Button
            href={home.about.buttonHref}
            variant="outline"
            size="lg"
          >
            {home.about.buttonLabel}
            <ArrowRight size={17} />
          </Button>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* Image */}
          <motion.div
            initial={{
              opacity: 0,
              x: -25,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              margin: "-100px",
            }}
            transition={{
              duration: 0.7,
            }}
          >
            {loading ? (
              <div className="aspect-[6/5] animate-pulse rounded-[2rem] bg-slate-200" />
            ) : image ? (
              <div className="group relative overflow-hidden rounded-[2rem] bg-slate-100 shadow-2xl">
                <div className="relative aspect-[6/5]">
                  <Image
                    src={image}
                    alt={
                      home.about.title ||
                      "About Greater Noida Press Club"
                    }
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/65">
                        Greater Noida
                      </p>

                      <p className="mt-1 text-2xl font-bold text-white">
                        Press Club
                      </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-xl">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex aspect-[6/5] items-center justify-center rounded-[2rem] bg-slate-100">
                <div className="text-center text-slate-500">
                  <ImageOff
                    className="mx-auto"
                    size={42}
                  />

                  <p className="mt-3 text-sm font-semibold">
                    About image coming soon
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{
              opacity: 0,
              x: 25,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              margin: "-100px",
            }}
            transition={{
              duration: 0.7,
              delay: 0.1,
            }}
          >
            {loading ? (
              <div className="space-y-4">
                <div className="h-10 w-4/5 animate-pulse rounded bg-slate-200" />
                <div className="h-5 animate-pulse rounded bg-slate-200" />
                <div className="h-5 w-5/6 animate-pulse rounded bg-slate-200" />
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  {home.about.title ||
                    data.heading}
                </h3>

                <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
                  {home.about.description ||
                    data.description}
                </p>

                {home.about.features.length >
                  0 && (
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {home.about.features.map(
                      (feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                            ✓
                          </span>

                          <span className="text-sm font-semibold text-slate-700">
                            {feature}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>

        {home.about.showStats && (
          <div className="mt-14 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 shadow-2xl sm:mt-20">
            <div className="grid grid-cols-3">
              {statItems.map(
                ([value, label], index) => (
                  <div
                    key={String(label)}
                    className={`px-3 py-7 text-center sm:px-8 sm:py-10 ${
                      index !== 0
                        ? "border-l border-white/10"
                        : ""
                    }`}
                  >
                    <h3 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
                      {loading
                        ? "—"
                        : value}
                    </h3>

                    <p className="mt-2 text-xs font-medium text-white/55 sm:text-sm">
                      {label}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   OBJECTIVES
   ========================================================= */

function ObjectivesSection() {
  const { settings } = useWebsiteSettings();

  const home = mergeHomeSettings(settings.home);

  return (
    <section className="bg-[#f5f7fa] py-20 sm:py-28 lg:py-32">
      <Container>
        <SectionHeading
          badge={home.objectives.eyebrow}
          title={home.objectives.title}
          description={home.objectives.description}
          action={
            <Button
              href={home.objectives.buttonHref}
              variant="outline"
              size="lg"
            >
              {home.objectives.buttonLabel}
              <ArrowRight size={17} />
            </Button>
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {home.objectives.cards
            .slice(
              0,
              Math.max(
                1,
                home.objectives.displayCount
              )
            )
            .map((card, index) => {
              const Icon =
                iconMap[card.icon] ||
                Star;

              return (
                <motion.div
                  key={`${card.title}-${index}`}
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
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                  }}
                >
                  <Card
                    padding="sm"
                    className="group h-full rounded-[1.75rem] border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl sm:p-8"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
                      <Icon className="text-2xl" />
                    </div>

                    <h3 className="mt-6 text-xl font-bold text-slate-950 sm:text-2xl">
                      {card.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                      {card.description}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
                      Learn More
                      <ArrowRight size={14} />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
        </div>
      </Container>
    </section>
  );
}

/* =========================================================
   LATEST UPDATES
   ========================================================= */

function LatestUpdatesSection() {
  const { settings } = useWebsiteSettings();

  const home = mergeHomeSettings(settings.home);

  const [items, setItems] =
    useState<LatestUpdate[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    apiFetch("/latest-updates")
      .then((response) =>
        responseJson<{
          data?: LatestUpdate[];
        }>(response)
      )
      .then((payload) => {
        if (!cancelled) {
          setItems(
            (
              payload.data || []
            ).slice(
              0,
              Math.max(
                1,
                home.latestUpdates
                  .displayCount
              )
            )
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setItems([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    home.latestUpdates.displayCount,
  ]);

  return (
    <section className="bg-white py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          align="left"
          badge={home.latestUpdates.eyebrow}
          title={home.latestUpdates.title}
          description={
            home.latestUpdates.description
          }
          action={
            <Button
              href={
                home.latestUpdates
                  .buttonHref
              }
              variant="outline"
              size="lg"
            >
              {
                home.latestUpdates
                  .buttonLabel
              }
              <ArrowRight size={17} />
            </Button>
          }
        />

        {loading ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((number) => (
              <div
                key={number}
                className="aspect-[16/12] animate-pulse rounded-[1.5rem] bg-slate-200"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-12 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-6 py-14 text-center">
            <Newspaper
              className="mx-auto text-slate-400"
              size={38}
            />

            <p className="mt-4 font-semibold text-slate-700">
              No latest updates
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => {
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
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                  }}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {image ? (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={image}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/10] items-center justify-center bg-slate-100">
                      <Newspaper
                        className="text-blue-300"
                        size={40}
                      />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-700 sm:text-xs">
                      <span>
                        {item.type ||
                          item.category ||
                          "Update"}
                      </span>

                      {date && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />

                          <span className="inline-flex items-center gap-1 text-slate-400">
                            <CalendarDays
                              size={13}
                            />
                            {formatDate(date)}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="mt-3 line-clamp-2 text-xl font-bold tracking-tight text-slate-950">
                      {item.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
                      {item.excerpt ||
                        item.description ||
                        "Read the latest update from Greater Noida Press Club."}
                    </p>

                    <Link
                      href={detailHref(item)}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:gap-3"
                    >
                      Read More
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   GALLERY
   ========================================================= */

function GallerySection() {
  const { settings } = useWebsiteSettings();

  const home = mergeHomeSettings(settings.home);

  const [items, setItems] =
    useState<GalleryItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    apiFetch("/gallery")
      .then((response) =>
        responseJson<{
          data?: GalleryItem[];
        }>(response)
      )
      .then((payload) => {
        if (!cancelled) {
          setItems(
            (
              payload.data || []
            ).slice(
              0,
              Math.max(
                1,
                home.gallery.displayCount
              )
            )
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setItems([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [home.gallery.displayCount]);

  return (
    <section className="bg-[#f5f7fa] py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          badge={home.gallery.eyebrow}
          title={home.gallery.title}
          description={home.gallery.description}
          action={
            <Button
              href={home.gallery.buttonHref}
              variant="outline"
              size="lg"
            >
              {home.gallery.buttonLabel}
              <ArrowRight size={17} />
            </Button>
          }
        />

        {loading ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((number) => (
              <div
                key={number}
                className="aspect-[4/3] animate-pulse rounded-[1.5rem] bg-slate-200"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-12 rounded-[1.5rem] border border-slate-200 bg-white px-6 py-14 text-center">
            <ImageOff
              className="mx-auto text-slate-400"
              size={38}
            />

            <p className="mt-4 font-semibold text-slate-700">
              No gallery images available
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {items.map((item, index) => {
              const src =
                item.image ||
                item.imageUrl ||
                item.url;

              return (
                <motion.div
                  key={
                    item._id ||
                    item.id ||
                    index
                  }
                  initial={{
                    opacity: 0,
                    scale: 0.97,
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                  }}
                >
                  <Link
                    href={
                      home.gallery
                        .buttonHref
                    }
                    className="group relative block overflow-hidden rounded-[1.5rem] bg-slate-100 shadow-sm"
                  >
                    <div className="relative aspect-[4/3]">
                      {src ? (
                        <Image
                          src={src}
                          alt={
                            item.title ||
                            item.name ||
                            "GNPC Gallery"
                          }
                          fill
                          sizes="(min-width: 640px) 33vw, 100vw"
                          className="object-cover transition duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageOff
                            className="text-slate-400"
                            size={32}
                          />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90" />

                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <div className="flex items-end justify-between gap-4">
                          <p className="line-clamp-2 text-base font-bold text-white">
                            {item.title ||
                              item.name ||
                              item.category ||
                              "GNPC Gallery"}
                          </p>

                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition group-hover:bg-white group-hover:text-slate-900">
                            <ArrowRight size={15} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   PRESS CONFERENCES
   ========================================================= */

function PressConferencesSection() {
  const { settings } = useWebsiteSettings();

  const home = mergeHomeSettings(settings.home);

  const [items, setItems] =
    useState<PressConference[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    apiFetch("/press-conferences", {
      cache: "no-store",
    })
      .then((response) =>
        responseJson<{
          data?: PressConference[];
        }>(response)
      )
      .then((payload) => {
        if (!cancelled) {
          setItems(
            (
              payload.data || []
            ).slice(
              0,
              Math.max(
                1,
                home.pressConferences
                  .displayCount
              )
            )
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setItems([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    home.pressConferences.displayCount,
  ]);

  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading
          badge={home.pressConferences.eyebrow}
          title={home.pressConferences.title}
          description={
            home.pressConferences.description
          }
          action={
            <Button
              href={
                home.pressConferences
                  .buttonHref
              }
              variant="outline"
              size="lg"
            >
              {
                home.pressConferences
                  .buttonLabel
              }
              <ArrowRight size={17} />
            </Button>
          }
        />

        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <p className="text-sm text-slate-500">
              Loading press conferences...
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="mt-10 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-6 py-14 text-center">
            <p className="font-semibold text-slate-700">
              No press conferences available
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <motion.div
                key={item._id}
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
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                }}
              >
                <Card
                  className="group h-full overflow-hidden rounded-[1.5rem] border-slate-200 bg-white p-0 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {item.featuredImage && (
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={item.featuredImage}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
                    </div>
                  )}

                  <div className="p-6 sm:p-7">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-700">
                      Press Conference
                    </p>

                    <h3 className="mt-3 text-xl font-extrabold tracking-tight text-slate-950">
                      {item.title}
                    </h3>

                    <div className="mt-5 space-y-2 text-sm text-slate-600">
                      <span className="flex items-center gap-2">
                        <CalendarDays
                          size={16}
                          className="text-blue-700"
                        />

                        {formatDate(
                          item.date ||
                            item.createdAt
                        )}
                      </span>

                      <span className="flex items-center gap-2">
                        <MapPin
                          size={16}
                          className="text-blue-700"
                        />

                        {item.venue ||
                          "Greater Noida Press Club"}
                      </span>
                    </div>

                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
                      {item.description ||
                        item.content ||
                        "Read the latest press conference update."}
                    </p>

                    <Button
                      href={`/press-conference/${item._id}`}
                      size="md"
                      className="mt-6"
                    >
                      View Details
                      <ArrowRight size={17} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

/* =========================================================
   EXECUTIVE COMMITTEE
   ========================================================= */

function ExecutiveCommitteeSection() {
  const { settings } = useWebsiteSettings();

  const home = mergeHomeSettings(settings.home);

  const [
    members,
    setMembers,
  ] = useState<ExecutiveCommittee[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    const params =
      new URLSearchParams({
        limit: String(
          Math.max(
            1,
            home.executiveCommittee
              .displayCount
          )
        ),
      });

    getPublicExecutiveCommittee(params)
      .then((data) => {
        if (!cancelled) {
          setMembers(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMembers([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    home.executiveCommittee
      .displayCount,
  ]);

  return (
    <section className="bg-[#f5f7fa] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge={
            home.executiveCommittee
              .eyebrow
          }
          title={
            home.executiveCommittee
              .title
          }
          description={
            home.executiveCommittee
              .description
          }
          action={
            home.executiveCommittee
              .showViewAll ? (
              <Button
                href={
                  home.executiveCommittee
                    .buttonHref
                }
                variant="outline"
                size="lg"
              >
                {
                  home.executiveCommittee
                    .buttonLabel
                }
                <ArrowRight size={17} />
              </Button>
            ) : undefined
          }
        />

        {loading ? (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((number) => (
              <div
                key={number}
                className="h-80 animate-pulse rounded-[1.5rem] bg-slate-200"
              />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="mt-12 rounded-[1.5rem] bg-white py-14 text-center shadow-sm">
            <SearchX
              className="mx-auto text-blue-600"
              size={42}
            />

            <p className="mt-4 font-bold text-slate-800">
              No committee members found
            </p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
            {members.map((member, index) => (
              <motion.article
                key={member._id}
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
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                }}
                className="group overflow-hidden rounded-[1.5rem] bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-blue-100 text-5xl font-bold text-blue-700">
                      {member.name.charAt(0)}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                </div>

                <div className="p-5 sm:p-6">
                  <h3 className="font-bold text-slate-950 sm:text-lg">
                    {member.name}
                  </h3>

                  <p className="mt-1 text-sm font-bold text-blue-700">
                    {member.designation}
                  </p>

                  {member.organization && (
                    <p className="mt-1 text-sm text-slate-500">
                      {member.organization}
                    </p>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   OFFICE BEARERS
   ========================================================= */

function OfficeBearersSection() {
  const { settings } = useWebsiteSettings();

  const home = mergeHomeSettings(settings.home);

  const {
    data,
    isLoading,
    isError,
  } = usePublicMembers(
    1,
    Math.max(
      1,
      home.officeBearers.displayCount
    )
  );

  const members = data?.data || [];

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge={home.officeBearers.eyebrow}
          title={home.officeBearers.title}
          description={
            home.officeBearers.description
          }
          action={
            home.officeBearers.showViewAll ? (
              <Button
                href={
                  home.officeBearers
                    .buttonHref
                }
                variant="outline"
                size="lg"
              >
                {
                  home.officeBearers
                    .buttonLabel
                }
                <ArrowRight size={17} />
              </Button>
            ) : undefined
          }
        />

        <div className="mt-12">
          {isLoading ? (
            <OfficeBearersSkeleton
              count={Math.max(
                1,
                home.officeBearers
                  .displayCount
              )}
            />
          ) : isError ? (
            <p className="rounded-[1.5rem] border border-slate-200 bg-slate-50 py-12 text-center text-slate-600">
              Office bearers are unavailable
              right now.
            </p>
          ) : members.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {members.map((member) => (
                <div
                  key={member._id}
                  className="overflow-hidden rounded-[1.5rem] transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <OfficeBearerCard
                    member={member}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-[1.5rem] border border-slate-200 bg-slate-50 py-12 text-center text-slate-500">
              No office bearers have been
              published yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   MEMBERSHIP
   ========================================================= */

function MembershipSection() {
  const { settings } = useWebsiteSettings();

  const home = mergeHomeSettings(settings.home);

  return (
    <section className="bg-[#f5f7fa] py-10 sm:py-16">
      <AboutCTA
        title={home.membership.title}
        description={home.membership.description}
        primaryLabel={
          home.membership.primaryLabel
        }
        secondaryLabel={
          home.membership.secondaryLabel
        }
        secondaryHref={
          home.membership.secondaryHref
        }
      />
    </section>
  );
}

/* =========================================================
   HOME PAGE
   ========================================================= */

export default function HomePage() {
  const { settings } = useWebsiteSettings();

  const home = mergeHomeSettings(settings.home);

  const sections = Object.entries(
    home.sections
  )
    .filter(([, value]) => value.enabled)
    .sort(
      ([, a], [, b]) =>
        a.order - b.order
    )
    .map(
      ([key]) =>
        key as keyof typeof home.sections
    );

  const render = (
    key: keyof typeof home.sections
  ) => {
    const background =
      home.sections[key].background;

    const wrap = (
      node: React.ReactNode
    ) => (
      <PageSection
        background={background}
      >
        {node}
      </PageSection>
    );

    switch (key) {
      case "hero":
        return (
          <div key={key}>
            {wrap(<HeroSection />)}
          </div>
        );

      case "about":
        return (
          <div key={key}>
            {wrap(<AboutSection />)}
          </div>
        );

      case "objectives":
        return (
          <div key={key}>
            {wrap(
              <ObjectivesSection />
            )}
          </div>
        );

      case "latestUpdates":
        return (
          <div key={key}>
            {wrap(
              <LatestUpdatesSection />
            )}
          </div>
        );

      case "gallery":
        return (
          <div key={key}>
            {wrap(<GallerySection />)}
          </div>
        );

      case "pressConferences":
        return (
          <div key={key}>
            {wrap(
              <PressConferencesSection />
            )}
          </div>
        );

      case "executiveCommittee":
        return (
          <div key={key}>
            {wrap(
              <ExecutiveCommitteeSection />
            )}
          </div>
        );

      case "officeBearers":
        return (
          <div key={key}>
            {wrap(
              <OfficeBearersSection />
            )}
          </div>
        );

      case "membership":
        return (
          <div key={key}>
            {wrap(
              <MembershipSection />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="home-page w-full overflow-x-hidden bg-white">
      {sections.map(render)}
    </main>
  );
}
