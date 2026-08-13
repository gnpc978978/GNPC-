"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Newspaper,
} from "lucide-react";

import HeroCarousel from "@/components/home/HeroCarousel";
import MembershipFormLink from "@/components/membership/MembershipFormLink";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";

export default function Hero() {
  const { settings } = useWebsiteSettings();

  const siteName =
    settings.siteName ||
    "Greater Noida Press Club";

  const heroTitle =
    settings.heroTitle ||
    "Connecting Journalism, Media & Community";

  const heroDescription =
    settings.heroDescription ||
    "A professional platform for journalists, media professionals and the community of Greater Noida.";

  const heroImage =
    settings.heroImage || "/Logo.png";

  const buttonClass = [
    "group",
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-2",
    "rounded-xl",
    "border",
    "border-slate-200",
    "bg-white",
    "px-5",
    "py-3.5",
    "text-sm",
    "font-bold",
    "text-[#0f4c81]",
    "shadow-sm",
    "transition-all",
    "duration-300",
    "hover:-translate-y-0.5",
    "hover:border-slate-300",
    "hover:bg-slate-50",
    "hover:shadow-md",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-[#155eef]",
    "focus-visible:ring-offset-2",
    "sm:px-6",
    "sm:text-base",
  ].join(" ");

  return (
    <section
      aria-labelledby="gnpc-hero-title"
      className="relative overflow-hidden border-b border-slate-200 bg-white"
    >
      {/* =====================================================
          SOFT BRAND BACKGROUND
          ===================================================== */}

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
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* =====================================================
          HERO CONTAINER
          ===================================================== */}

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 xl:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 xl:gap-20">

          {/* =================================================
              LEFT — CONTENT
              ================================================= */}

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
              ease: "easeOut",
            }}
            className="order-2 lg:order-1"
          >
            {/* Eyebrow */}

            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-0.5 w-8 rounded-full bg-[#155eef]"
              />

              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#155eef] sm:text-sm">
                Greater Noida Press Club
              </span>
            </div>

            {/* Organization identity */}

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-bold text-[#155eef]">
              <span
                aria-hidden="true"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#155eef] shadow-sm"
              >
                <Newspaper size={13} />
              </span>

              <span>
                Journalism • Media • Community
              </span>
            </div>

            {/* Main heading */}

            <h1
              id="gnpc-hero-title"
              className={[
                "mt-6",
                "max-w-3xl",
                "text-[2.35rem]",
                "font-black",
                "leading-[1.08]",
                "tracking-[-0.035em]",
                "text-[#101828]",
                "sm:text-5xl",
                "md:text-[3.5rem]",
                "lg:text-[4rem]",
                "xl:text-[4.5rem]",
              ].join(" ")}
            >
              {heroTitle}
            </h1>

            {/* Description */}

            <p
              className={[
                "mt-6",
                "max-w-2xl",
                "text-base",
                "leading-7",
                "text-slate-600",
                "sm:text-lg",
                "sm:leading-8",
              ].join(" ")}
            >
              {heroDescription}
            </p>

            {/* =================================================
                PRIMARY ACTIONS
                ================================================= */}

            <div
              className={[
                "mt-8",
                "flex",
                "flex-col",
                "gap-3",
                "sm:mt-10",
                "sm:flex-row",
                "sm:flex-wrap",
                "sm:gap-4",
              ].join(" ")}
            >
              {/* Become a Member */}

              <MembershipFormLink
                className={buttonClass}
                unavailableClassName={[
                  "group",
                  "inline-flex",
                  "cursor-not-allowed",
                  "items-center",
                  "justify-center",
                  "gap-2",
                  "rounded-xl",
                  "border",
                  "border-slate-200",
                  "bg-slate-50",
                  "px-5",
                  "py-3.5",
                  "text-sm",
                  "font-bold",
                  "text-[#0f4c81]",
                  "opacity-60",
                  "sm:px-6",
                  "sm:text-base",
                ].join(" ")}
              >
                Become a Member

                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </MembershipFormLink>

              {/* Latest Updates */}

              <Link
                href="/latest-updates"
                className={buttonClass}
              >
                Latest Updates

                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* =================================================
                QUICK LINKS
                ================================================= */}

            <div
              className={[
                "mt-8",
                "flex",
                "flex-wrap",
                "gap-x-6",
                "gap-y-3",
                "border-t",
                "border-slate-200",
                "pt-6",
                "sm:mt-10",
              ].join(" ")}
            >
              <Link
                href="/press-releases"
                className={[
                  "group",
                  "inline-flex",
                  "items-center",
                  "gap-2",
                  "text-sm",
                  "font-semibold",
                  "text-slate-600",
                  "transition-colors",
                  "duration-200",
                  "hover:text-[#155eef]",
                ].join(" ")}
              >
                <Newspaper
                  size={16}
                  className="text-[#155eef]"
                  aria-hidden="true"
                />

                <span>
                  Press Releases
                </span>

                <ArrowRight
                  size={14}
                  className={[
                    "opacity-0",
                    "transition-all",
                    "duration-200",
                    "group-hover:translate-x-1",
                    "group-hover:opacity-100",
                  ].join(" ")}
                  aria-hidden="true"
                />
              </Link>

              <Link
                href="/events"
                className={[
                  "group",
                  "inline-flex",
                  "items-center",
                  "gap-2",
                  "text-sm",
                  "font-semibold",
                  "text-slate-600",
                  "transition-colors",
                  "duration-200",
                  "hover:text-[#155eef]",
                ].join(" ")}
              >
                <CalendarDays
                  size={16}
                  className="text-[#155eef]"
                  aria-hidden="true"
                />

                <span>
                  Events
                </span>

                <ArrowRight
                  size={14}
                  className={[
                    "opacity-0",
                    "transition-all",
                    "duration-200",
                    "group-hover:translate-x-1",
                    "group-hover:opacity-100",
                  ].join(" ")}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </motion.div>

          {/* =================================================
              RIGHT — HERO VISUAL
              ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: 24,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.75,
              delay: 0.1,
              ease: "easeOut",
            }}
            className="order-1 lg:order-2"
          >
            <div className="relative">

              {/* Decorative brand frame */}

              <div
                aria-hidden="true"
                className={[
                  "absolute",
                  "-inset-3",
                  "rounded-[2rem]",
                  "border",
                  "border-blue-100",
                  "bg-blue-50/50",
                ].join(" ")}
              />

              {/* Main image card */}

              <div
                className={[
                  "relative",
                  "overflow-hidden",
                  "rounded-[1.5rem]",
                  "border",
                  "border-slate-200",
                  "bg-white",
                  "p-2",
                  "shadow-xl",
                  "shadow-slate-200/70",
                  "sm:rounded-[2rem]",
                  "sm:p-2.5",
                ].join(" ")}
              >
                <div
                  className={[
                    "relative",
                    "h-[300px]",
                    "overflow-hidden",
                    "rounded-[1.15rem]",
                    "bg-slate-100",
                    "sm:h-[410px]",
                    "sm:rounded-[1.5rem]",
                    "lg:h-[480px]",
                    "xl:h-[530px]",
                  ].join(" ")}
                >
                  {/* Carousel */}

                  <HeroCarousel
                    fallbackImage={heroImage}
                    alt={heroTitle}
                  />

                  {/* Readability overlay */}

                  <div
                    aria-hidden="true"
                    className={[
                      "pointer-events-none",
                      "absolute",
                      "inset-0",
                      "bg-gradient-to-t",
                      "from-[#0f4c81]/65",
                      "via-transparent",
                      "to-white/5",
                    ].join(" ")}
                  />

                  {/* Top label */}

                  <div
                    className={[
                      "absolute",
                      "left-4",
                      "top-4",
                      "inline-flex",
                      "items-center",
                      "gap-2",
                      "rounded-full",
                      "border",
                      "border-white/40",
                      "bg-white/90",
                      "px-3",
                      "py-2",
                      "text-[10px]",
                      "font-extrabold",
                      "uppercase",
                      "tracking-[0.16em]",
                      "text-[#0f4c81]",
                      "shadow-sm",
                      "backdrop-blur-md",
                      "sm:left-5",
                      "sm:top-5",
                      "sm:text-xs",
                    ].join(" ")}
                  >
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full bg-[#155eef]"
                    />

                    GNPC
                  </div>

                  {/* Bottom image information */}

                  <div
                    className={[
                      "absolute",
                      "bottom-0",
                      "left-0",
                      "right-0",
                      "p-5",
                      "sm:p-7",
                    ].join(" ")}
                  >
                    <div className="max-w-lg">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/75">
                        {siteName}
                      </p>

                      <p className="mt-1.5 text-sm font-bold leading-6 text-white sm:text-base sm:leading-7">
                        Journalism, media and community — connected through GNPC.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* =====================================================
          TRUST / IDENTITY STRIP
          ===================================================== */}

      <div className="relative border-t border-slate-100 bg-slate-50/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            {siteName}
          </p>

          <p className="text-sm font-medium text-slate-600">
            Journalism • Media • Community
          </p>
        </div>
      </div>
    </section>
  );
}
