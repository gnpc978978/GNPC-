"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Newspaper,
  Sparkles,
} from "lucide-react";

import HeroCarousel from "@/components/home/HeroCarousel";
import MembershipFormLink from "@/components/membership/MembershipFormLink";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import { mergeHomeSettings } from "@/types/homeSettings";

export default function Hero() {
  const { settings } = useWebsiteSettings();

  const home = mergeHomeSettings(settings.home);

  const siteName =
    settings.siteName || "Greater Noida Press Club";

  const heroTitle =
    home.hero.title ||
    settings.heroTitle ||
    "Connecting Journalism, Media & Community";

  const heroDescription =
    home.hero.description ||
    settings.heroDescription ||
    "A professional platform for journalists, media professionals and the community of Greater Noida.";

  const heroImage =
    settings.heroImage || "/Logo.png";

  const primaryLabel =
    home.hero.primaryLabel || "Become a Member";

  const secondaryLabel =
    home.hero.secondaryLabel || "Latest Updates";

  const eyebrow =
    home.hero.eyebrow || "Greater Noida Press Club";

  const identityLabel =
    home.hero.identityLabel ||
    "Journalism • Media • Community";

  const buttonBase = [
    "group relative inline-flex items-center justify-center",
    "gap-2 overflow-hidden",
    "rounded-xl",
    "px-5 py-3.5",
    "text-sm font-extrabold",
    "transition-all duration-300",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-[#c8102e]",
    "focus-visible:ring-offset-2",
    "sm:px-6 sm:py-4 sm:text-base",
  ].join(" ");

  return (
    <section
      aria-labelledby="gnpc-hero-title"
      className="relative isolate overflow-hidden bg-[#151b24] text-white"
    >
      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Large ambient glow */}
        <motion.div
          animate={{
            x: [0, 35, 0],
            y: [0, -20, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-[#c8102e]/10 blur-[100px]"
        />

        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-52 -right-40 h-[36rem] w-[36rem] rounded-full bg-slate-400/10 blur-[110px]"
        />

        {/* Editorial grid */}
        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        {/* Vertical accent */}
        <div className="absolute left-[7%] top-0 hidden h-full w-px bg-white/[0.06] lg:block" />

        <div className="absolute right-[7%] top-0 hidden h-full w-px bg-white/[0.06] lg:block" />
      </div>

      {/* =====================================================
          MAIN
          ===================================================== */}

      <div className="relative mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-6 sm:py-16 md:px-8 lg:px-10 lg:py-20 xl:px-12 xl:py-24 2xl:px-14">
        <div className="grid items-center gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14 xl:gap-20">
          {/* =================================================
              LEFT CONTENT
              ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: -28,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-10 order-2 lg:order-1"
          >
            {/* Eyebrow */}

            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="relative h-[3px] w-10 overflow-hidden rounded-full bg-[#c8102e]"
              >
                <span className="absolute inset-y-0 left-0 w-1/2 animate-pulse bg-white/80" />
              </span>

              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55 sm:text-xs">
                {eyebrow}
              </span>
            </div>

            {/* Identity pill */}

            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
                duration: 0.5,
              }}
              className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/80 backdrop-blur-md sm:text-xs"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c8102e] text-white shadow-lg shadow-[#c8102e]/20">
                <Newspaper size={12} />
              </span>

              {identityLabel}
            </motion.div>

            {/* Heading */}

            <h1
              id="gnpc-hero-title"
              className={[
                "mt-6 max-w-4xl",
                "text-[2.65rem]",
                "font-black",
                "leading-[0.98]",
                "tracking-[-0.055em]",
                "text-white",
                "sm:text-5xl",
                "md:text-6xl",
                "lg:text-[4.5rem]",
                "xl:text-[5.3rem]",
                "2xl:text-[5.8rem]",
              ].join(" ")}
            >
              {heroTitle}
            </h1>

            {/* Accent line */}

            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: 82,
              }}
              transition={{
                delay: 0.65,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-7 h-1 rounded-full bg-[#c8102e]"
            />

            {/* Description */}

            <p className="mt-7 max-w-2xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8 lg:text-lg">
              {heroDescription}
            </p>

            {/* Actions */}

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap">
              <MembershipFormLink
                className={[
                  buttonBase,
                  "bg-[#c8102e]",
                  "text-white",
                  "shadow-[0_14px_35px_rgba(200,16,46,0.22)]",
                  "hover:-translate-y-1",
                  "hover:bg-[#a50d25]",
                  "hover:shadow-[0_18px_42px_rgba(200,16,46,0.32)]",
                ].join(" ")}
                unavailableClassName={[
                  buttonBase,
                  "cursor-not-allowed",
                  "bg-white/10",
                  "text-white/50",
                ].join(" ")}
              >
                <span className="relative z-10">
                  {primaryLabel}
                </span>

                <ArrowRight
                  size={18}
                  className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                />

                {/* Shine */}
                <span
                  aria-hidden="true"
                  className="absolute -left-[120%] top-0 h-full w-1/2 -skew-x-12 bg-white/20 transition-all duration-700 group-hover:left-[130%]"
                />
              </MembershipFormLink>

              <Link
                href="/latest-updates"
                className={[
                  buttonBase,
                  "border border-white/15",
                  "bg-white/[0.06]",
                  "text-white",
                  "backdrop-blur-md",
                  "hover:-translate-y-1",
                  "hover:border-white/25",
                  "hover:bg-white/10",
                ].join(" ")}
              >
                <span>{secondaryLabel}</span>

                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Quick links */}

            {home.hero.quickLinks.length > 0 && (
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6">
                {home.hero.quickLinks.map(
                  (item, index) => (
                    <Link
                      key={`${item.label}-${item.href}`}
                      href={item.href || "/"}
                      className="group inline-flex items-center gap-2 text-xs font-bold text-white/45 transition-colors duration-300 hover:text-white sm:text-sm"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-all duration-300 group-hover:border-[#c8102e]/50 group-hover:bg-[#c8102e]">
                        {index % 2 === 0 ? (
                          <Newspaper size={11} />
                        ) : (
                          <CalendarDays size={11} />
                        )}
                      </span>

                      <span>{item.label}</span>

                      <ArrowRight
                        size={12}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>
                  )
                )}
              </div>
            )}
          </motion.div>

          {/* =================================================
              RIGHT VISUAL
              ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.9,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative order-1 lg:order-2"
          >
            {/* Decorative orbit */}

            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
              aria-hidden="true"
              className="absolute -inset-5 rounded-[2.5rem] border border-dashed border-white/[0.08]"
            />

            {/* Accent frame */}

            <div
              aria-hidden="true"
              className="absolute -inset-2 rounded-[2rem] border border-[#c8102e]/20 bg-[#c8102e]/[0.025]"
            />

            {/* Image shell */}

            <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#202733] p-2 shadow-[0_30px_90px_rgba(0,0,0,0.42)] sm:rounded-[2rem] sm:p-2.5">
              <motion.div
                whileHover={{
                  scale: 1.018,
                }}
                transition={{
                  duration: 0.5,
                }}
                className="relative h-[330px] overflow-hidden rounded-[1.2rem] bg-[#252d38] sm:h-[440px] sm:rounded-[1.5rem] lg:h-[520px] xl:h-[590px]"
              >
                <HeroCarousel
                  fallbackImage={heroImage}
                  alt={heroTitle}
                />

                {/* Dark cinematic overlay */}

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080c12]/90 via-[#080c12]/10 to-transparent"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080c12]/30 via-transparent to-transparent"
                />

                {/* Top floating badge */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.7,
                    duration: 0.5,
                  }}
                  className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#111722]/75 px-3 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/85 shadow-lg backdrop-blur-xl sm:left-5 sm:top-5 sm:text-[10px]"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-[#c8102e]" />
                    <span className="relative h-2 w-2 rounded-full bg-[#c8102e]" />
                  </span>

                  GNPC
                </motion.div>

                {/* Floating glass card */}

                <motion.div
                  animate={{
                    y: [0, -7, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute right-4 top-4 hidden max-w-[210px] rounded-2xl border border-white/15 bg-[#111722]/75 p-4 shadow-2xl backdrop-blur-xl sm:block"
                >
                  <div className="flex items-center gap-2 text-[#c8102e]">
                    <Sparkles size={14} />

                    <span className="text-[9px] font-black uppercase tracking-[0.16em]">
                      GNPC
                    </span>
                  </div>

                  <p className="mt-2 text-xs font-bold leading-5 text-white/75">
                    {identityLabel}
                  </p>
                </motion.div>

                {/* Bottom content */}

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-8">
                  <div className="max-w-xl">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/45 sm:text-[10px]">
                      {siteName}
                    </p>

                    <div className="mt-2 flex items-end justify-between gap-5">
                      <p className="max-w-md text-sm font-bold leading-6 text-white sm:text-base sm:leading-7">
                        {identityLabel}
                      </p>

                      <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white sm:flex">
                        <ArrowRight size={17} />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom floating label */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.8,
                duration: 0.5,
              }}
              className="absolute -bottom-5 left-5 hidden rounded-2xl border border-white/10 bg-[#202733] px-5 py-3 shadow-2xl sm:block"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c8102e] text-white">
                  <Newspaper size={14} />
                </span>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/40">
                    Media • Community
                  </p>

                  <p className="mt-0.5 text-xs font-bold text-white">
                    Greater Noida Press Club
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM EDITORIAL STRIP
          ===================================================== */}

      <div className="relative border-t border-white/[0.08] bg-[#10151d]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#c8102e]" />

            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 sm:text-[10px]">
              {siteName}
            </span>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">
            Journalism • Media • Community
          </span>
        </div>
      </div>
    </section>
  );
}
