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
import Button from "@/components/ui/Button";
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



  return (
    <section
      aria-labelledby="gnpc-hero-title"
      className="gnpc-hero relative overflow-hidden text-white"
    >
      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-[#d4b06a]/10 blur-3xl" />

        <div className="absolute -bottom-40 -right-32 h-[30rem] w-[30rem] rounded-full bg-[#2f789d]/20 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* =====================================================
          HERO CONTENT
          ===================================================== */}

      <div className="gnpc-container relative pb-8 pt-10 sm:pb-10 sm:pt-14 lg:pb-12 lg:pt-16">
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

          <div className="gnpc-hero-copy flex items-center justify-center gap-3">
            <span
              aria-hidden="true"
              className="gnpc-hero-line h-px w-8 sm:w-12"
            />

            <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-[#d4b06a] sm:text-[10px]">
              {eyebrow}
            </span>

            <span
              aria-hidden="true"
              className="gnpc-hero-line h-px w-8 sm:w-12"
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
            className="gnpc-hero-pill mx-auto mt-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] sm:text-[10px]"
          >
            <span className="gnpc-hero-icon flex h-5 w-5 items-center justify-center rounded-full">
              <Newspaper size={10} />
            </span>

            {identityLabel}
          </motion.div>

          {/* Main Heading */}

          <h1
            id="gnpc-hero-title"
            className="gnpc-hero-copy mx-auto mt-6 max-w-[900px] text-[2.6rem] font-black leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl lg:text-[4.5rem]"
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
            className="mx-auto mt-5 h-1 rounded-full bg-[#d4b06a]"
          />

          {/* Description */}

          {heroDescription && (
            <p className="gnpc-hero-muted mx-auto mt-5 max-w-[650px] text-sm leading-6 sm:text-base sm:leading-7">
              {heroDescription}
            </p>
          )}

          {/* Buttons */}

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MembershipFormLink
              className="gnpc-btn gnpc-btn-primary group flex-1"
              unavailableClassName="gnpc-btn inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-5 py-3 text-sm font-bold leading-none text-slate-500"
            >
              {primaryLabel}
              <ArrowRight size={16} />
            </MembershipFormLink>

            <Button
              href={home.hero.quickLinks[0]?.href || "/latest-updates"}
              variant="outline"
            >
              <span>{secondaryLabel}</span>
              <ArrowRight size={16} />
            </Button>
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
            className="relative mx-auto mt-8 w-full max-w-[1240px] sm:mt-10 lg:mt-12"
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
            className="gnpc-hero-links mx-auto mt-7 flex max-w-[850px] flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t pt-5"
          >
            {home.hero.quickLinks.map(
              (item, index) => (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href || "/"}
                  className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/55 transition-colors duration-300 hover:text-[#e2c27d] sm:text-xs"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-white/[.06] transition-all duration-300 group-hover:border-[#d4b06a]/60 group-hover:bg-[#d4b06a]/10">
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
        className="h-5 bg-transparent"
      />
    </section>
  );
}
