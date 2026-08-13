"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  Target,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(
    /\/+$/,
    ""
  );

type Objective = {
  title: string;
  description: string;
  icon?: string;
};

type Reason = {
  title: string;
  description: string;
  icon?: string;
};

type AboutSettings = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;

  image?: string;
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
  objectives: Objective[];

  presidentName: string;
  presidentDesignation: string;
  presidentMessage: string;
  presidentPhoto?: string;

  whyChooseUsEyebrow: string;
  whyChooseUsTitle: string;
  whyChooseUsDescription: string;
  reasons: Reason[];

  ctaTitle: string;
  ctaDescription: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
};

function normalizeContent(
  data: Partial<AboutSettings>
): AboutSettings {
  return {
    heroEyebrow:
      data.heroEyebrow ?? "",
    heroTitle:
      data.heroTitle ?? "",
    heroDescription:
      data.heroDescription ?? "",

    image: data.image ?? "",
    heading: data.heading ?? "",
    description:
      data.description ?? "",
    secondaryDescription:
      data.secondaryDescription ?? "",

    commitmentTitle:
      data.commitmentTitle ?? "",
    commitmentDescription:
      data.commitmentDescription ?? "",

    foundationEyebrow:
      data.foundationEyebrow ?? "",
    foundationTitle:
      data.foundationTitle ?? "",
    foundationDescription:
      data.foundationDescription ?? "",

    missionTitle:
      data.missionTitle ?? "",
    missionDescription:
      data.missionDescription ?? "",

    visionTitle:
      data.visionTitle ?? "",
    visionDescription:
      data.visionDescription ?? "",

    objectivesEyebrow:
      data.objectivesEyebrow ?? "",
    objectivesTitle:
      data.objectivesTitle ?? "",
    objectivesDescription:
      data.objectivesDescription ?? "",

    objectives:
      Array.isArray(data.objectives)
        ? data.objectives
        : [],

    presidentName:
      data.presidentName ?? "",
    presidentDesignation:
      data.presidentDesignation ?? "",
    presidentMessage:
      data.presidentMessage ?? "",
    presidentPhoto:
      data.presidentPhoto ?? "",

    whyChooseUsEyebrow:
      data.whyChooseUsEyebrow ?? "",
    whyChooseUsTitle:
      data.whyChooseUsTitle ?? "",
    whyChooseUsDescription:
      data.whyChooseUsDescription ?? "",

    reasons:
      Array.isArray(data.reasons)
        ? data.reasons
        : [],

    ctaTitle:
      data.ctaTitle ?? "",
    ctaDescription:
      data.ctaDescription ?? "",
    ctaPrimaryLabel:
      data.ctaPrimaryLabel ?? "",
    ctaSecondaryLabel:
      data.ctaSecondaryLabel ?? "",
  };
}

function getErrorMessage(
  error: unknown
) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      "Unable to load About page content."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load About page content.";
}

