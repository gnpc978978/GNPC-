"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import HeroCarousel from "./HeroCarousel";

interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  heroImage?: string;
  heroTitle?: string;
}

export default function Hero({
  title = "Welcome to the Press Club",
  subtitle = "Connecting Journalists & Media Professionals",
  description = "Join a dynamic community dedicated to freedom of expression, professional growth, and impactful journalism across the region.",
  primaryCtaText = "Become a Member",
  primaryCtaLink = "/membership",
  secondaryCtaText = "Latest News",
  secondaryCtaLink = "/latest-updates",
  heroImage = "/hero-placeholder.jpg",
  heroTitle,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-20 lg:py-28">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {subtitle && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs sm:text-sm font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{subtitle}</span>
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
              {title}
            </h1>

            {description && (
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                {description}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              {primaryCtaText && primaryCtaLink && (
                <Button
                  asChild
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-6 rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                >
                  <Link href={primaryCtaLink} className="flex items-center gap-2">
                    {primaryCtaText}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              )}

              {secondaryCtaText && secondaryCtaLink && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 border hover:text-white px-6 py-6 rounded-lg transition-all duration-200"
                >
                  <Link href={secondaryCtaLink}>
                    {secondaryCtaText}
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Right Image/Carousel Column */}
          <div className="lg:col-span-5 w-full max-w-lg mx-auto lg:max-w-none">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-800/40 shadow-2xl backdrop-blur-sm aspect-[4/3]">
              <HeroCarousel
                fallbackImage={heroImage}
                alt={heroTitle || "Hero Banner Image"}
              />

              {/* Dark cinematic overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
