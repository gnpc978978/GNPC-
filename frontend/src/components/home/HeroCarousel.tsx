"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  useCallback,
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

const AUTO_PLAY_DELAY = 5000;

type Position =
  | "far-left"
  | "left"
  | "center"
  | "right"
  | "far-right";

function getRelativePosition(
  index: number,
  activeIndex: number,
  total: number
): Position | null {
  if (total <= 1) {
    return index === activeIndex
      ? "center"
      : null;
  }

  let difference =
    index - activeIndex;

  if (
    difference >
    total / 2
  ) {
    difference -= total;
  }

  if (
    difference <
    -total / 2
  ) {
    difference += total;
  }

  if (difference === 0) {
    return "center";
  }

  if (difference === -1) {
    return "left";
  }

  if (difference === 1) {
    return "right";
  }

  if (difference === -2) {
    return "far-left";
  }

  if (difference === 2) {
    return "far-right";
  }

  return null;
}

function getCardAnimation(
  position: Position
) {
  switch (position) {
    case "center":
      return {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        zIndex: 30,
      };

    case "left":
      return {
        x: "-66%",
        y: 24,
        rotate: -6,
        scale: 0.9,
        opacity: 0.88,
        zIndex: 20,
      };

    case "right":
      return {
        x: "66%",
        y: 24,
        rotate: 6,
        scale: 0.9,
        opacity: 0.88,
        zIndex: 20,
      };

    case "far-left":
      return {
        x: "-126%",
        y: 52,
        rotate: -11,
        scale: 0.78,
        opacity: 0.55,
        zIndex: 10,
      };

    case "far-right":
      return {
        x: "126%",
        y: 52,
        rotate: 11,
        scale: 0.78,
        opacity: 0.55,
        zIndex: 10,
      };
  }
}

function getMobileAnimation(
  position: Position
) {
  switch (position) {
    case "center":
      return {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        zIndex: 30,
      };

    case "left":
      return {
        x: "-64%",
        y: 16,
        rotate: -5,
        scale: 0.88,
        opacity: 0.72,
        zIndex: 20,
      };

    case "right":
      return {
        x: "64%",
        y: 16,
        rotate: 5,
        scale: 0.88,
        opacity: 0.72,
        zIndex: 20,
      };

    case "far-left":
    case "far-right":
      return {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 0.8,
        opacity: 0,
        zIndex: 0,
      };
  }
}

function createFallbackBanner(
  image: string
): Banner {
  return {
    _id: "fallback",
    image,
    order: 0,
    active: true,
    createdAt: "",
  };
}

