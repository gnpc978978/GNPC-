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
    settings.heroImage ||
    "/Logo.png";

  const primaryButton =
    [
      "group",
      "inline-flex",
      "items-center",
      "justify-center",
      "gap-2.5",
      "rounded-lg",
      "border",
      "border-[#0f4c81]",
      "bg-[#0f4c81]",
      "px-5",
      "py-3.5",
      "text-sm",
      "font-bold",
      "tracking-[-0.01em]",
      "text-white",
      "shadow-[0_8px_24px_rgba(15,76,129,0.18)]",
      "transition-all",
      "duration-200",
      "hover:-translate-y-0.5",
      "hover:bg-[#0b3d68]",
      "hover:shadow-[0_12px_28px_rgba(15,76,129,0.24)]",
      "focus-visible:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-[#155eef]",
      "focus-visible:ring-offset-2",
      "sm:px-6",
      "sm:text-[15px]",
    ].join(" ");

  const secondaryButton =
    [
      "group",
      "inline-flex",
      "items-center",
      "justify-center",
      "gap-2.5",
      "rounded-lg",
      "border",
      "border-slate-200",
      "bg-white",
      "px-5",
      "py-3.5",
      "text-sm",
      "font-bold",
      "tracking-[-0.01em]",
      "text-[#0f4c81]",
      "shadow-[0_2px_8px_rgba(15,23,42,0.04)]",
      "transition-all",
      "duration-200",
      "hover:-translate-y-0.5",
      "hover:border-[#b9c8d8]",
      "hover:bg-slate-50",
      "hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)]",
      "focus-visible:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-[#155eef]",
      "focus-visible:ring-offset-2",
      "sm:px-6",
      "sm:text-[15px]",
    ].join(" ");

  return (
    <section
      aria-labelledby="gnpc-hero-title"
      className={[
        "relative",
        "overflow-hidden",
        "border-b",
        "border-slate-200",
        "bg-[#f8fafc]",
      ].join(" ")}
    >
      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Editorial light field */}

        <div
          className={[
            "absolute",
            "-left-40",
            "-top-40",
            "h-[32rem]",
            "w-[32rem]",
            "rounded-full",
            "bg-blue-100/40",
            "blur-[100px]",
          ].join(" ")}
        />

        <div
          className={[
            "absolute",
            "-bottom-48",
            "-right-40",
            "h-[32rem]",
            "w-[32rem]",
            "rounded-full",
            "bg-slate-200/60",
            "blur-[110px]",
          ].join(" ")}
        />

        {/* Very subtle editorial grid */}

        <div
          className={[
            "absolute",
            "inset-0",
            "opacity-[0.022]",
          ].join(" ")}
          style={{
            backgroundImage:
              "linear-gradient(#0f4c81 1px, transparent 1px), linear-gradient(90deg, #0f4c81 1px, transparent 1px)",
            backgroundSize:
              "72px 72px",
          }}
        />

        {/* Vertical editorial accent */}

        <div
          className={[
            "absolute",
            "left-0",
            "top-0",
            "h-full",
            "w-px",
            "bg-gradient-to-b",
            "from-transparent",
            "via-[#155eef]/20",
            "to-transparent",
          ].join(" ")}
        />
      </div>

      {/* =====================================================
          MAIN HERO
          ===================================================== */}

      <div
        className={[
          "relative",
          "mx-auto",
          "max-w-[80rem]",
          "px-4",
          "py-12",
          "sm:px-6",
          "sm:py-16",
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
            "lg:grid-cols-[0.88fr_1.12fr]",
            "lg:gap-14",
            "xl:gap-20",
          ].join(" ")}
        >
          {/* =================================================
              LEFT — EDITORIAL CONTENT
              ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 18,
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

            <div
              className={[
                "flex",
                "items-center",
                "gap-3",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className={[
                  "h-px",
                  "w-10",
                  "bg-[#155eef]",
                  "sm:w-12",
                ].join(" ")}
              />

              <span
                className={[
                  "text-[10px]",
                  "font-extrabold",
                  "uppercase",
                  "tracking-[0.2em]",
                  "text-[#155eef]",
                  "sm:text-xs",
                ].join(" ")}
              >
                Greater Noida Press Club
              </span>
            </div>

            {/* Editorial identity */}

            <div
              className={[
                "mt-6",
                "flex",
                "items-center",
                "gap-3",
              ].join(" ")}
            >
              <span
                className={[
                  "flex",
                  "h-9",
                  "w-9",
                  "shrink-0",
                  "items-center",
                  "justify-center",
                  "rounded-lg",
                  "border",
                  "border-blue-100",
                  "bg-white",
                  "text-[#155eef]",
                  "shadow-[0_4px_12px_rgba(15,76,129,0.06)]",
                ].join(" ")}
              >
                <Newspaper
                  size={17}
                  aria-hidden="true"
                />
              </span>

              <div>
                <p
                  className={[
                    "text-[10px]",
                    "font-extrabold",
                    "uppercase",
                    "tracking-[0.15em]",
                    "text-slate-400",
                  ].join(" ")}
                >
                  Independent Media Platform
                </p>

                <p
                  className={[
                    "mt-0.5",
                    "text-xs",
                    "font-bold",
                    "text-slate-700",
                    "sm:text-sm",
                  ].join(" ")}
                >
                  Journalism • Media • Community
                </p>
              </div>
            </div>

            {/* Main heading */}

            <h1
              id="gnpc-hero-title"
              className={[
                "mt-7",
                "max-w-3xl",
                "text-[2.45rem]",
                "font-black",
                "leading-[1.04]",
                "tracking-[-0.045em]",
                "text-[#0b1f33]",
                "sm:text-5xl",
                "md:text-[3.65rem]",
                "lg:text-[4rem]",
                "xl:text-[4.7rem]",
              ].join(" ")}
            >
              {heroTitle}
            </h1>

            {/* Decorative rule */}

            <div
              aria-hidden="true"
              className={[
                "mt-7",
                "flex",
                "items-center",
                "gap-2",
              ].join(" ")}
            >
              <span className="h-1 w-12 rounded-full bg-[#155eef]" />

              <span className="h-1 w-2 rounded-full bg-[#c8102e]" />

              <span className="h-px w-20 bg-slate-200" />
            </div>

            {/* Description */}

            <p
              className={[
                "mt-7",
                "max-w-2xl",
                "text-[15px]",
                "leading-7",
                "text-slate-600",
                "sm:text-[17px]",
                "sm:leading-8",
              ].join(" ")}
            >
              {heroDescription}
            </p>

            {/* =================================================
                ACTIONS
                ================================================= */}

            <div
              className={[
                "mt-8",
                "flex",
                "flex-col",
                "gap-3",
                "sm:mt-9",
                "sm:flex-row",
                "sm:flex-wrap",
              ].join(" ")}
            >
              <MembershipFormLink
                className={primaryButton}
                unavailableClassName={[
                  "group",
                  "inline-flex",
                  "cursor-not-allowed",
                  "items-center",
                  "justify-center",
                  "gap-2.5",
                  "rounded-lg",
                  "border",
                  "border-slate-200",
                  "bg-slate-100",
                  "px-5",
                  "py-3.5",
                  "text-sm",
                  "font-bold",
                  "text-[#0f4c81]",
                  "opacity-60",
                  "sm:px-6",
                  "sm:text-[15px]",
                ].join(" ")}
              >
                Become a Member

                <ArrowRight
                  size={17}
                  aria-hidden="true"
                  className={[
                    "transition-transform",
                    "duration-200",
                    "group-hover:translate-x-1",
                  ].join(" ")}
                />
              </MembershipFormLink>

              <Link
                href="/latest-updates"
                className={secondaryButton}
              >
                Latest Updates

                <ArrowRight
                  size={17}
                  aria-hidden="true"
                  className={[
                    "transition-transform",
                    "duration-200",
                    "group-hover:translate-x-1",
                  ].join(" ")}
                />
              </Link>
            </div>

            {/* =================================================
                QUICK LINKS
                ================================================= */}

            <div
              className={[
                "mt-9",
                "flex",
                "flex-wrap",
                "gap-x-7",
                "gap-y-3",
                "border-t",
                "border-slate-200",
                "pt-6",
              ].join(" ")}
            >
              <Link
                href="/press-releases"
                className={[
                  "group",
                  "inline-flex",
                  "items-center",
                  "gap-2",
                  "text-xs",
                  "font-bold",
                  "text-slate-600",
                  "transition-colors",
                  "duration-200",
                  "hover:text-[#155eef]",
                  "sm:text-sm",
                ].join(" ")}
              >
                <Newspaper
                  size={15}
                  className="text-[#155eef]"
                  aria-hidden="true"
                />

                <span>
                  Press Releases
                </span>

                <ArrowRight
                  size={13}
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
                  "text-xs",
                  "font-bold",
                  "text-slate-600",
                  "transition-colors",
                  "duration-200",
                  "hover:text-[#155eef]",
                  "sm:text-sm",
                ].join(" ")}
              >
                <CalendarDays
                  size={15}
                  className="text-[#155eef]"
                  aria-hidden="true"
                />

                <span>
                  Events
                </span>

                <ArrowRight
                  size={13}
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
              RIGHT — CINEMATIC CMS HERO
              ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: 24,
              scale: 0.985,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.75,
              delay: 0.08,
              ease: "easeOut",
            }}
            className="order-1 lg:order-2"
          >
            <div className="relative">
              {/* Offset frame */}

              <div
                aria-hidden="true"
                className={[
                  "absolute",
                  "-inset-3",
                  "rounded-[1.75rem]",
                  "border",
                  "border-[#155eef]/10",
                  "bg-[#155eef]/[0.025]",
                  "sm:-inset-4",
                  "sm:rounded-[2rem]",
                ].join(" ")}
              />

              {/* Main visual */}

              <div
                className={[
                  "relative",
                  "overflow-hidden",
                  "rounded-[1.35rem]",
                  "border",
                  "border-slate-200",
                  "bg-white",
                  "p-1.5",
                  "shadow-[0_24px_70px_rgba(15,23,42,0.13)]",
                  "sm:rounded-[1.75rem]",
                  "sm:p-2",
                ].join(" ")}
              >
                <div
                  className={[
                    "relative",
                    "h-[320px]",
                    "overflow-hidden",
                    "rounded-[1.05rem]",
                    "bg-slate-200",
                    "sm:h-[420px]",
                    "sm:rounded-[1.4rem]",
                    "lg:h-[485px]",
                    "xl:h-[535px]",
                  ].join(" ")}
                >
                  {/* CMS carousel */}

                  <HeroCarousel
                    fallbackImage={heroImage}
                    alt={heroTitle}
                  />

                  {/* Editorial readability overlay */}

                  <div
                    aria-hidden="true"
                    className={[
                      "pointer-events-none",
                      "absolute",
                      "inset-0",
                      "bg-gradient-to-t",
                      "from-[#071c2d]/75",
                      "via-[#071c2d]/10",
                      "to-transparent",
                    ].join(" ")}
                  />

                  {/* Top brand marker */}

                  <div
                    className={[
                      "absolute",
                      "left-4",
                      "top-4",
                      "inline-flex",
                      "items-center",
                      "gap-2",
                      "rounded-md",
                      "border",
                      "border-white/25",
                      "bg-[#071c2d]/65",
                      "px-3",
                      "py-2",
                      "text-[9px]",
                      "font-extrabold",
                      "uppercase",
                      "tracking-[0.2em]",
                      "text-white",
                      "shadow-lg",
                      "backdrop-blur-md",
                      "sm:left-5",
                      "sm:top-5",
                      "sm:text-[10px]",
                    ].join(" ")}
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-[#c8102e]"
                    />

                    GNPC
                  </div>

                  {/* Bottom editorial caption */}

                  <div
                    className={[
                      "pointer-events-none",
                      "absolute",
                      "bottom-0",
                      "left-0",
                      "right-0",
                      "p-5",
                      "sm:p-7",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "max-w-xl",
                        "border-l-2",
                        "border-white/60",
                        "pl-4",
                      ].join(" ")}
                    >
                      <p
                        className={[
                          "text-[9px]",
                          "font-extrabold",
                          "uppercase",
                          "tracking-[0.2em]",
                          "text-white/65",
                          "sm:text-[10px]",
                        ].join(" ")}
                      >
                        {siteName}
                      </p>

                      <p
                        className={[
                          "mt-1.5",
                          "text-sm",
                          "font-bold",
                          "leading-6",
                          "text-white",
                          "sm:text-base",
                          "sm:leading-7",
                        ].join(" ")}
                      >
                        Journalism, media and community —
                        connected through GNPC.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  FLOATING EDITORIAL DETAIL
                  ================================================= */}

              <div
                className={[
                  "absolute",
                  "-bottom-5",
                  "left-5",
                  "hidden",
                  "items-center",
                  "gap-3",
                  "rounded-xl",
                  "border",
                  "border-slate-200",
                  "bg-white",
                  "px-4",
                  "py-3",
                  "shadow-[0_12px_32px_rgba(15,23,42,0.10)]",
                  "sm:flex",
                  "lg:left-8",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex",
                    "h-8",
                    "w-8",
                    "items-center",
                    "justify-center",
                    "rounded-lg",
                    "bg-[#eef4ff]",
                    "text-[#155eef]",
                  ].join(" ")}
                >
                  <Newspaper
                    size={15}
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <p
                    className={[
                      "text-[9px]",
                      "font-extrabold",
                      "uppercase",
                      "tracking-[0.16em]",
                      "text-slate-400",
                    ].join(" ")}
                  >
                    GNPC
                  </p>

                  <p
                    className={[
                      "mt-0.5",
                      "text-xs",
                      "font-bold",
                      "text-slate-700",
                    ].join(" ")}
                  >
                    Greater Noida
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM IDENTITY STRIP
          ===================================================== */}

      <div
        className={[
          "relative",
          "border-t",
          "border-slate-200/80",
          "bg-white/75",
        ].join(" ")}
      >
        <div
          className={[
            "mx-auto",
            "flex",
            "max-w-[80rem]",
            "flex-col",
            "gap-2.5",
            "px-4",
            "py-4",
            "sm:flex-row",
            "sm:items-center",
            "sm:justify-between",
            "sm:px-6",
            "lg:px-8",
          ].join(" ")}
        >
          <div
            className={[
              "flex",
              "items-center",
              "gap-2.5",
            ].join(" ")}
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-[#c8102e]"
            />

            <p
              className={[
                "text-[10px]",
                "font-extrabold",
                "uppercase",
                "tracking-[0.16em]",
                "text-slate-500",
              ].join(" ")}
            >
              {siteName}
            </p>
          </div>

          <p
            className={[
              "text-xs",
              "font-semibold",
              "text-slate-500",
              "sm:text-sm",
            ].join(" ")}
          >
            Journalism • Media • Community
          </p>
        </div>
      </div>
    </section>
  );
}
