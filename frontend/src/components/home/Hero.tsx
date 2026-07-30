"use client";

import Link from "next/link";
import HeroCarousel from "@/components/home/HeroCarousel";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import MembershipFormLink from "@/components/membership/MembershipFormLink";

export default function Hero() {
  const { settings } = useWebsiteSettings();

  return (
    <section className="relative overflow-hidden bg-slate-950 py-12 text-white sm:py-20 lg:py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <p className="inline-flex max-w-full rounded-full bg-blue-500/20 px-3 py-1.5 text-xs font-semibold text-blue-100 sm:px-4 sm:py-2 sm:text-sm">
            📰 {settings.siteName || "Press Club"}
          </p>
          <p className="mt-5 text-xs font-bold tracking-[0.28em] text-blue-300 sm:mt-7 sm:text-sm sm:tracking-[0.35em]">GNPC</p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            {settings.heroTitle || settings.siteName || "Press Club"}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">
            {settings.heroDescription || "Connecting journalists, media professionals, and the community."}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-4">
            <MembershipFormLink className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:px-6" unavailableClassName="cursor-not-allowed rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold opacity-70 sm:px-6">Become A Member</MembershipFormLink>
            <Link href="/press-conference" className="rounded-xl border border-white/30 px-5 py-3 text-center font-semibold transition hover:bg-white/10 sm:px-6">Press Conferences</Link>
          </div>
        </div>
        <div className="order-1 relative h-56 overflow-hidden rounded-2xl border border-white/15 shadow-2xl sm:h-96 sm:rounded-3xl lg:order-2 lg:h-[500px]">
          <HeroCarousel fallbackImage={settings.heroImage} alt={settings.heroTitle || settings.siteName || "Press Club"} />
        </div>
      </div>
    </section>
  );
}
