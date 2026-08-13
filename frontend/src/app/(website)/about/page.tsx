"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle2,
  Eye,
  Target,
} from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import AboutCTA from "@/components/about/AboutCTA";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

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

const fallbackContent: AboutSettings = {
  heroEyebrow: "About Greater Noida Press Club",
  heroTitle: "About Us",
  heroDescription:
    "Learn about Greater Noida Press Club, our mission, vision and commitment towards ethical journalism.",

  image: "",

  heading:
    "Empowering Journalists & Strengthening Independent Media",

  description:
    "Greater Noida Press Club is a professional organization dedicated to supporting journalists, promoting ethical journalism, and providing a strong platform for media professionals.",

  secondaryDescription:
    "We believe in freedom of expression, responsible reporting, and creating opportunities that help journalists grow, collaborate, and contribute to society.",

  commitmentTitle: "Our Commitment",

  commitmentDescription:
    "We are committed to protecting journalistic values, encouraging transparency, and building a stronger media community through education, collaboration, and innovation.",

  foundationEyebrow: "Our Foundation",

  foundationTitle: "Mission & Vision",

  foundationDescription:
    "We are committed to ethical journalism, professional excellence, and empowering media professionals through collaboration and innovation.",

  missionTitle: "Our Mission",

  missionDescription:
    "To support journalists with professional development, transparency, ethical reporting, and a strong platform that protects press freedom.",

  visionTitle: "Our Vision",

  visionDescription:
    "To build a trusted community where journalists collaborate, innovate, and contribute to an informed and democratic society.",

  objectivesEyebrow: "Our Objectives",

  objectivesTitle: "What We Aim To Achieve",

  objectivesDescription:
    "Our primary objective is to strengthen journalism through education, collaboration, innovation, and ethical reporting.",

  objectives: [],

  presidentName: "",
  presidentDesignation: "",
  presidentMessage: "",
  presidentPhoto: "",

  whyChooseUsEyebrow: "Why Choose Us",

  whyChooseUsTitle:
    "Why Greater Noida Press Club Matters",

  whyChooseUsDescription:
    "We provide a trusted platform for journalists to connect, collaborate, and grow while maintaining the highest standards of journalism.",

  reasons: [],

  ctaTitle:
    "Become a Part of Our Greater Noida Press Club",

  ctaDescription:
    "Join a community dedicated to ethical journalism, professional growth, networking, and media excellence. Together we build a stronger voice for journalists.",

  ctaPrimaryLabel: "Become a Member",

  ctaSecondaryLabel: "Meet Our Office Bearers",
};

export default function AboutPage() {
  const [content, setContent] =
    useState<AboutSettings | null>(null);

  const [loading, setLoading] =
    useState(true);

  const loadAboutContent = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/about-settings`
      );

      const data =
        response.data?.data ??
        response.data ??
        {};

      setContent({
        ...fallbackContent,
        ...data,

        objectives: Array.isArray(data?.objectives)
          ? data.objectives
          : [],

        reasons: Array.isArray(data?.reasons)
          ? data.reasons
          : [],
      });
    } catch (error) {
      console.error(
        "Failed to load About content:",
        error
      );

      /*
       * Keep the page usable if the CMS/API
       * is temporarily unavailable.
       */
      setContent(fallbackContent);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAboutContent();

    const handleUpdate = () => {
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
  }, []);

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
   * EMPTY STATE
   * -------------------------------------------------------
   */

  if (!content) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-white px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            About page content unavailable
          </h1>

          <p className="mt-2 text-slate-500">
            Please try again later.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white text-slate-900">
      {/* =====================================================
          PAGE HERO
          Uses the same PageHero component as other pages.
          ===================================================== */}

      <PageHero
        contentKey="about"
        eyebrow={
          content.heroEyebrow ||
          "About Greater Noida Press Club"
        }
        title={content.heroTitle || "About Us"}
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
          PRESIDENT
          ===================================================== */}

      {(content.presidentName ||
        content.presidentMessage) && (
        <section className="bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_1fr] lg:items-center lg:gap-12">
            {content.presidentPhoto ? (
              <img
                src={content.presidentPhoto}
                alt={
                  content.presidentName ||
                  "President"
                }
                className="mx-auto h-56 w-56 rounded-full object-cover ring-4 ring-white/10 sm:h-64 sm:w-64"
                loading="lazy"
              />
            ) : (
              <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-full bg-white/10 text-5xl font-black sm:h-64 sm:w-64">
                {content.presidentName
                  ?.charAt(0)
                  ?.toUpperCase() || "P"}
              </div>
            )}

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300 sm:text-sm sm:tracking-[0.2em]">
                President's Message
              </p>

              {content.presidentMessage && (
                <blockquote className="mt-4 break-words text-lg leading-8 text-slate-200 sm:mt-5 sm:text-xl sm:leading-9 md:text-2xl">
                  “{content.presidentMessage}”
                </blockquote>
              )}

              {content.presidentName && (
                <div className="mt-6 sm:mt-7">
                  <p className="text-base font-bold sm:text-lg">
                    {content.presidentName}
                  </p>

                  {content.presidentDesignation && (
                    <p className="mt-1 text-sm text-slate-400 sm:text-base">
                      {content.presidentDesignation}
                    </p>
                  )}
                </div>
              )}
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
