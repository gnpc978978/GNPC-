"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  CheckCircle2,
  Eye,
  RefreshCw,
  Target,
} from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import AboutCTA from "@/components/about/AboutCTA";
import Button from "@/components/ui/Button";

import {
  apiFetch,
  responseJson,
} from "@/services/api";

type AboutItem = {
  title: string;
  description: string;
  icon?: string;
};

type AboutSettings = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;

  image: string;

  heading: string;
  description: string;
  secondaryDescription: string;

  commitmentTitle: string;
  commitmentDescription: string;

  foundationEyebrow: string;
  foundationTitle: string;
  foundationDescription: string;

  missionTitle: string;
  missionDescription: string;

  visionTitle: string;
  visionDescription: string;

  objectivesEyebrow: string;
  objectivesTitle: string;
  objectivesDescription: string;
  objectives: AboutItem[];

  presidentName: string;
  presidentDesignation: string;
  presidentMessage: string;
  presidentPhoto: string;

  whyChooseUsEyebrow: string;
  whyChooseUsTitle: string;
  whyChooseUsDescription: string;
  reasons: AboutItem[];

  ctaTitle: string;
  ctaDescription: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
};

type AboutResponse = {
  success?: boolean;
  message?: string;
  data?: Partial<AboutSettings>;
};

const EMPTY_ABOUT: AboutSettings = {
  heroEyebrow: "",
  heroTitle: "",
  heroDescription: "",

  image: "",

  heading: "",
  description: "",
  secondaryDescription: "",

  commitmentTitle: "",
  commitmentDescription: "",

  foundationEyebrow: "",
  foundationTitle: "",
  foundationDescription: "",

  missionTitle: "",
  missionDescription: "",

  visionTitle: "",
  visionDescription: "",

  objectivesEyebrow: "",
  objectivesTitle: "",
  objectivesDescription: "",
  objectives: [],

  presidentName: "",
  presidentDesignation: "",
  presidentMessage: "",
  presidentPhoto: "",

  whyChooseUsEyebrow: "",
  whyChooseUsTitle: "",
  whyChooseUsDescription: "",
  reasons: [],

  ctaTitle: "",
  ctaDescription: "",
  ctaPrimaryLabel: "",
  ctaSecondaryLabel: "",
};

function normalizeItems(
  value: unknown
): AboutItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(
    (item) => ({
      title:
        typeof item?.title ===
        "string"
          ? item.title
          : "",

      description:
        typeof item?.description ===
        "string"
          ? item.description
          : "",

      icon:
        typeof item?.icon ===
        "string"
          ? item.icon
          : "",
    })
  );
}

function normalizeAbout(
  data?: Partial<AboutSettings>
): AboutSettings {
  return {
    ...EMPTY_ABOUT,
    ...(data || {}),

    objectives:
      normalizeItems(
        data?.objectives
      ),

    reasons:
      normalizeItems(
        data?.reasons
      ),

    image:
      typeof data?.image ===
      "string"
        ? data.image
        : "",

    presidentPhoto:
      typeof data?.presidentPhoto ===
      "string"
        ? data.presidentPhoto
        : "",
  };
}

function PageSkeleton() {
  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="animate-pulse">
            <div className="h-4 w-56 rounded bg-slate-200" />

            <div className="mt-5 h-12 max-w-2xl rounded bg-slate-200" />

            <div className="mt-5 h-6 max-w-3xl rounded bg-slate-100" />
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-10 max-w-2xl rounded bg-slate-200" />

          <div className="mt-6 h-5 max-w-3xl rounded bg-slate-100" />

          <div className="mt-3 h-5 max-w-2xl rounded bg-slate-100" />

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="h-64 rounded-3xl bg-slate-100" />
            <div className="h-64 rounded-3xl bg-slate-100" />
          </div>
        </div>
      </section>
    </main>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-white px-4 py-16 sm:px-6">
      <div className="w-full max-w-xl rounded-3xl border border-red-200 bg-red-50 p-6 text-center sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-red-600 shadow-sm">
          <RefreshCw
            size={24}
            aria-hidden="true"
          />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          About page content unavailable
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {message}
        </p>

        <Button type="button" onClick={onRetry} className="mt-6"> <RefreshCw size={16} aria-hidden="true" /> Try Again</Button>
      </div>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <p className="gnpc-eyebrow">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
          {description}
        </p>
      )}
    </div>
  );
}

