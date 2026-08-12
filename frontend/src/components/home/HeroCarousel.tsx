"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import {
  PointerEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getBanners } from "@/services/bannerService";
import type { Banner } from "@/types/banner";

type Props = {
  fallbackImage?: string;
  alt: string;
};

export default function HeroCarousel({
  fallbackImage,
  alt,
}: Props) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [startX, setStartX] = useState<number | null>(
    null
  );
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadBanners = async () => {
      try {
        const data = await getBanners();

        if (!mounted) {
          return;
        }

        const activeBanners = data
          .filter((banner) => banner.active)
          .sort(
            (a, b) =>
              (a.order ?? 0) - (b.order ?? 0)
          );

        setBanners(activeBanners);
      } catch (error) {
        if (mounted) {
          console.error(
            "Unable to load hero banners:",
            error
          );
          setBanners([]);
        }
      }
    };

    void loadBanners();

    return () => {
      mounted = false;
    };
  }, []);

  const slides = useMemo(() => {
    if (banners.length > 0) {
      return banners;
    }

    if (fallbackImage) {
      return [
        {
          _id: "fallback",
          image: fallbackImage,
          order: 0,
          active: true,
          createdAt: "",
        } satisfies Banner,
      ];
    }

    return [];
  }, [banners, fallbackImage]);

  useEffect(() => {
    if (activeIndex >= slides.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, slides.length]);

  useEffect(() => {
    if (
      slides.length < 2 ||
      isPaused
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex(
        (current) =>
          (current + 1) % slides.length
      );
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [slides.length, isPaused]);

  const showSlide = (index: number) => {
    if (slides.length < 2) {
      return;
    }

    setActiveIndex(
      (index + slides.length) %
        slides.length
    );
  };

  const handlePointerDown = (
    event: PointerEvent<HTMLDivElement>
  ) => {
    setStartX(event.clientX);
  };

  const handlePointerUp = (
    event: PointerEvent<HTMLDivElement>
  ) => {
    if (
      startX === null ||
      slides.length < 2
    ) {
      setStartX(null);
      return;
    }

    const distance =
      event.clientX - startX;

    if (Math.abs(distance) > 45) {
      showSlide(
        activeIndex +
          (distance < 0 ? 1 : -1)
      );
    }

    setStartX(null);
  };

  if (slides.length === 0) {
    return (
      <div className="flex h-full min-h-[290px] items-center justify-center bg-gradient-to-br from-[#0f4c81] to-[#07111d] p-8 text-center sm:min-h-0">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-200">
            GNPC
          </p>

          <p className="mt-3 text-xl font-bold text-white sm:text-2xl">
            Greater Noida Press Club
          </p>

          <p className="mt-2 text-sm text-blue-100/80">
            Journalism. Integrity. Community.
          </p>
        </div>
      </div>
    );
  }

  const activeSlide =
    slides[activeIndex] ?? slides[0];

  return (
    <div
      className="group relative h-full w-full touch-pan-y select-none overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() =>
        setStartX(null)
      }
      onMouseEnter={() =>
        setIsPaused(true)
      }
      onMouseLeave={() =>
        setIsPaused(false)
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide._id}
          initial={{
            opacity: 0,
            scale: 1.025,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 1.01,
          }}
          transition={{
            duration: 0.75,
            ease: "easeOut",
          }}
          className="absolute inset-0"
        >
          <Image
            src={activeSlide.image}
            alt={alt}
            fill
            priority={activeIndex === 0}
            sizes="(min-width: 1280px) 55vw, (min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Image gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/10"
      />

      {slides.length > 1 && (
        <>
          {/* Previous */}
          <button
            type="button"
            onClick={() =>
              showSlide(activeIndex - 1)
            }
            aria-label="Previous hero banner"
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-950/55 text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-slate-950/80 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white group-hover:opacity-100 sm:left-5"
          >
            <ChevronLeft
              size={20}
              aria-hidden="true"
            />
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={() =>
              showSlide(activeIndex + 1)
            }
            aria-label="Next hero banner"
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-950/55 text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-slate-950/80 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white group-hover:opacity-100 sm:right-5"
          >
            <ChevronRight
              size={20}
              aria-hidden="true"
            />
          </button>

          {/* Bottom controls */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-4 sm:bottom-5 sm:left-5 sm:right-5">
            {/* Indicators */}
            <div className="flex items-center gap-1.5">
              {slides.map(
                (slide, index) => (
                  <button
                    key={slide._id}
                    type="button"
                    onClick={() =>
                      showSlide(index)
                    }
                    aria-label={`Show hero banner ${
                      index + 1
                    }`}
                    aria-current={
                      index === activeIndex
                    }
                    className="group/dot flex h-5 items-center"
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-all duration-300 ${
                        index === activeIndex
                          ? "w-8 bg-white"
                          : "w-2.5 bg-white/50 group-hover/dot:bg-white/80"
                      }`}
                    />
                  </button>
                )
              )}
            </div>

            {/* Pause / play */}
            <button
              type="button"
              onClick={() =>
                setIsPaused(
                  (current) => !current
                )
              }
              aria-label={
                isPaused
                  ? "Play hero carousel"
                  : "Pause hero carousel"
              }
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-slate-950/50 text-white backdrop-blur-md transition hover:bg-slate-950/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {isPaused ? (
                <Play
                  size={13}
                  fill="currentColor"
                  aria-hidden="true"
                />
              ) : (
                <Pause
                  size={13}
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