export default function AboutPage() {
  const [content, setContent] =
    useState<AboutSettings | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadAboutContent =
    async () => {
      try {
        setLoading(true);
        setError(null);

        if (!API_URL) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not configured."
          );
        }

        const response =
          await axios.get(
            `${API_URL}/settings/about`,
            {
              timeout: 10000,
            }
          );

        if (
          !response.data?.success
        ) {
          throw new Error(
            response.data?.message ||
              "Unable to load About page content."
          );
        }

        if (
          !response.data?.data
        ) {
          throw new Error(
            "About API returned no data."
          );
        }

        setContent(
          normalizeContent(
            response.data.data
          )
        );
      } catch (error) {
        console.error(
          "Failed to load About content:",
          error
        );

        setContent(null);
        setError(
          getErrorMessage(error)
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    void loadAboutContent();

    const handleUpdate = () => {
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
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <section className="bg-slate-900 px-6 py-24">
          <div className="mx-auto max-w-7xl animate-pulse">
            <div className="h-5 w-56 rounded bg-white/20" />

            <div className="mt-5 h-14 max-w-2xl rounded bg-white/20" />

            <div className="mt-5 h-20 max-w-3xl rounded bg-white/10" />
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-7xl animate-pulse">
            <div className="h-10 w-1/2 rounded bg-slate-200" />

            <div className="mt-5 h-32 rounded bg-slate-100" />
          </div>
        </section>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            About page content unavailable
          </h1>

          <p className="mt-3 text-slate-500">
            {error ||
              "We could not load the latest About page content."}
          </p>

          <button
            type="button"
            onClick={() =>
              void loadAboutContent()
            }
            className="mt-6 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-24 text-white md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.22),transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl">
          {content.heroEyebrow && (
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
              {content.heroEyebrow}
            </p>
          )}

          {content.heroTitle && (
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
              {content.heroTitle}
            </h1>
          )}

          {content.heroDescription && (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
              {content.heroDescription}
            </p>
          )}
        </div>
      </section>

      {/* INTRO */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            {content.heading && (
              <h2 className="text-3xl font-black tracking-tight md:text-5xl">
                {content.heading}
              </h2>
            )}

            {content.description && (
              <p className="mt-6 text-lg leading-8 text-slate-600">
                {content.description}
              </p>
            )}

            {content.secondaryDescription && (
              <p className="mt-5 text-lg leading-8 text-slate-600">
                {content.secondaryDescription}
              </p>
            )}

            {content.commitmentTitle && (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-xl font-bold">
                  {content.commitmentTitle}
                </h3>

                {content.commitmentDescription && (
                  <p className="mt-3 leading-7 text-slate-600">
                    {
                      content.commitmentDescription
                    }
                  </p>
                )}
              </div>
            )}
          </div>

          {content.image && (
            <div className="overflow-hidden rounded-3xl">
              <img
                src={content.image}
                alt={
                  content.heading ||
                  "About us"
                }
                className="h-full max-h-[520px] w-full object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </section>

      {/* FOUNDATION */}
      <section className="bg-slate-50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            {content.foundationEyebrow && (
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                {content.foundationEyebrow}
              </p>
            )}

            {content.foundationTitle && (
              <h2 className="mt-3 text-3xl font-black md:text-5xl">
                {content.foundationTitle}
              </h2>
            )}

            {content.foundationDescription && (
              <p className="mt-5 text-lg leading-8 text-slate-600">
                {
                  content.foundationDescription
                }
              </p>
            )}
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Target
                  size={24}
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                {content.missionTitle}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                {content.missionDescription}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Eye
                  size={24}
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                {content.visionTitle}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                {content.visionDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OBJECTIVES */}
      {content.objectives.length >
        0 && (
        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              {content.objectivesEyebrow && (
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                  {
                    content.objectivesEyebrow
                  }
                </p>
              )}

              {content.objectivesTitle && (
                <h2 className="mt-3 text-3xl font-black md:text-5xl">
                  {
                    content.objectivesTitle
                  }
                </h2>
              )}

              {content.objectivesDescription && (
                <p className="mt-5 text-lg leading-8 text-slate-600">
                  {
                    content.objectivesDescription
                  }
                </p>
              )}
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {content.objectives.map(
                (
                  objective,
                  index
                ) => (
                  <article
                    key={`${objective.title}-${index}`}
                    className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <CheckCircle2
                        size={22}
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="mt-5 text-xl font-bold">
                      {
                        objective.title
                      }
                    </h3>

                    <p className="mt-3 leading-7 text-slate-600">
                      {
                        objective.description
                      }
                    </p>
                  </article>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* PRESIDENT */}
      {(content.presidentName ||
        content.presidentMessage) && (
        <section className="bg-slate-950 px-6 py-20 text-white md:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[280px_1fr] lg:items-center">
            {content.presidentPhoto ? (
              <img
                src={
                  content.presidentPhoto
                }
                alt={
                  content.presidentName ||
                  "President"
                }
                className="mx-auto h-64 w-64 rounded-full object-cover ring-4 ring-white/10"
                loading="lazy"
              />
            ) : (
              <div className="mx-auto flex h-64 w-64 items-center justify-center rounded-full bg-white/10 text-5xl font-black">
                {content.presidentName
                  ?.charAt(0)
                  ?.toUpperCase() ||
                  "P"}
              </div>
            )}

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
                President's Message
              </p>

              {content.presidentMessage && (
                <blockquote className="mt-5 text-xl leading-9 text-slate-200 md:text-2xl">
                  “
                  {
                    content.presidentMessage
                  }
                  ”
                </blockquote>
              )}

              {content.presidentName && (
                <div className="mt-7">
                  <p className="text-lg font-bold">
                    {
                      content.presidentName
                    }
                  </p>

                  {content.presidentDesignation && (
                    <p className="mt-1 text-slate-400">
                      {
                        content.presidentDesignation
                      }
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* WHY CHOOSE US */}
      {content.reasons.length >
        0 && (
        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              {content.whyChooseUsEyebrow && (
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                  {
                    content.whyChooseUsEyebrow
                  }
                </p>
              )}

              {content.whyChooseUsTitle && (
                <h2 className="mt-3 text-3xl font-black md:text-5xl">
                  {
                    content.whyChooseUsTitle
                  }
                </h2>
              )}

              {content.whyChooseUsDescription && (
                <p className="mt-5 text-lg leading-8 text-slate-600">
                  {
                    content.whyChooseUsDescription
                  }
                </p>
              )}
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {content.reasons.map(
                (reason, index) => (
                  <article
                    key={`${reason.title}-${index}`}
                    className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <CheckCircle2
                        size={22}
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="mt-5 text-xl font-bold">
                      {reason.title}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-600">
                      {
                        reason.description
                      }
                    </p>
                  </article>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-6 pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-blue-600 px-7 py-12 text-white md:px-12 md:py-16">
          <div className="max-w-3xl">
            {content.ctaTitle && (
              <h2 className="text-3xl font-black md:text-5xl">
                {content.ctaTitle}
              </h2>
            )}

            {content.ctaDescription && (
              <p className="mt-5 text-lg leading-8 text-blue-50">
                {
                  content.ctaDescription
                }
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {content.ctaPrimaryLabel && (
                <Link
                  href="/membership"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-blue-700 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
                >
                  {
                    content.ctaPrimaryLabel
                  }

                  <ArrowRight
                    size={18}
                    aria-hidden="true"
                  />
                </Link>
              )}

              {content.ctaSecondaryLabel && (
                <Link
                  href="/office-bearers"
                  className="inline-flex items-center justify-center rounded-xl border border-white/40 px-6 py-3 font-bold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
                >
                  {
                    content.ctaSecondaryLabel
                  }
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
