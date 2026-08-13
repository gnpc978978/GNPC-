"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
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

  return (
    <section
      aria-labelledby="gnpc-hero-title"
      className={[
        "relative",
        "isolate",
        "overflow-hidden",

        "bg-[#0a3a61]",

        "text-white",
      ].join(" ")}
    >
      {/* ==================================================
          BACKGROUND
          ================================================== */}

      <div
        aria-hidden="true"
        className={[
          "absolute",
          "inset-0",
          "-z-20",

          "bg-[#0a3a61]",
        ].join(" ")}
      />

      {/* Subtle GNPC blue atmosphere */}
      <div
        aria-hidden="true"
        className={[
          "absolute",
          "-left-40",
          "-top-40",
          "-z-10",

          "h-[34rem]",
          "w-[34rem]",

          "rounded-full",

          "bg-[#0f4c81]/30",

          "blur-3xl",
        ].join(" ")}
      />

      <div
        aria-hidden="true"
        className={[
          "absolute",
          "-bottom-48",
          "-right-40",
          "-z-10",

          "h-[32rem]",
          "w-[32rem]",

          "rounded-full",

          "bg-black/20",

          "blur-3xl",
        ].join(" ")}
      />

      {/* Very subtle editorial grid */}
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none",
          "absolute",
          "inset-0",
          "-z-10",

          "opacity-[0.045]",
        ].join(" ")}
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize:
            "56px 56px",
        }}
      />

      {/* ==================================================
          HERO CONTENT
          ================================================== */}

      <div
        className={[
          "mx-auto",
          "max-w-7xl",

          "px-4",
          "py-10",

          "sm:px-6",
          "sm:py-14",

          "lg:px-8",
          "lg:py-20",

          "xl:py-24",
        ].join(" ")}
      >
        <div
          className={[
            "grid",
            "items-center",

            "gap-12",

            "lg:grid-cols-[0.9fr_1.1fr]",
            "lg:gap-14",

            "xl:grid-cols-[0.86fr_1.14fr]",
            "xl:gap-20",
          ].join(" ")}
        >
          {/* =================================================
              LEFT — EDITORIAL CONTENT
              ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className={[
              "order-2",
              "lg:order-1",
            ].join(" ")}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-9 bg-white/60"
              />

              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/70 sm:text-sm">
                Greater Noida Press Club
              </span>
            </div>

            {/* Small organization label */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-2 text-xs font-bold text-white/80 backdrop-blur-md">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                <Newspaper
                  size={13}
                  aria-hidden="true"
                />
              </span>

              <span>
                Journalism • Media • Community
              </span>
            </div>

            {/* Main title */}
            <h1
              id="gnpc-hero-title"
              className={[
                "mt-6",

                "max-w-3xl",

                "text-4xl",
                "font-black",

                "leading-[1.02]",
                "tracking-[-0.035em]",

                "sm:text-5xl",

                "md:text-6xl",

                "lg:text-[4.1rem]",

                "xl:text-[4.7rem]",
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

                "text-white/70",

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
              {/* Become a member */}
              <MembershipFormLink
                className={[
                  "group",

                  "inline-flex",
                  "items-center",
                  "justify-center",
                  "gap-2",

                  "rounded-xl",

                  "border",
                  "border-white",

                  "bg-white",

                  "px-5",
                  "py-3.5",

                  "text-sm",
                  "font-extrabold",

                  "text-[#0a3a61]",

                  "shadow-xl",
                  "shadow-black/10",

                  "transition-all",
                  "duration-300",

                  "hover:-translate-y-0.5",
                  "hover:bg-slate-50",
                  "hover:shadow-2xl",

                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-white",
                  "focus-visible:ring-offset-2",
                  "focus-visible:ring-offset-[#0a3a61]",

                  "sm:px-6",
                  "sm:text-base",
                ].join(" ")}
                unavailableClassName={[
                  "inline-flex",
                  "cursor-not-allowed",
                  "items-center",
                  "justify-center",

                  "rounded-xl",

                  "border",
                  "border-white/20",

                  "bg-white/50",

                  "px-5",
                  "py-3.5",

                  "text-sm",
                  "font-extrabold",

                  "text-[#0a3a61]",

                  "opacity-60",

                  "sm:px-6",
                  "sm:text-base",
                ].join(" ")}
              >
                Become A Member

                <ArrowRight
                  size={18}
                  className={[
                    "transition-transform",
                    "duration-300",

                    "group-hover:translate-x-1",
                  ].join(" ")}
                  aria-hidden="true"
                />
              </MembershipFormLink>

              {/* Latest updates */}
              <Link
                href="/latest-updates"
                className={[
                  "group",

                  "inline-flex",
                  "items-center",
                  "justify-center",
                  "gap-2",

                  "rounded-xl",

                  "border",
                  "border-white/20",

                  "bg-white/[0.06]",

                  "px-5",
                  "py-3.5",

                  "text-sm",
                  "font-bold",

                  "text-white",

                  "backdrop-blur-md",

                  "transition-all",
                  "duration-300",

                  "hover:-translate-y-0.5",
                  "hover:border-white/35",
                  "hover:bg-white/10",

                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-white",
                  "focus-visible:ring-offset-2",
                  "focus-visible:ring-offset-[#0a3a61]",

                  "sm:px-6",
                  "sm:text-base",
                ].join(" ")}
              >
                Latest Updates

                <ArrowRight
                  size={18}
                  className={[
                    "transition-transform",
                    "duration-300",

                    "group-hover:translate-x-1",
                  ].join(" ")}
                  aria-hidden="true"
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
                "border-white/10",

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

                  "text-white/65",

                  "transition-colors",
                  "duration-200",

                  "hover:text-white",
                ].join(" ")}
              >
                <Newspaper
                  size={16}
                  className="text-white/60"
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

                  "text-white/65",

                  "transition-colors",
                  "duration-200",

                  "hover:text-white",
                ].join(" ")}
              >
                <CalendarDays
                  size={16}
                  className="text-white/60"
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
              x: 30,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: "easeOut",
            }}
            className={[
              "order-1",
              "lg:order-2",
            ].join(" ")}
          >
            <div className="relative">
              {/* Outer frame */}
              <div
                aria-hidden="true"
                className={[
                  "absolute",
                  "-inset-3",

                  "rounded-[2rem]",

                  "border",
                  "border-white/[0.06]",
                ].join(" ")}
              />

              {/* Image frame */}
              <div
                className={[
                  "relative",

                  "overflow-hidden",

                  "rounded-[1.5rem]",

                  "border",
                  "border-white/15",

                  "bg-white/[0.04]",

                  "p-1.5",

                  "shadow-2xl",
                  "shadow-black/35",

                  "sm:rounded-[2rem]",
                  "sm:p-2",
                ].join(" ")}
              >
                <div
                  className={[
                    "relative",

                    "h-[300px]",

                    "overflow-hidden",

                    "rounded-[1.15rem]",

                    "bg-[#061f35]",

                    "sm:h-[420px]",

                    "sm:rounded-[1.5rem]",

                    "lg:h-[500px]",

                    "xl:h-[550px]",
                  ].join(" ")}
                >
                  {/* Carousel */}
                  <HeroCarousel
                    fallbackImage={
                      heroImage
                    }
                    alt={
                      heroTitle
                    }
                  />

                  {/* Editorial readability overlay */}
                  <div
                    aria-hidden="true"
                    className={[
                      "pointer-events-none",
                      "absolute",
                      "inset-0",

                      "bg-gradient-to-t",
                      "from-black/50",
                      "via-transparent",
                      "to-black/10",
                    ].join(" ")}
                  />

                  {/* Top editorial label */}
                  <div
                    className={[
                      "pointer-events-none",

                      "absolute",
                      "left-4",
                      "top-4",

                      "inline-flex",
                      "items-center",
                      "gap-2",

                      "rounded-full",

                      "border",
                      "border-white/15",

                      "bg-[#0a3a61]/80",

                      "px-3",
                      "py-2",

                      "text-[10px]",
                      "font-extrabold",
                      "uppercase",
                      "tracking-[0.18em]",

                      "text-white",

                      "backdrop-blur-md",

                      "sm:left-5",
                      "sm:top-5",

                      "sm:text-xs",
                    ].join(" ")}
                  >
                    <span
                      aria-hidden="true"
                      className="relative flex h-2 w-2"
                    >
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-50" />

                      <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                    </span>

                    GNPC
                  </div>

                  {/* Bottom image information */}
                  <div
                    className={[
                      "pointer-events-none",

                      "absolute",
                      "bottom-0",
                      "left-0",
                      "right-0",

                      "p-5",

                      "sm:p-6",
                    ].join(" ")}
                  >
                    <div className="max-w-md">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/60">
                        {siteName}
                      </p>

                      <p className="mt-1 text-sm font-bold leading-5 text-white sm:text-base">
                        Journalism, media and community — connected through GNPC.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  FLOATING INFORMATION CARD
                  ================================================= */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.75,
                }}
                className={[
                  "absolute",

                  "-bottom-5",
                  "left-4",

                  "hidden",

                  "max-w-[270px]",

                  "rounded-2xl",

                  "border",
                  "border-white/15",

                  "bg-[#061f35]/95",

                  "p-4",

                  "shadow-2xl",

                  "backdrop-blur-xl",

                  "sm:block",

                  "lg:-left-7",
                ].join(" ")}
              >
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/50">
                  Greater Noida
                </p>

                <p className="mt-1 text-sm font-bold leading-5 text-white">
                  A professional platform for journalists, media professionals and the community.
                </p>
              </motion.div>

              {/* =================================================
                  SCROLL PROMPT
                  ================================================= */}

              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.8,
                  delay: 1.1,
                }}
                className={[
                  "absolute",

                  "-bottom-11",
                  "right-2",

                  "hidden",

                  "items-center",
                  "gap-2",

                  "text-[10px]",
                  "font-bold",
                  "uppercase",
                  "tracking-[0.16em]",

                  "text-white/40",

                  "xl:flex",
                ].join(" ")}
              >
                <span>
                  Explore
                </span>

                <motion.span
                  animate={{
                    y: [0, 4, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ChevronDown
                    size={15}
                    aria-hidden="true"
                  />
                </motion.span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ==================================================
          BOTTOM EDGE
          ================================================== */}

      <div
        aria-hidden="true"
        className={[
          "absolute",
          "bottom-0",
          "left-0",
          "right-0",

          "h-px",

          "bg-white/10",
        ].join(" ")}
      />
    </section>
  );
}
