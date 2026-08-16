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
import { mergeHomeSettings } from "@/types/homeSettings";

export default function Hero() {
  const { settings } = useWebsiteSettings();

  const home = mergeHomeSettings(settings.home);

  const siteName =
    settings.siteName ||
    "Greater Noida Press Club";

  const heroTitle =
    home.hero.title ||
    settings.heroTitle ||
    "Connecting Journalism, Media & Community";

  const heroDescription =
    home.hero.description ||
    settings.heroDescription ||
    "";

  const heroImage =
    settings.heroImage ||
    "/Logo.png";

  const primaryLabel =
    home.hero.primaryLabel ||
    "Become a Member";

  const secondaryLabel =
    home.hero.secondaryLabel ||
    "Latest Updates";

  const eyebrow =
    home.hero.eyebrow ||
    siteName;

  const identityLabel =
    home.hero.identityLabel ||
    "Journalism • Media • Community";

  const buttonBase = [
    "group relative inline-flex items-center justify-center",
    "gap-2 overflow-hidden",
    "rounded-full",
    "px-5 py-3",
    "text-sm font-bold",
    "transition-all duration-300",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-[#172033]",
    "focus-visible:ring-offset-2",
    "sm:px-6 sm:py-3.5",
  ].join(" ");

  return (
    <section
      aria-labelledby="gnpc-hero-title"
      className="relative overflow-hidden bg-[#f4ede2] text-[#171717]"
    >
      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-white/70 blur-3xl" />

        <div className="absolute -bottom-40 -right-32 h-[30rem] w-[30rem] rounded-full bg-[#ded0bd]/40 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(23,23,23,0.12) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* =====================================================
          HERO CONTENT
          ===================================================== */}

      <div className="relative mx-auto w-full max-w-[1500px] px-4 pb-8 pt-12 sm:px-6 sm:pb-10 sm:pt-16 md:px-8 lg:px-10 lg:pb-12 lg:pt-20 xl:px-12">
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
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-[950px] text-center"
        >
          {/* Eyebrow */}

          <div className="flex items-center justify-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-8 bg-[#171717]/30 sm:w-12"
            />

            <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-[#171717]/55 sm:text-[10px]">
              {eyebrow}
            </span>

            <span
              aria-hidden="true"
              className="h-px w-8 bg-[#171717]/30 sm:w-12"
            />
          </div>

          {/* Identity */}

          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.15,
              duration: 0.5,
            }}
            className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/55 px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-black/55 backdrop-blur-md sm:text-[10px]"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#172033] text-white">
              <Newspaper size={10} />
            </span>

            {identityLabel}
          </motion.div>

          {/* Main Heading */}

          <h1
            id="gnpc-hero-title"
            className="mx-auto mt-6 max-w-[900px] text-[2.7rem] font-black leading-[0.96] tracking-[-0.055em] text-[#151515] sm:text-5xl md:text-6xl lg:text-[4.7rem] xl:text-[5.6rem]"
          >
            {heroTitle}
          </h1>

          {/* Accent */}

          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: 64,
            }}
            transition={{
              delay: 0.45,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto mt-6 h-1 rounded-full bg-[#c8102e]"
          />

          {/* Description */}

          {heroDescription && (
            <p className="mx-auto mt-6 max-w-[650px] text-sm leading-6 text-[#171717]/55 sm:text-base sm:leading-7">
              {heroDescription}
            </p>
          )}

          {/* Buttons */}

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MembershipFormLink
              className={[
                buttonBase,
                "bg-white",
                "text-[#171717]",
                "border border-black/10",
                "shadow-[0_12px_30px_rgba(23,23,23,0.12)]",
                "hover:-translate-y-0.5",
                "hover:bg-[#f7f2e9]",
              ].join(" ")}
              unavailableClassName={[
                buttonBase,
                "cursor-not-allowed",
                "bg-black/10",
                "text-black/40",
              ].join(" ")}
            >
              <span className="relative z-10">
                {primaryLabel}
              </span>

              <ArrowRight
                size={16}
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
              />

              <span
                aria-hidden="true"
                className="absolute -left-[120%] top-0 h-full w-1/2 -skew-x-12 bg-black/5 transition-all duration-700 group-hover:left-[130%]"
              />
            </MembershipFormLink>

           <Link
  href={
    home.hero.quickLinks[0]?.href ||
    "/latest-updates"
  }
  className={[
    buttonBase,
    "border border-black/10",
    "bg-white/55",
    "text-[#171717]",
    "backdrop-blur-md",
    "hover:-translate-y-0.5",
    "hover:bg-white",
    "hover:shadow-sm",
  ].join(" ")}
>
  <span>{secondaryLabel}</span>

  <ArrowRight
    size={16}
    className="transition-transform duration-300 group-hover:translate-x-1"
  />
</Link>
          </div>
        </motion.div>

        {/* ===================================================
            PHOTO FAN
            =================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 35,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            delay: 0.25,
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mx-auto mt-10 w-full max-w-[1450px] sm:mt-12 lg:mt-14"
        >
          <HeroCarousel
            fallbackImage={heroImage}
            alt={heroTitle}
          />
        </motion.div>

        {/* ===================================================
            QUICK LINKS
            =================================================== */}

        {home.hero.quickLinks.length > 0 && (
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
              delay: 0.7,
              duration: 0.6,
            }}
            className="mx-auto mt-7 flex max-w-[850px] flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-black/10 pt-5"
          >
            {home.hero.quickLinks.map(
              (item, index) => (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href || "/"}
                  className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-black/45 transition-colors duration-300 hover:text-black sm:text-xs"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-black/10 bg-white/40 transition-all duration-300 group-hover:border-black/20 group-hover:bg-white">
                    {index % 2 === 0 ? (
                      <Newspaper size={11} />
                    ) : (
                      <CalendarDays size={11} />
                    )}
                  </span>

                  <span>{item.label}</span>

                  <ArrowRight
                    size={11}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              )
            )}
          </motion.div>
        )}
      </div>

      {/* =====================================================
          BOTTOM EDGE
          ===================================================== */}

      <div
        aria-hidden="true"
        className="h-5 bg-[#f4ede2]"
      />
    </section>
  );
}
