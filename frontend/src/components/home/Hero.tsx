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
    settings.siteName || "Greater Noida Press Club";

  const heroTitle =
    settings.heroTitle ||
    "Journalism That Informs, Connects & Represents";

  const heroDescription =
    settings.heroDescription ||
    "Greater Noida Press Club brings journalists, media professionals and the community together through responsible journalism, collaboration and professional engagement.";

  return (
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_20%,rgba(15,76,129,0.42),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(200,16,46,0.18),transparent_30%),linear-gradient(135deg,#06111f_0%,#0a2036_48%,#07111d_100%)]"
      />

      {/* Decorative grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-40 -z-10 h-[28rem] w-[28rem] rounded-full bg-red-500/10 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20 xl:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 xl:gap-20">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            {/* Organization badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100 backdrop-blur-md sm:px-4 sm:text-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20">
                <Newspaper
                  size={13}
                  aria-hidden="true"
                />
              </span>

              <span>{siteName}</span>
            </div>

            {/* Editorial label */}
            <div className="mt-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-blue-300 sm:mt-9 sm:text-sm">
              <span className="h-px w-8 bg-blue-400/70" />
              GNPC
            </div>

            {/* Main heading */}
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
              {heroTitle}
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              {heroDescription}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
              <MembershipFormLink
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f4c81] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#12609f] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:px-6 sm:text-base"
                unavailableClassName="inline-flex cursor-not-allowed items-center justify-center rounded-xl bg-[#0f4c81] px-5 py-3.5 text-sm font-bold text-white opacity-60 sm:px-6 sm:text-base"
              >
                Become A Member
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </MembershipFormLink>

              <Link
                href="/latest-updates"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-5 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:px-6 sm:text-base"
              >
                Latest Updates
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>

            {/* Quick information */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6 sm:mt-10">
              <Link
                href="/press-conference"
                className="group inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
              >
                <CalendarDays
                  size={16}
                  className="text-blue-300"
                  aria-hidden="true"
                />
                <span>Press Conferences</span>
                <ArrowRight
                  size={14}
                  className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Link>

              <Link
                href="/press-releases"
                className="group inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
              >
                <Newspaper
                  size={16}
                  className="text-blue-300"
                  aria-hidden="true"
                />
                <span>Press Releases</span>
                <ArrowRight
                  size={14}
                  className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, x: 32, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: "easeOut",
            }}
            className="order-1 lg:order-2"
          >
            <div className="relative">
              {/* Outer glow */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2rem] bg-blue-500/10 blur-2xl"
              />

              {/* Image frame */}
              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/5 p-1.5 shadow-2xl shadow-black/40 sm:rounded-[2rem] sm:p-2">
                <div className="relative h-[290px] overflow-hidden rounded-[1.15rem] bg-slate-900 sm:h-[420px] sm:rounded-[1.5rem] lg:h-[510px] xl:h-[550px]">
                  <HeroCarousel
                    fallbackImage={settings.heroImage}
                    alt={heroTitle}
                  />

                  {/* Image readability overlay */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent"
                  />

                  {/* Live editorial marker */}
                  <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/60 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md sm:left-5 sm:top-5 sm:text-xs">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                    </span>
                    GNPC
                  </div>
                </div>
              </div>

              {/* Floating editorial card */}
              <div className="absolute -bottom-5 left-4 hidden max-w-[250px] rounded-2xl border border-white/15 bg-slate-950/85 p-4 shadow-2xl backdrop-blur-xl sm:block lg:-left-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">
                  Greater Noida
                </p>

                <p className="mt-1 text-sm font-bold leading-5 text-white">
                  A platform for journalism, media professionals and the community.
                </p>
              </div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 1,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute -bottom-10 right-2 hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 xl:flex"
              >
                <ChevronDown
                  size={15}
                  aria-hidden="true"
                />
                Explore
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom edge */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
    </section>
  );
}