export default function HeroCarousel({
  fallbackImage,
  alt,
}: Props) {
  const [banners, setBanners] =
    useState<Banner[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const [
    isPaused,
    setIsPaused,
  ] = useState(false);

  const [
    direction,
    setDirection,
  ] = useState<1 | -1>(1);

  const loadBanners =
    useCallback(async () => {
      try {
        setLoading(true);

        const data =
          await getBanners();

        const active =
          data
            .filter(
              (banner) =>
                banner.active
            )
            .sort(
              (a, b) =>
                (a.order ?? 0) -
                (b.order ?? 0)
            );

        setBanners(active);
      } catch (error) {
        console.error(
          "Unable to load hero photos:",
          error
        );

        setBanners([]);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadBanners();
  }, [loadBanners]);

  const photos = useMemo(() => {
    if (banners.length > 0) {
      return banners;
    }

    if (
      !loading &&
      fallbackImage
    ) {
      return [
        createFallbackBanner(
          fallbackImage
        ),
      ];
    }

    return [];
  }, [
    banners,
    fallbackImage,
    loading,
  ]);

  /*
   * ----------------------------------------------------------
   * KEEP ACTIVE INDEX VALID
   * ----------------------------------------------------------
   */

  useEffect(() => {
    if (
      photos.length === 0
    ) {
      return;
    }

    if (
      activeIndex >=
      photos.length
    ) {
      setActiveIndex(0);
    }
  }, [
    activeIndex,
    photos.length,
  ]);

  /*
   * ----------------------------------------------------------
   * NAVIGATION
   * ----------------------------------------------------------
   */

  const goTo = useCallback(
    (
      index: number,
      nextDirection?: 1 | -1
    ) => {
      if (
        photos.length <= 1
      ) {
        return;
      }

      const normalized =
        (index +
          photos.length) %
        photos.length;

      setDirection(
        nextDirection ??
          (normalized >
          activeIndex
            ? 1
            : -1)
      );

      setActiveIndex(
        normalized
      );
    },
    [
      activeIndex,
      photos.length,
    ]
  );

  const next = useCallback(() => {
    if (
      photos.length <= 1
    ) {
      return;
    }

    setDirection(1);

    setActiveIndex(
      (current) =>
        (current + 1) %
        photos.length
    );
  }, [photos.length]);

  const previous =
    useCallback(() => {
      if (
        photos.length <= 1
      ) {
        return;
      }

      setDirection(-1);

      setActiveIndex(
        (current) =>
          (current -
            1 +
            photos.length) %
          photos.length
      );
    }, [photos.length]);

  /*
   * ----------------------------------------------------------
   * AUTO PLAY
   * ----------------------------------------------------------
   */

  useEffect(() => {
    if (
      photos.length <= 1 ||
      isPaused
    ) {
      return;
    }

    const timer =
      window.setInterval(
        () => {
          setDirection(1);

          setActiveIndex(
            (current) =>
              (current + 1) %
              photos.length
          );
        },
        AUTO_PLAY_DELAY
      );

    return () =>
      window.clearInterval(
        timer
      );
  }, [
    photos.length,
    isPaused,
  ]);

  /*
   * ----------------------------------------------------------
   * KEYBOARD SUPPORT
   * ----------------------------------------------------------
   */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key ===
        "ArrowLeft"
      ) {
        previous();
      }

      if (
        event.key ===
        "ArrowRight"
      ) {
        next();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [
    next,
    previous,
  ]);

  /*
   * ----------------------------------------------------------
   * TOUCH SWIPE
   * ----------------------------------------------------------
   */

  const [
    touchStart,
    setTouchStart,
  ] = useState<number | null>(
    null
  );

  const handleTouchStart = (
    event: React.TouchEvent
  ) => {
    setTouchStart(
      event.touches[0]?.clientX ??
        null
    );

    setIsPaused(true);
  };

  const handleTouchEnd = (
    event: React.TouchEvent
  ) => {
    if (
      touchStart === null
    ) {
      setIsPaused(false);
      return;
    }

    const endX =
      event.changedTouches[0]
        ?.clientX ?? touchStart;

    const distance =
      touchStart - endX;

    if (
      Math.abs(distance) >
      45
    ) {
      if (distance > 0) {
        next();
      } else {
        previous();
      }
    }

    setTouchStart(null);

    window.setTimeout(
      () => setIsPaused(false),
      1200
    );
  };

  /*
   * ----------------------------------------------------------
   * LOADING
   * ----------------------------------------------------------
   */

  if (loading) {
    return (
      <div className="relative mx-auto h-[300px] w-full max-w-[850px] sm:h-[380px] lg:h-[440px]">
        <div className="absolute left-1/2 top-1/2 h-[255px] w-[180px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-[1.5rem] bg-black/5 sm:h-[330px] sm:w-[235px]" />

        <div className="absolute left-[17%] top-[22%] hidden h-[220px] w-[150px] -rotate-7 animate-pulse rounded-[1.25rem] bg-black/[0.035] sm:block" />

        <div className="absolute right-[17%] top-[22%] hidden h-[220px] w-[150px] rotate-7 animate-pulse rounded-[1.25rem] bg-black/[0.035] sm:block" />
      </div>
    );
  }

  /*
   * ----------------------------------------------------------
   * NO PHOTOS
   * ----------------------------------------------------------
   */

  if (photos.length === 0) {
    return (
      <div className="mx-auto flex h-[230px] w-full max-w-[650px] items-center justify-center rounded-[2rem] border border-black/10 bg-white/45 text-center sm:h-[300px]">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-black/35">
            GNPC
          </p>

          <p className="mt-2 text-sm font-semibold text-black/55">
            Add hero photos from the CMS
          </p>

          <p className="mt-1 text-xs text-black/35">
            Website Settings → Home → Hero
          </p>
        </div>
      </div>
    );
  }

  /*
   * ----------------------------------------------------------
   * SINGLE PHOTO
   * ----------------------------------------------------------
   */

  if (photos.length === 1) {
    const photo = photos[0];

    return (
      <div className="relative mx-auto flex h-[330px] w-full max-w-[500px] items-center justify-center sm:h-[400px]">
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
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
            scale: 1.025,
          }}
          transition={{
            duration: 0.75,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="relative h-[280px] w-[200px] overflow-hidden rounded-[1.5rem] border-[7px] border-white bg-white shadow-[0_28px_70px_rgba(38,32,23,0.2)] sm:h-[340px] sm:w-[245px]"
        >
          <Image
            src={photo.image}
            alt={alt}
            fill
            priority
            sizes="245px"
            className="object-cover"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5"
          />
        </motion.div>
      </div>
    );
  }

  /*
   * ----------------------------------------------------------
   * CAROUSEL
   * ----------------------------------------------------------
   */

  return (
    <div
      className="relative mx-auto w-full max-w-[950px]"
      onMouseEnter={() =>
        setIsPaused(true)
      }
      onMouseLeave={() =>
        setIsPaused(false)
      }
      onTouchStart={
        handleTouchStart
      }
      onTouchEnd={handleTouchEnd}
    >
      {/* ======================================================
          PHOTO STAGE
          ====================================================== */}

      <div className="relative h-[320px] w-full overflow-hidden sm:h-[390px] md:h-[430px] lg:h-[465px] lg:overflow-visible">
        {/* Ground shadow */}

        <div
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 h-10 w-[58%] -translate-x-1/2 rounded-[50%] bg-black/10 blur-2xl sm:bottom-8"
        />

        {/* Photos */}

        <div
          className="absolute inset-0"
          style={{
            perspective:
              "1400px",
          }}
        >
          {photos.map(
            (
              photo,
              index
            ) => {
              const position =
                getRelativePosition(
                  index,
                  activeIndex,
                  photos.length
                );

              if (!position) {
                return null;
              }

              const desktopAnimation =
                getCardAnimation(
                  position
                );

              const mobileAnimation =
                getMobileAnimation(
                  position
                );

              const isCenter =
                position ===
                "center";

              return (
                <motion.div
                  key={photo._id}
                  initial={false}
                  animate={{
                    ...desktopAnimation,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 105,
                    damping: 18,
                    mass: 0.85,
                  }}
                  className={[
                    "absolute left-1/2 top-1/2",
                    "h-[245px] w-[170px]",
                    "-translate-x-1/2 -translate-y-1/2",
                    "overflow-hidden rounded-[1.35rem]",
                    "border-[6px] border-white",
                    "bg-white",
                    "shadow-[0_28px_65px_rgba(38,32,23,0.19)]",
                    "sm:h-[315px] sm:w-[220px]",
                    "md:h-[350px] md:w-[245px]",
                    "lg:h-[375px] lg:w-[260px]",
                    position ===
                      "far-left" ||
                    position ===
                      "far-right"
                      ? "hidden sm:block"
                      : "",
                  ].join(" ")}
                  style={{
                    zIndex:
                      desktopAnimation.zIndex,
                  }}
                  whileHover={
                    isCenter
                      ? {
                          y: "-53%",
                          scale: 1.025,
                        }
                      : undefined
                  }
                >
                  <Image
                    src={
                      photo.image
                    }
                    alt={`${alt} — photo ${
                      index + 1
                    }`}
                    fill
                    priority={
                      isCenter ||
                      index < 3
                    }
                    sizes="260px"
                    className="object-cover"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5"
                  />

                  {/* Photo number */}

                  <div
                    className={[
                      "absolute bottom-3 left-3",
                      "flex h-7 min-w-7 items-center justify-center",
                      "rounded-full px-2",
                      "text-[8px] font-black",
                      "backdrop-blur-md",
                      isCenter
                        ? "bg-black/65 text-white"
                        : "bg-white/75 text-black/55",
                    ].join(" ")}
                  >
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </div>

                  {/* Active indicator */}

                  {isCenter && (
                    <motion.div
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-2.5 py-1.5 text-[8px] font-black uppercase tracking-[0.12em] text-white backdrop-blur-md"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />

                      Featured
                    </motion.div>
                  )}
                </motion.div>
              );
            }
          )}
        </div>

        {/* ====================================================
            LEFT ARROW
            ==================================================== */}

        {photos.length > 1 && (
          <button
            type="button"
            onClick={previous}
            aria-label="Previous hero photo"
            className="absolute left-2 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/85 text-black shadow-lg backdrop-blur-md transition duration-300 hover:-translate-y-1/2 hover:bg-white sm:left-5 sm:h-12 sm:w-12 lg:-left-3"
          >
            <ChevronLeft
              size={19}
            />
          </button>
        )}

        {/* ====================================================
            RIGHT ARROW
            ==================================================== */}

        {photos.length > 1 && (
          <button
            type="button"
            onClick={next}
            aria-label="Next hero photo"
            className="absolute right-2 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/85 text-black shadow-lg backdrop-blur-md transition duration-300 hover:-translate-y-1/2 hover:bg-white sm:right-5 sm:h-12 sm:w-12 lg:-right-3"
          >
            <ChevronRight
              size={19}
            />
          </button>
        )}
      </div>

      {/* ======================================================
          CONTROLS
          ====================================================== */}

      {photos.length > 1 && (
        <div className="relative z-50 mt-2 flex flex-col items-center gap-4 sm:mt-0">
          {/* Dots */}

          <div className="flex items-center justify-center gap-1.5">
            {photos.map(
              (
                photo,
                index
              ) => {
                const active =
                  index ===
                  activeIndex;

                return (
                  <button
                    key={
                      photo._id
                    }
                    type="button"
                    onClick={() =>
                      goTo(
                        index,
                        index >
                          activeIndex
                          ? 1
                          : -1
                      )
                    }
                    aria-label={`Go to hero photo ${
                      index + 1
                    }`}
                    aria-current={
                      active
                        ? "true"
                        : undefined
                    }
                    className="group flex h-6 items-center justify-center"
                  >
                    <span
                      className={[
                        "block h-1.5 rounded-full transition-all duration-300",
                        active
                          ? "w-7 bg-[#c8102e]"
                          : "w-1.5 bg-black/20 group-hover:bg-black/40",
                      ].join(" ")}
                    />
                  </button>
                );
              }
            )}
          </div>

          {/* Counter */}

          <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.18em] text-black/35">
            <span>
              {String(
                activeIndex +
                  1
              ).padStart(
                2,
                "0"
              )}
            </span>

            <span className="h-px w-6 bg-black/15" />

            <span>
              {String(
                photos.length
              ).padStart(
                2,
                "0"
              )}
            </span>

            <span className="hidden sm:inline">
              {isPaused
                ? "Paused"
                : "Auto"}
            </span>
          </div>
        </div>
      )}

      {/* ======================================================
          SCREEN READER STATUS
          ====================================================== */}

      <div
        aria-live="polite"
        className="sr-only"
      >
        Hero photo{" "}
        {activeIndex + 1} of{" "}
        {photos.length}
      </div>
    </div>
  );
}
