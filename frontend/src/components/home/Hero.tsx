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

      {/* =====================================================
          HERO CONTENT
          ===================================================== */}

      <div className="gnpc-container relative pb-6 pt-8 sm:pb-7 sm:pt-10 lg:pb-8 lg:pt-12">
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
          className="mx-auto max-w-[1040px] text-center"
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

          {/* Main Heading */}

          <h1
            id="gnpc-hero-title"
            className="gnpc-hero-copy mx-auto mt-4 max-w-[1000px] text-[clamp(2rem,4.6vw,4rem)] font-black leading-[1.04] tracking-[-0.04em] text-white"
          >
            {heroTitle}
          </h1>

          {/* Supporting identity label */}
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e2c27d] sm:text-[11px]">
            {identityLabel}
          </p>

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
            className="mx-auto mt-3 h-[3px] rounded-full bg-[#d4b06a]"
          />

          {/* Description */}

          {heroDescription && (
            <p className="gnpc-hero-muted mx-auto mt-3 max-w-[700px] text-sm leading-6 sm:text-[15px] sm:leading-6">
              {heroDescription}
            </p>
          )}

          {/* Buttons */}

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            <MembershipFormLink
              className="w-auto !px-4 sm:!px-5"
              unavailableClassName="!px-4 sm:!px-5"
            >
              {primaryLabel}
              <ArrowRight size={16} />
            </MembershipFormLink>

            <Button
              href={home.hero.quickLinks[0]?.href || "/latest-updates"}
              variant="outline"
              size="md"
              className="shrink-0 !px-4 sm:!px-5"
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
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
            className="relative mx-auto mt-6 w-full max-w-[1100px] sm:mt-7 lg:mt-8"
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
            className="gnpc-hero-links mx-auto mt-5 flex max-w-[850px] flex-wrap items-center justify-center gap-x-5 gap-y-2.5 border-t pt-4"
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
        className="h-2 bg-transparent"
      />
    </section>
  );
}
