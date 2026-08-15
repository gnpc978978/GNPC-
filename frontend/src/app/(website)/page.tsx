"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

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

function formatDate(
  value?: string
) {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
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

function detailHref(
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
    type ===
      "pressconference"
  ) {
    return `/press-conference/${encodeURIComponent(
      item._id
    )}`;
  }

  if (
    type.includes(
      "announcement"
    )
  ) {
    return `/announcements/${encodeURIComponent(
      item.slug ||
        item._id
    )}`;
  }

  if (
    type.includes("event")
  ) {
    return `/events/${encodeURIComponent(
      item.slug ||
        item._id
    )}`;
  }

  return `/press-releases/${encodeURIComponent(
    item.slug ||
      item._id
  )}`;
}

function PageSection({
  children,
  background,
}: {
  children: React.ReactNode;
  background:
    | "white"
    | "slate";
}) {
  return (
    <div
      className={
        background ===
        "slate"
          ? "bg-slate-50"
          : "bg-white"
      }
    >
      {children}
    </div>
  );
}

function HeroSection() {
  const {
    settings,
  } = useWebsiteSettings();

  const home =
    mergeHomeSettings(
      settings.home
    );

  const buttonClass =
    "group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-[#0f4c81] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155eef] focus-visible:ring-offset-2 sm:px-6 sm:text-base";

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-transparent">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-blue-50 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-slate-100 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#155eef 1px, transparent 1px), linear-gradient(90deg, #155eef 1px, transparent 1px)",
            backgroundSize:
              "64px 64px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 xl:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
            }}
            className="order-2 lg:order-1"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-0.5 w-8 rounded-full bg-[#155eef]"
              />

              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#155eef] sm:text-sm">
                {home.hero.eyebrow}
              </span>
            </div>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-bold text-[#155eef]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm">
                <Newspaper
                  size={13}
                />
              </span>

              {home.hero.identityLabel}
            </div>

            <h1 className="mt-6 max-w-3xl text-[2.35rem] font-black leading-[1.08] tracking-[-0.035em] text-[#101828] sm:text-5xl md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem]">
              {home.hero.title ||
                settings.heroTitle}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              {home.hero.description ||
                settings.heroDescription}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
              <MembershipFormLink
                className={
                  buttonClass
                }
                unavailableClassName={`${buttonClass} cursor-not-allowed opacity-60`}
              >
                {home.hero.primaryLabel}

                <ArrowRight
                  size={18}
                />
              </MembershipFormLink>

              <Link
                href="/latest-updates"
                className={
                  buttonClass
                }
              >
                {
                  home.hero
                    .secondaryLabel
                }

                <ArrowRight
                  size={18}
                />
              </Link>
            </div>

            {home.hero.quickLinks
              .length > 0 && (
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-200 pt-6 sm:mt-10">
                {home.hero.quickLinks.map(
                  (item) => (
                    <Link
                      key={`${item.label}-${item.href}`}
                      href={
                        item.href ||
                        "/"
                      }
                      className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700"
                    >
                      <Newspaper
                        size={15}
                        className="text-blue-600"
                      />

                      {item.label}

                      <ArrowRight
                        size={13}
                      />
                    </Link>
                  )
                )}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.7,
              delay: 0.1,
            }}
            className="order-1 lg:order-2"
          >
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-2xl">
              <div className="aspect-[4/3] min-h-[290px] sm:aspect-[16/11] lg:min-h-[460px]">
                <HeroCarousel
                  fallbackImage={
                    settings.heroImage ||
                    "/Logo.png"
                  }
                  alt={
                    home.hero.title ||
                    settings.siteName ||
                    "Greater Noida Press Club"
                  }
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const {
    settings,
  } = useWebsiteSettings();

  const home =
    mergeHomeSettings(
      settings.home
    );

  const [data, setData] =
    useState<{
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
      apiFetch(
        "/settings/about",
        {
          cache: "no-store",
        }
      ).then((response) =>
        responseJson<{
          data?: {
            image?: string;
            heading?: string;
            description?: string;
          };
        }>(response)
      ),

      apiFetch(
        "/dashboard/public-stats",
        {
          cache: "no-store",
        }
      ).then((response) =>
        responseJson<{
          data: PublicStats;
        }>(response)
      ),
    ]).then(
      ([
        about,
        publicStats,
      ]) => {
        if (cancelled) {
          return;
        }

        if (
          about.status ===
          "fulfilled"
        ) {
          setData(
            about.value.data ||
              {}
          );
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
    data.image ||
    settings.aboutImage;

  const statItems = [
    [
      stats.members,
      home.about
        .statsLabels[0],
    ],
    [
      stats.pressReleases,
      home.about
        .statsLabels[1],
    ],
    [
      stats.events,
      home.about
        .statsLabels[2],
    ],
  ];

  return (
    <section className="bg-transparent py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 flex flex-col gap-5 text-center sm:mb-14 sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <span className="gnpc-eyebrow">
              {home.about.eyebrow}
            </span>

            <h2 className="gnpc-section-title mt-3 text-3xl sm:text-4xl lg:text-5xl">
              {home.about.title ||
                data.heading ||
                settings.siteName}
            </h2>
          </div>

          <Button
            href={
              home.about.buttonHref
            }
            variant="outline"
            size="lg"
          >
            {home.about.buttonLabel}
          </Button>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            {loading ? (
              <div className="aspect-[6/5] animate-pulse rounded-3xl bg-slate-200" />
            ) : image ? (
              <div className="relative aspect-[6/5] overflow-hidden rounded-3xl bg-slate-100 shadow-2xl">
                <Image
                  src={image}
                  alt={
                    home.about
                      .title
                  }
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />

                <span className="absolute bottom-5 left-5 rounded-2xl bg-slate-950/45 px-4 py-3 text-xs font-bold tracking-[0.18em] text-white backdrop-blur">
                  GNPC
                </span>
              </div>
            ) : (
              <div className="flex aspect-[6/5] items-center justify-center rounded-3xl bg-slate-100">
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
          </div>

          <div>
            {loading ? (
              <div className="space-y-4">
                <div className="h-10 w-4/5 animate-pulse rounded bg-slate-200" />

                <div className="h-5 animate-pulse rounded bg-slate-200" />
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {home.about.title ||
                    data.heading}
                </h3>

                <p className="mt-4 text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
                  {home.about.description ||
                    data.description}
                </p>

                {home.about.features
                  .length >
                  0 && (
                  <div className="mt-7 space-y-3">
                    {home.about.features.map(
                      (feature) => (
                        <div
                          key={
                            feature
                          }
                          className="flex items-center gap-3"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            ✓
                          </span>

                          <span className="text-sm font-medium text-slate-700 sm:text-base">
                            {feature}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {home.about
          .showStats && (
          <div className="mt-12 rounded-3xl bg-slate-50 p-6 sm:mt-16 sm:p-8">
            <div className="grid grid-cols-3 gap-3 text-center sm:gap-8">
              {statItems.map(
                ([
                  value,
                  label,
                ]) => (
                  <div
                    key={String(
                      label
                    )}
                  >
                    <h3 className="text-2xl font-bold text-blue-600 sm:text-4xl">
                      {loading
                        ? "—"
                        : value}
                    </h3>

                    <p className="mt-1 text-xs font-medium text-slate-600 sm:text-base">
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

function ObjectivesSection() {
  const {
    settings,
  } = useWebsiteSettings();

  const home =
    mergeHomeSettings(
      settings.home
    );

  return (
    <section className="bg-transparent py-14 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          badge={
            home.objectives
              .eyebrow
          }
          title={
            home.objectives
              .title
          }
          description={
            home.objectives
              .description
          }
          action={
            <Button
              href={
                home.objectives
                  .buttonHref
              }
              variant="outline"
              size="lg"
            >
              {
                home.objectives
                  .buttonLabel
              }
            </Button>
          }
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {home.objectives.cards
            .slice(
              0,
              Math.max(
                1,
                home.objectives
                  .displayCount
              )
            )
            .map(
              (
                card,
                index
              ) => {
                const Icon =
                  iconMap[
                    card.icon
                  ] ||
                  Star;

                return (
                  <Card
                    key={`${card.title}-${index}`}
                    padding="sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 sm:h-16 sm:w-16 sm:rounded-2xl">
                      <Icon className="text-lg sm:text-3xl" />
                    </div>

                    <h3 className="mt-3 text-sm font-bold text-slate-900 sm:mt-6 sm:text-2xl">
                      {card.title}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
                      {
                        card.description
                      }
                    </p>
                  </Card>
                );
              }
            )}
        </div>
      </Container>
    </section>
  );
}

function LatestUpdatesSection() {
  const {
    settings,
  } = useWebsiteSettings();

  const home =
    mergeHomeSettings(
      settings.home
    );

  const [items, setItems] =
    useState<
      LatestUpdate[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    apiFetch(
      "/latest-updates"
    )
      .then((response) =>
        responseJson<{
          data?: LatestUpdate[];
        }>(response)
      )
      .then((payload) => {
        if (!cancelled) {
          setItems(
            (
              payload.data ||
              []
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
    home.latestUpdates
      .displayCount,
  ]);

  return (
    <section className="bg-transparent py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          align="left"
          badge={
            home.latestUpdates
              .eyebrow
          }
          title={
            home.latestUpdates
              .title
          }
          description={
            home.latestUpdates
              .description
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

              <ArrowRight
                size={17}
              />
            </Button>
          }
        />

        {loading ? (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[1, 2, 3].map(
              (number) => (
                <div
                  key={number}
                  className="aspect-[16/12] animate-pulse rounded-2xl bg-slate-200"
                />
              )
            )}
          </div>
        ) : items.length ===
          0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <Newspaper
              className="mx-auto text-slate-400"
              size={38}
            />

            <p className="mt-4 font-semibold text-slate-700">
              No latest updates
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
            {items.map(
              (item) => {
                const image =
                  item.featuredImage ||
                  item.image;

                const date =
                  item.publishedAt ||
                  item.date ||
                  item.createdAt;

                return (
                  <article
                    key={
                      item._id
                    }
                    className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    {image ? (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={
                            image
                          }
                          alt={
                            item.title
                          }
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[16/9] items-center justify-center bg-slate-100">
                        <Newspaper
                          className="text-blue-300"
                          size={40}
                        />
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-3 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-blue-700 sm:text-xs">
                        <span>
                          {item.type ||
                            item.category ||
                            "Update"}
                        </span>

                        {date && (
                          <span className="inline-flex items-center gap-1 text-slate-400">
                            <CalendarDays
                              size={
                                14
                              }
                            />

                            {formatDate(
                              date
                            )}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2 line-clamp-2 text-sm font-bold text-slate-900 sm:text-xl">
                        {
                          item.title
                        }
                      </h3>

                      <p className="mt-2 line-clamp-3 flex-1 text-xs leading-5 text-slate-600 sm:text-sm">
                        {item.excerpt ||
                          item.description ||
                          "Read the latest update from Greater Noida Press Club."}
                      </p>

                      <Link
                        href={detailHref(
                          item
                        )}
                        className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-blue-700 sm:text-base"
                      >
                        Read More

                        <ArrowRight
                          size={17}
                        />
                      </Link>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function GallerySection() {
  const {
    settings,
  } = useWebsiteSettings();

  const home =
    mergeHomeSettings(
      settings.home
    );

  const [items, setItems] =
    useState<
      GalleryItem[]
    >([]);

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
              payload.data ||
              []
            ).slice(
              0,
              Math.max(
                1,
                home.gallery
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
    home.gallery
      .displayCount,
  ]);

  return (
    <section className="bg-transparent py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          badge={
            home.gallery
              .eyebrow
          }
          title={
            home.gallery
              .title
          }
          description={
            home.gallery
              .description
          }
          action={
            <Button
              href={
                home.gallery
                  .buttonHref
              }
              variant="outline"
              size="lg"
            >
              {
                home.gallery
                  .buttonLabel
              }

              <ArrowRight
                size={17}
              />
            </Button>
          }
        />

        {loading ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map(
              (number) => (
                <div
                  key={number}
                  className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-200"
                />
              )
            )}
          </div>
        ) : items.length ===
          0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <ImageOff
              className="mx-auto text-slate-400"
              size={38}
            />

            <p className="mt-4 font-semibold text-slate-700">
              No gallery images available
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {items.map(
              (
                item,
                index
              ) => {
                const src =
                  item.image ||
                  item.imageUrl ||
                  item.url;

                return (
                  <Link
                    key={
                      item._id ||
                      item.id ||
                      index
                    }
                    href={
                      home.gallery
                        .buttonHref
                    }
                    className="group relative overflow-hidden rounded-2xl bg-slate-100"
                  >
                    <div className="relative aspect-[4/3]">
                      {src ? (
                        <Image
                          src={
                            src
                          }
                          alt={
                            item.title ||
                            item.name ||
                            "GNPC Gallery"
                          }
                          fill
                          sizes="(min-width: 640px) 33vw, 50vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageOff
                            className="text-slate-400"
                            size={32}
                          />
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-10">
                        <p className="line-clamp-2 text-sm font-semibold text-white sm:text-base">
                          {item.title ||
                            item.name ||
                            item.category ||
                            "GNPC Gallery"}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function PressConferencesSection() {
  const {
    settings,
  } = useWebsiteSettings();

  const home =
    mergeHomeSettings(
      settings.home
    );

  const [items, setItems] =
    useState<
      PressConference[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    apiFetch(
      "/press-conferences",
      {
        cache: "no-store",
      }
    )
      .then((response) =>
        responseJson<{
          data?: PressConference[];
        }>(response)
      )
      .then((payload) => {
        if (!cancelled) {
          setItems(
            (
              payload.data ||
              []
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
    home.pressConferences
      .displayCount,
  ]);

  return (
    <section className="bg-transparent py-14 sm:py-20">
      <Container>
        <SectionHeading
          badge={
            home.pressConferences
              .eyebrow
          }
          title={
            home.pressConferences
              .title
          }
          description={
            home.pressConferences
              .description
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

              <ArrowRight
                size={17}
              />
            </Button>
          }
        />

        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <p className="text-sm text-slate-500">
              Loading press conferences...
            </p>
          </div>
        ) : items.length ===
          0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
            <p className="font-semibold text-slate-700">
              No press conferences available
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(
              (item) => (
                <Card
                  key={
                    item._id
                  }
                  className="overflow-hidden border-slate-200 bg-white p-0 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {item.featuredImage && (
                    <img
                      src={
                        item.featuredImage
                      }
                      alt={
                        item.title
                      }
                      className="h-52 w-full object-cover"
                    />
                  )}

                  <div className="p-5 sm:p-6">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-700">
                      Press Conference
                    </p>

                    <h3 className="mt-2 text-xl font-extrabold text-slate-900">
                      {
                        item.title
                      }
                    </h3>

                    <div className="mt-4 space-y-2 text-sm text-slate-600">
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

                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                      {item.description ||
                        item.content ||
                        "Read the latest press conference update."}
                    </p>

                    <Button
                      href={`/press-conference/${item._id}`}
                      size="md"
                      className="mt-5"
                    >
                      View Details

                      <ArrowRight
                        size={17}
                      />
                    </Button>
                  </div>
                </Card>
              )
            )}
          </div>
        )}
      </Container>
    </section>
  );
}

function ExecutiveCommitteeSection() {
  const {
    settings,
  } = useWebsiteSettings();

  const home =
    mergeHomeSettings(
      settings.home
    );

  const [members, setMembers] =
    useState<
      ExecutiveCommittee[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    const params =
      new URLSearchParams({
        limit: String(
          Math.max(
            1,
            home
              .executiveCommittee
              .displayCount
          )
        ),
      });

    getPublicExecutiveCommittee(
      params
    )
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
    home
      .executiveCommittee
      .displayCount,
  ]);

  return (
    <section className="bg-transparent py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge={
            home
              .executiveCommittee
              .eyebrow
          }
          title={
            home
              .executiveCommittee
              .title
          }
          description={
            home
              .executiveCommittee
              .description
          }
          action={
            home
              .executiveCommittee
              .showViewAll ? (
              <Button
                href={
                  home
                    .executiveCommittee
                    .buttonHref
                }
                variant="outline"
                size="lg"
              >
                {
                  home
                    .executiveCommittee
                    .buttonLabel
                }
              </Button>
            ) : undefined
          }
        />

        {loading ? (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[1, 2, 3].map(
              (number) => (
                <div
                  key={number}
                  className="h-80 animate-pulse rounded-2xl bg-slate-200"
                />
              )
            )}
          </div>
        ) : members.length ===
          0 ? (
          <div className="mt-10 rounded-2xl bg-white py-14 text-center">
            <SearchX
              className="mx-auto text-blue-600"
              size={42}
            />

            <p className="mt-4 font-bold text-slate-800">
              No committee members found
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {members.map(
              (member) => (
                <article
                  key={
                    member._id
                  }
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
                >
                  <div className="relative aspect-square bg-slate-100">
                    {member.photo ? (
                      <Image
                        src={
                          member.photo
                        }
                        alt={
                          member.name
                        }
                        fill
                        sizes="(min-width: 1024px) 33vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-blue-100 text-5xl font-bold text-blue-700">
                        {member.name.charAt(
                          0
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="font-bold text-slate-900">
                      {
                        member.name
                      }
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-blue-700">
                      {
                        member.designation
                      }
                    </p>

                    {member.organization && (
                      <p className="mt-1 text-sm text-slate-600">
                        {
                          member.organization
                        }
                      </p>
                    )}
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function OfficeBearersSection() {
  const {
    settings,
  } = useWebsiteSettings();

  const home =
    mergeHomeSettings(
      settings.home
    );

  const {
    data,
    isLoading,
    isError,
  } = usePublicMembers(
    1,
    Math.max(
      1,
      home.officeBearers
        .displayCount
    )
  );

  const members =
    data?.data || [];

  return (
    <section className="bg-transparent py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge={
            home.officeBearers
              .eyebrow
          }
          title={
            home.officeBearers
              .title
          }
          description={
            home.officeBearers
              .description
          }
          action={
            home.officeBearers
              .showViewAll ? (
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
              </Button>
            ) : undefined
          }
        />

        <div className="mt-9">
          {isLoading ? (
            <OfficeBearersSkeleton
              count={Math.max(
                1,
                home
                  .officeBearers
                  .displayCount
              )}
            />
          ) : isError ? (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 py-12 text-center text-slate-600">
              Office bearers are unavailable right now.
            </p>
          ) : members.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {members.map(
                (member) => (
                  <OfficeBearerCard
                    key={
                      member._id
                    }
                    member={
                      member
                    }
                  />
                )
              )}
            </div>
          ) : (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 py-12 text-center text-slate-500">
              No office bearers have been published yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function MembershipSection() {
  const {
    settings,
  } = useWebsiteSettings();

  const home =
    mergeHomeSettings(
      settings.home
    );

  return (
    <AboutCTA
      title={
        home.membership
          .title
      }
      description={
        home.membership
          .description
      }
      primaryLabel={
        home.membership
          .primaryLabel
      }
      secondaryLabel={
        home.membership
          .secondaryLabel
      }
      secondaryHref={
        home.membership
          .secondaryHref
      }
    />
  );
}

export default function HomePage() {
  const {
    settings,
  } = useWebsiteSettings();

  const home =
    mergeHomeSettings(
      settings.home
    );

  const sections =
    Object.entries(
      home.sections
    )
      .filter(
        ([, value]) =>
          value.enabled
      )
      .sort(
        ([, a], [, b]) =>
          a.order -
          b.order
      )
      .map(
        ([key]) =>
          key as keyof typeof home.sections
      );

  const render = (
    key: keyof typeof home.sections
  ) => {
    const background =
      home.sections[key]
        .background;

    const wrap = (
      node: React.ReactNode
    ) => (
      <PageSection
        background={
          background
        }
      >
        {node}
      </PageSection>
    );

    switch (key) {
      case "hero":
        return (
          <div key={key}>
            {wrap(
              <HeroSection />
            )}
          </div>
        );

      case "about":
        return (
          <div key={key}>
            {wrap(
              <AboutSection />
            )}
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
            {wrap(
              <GallerySection />
            )}
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
      {sections.map(
        render
      )}
    </main>
  );
}
