"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
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

type PhotoPosition = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  zIndex: number;
};

const positions: PhotoPosition[] = [
  {
    x: -520,
    y: 42,
    rotate: -12,
    scale: 0.86,
    zIndex: 1,
  },
  {
    x: -390,
    y: 25,
    rotate: -8,
    scale: 0.9,
    zIndex: 2,
  },
  {
    x: -260,
    y: 10,
    rotate: -5,
    scale: 0.94,
    zIndex: 3,
  },
  {
    x: -130,
    y: 0,
    rotate: -2,
    scale: 0.98,
    zIndex: 4,
  },
  {
    x: 0,
    y: -5,
    rotate: 0,
    scale: 1,
    zIndex: 8,
  },
  {
    x: 130,
    y: 0,
    rotate: 2,
    scale: 0.98,
    zIndex: 4,
  },
  {
    x: 260,
    y: 10,
    rotate: 5,
    scale: 0.94,
    zIndex: 3,
  },
  {
    x: 390,
    y: 25,
    rotate: 8,
    scale: 0.9,
    zIndex: 2,
  },
  {
    x: 520,
    y: 42,
    rotate: 12,
    scale: 0.86,
    zIndex: 1,
  },
];

function getVisibleOnMobile(index: number, total: number) {
  const center = (total - 1) / 2;

  return Math.abs(index - center) <= 1;
}

export default function HeroCarousel({
  fallbackImage,
  alt,
}: Props) {
  const [banners, setBanners] = useState<
    Banner[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    const loadBanners = async () => {
      try {
        const data = await getBanners();

        if (!mounted) {
          return;
        }

        const activeBanners = data
          .filter(
            (banner) => banner.active
          )
          .sort(
            (a, b) =>
              (a.order ?? 0) -
              (b.order ?? 0)
          );

        setBanners(activeBanners);
      } catch (error) {
        if (mounted) {
          console.error(
            "Unable to load hero photos:",
            error
          );

          setBanners([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadBanners();

    return () => {
      mounted = false;
    };
  }, []);

  const photos = useMemo(() => {
    if (banners.length > 0) {
      return banners.slice(0, 9);
    }

    if (!loading && fallbackImage) {
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
  }, [
    banners,
    fallbackImage,
    loading,
  ]);

  if (loading) {
    return (
      <div className="relative mx-auto h-[255px] w-full max-w-[1250px] sm:h-[330px] md:h-[370px] lg:h-[410px]">
        <div className="absolute inset-x-0 bottom-0 h-[220px] animate-pulse rounded-[2rem] bg-black/5 sm:h-[290px]" />
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="mx-auto flex h-[220px] max-w-[700px] items-center justify-center rounded-[2rem] border border-black/10 bg-white/50 text-center sm:h-[280px]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/40">
            GNPC
          </p>

          <p className="mt-2 text-sm font-semibold text-black/60">
            Add hero photos from the CMS
          </p>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * SINGLE PHOTO FALLBACK
   * ============================================================
   */

  if (photos.length === 1) {
    const photo = photos[0];

    return (
      <div className="mx-auto flex h-[300px] w-full max-w-[430px] items-center justify-center sm:h-[360px]">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
            rotate: -2,
          }}
          animate={{
            opacity: 1,
            y: 0,
            rotate: -2,
          }}
          whileHover={{
            y: -8,
            rotate: 0,
            scale: 1.02,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative h-[260px] w-[185px] overflow-hidden rounded-[1.35rem] border-[7px] border-white bg-white shadow-[0_25px_60px_rgba(38,32,23,0.18)] sm:h-[315px] sm:w-[225px]"
        >
          <Image
            src={photo.image}
            alt={alt}
            fill
            priority
            sizes="225px"
            className="object-cover"
          />
        </motion.div>
      </div>
    );
  }

  /*
   * ============================================================
   * PHOTO FAN
   * ============================================================
   */

  const displayCount = Math.min(
    photos.length,
    positions.length
  );

  const visiblePhotos =
    photos.slice(0, displayCount);

  return (
    <div
      className={[
        "relative mx-auto",
        "h-[270px]",
        "w-full",
        "overflow-hidden",
        "sm:h-[340px]",
        "md:h-[375px]",
        "lg:h-[420px]",
        "lg:overflow-visible",
      ].join(" ")}
    >
      {/* Soft ground shadow */}

      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 h-12 w-[70%] -translate-x-1/2 rounded-[50%] bg-black/10 blur-2xl sm:bottom-10"
      />

      {/* Perspective frame */}

      <div
        className="absolute inset-x-0 bottom-0 top-0"
        style={{
          perspective:
            "1400px",
        }}
      >
        {visiblePhotos.map(
          (photo, index) => {
            const position =
              positions[index];

            const isMobileVisible =
              getVisibleOnMobile(
                index,
                visiblePhotos.length
              );

            return (
              <motion.div
                key={photo._id}
                initial={{
                  opacity: 0,
                  x: position.x,
                  y: position.y + 35,
                  rotate: position.rotate,
                  scale:
                    position.scale *
                    0.94,
                }}
                animate={{
                  opacity:
                    isMobileVisible
                      ? 1
                      : 1,
                  x: position.x,
                  y: position.y,
                  rotate:
                    position.rotate,
                  scale:
                    position.scale,
                }}
                whileHover={{
                  y: position.y - 14,
                  rotate: 0,
                  scale:
                    position.scale +
                    0.045,
                  zIndex: 20,
                }}
                transition={{
                  duration: 0.8,
                  delay:
                    index * 0.055,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
                className={[
                  "absolute left-1/2 top-[30px]",
                  "h-[205px] w-[140px]",
                  "origin-bottom",
                  "overflow-hidden",
                  "rounded-[1.15rem]",
                  "border-[6px] border-white",
                  "bg-white",
                  "shadow-[0_25px_55px_rgba(38,32,23,0.17)]",
                  "transition-shadow duration-300",
                  "sm:top-[20px]",
                  "sm:h-[270px]",
                  "sm:w-[185px]",
                  "md:h-[295px]",
                  "md:w-[200px]",
                  "lg:h-[325px]",
                  "lg:w-[220px]",
                  !isMobileVisible
                    ? "hidden sm:block"
                    : "",
                ].join(" ")}
                style={{
                  marginLeft:
                    "-70px",
                  zIndex:
                    position.zIndex,
                }}
              >
                <Image
                  src={photo.image}
                  alt={`${alt} — photo ${
                    index + 1
                  }`}
                  fill
                  priority={index < 3}
                  sizes="220px"
                  className="object-cover"
                />

                {/* Image overlay */}

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5"
                />

                {/* Photo number */}

                <div className="absolute bottom-2.5 left-2.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-black/55 px-2 text-[8px] font-bold text-white backdrop-blur-md">
                  {String(
                    index + 1
                  ).padStart(2, "0")}
                </div>
              </motion.div>
            );
          }
        )}
      </div>

      {/* Center highlight */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[12px] z-[7] h-[4px] w-16 -translate-x-1/2 rounded-full bg-[#c8102e] sm:top-[4px]"
      />
    </div>
  );
}
