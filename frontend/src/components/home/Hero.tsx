"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles, Newspaper } from "lucide-react";

interface HeroSlide {
  _id: string;
  title: string;
  image?: string;
  imageUrl?: string;
  category?: string;
  link?: string;
  description?: string;
}

interface HeroProps {
  slides?: HeroSlide[];
  heroImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
}

const HeroCarousel = ({
  slides = [],
  fallbackImage,
  alt,
}: {
  slides?: HeroSlide[];
  fallbackImage?: string;
  alt: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const displaySlides = slides.length > 0 ? slides : fallbackImage ? [{ _id: "fallback", title: alt, image: fallbackImage }] : [];

  useEffect(() => {
    if (!isPlaying || displaySlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displaySlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, displaySlides.length]);

  if (displaySlides.length === 0) {
    return (
      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-400">
        <Newspaper className="w-12 h-12 mb-2 opacity-50" />
      </div>
    );
  }

  const currentSlide = displaySlides[currentIndex];
  const imgSrc = currentSlide.imageUrl || currentSlide.image || fallbackImage || "";

  return (
    <div className="relative w-full h-full group overflow-hidden">
      {imgSrc ? (
        <Image
          src={imgSrc}
          alt={currentSlide.title || alt}
          fill
          priority
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-slate-800" />
      )}

      {displaySlides.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + displaySlides.length) % displaySlides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % displaySlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm z-10">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:text-amber-400 transition-colors"
              aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <div className="flex gap-1.5">
              {displaySlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentIndex ? "w-6 bg-amber-400" : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function Hero({
  slides = [],
  heroImage = "/hero-default.jpg",
  heroTitle = "Greater Noida Press Club",
  heroSubtitle = "The official voice and press media organization representing journalists and news professionals.",
}: HeroProps) {
  return (
    <section className="relative w-full min-h-[500px] lg:min-h-[600px] bg-slate-950 text-white flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <HeroCarousel
          slides={slides}
          fallbackImage={heroImage}
          alt={heroTitle || "Hero Image"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Official Portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {heroTitle}
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
            {heroSubtitle}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/membership"
              className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold transition-colors shadow-lg shadow-amber-500/20"
            >
              Become a Member
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700 font-semibold backdrop-blur-sm transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
