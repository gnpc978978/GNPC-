"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle2,
  Eye,
  Target,
} from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import AboutCTA from "@/components/about/AboutCTA";

/*
 * -------------------------------------------------------
 * API CONFIGURATION
 * -------------------------------------------------------
 *
 * Expected environment variable:
 *
 * NEXT_PUBLIC_API_URL=http://localhost:5000/api
 *
 * Production example:
 *
 * NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
 *
 * The backend About endpoint is:
 *
 * GET /api/settings/about
 *
 * Therefore the final request becomes:
 *
 * ${NEXT_PUBLIC_API_URL}/settings/about
 */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

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

/*
 * -------------------------------------------------------
 * EMPTY DEFAULT
 * -------------------------------------------------------
 *
 * This is only used to guarantee safe rendering.
 *
 * We DO NOT use hardcoded fallback CMS content when
 * the API fails. Otherwise a broken CMS looks like it
 * is working.
 */

const emptyContent: AboutSettings = {
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

export default function AboutPage() {
  const [content, setContent] =
    useState<AboutSettings | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * -------------------------------------------------------
   * LOAD ABOUT CMS DATA
   * -------------------------------------------------------
   */

  const loadAboutContent = useCallback(
    async () => {
      try {
        setLoading(true);
        setError(null);

        /*
         * Fail clearly if the environment variable
         * has not been configured.
         */
        if (!API_URL) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not configured."
          );
        }

        /*
         * IMPORTANT:
         *
         * Backend:
         * /api/settings/about
         *
         * API_URL should already contain /api.
         *
         * Example:
         * https://api.example.com/api
         *
         * Result:
         * https://api.example.com/api/settings/about
         */
        const endpoint =
          `${API_URL}/settings/about`;

        console.log(
          "[About CMS] Fetching:",
          endpoint
        );

        const response =
          await axios.get(endpoint, {
            timeout: 15000,
            headers: {
              Accept: "application/json",
            },
          });

        /*
         * Backend response:
         *
         * {
         *   success: true,
         *   data: {...}
         * }
         */

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "About CMS returned an unsuccessful response."
          );
        }

        const data =
          response.data?.data;

        if (!data) {
          throw new Error(
            "About CMS returned no data."
          );
        }

        /*
         * Normalize arrays so the UI never crashes
         * when the CMS contains missing/null values.
         */
        const normalizedContent: AboutSettings = {
          ...emptyContent,
          ...data,

          objectives:
            Array.isArray(data.objectives)
              ? data.objectives.map(
                  (item: Objective) => ({
                    title:
                      item?.title ?? "",
                    description:
                      item?.description ?? "",
                    icon:
                      item?.icon ?? "",
                  })
                )
              : [],

          reasons:
            Array.isArray(data.reasons)
              ? data.reasons.map(
                  (item: Reason) => ({
                    title:
                      item?.title ?? "",
                    description:
                      item?.description ?? "",
                    icon:
                      item?.icon ?? "",
                  })
                )
              : [],
        };

        console.log(
          "[About CMS] Data loaded successfully:",
          normalizedContent
        );

        setContent(
          normalizedContent
        );
      } catch (error) {
        console.error(
          "[About CMS] Failed to load content:",
          error
        );

        let message =
          "Unable to load About page content.";

        if (axios.isAxiosError(error)) {
          if (error.response) {
            message =
              error.response.data?.message ||
              `About API returned ${error.response.status}.`;
          } else if (error.request) {
            message =
              "Unable to connect to the About CMS API.";
          } else if (error.message) {
            message = error.message;
          }
        } else if (
          error instanceof Error
        ) {
          message = error.message;
        }

        setError(message);

        /*
         * IMPORTANT:
         *
         * Do not silently display hardcoded CMS content.
         * Keep content null so we know the CMS actually failed.
         */
        setContent(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /*
   * -------------------------------------------------------
   * INITIAL LOAD
   * -------------------------------------------------------
   */

  useEffect(() => {
    loadAboutContent();
  }, [loadAboutContent]);

  /*
   * -------------------------------------------------------
   * CMS UPDATE EVENT
   * -------------------------------------------------------
   *
   * When the admin CMS saves About settings, another
   * part of the frontend can dispatch:
   *
   * window.dispatchEvent(
   *   new Event("about-settings-updated")
   * );
   *
   * The public About page will then refresh.
   */

  useEffect(() => {
    const handleUpdate =
      () => {
        loadAboutContent();
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
  }, [loadAboutContent]);

  /*
   * -------------------------------------------------------
   * LOADING
   * -------------------------------------------------------
   */

  if (loading) {
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
          </div>
        </section>
      </main>
    );
  }

  /*
   * -------------------------------------------------------
   * ERROR STATE
   * -------------------------------------------------------
   */

  if (error || !content) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-white px-6">
        <div className="w-full max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            About page content unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {error ||
              "The About CMS did not return any content."}
          </p>

          <button
            type="button"
            onClick={loadAboutContent}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white text-slate-900">
      {/* =====================================================
          PAGE HERO
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
            {/* TEXT */}

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
                  {content.secondaryDescription}
                </p>
              )}

              {content.commitmentTitle && (
                <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:mt-8 sm:p-6">
                  <h3 className="text-xl font-bold text-slate-900">
                    {content.commitmentTitle}
                  </h3>

                  {content.commitmentDescription && (
                    <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                      {content.commitmentDescription}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* IMAGE */}

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
      </section>

      {/* =====================================================
          FOUNDATION
          ===================================================== */}

      <section className="bg-slate-50 px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            {content.foundationEyebrow && (
              <p className="gnpc-eyebrow">
                {content.foundationEyebrow}
              </p>
            )}

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {content.foundationTitle}
            </h2>

            {content.foundationDescription && (
              <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                {content.foundationDescription}
              </p>
            )}
          </div>

          <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2">
            {/* MISSION */}

            <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:rounded-3xl sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Target
                  size={24}
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900 sm:mt-6 sm:text-2xl">
                {content.missionTitle}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600 sm:mt-4 sm:text-base">
                {content.missionDescription}
              </p>
            </article>

            {/* VISION */}

            <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:rounded-3xl sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Eye
                  size={24}
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900 sm:mt-6 sm:text-2xl">
                {content.visionTitle}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600 sm:mt-4 sm:text-base">
                {content.visionDescription}
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================
          OBJECTIVES
          ===================================================== */}

      {content.objectives.length > 0 && (
        <section className="bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              {content.objectivesEyebrow && (
                <p className="gnpc-eyebrow">
                  {content.objectivesEyebrow}
                </p>
              )}

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {content.objectivesTitle}
              </h2>

              {content.objectivesDescription && (
                <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                  {content.objectivesDescription}
                </p>
              )}
            </div>

            <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2 lg:grid-cols-3">
              {content.objectives.map(
                (objective, index) => (
                  <article
                    key={`${objective.title}-${index}`}
                    className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg sm:rounded-3xl sm:p-6"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <CheckCircle2
                        size={22}
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="mt-5 break-words text-lg font-bold text-slate-900 sm:text-xl">
                      {objective.title}
                    </h3>

                    <p className="mt-3 break-words text-sm leading-7 text-slate-600 sm:text-base">
                      {objective.description}
                    </p>
                  </article>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          PRESIDENT'S MESSAGE
          ===================================================== */}

      {(content.presidentName ||
        content.presidentMessage) && (
        <section className="bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl">
              <div className="grid items-center gap-8 p-6 sm:p-8 md:grid-cols-[260px_1fr] md:gap-10 md:p-10 lg:grid-cols-[320px_1fr] lg:gap-16 lg:p-14">
                {/* PRESIDENT PHOTO */}

                <div className="flex justify-center md:justify-start">
                  {content.presidentPhoto ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm sm:rounded-3xl">
                      <img
                        src={content.presidentPhoto}
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
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "P"}
                    </div>
                  )}
                </div>

                {/* MESSAGE */}

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 sm:text-sm sm:tracking-[0.2em]">
                    President's Message
                  </p>

                  {content.presidentMessage && (
                    <blockquote className="mt-4 break-words text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
                      “{content.presidentMessage}”
                    </blockquote>
                  )}

                  {(content.presidentName ||
                    content.presidentDesignation) && (
                    <div className="mt-6 border-t border-slate-200 pt-5 sm:mt-7 sm:pt-6">
                      {content.presidentName && (
                        <p className="text-base font-bold text-slate-900 sm:text-lg">
                          {content.presidentName}
                        </p>
                      )}

                      {content.presidentDesignation && (
                        <p className="mt-1 text-sm text-slate-500 sm:text-base">
                          {content.presidentDesignation}
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

      {content.reasons.length > 0 && (
        <section className="bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              {content.whyChooseUsEyebrow && (
                <p className="gnpc-eyebrow">
                  {content.whyChooseUsEyebrow}
                </p>
              )}

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {content.whyChooseUsTitle}
              </h2>

              {content.whyChooseUsDescription && (
                <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                  {content.whyChooseUsDescription}
                </p>
              )}
            </div>

            <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2 lg:grid-cols-3">
              {content.reasons.map(
                (reason, index) => (
                  <article
                    key={`${reason.title}-${index}`}
                    className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-7"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <CheckCircle2
                        size={22}
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="mt-5 break-words text-lg font-bold text-slate-900 sm:text-xl">
                      {reason.title}
                    </h3>

                    <p className="mt-3 break-words text-sm leading-7 text-slate-600 sm:text-base">
                      {reason.description}
                    </p>
                  </article>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          CTA
          ===================================================== */}

      <AboutCTA />
    </main>
  );
}