function ItemCard({
  item,
  index,
}: {
  item: AboutItem;
  index: number;
}) {
  return (
    <article
      key={`${item.title}-${index}`}
      className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg sm:rounded-3xl sm:p-6"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <CheckCircle2
          size={22}
          aria-hidden="true"
        />
      </div>

      {item.title && (
        <h3 className="mt-5 break-words text-lg font-bold text-slate-900 sm:text-xl">
          {item.title}
        </h3>
      )}

      {item.description && (
        <p className="mt-3 break-words text-sm leading-7 text-slate-600 sm:text-base">
          {item.description}
        </p>
      )}
    </article>
  );
}

export default function AboutPage() {
  const [content, setContent] =
    useState<AboutSettings | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null
    );

  const loadAboutContent =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError(null);

          /*
           * Centralized API service.
           *
           * This resolves:
           *
           * /api/settings/about
           *
           * through api.ts instead of
           * constructing the URL locally.
           */
          const response =
            await apiFetch(
              "/settings/about"
            );

          const payload =
            await responseJson<AboutResponse>(
              response
            );

          if (
            payload.success ===
            false
          ) {
            throw new Error(
              payload.message ||
                "About CMS returned an unsuccessful response."
            );
          }

          if (
            !payload.data
          ) {
            throw new Error(
              "About CMS returned no content."
            );
          }

          setContent(
            normalizeAbout(
              payload.data
            )
          );
        } catch (requestError) {
          console.error(
            "[About CMS] Failed to load content:",
            requestError
          );

          setContent(null);

          setError(
            requestError instanceof
              Error
              ? requestError.message
              : "Unable to load About page content."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    void loadAboutContent();
  }, [
    loadAboutContent,
  ]);

  /*
   * This allows the CMS editor to notify
   * another open page in the same browser tab.
   */
  useEffect(() => {
    const handleUpdate =
      () => {
        void loadAboutContent();
      };

    window.addEventListener(
      "about-settings-updated",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "about-settings-updated",
        handleUpdate
      );
    };
  }, [
    loadAboutContent,
  ]);

  if (loading) {
    return <PageSkeleton />;
  }

  if (
    error ||
    !content
  ) {
    return (
      <ErrorState
        message={
          error ||
          "The About CMS did not return any content."
        }
        onRetry={() => {
          void loadAboutContent();
        }}
      />
    );
  }

  return (
    <main className="bg-white text-slate-900">
      {/* =====================================================
          HERO
          ===================================================== */}

      <PageHero
        contentKey="about"
        eyebrow={
          content.heroEyebrow ||
          "About Greater Noida Press Club"
        }
        title={
          content.heroTitle ||
          "About Us"
        }
        description={
          content.heroDescription ||
          "Learn about Greater Noida Press Club, our mission, vision and commitment towards ethical journalism."
        }
        breadcrumbs={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "About Us",
          },
        ]}
      />

      {/* =====================================================
          INTRO
          ===================================================== */}

      <section className="bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="min-w-0">
              {content.heading && (
                <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                  {content.heading}
                </h2>
              )}

              {content.description && (
                <p className="mt-5 text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
                  {content.description}
                </p>
              )}

              {content.secondaryDescription && (
                <p className="mt-4 text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
                  {
                    content.secondaryDescription
                  }
                </p>
              )}

              {content.commitmentTitle && (
                <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:mt-8 sm:p-6">
                  <h3 className="text-xl font-bold text-slate-900">
                    {
                      content.commitmentTitle
                    }
                  </h3>

                  {content.commitmentDescription && (
                    <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                      {
                        content.commitmentDescription
                      }
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="min-w-0">
              {content.image ? (
                <div className="relative overflow-hidden rounded-2xl bg-slate-100 shadow-sm sm:rounded-3xl">
                  <div className="aspect-[6/5]">
                    <img
                      src={content.image}
                      alt={
                        content.heading ||
                        "Greater Noida Press Club"
                      }
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex aspect-[6/5] items-center justify-center rounded-2xl bg-slate-50 sm:rounded-3xl">
                  <div className="px-6 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Target
                        size={26}
                        aria-hidden="true"
                      />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-500">
                      About image coming soon
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MISSION / VISION
          ===================================================== */}

      <section className="bg-slate-50 px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={
              content.foundationEyebrow
            }
            title={
              content.foundationTitle ||
              "Mission & Vision"
            }
            description={
              content.foundationDescription
            }
          />

          <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2">
            <article className="min-w-0 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:rounded-3xl sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Target
                  size={24}
                  aria-hidden="true"
                />
              </div>

              {content.missionTitle && (
                <h3 className="mt-5 break-words text-xl font-bold text-slate-900 sm:mt-6 sm:text-2xl">
                  {
                    content.missionTitle
                  }
                </h3>
              )}

              {content.missionDescription && (
                <p className="mt-3 break-words text-sm leading-7 text-slate-600 sm:mt-4 sm:text-base">
                  {
                    content.missionDescription
                  }
                </p>
              )}
            </article>

            <article className="min-w-0 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:rounded-3xl sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Eye
                  size={24}
                  aria-hidden="true"
                />
              </div>

              {content.visionTitle && (
                <h3 className="mt-5 break-words text-xl font-bold text-slate-900 sm:mt-6 sm:text-2xl">
                  {
                    content.visionTitle
                  }
                </h3>
              )}

              {content.visionDescription && (
                <p className="mt-3 break-words text-sm leading-7 text-slate-600 sm:mt-4 sm:text-base">
                  {
                    content.visionDescription
                  }
                </p>
              )}
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
          OBJECTIVES
          ===================================================== */}

      {content.objectives.length >
        0 && (
        <section className="bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow={
                content.objectivesEyebrow
              }
              title={
                content.objectivesTitle ||
                "Our Objectives"
              }
              description={
                content.objectivesDescription
              }
            />

            <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2 lg:grid-cols-3">
              {content.objectives.map(
                (
                  objective,
                  index
                ) => (
                  <ItemCard
                    key={`${objective.title}-${index}`}
                    item={
                      objective
                    }
                    index={index}
                  />
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          PRESIDENT
          ===================================================== */}

      {(content.presidentName ||
        content.presidentMessage ||
        content.presidentPhoto) && (
        <section className="bg-slate-50 px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl">
              <div className="grid items-center gap-8 p-6 sm:p-8 md:grid-cols-[260px_1fr] md:gap-10 md:p-10 lg:grid-cols-[320px_1fr] lg:gap-16 lg:p-14">
                <div className="flex justify-center md:justify-start">
                  {content.presidentPhoto ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm sm:rounded-3xl">
                      <img
                        src={
                          content.presidentPhoto
                        }
                        alt={
                          content.presidentName ||
                          "President, Greater Noida Press Club"
                        }
                        className="h-64 w-64 object-cover sm:h-72 sm:w-72 lg:h-80 lg:w-80"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="flex h-64 w-64 items-center justify-center rounded-2xl bg-slate-100 text-5xl font-black text-slate-400 sm:h-72 sm:w-72 sm:rounded-3xl lg:h-80 lg:w-80">
                      {content.presidentName
                        ?.charAt(
                          0
                        )
                        ?.toUpperCase() ||
                        "P"}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 sm:text-sm">
                    President's Message
                  </p>

                  {content.presidentMessage && (
                    <blockquote className="mt-4 break-words text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
                      “
                      {
                        content.presidentMessage
                      }
                      ”
                    </blockquote>
                  )}

                  {(content.presidentName ||
                    content.presidentDesignation) && (
                    <div className="mt-6 border-t border-slate-200 pt-5 sm:mt-7 sm:pt-6">
                      {content.presidentName && (
                        <p className="text-base font-bold text-slate-900 sm:text-lg">
                          {
                            content.presidentName
                          }
                        </p>
                      )}

                      {content.presidentDesignation && (
                        <p className="mt-1 text-sm text-slate-500 sm:text-base">
                          {
                            content.presidentDesignation
                          }
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          WHY CHOOSE US
          ===================================================== */}

      {content.reasons.length >
        0 && (
        <section className="bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow={
                content.whyChooseUsEyebrow
              }
              title={
                content.whyChooseUsTitle ||
                "Why Choose Us"
              }
              description={
                content.whyChooseUsDescription
              }
            />

            <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2 lg:grid-cols-3">
              {content.reasons.map(
                (
                  reason,
                  index
                ) => (
                  <ItemCard
                    key={`${reason.title}-${index}`}
                    item={reason}
                    index={index}
                  />
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          CTA
          =====================================================

          IMPORTANT:
          CMS values are now explicitly passed into
          AboutCTA. Previously this was simply:

              <AboutCTA />

          which meant the CMS CTA fields were never used.
          ===================================================== */}

      <AboutCTA
        title={
          content.ctaTitle
        }
        description={
          content.ctaDescription
        }
        primaryLabel={
          content.ctaPrimaryLabel
        }
        secondaryLabel={
          content.ctaSecondaryLabel
        }
      />

      {/* =====================================================
          SMALL NAVIGATION FALLBACK
          ===================================================== */}

      <div className="sr-only">
        <Link
          href="/office-bearers"
        >
          Office Bearers
        </Link>
      </div>
    </main>
  );
}
