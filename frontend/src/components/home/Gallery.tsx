"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowRight,
  ImageOff,
  Images,
  Sparkles,
} from "lucide-react";
import {
  motion,
  type Variants,
} from "framer-motion";

import {
  apiFetch,
  responseJson,
} from "@/services/api";

import Button from "@/components/ui/Button";

import {
  mergeHomeSettings,
} from "@/types/homeSettings";

import {
  useWebsiteSettings,
} from "@/context/WebsiteSettingsContext";

type GalleryItem = {
  _id?: string;
  id?: string;

  title?: string;
  name?: string;

  image?: string;
  imageUrl?: string;
  url?: string;
  coverImage?: string;
  images?: string[];

  category?: string;
  description?: string;
};

type GalleryResponse = {
  success?: boolean;
  data?: GalleryItem[];
  gallery?: GalleryItem[];
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.6,
      ease: [
        0.22,
        1,
        0.36,
        1,
      ],
    },
  },
};

function getImageSrc(
  item: GalleryItem
) {
  return (
    item.image ||
    item.imageUrl ||
    item.url ||
    item.coverImage ||
    (Array.isArray(item.images) ? item.images[0] : "") ||
    ""
  );
}

function getTitle(
  item: GalleryItem
) {
  return (
    item.title ||
    item.name ||
    item.category ||
    "GNPC Gallery"
  );
}

function GalleryPlaceholder({
  large = false,
}: {
  large?: boolean;
}) {
  return (
    <div
      className={[
        "flex h-full w-full items-center justify-center bg-[#ded0bb]",
        large
          ? "min-h-[320px]"
          : "",
      ].join(" ")}
    >
      <Images
        size={
          large
            ? 50
            : 34
        }
        strokeWidth={
          1.3
        }
        className="text-black/20"
      />
    </div>
  );
}

function GalleryCard({
  item,
  index,
  large = false,
}: {
  item: GalleryItem;
  index: number;
  large?: boolean;
}) {
  const src =
    getImageSrc(item);

  const title =
    getTitle(item);

  return (
    <motion.article
      variants={itemVariants}
      className={[
        "group relative overflow-hidden rounded-[2rem] border border-black/10 bg-white/60 p-1 shadow-[0_18px_50px_rgba(38,32,23,0.08)] backdrop-blur-md",
        "transition duration-300 hover:-translate-y-1 hover:bg-white",
        large
          ? "min-h-[480px] sm:min-h-[560px]"
          : "min-h-[220px] sm:min-h-[260px]",
      ].join(" ")}
    >
      <Link
        href="/gallery"
        aria-label={`Open gallery: ${title}`}
        className="absolute inset-0 z-30"
      />

      <div className="relative h-full overflow-hidden rounded-[1.75rem]">
        {src ? (
          <Image
            src={src}
            alt={title}
            fill
            sizes={
              large
                ? "(min-width: 1024px) 58vw, 100vw"
                : "(min-width: 768px) 30vw, 50vw"
            }
            className="object-cover transition duration-700 group-hover:scale-[1.045]"
          />
        ) : (
          <GalleryPlaceholder
            large={large}
          />
        )}

        {/* Image overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

        {/* Number */}

        <div className="absolute left-4 top-4 z-10 flex h-8 min-w-8 items-center justify-center rounded-full border border-white/20 bg-black/35 px-2.5 text-[8px] font-black tracking-[0.15em] text-white backdrop-blur-md">
          {String(
            index + 1
          ).padStart(2, "0")}
        </div>

        {/* Content */}

        <div className="absolute bottom-0 left-0 right-0 z-10 p-5 sm:p-6">
          {item.category && (
            <div className="mb-2 text-[9px] font-black uppercase tracking-[0.15em] text-white/55">
              {item.category}
            </div>
          )}

          <h3
            className={[
              "font-black leading-[1.05] tracking-[-0.035em] text-white",
              large
                ? "text-2xl sm:text-3xl"
                : "text-lg sm:text-xl",
            ].join(" ")}
          >
            {title}
          </h3>

          {item.description && (
            <p className="mt-2 line-clamp-2 max-w-[550px] text-xs leading-5 text-white/55 sm:text-sm sm:leading-6">
              {item.description}
            </p>
          )}

          <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">
            Explore Gallery

            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Gallery() {
  const {
    settings,
  } = useWebsiteSettings();

  const home =
    mergeHomeSettings(
      settings.home
    );

  const section =
    home.gallery;

  const [
    items,
    setItems,
  ] = useState<
    GalleryItem[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  /*
   * ==========================================================
   * LIVE GALLERY DATA
   * ==========================================================
   */

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await apiFetch(
            "/gallery",
            {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
              cache: "no-store",
            }
          );

        const payload =
          await responseJson<GalleryResponse>(
            response
          );

        if (
          cancelled
        ) {
          return;
        }

        const data =
          Array.isArray(payload.gallery)
            ? payload.gallery
            : Array.isArray(payload.data)
              ? payload.data
              : [];

        setItems(
          data.filter(
            (item) => item && item.status !== "inactive"
          )
        );
      } catch (
        requestError
      ) {
        if (
          cancelled
        ) {
          return;
        }

        setItems([]);

        setError(
          requestError instanceof
            Error
            ? requestError.message
            : "Unable to load gallery."
        );
      } finally {
        if (
          !cancelled
        ) {
          setLoading(
            false
          );
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * ==========================================================
   * CMS DISPLAY COUNT
   * ==========================================================
   */

  const displayCount =
    Math.max(
      1,
      section.displayCount ||
        3
    );

  const visibleItems =
    useMemo(
      () =>
        items.slice(
          0,
          displayCount
        ),
      [
        displayCount,
        items,
      ]
    );

  return (
    <section
      id="gallery"
      className="relative overflow-hidden bg-[#f4ede2] py-16 text-[#171717] sm:py-24 lg:py-28"
    >
      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -right-40 top-0 h-[30rem] w-[30rem] rounded-full bg-white/70 blur-3xl" />

        <div className="absolute -left-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-[#d8c7af]/30 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(23,23,23,0.14) 1px, transparent 1px)",
            backgroundSize:
              "24px 24px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* ===================================================
            CMS HEADER
            =================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 22,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.7,
          }}
          className="gnpc-section-heading mx-auto max-w-[900px] text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-black/20 sm:w-12" />

            <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-black/45 sm:text-[10px]">
              <Sparkles
                size={11}
              />

              {section.eyebrow ||
                "Gallery"}
            </span>

            <span className="h-px w-8 bg-black/20 sm:w-12" />
          </div>

          <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-[4.5rem]">
            {section.title}
          </h2>

          {section.description && (
            <p className="mx-auto mt-5 max-w-[700px] text-sm leading-6 text-black/50 sm:text-base sm:leading-7">
              {section.description}
            </p>
          )}
        </motion.div>

        {/* ===================================================
            LOADING
            =================================================== */}

        {loading && (
          <div className="mt-12 grid gap-4 sm:mt-16 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="min-h-[440px] animate-pulse rounded-[2rem] bg-black/5 sm:min-h-[520px]" />

            <div className="grid gap-4">
              <div className="min-h-[220px] animate-pulse rounded-[2rem] bg-black/5" />

              <div className="min-h-[220px] animate-pulse rounded-[2rem] bg-black/5" />
            </div>
          </div>
        )}

        {/* ===================================================
            ERROR
            =================================================== */}

        {!loading &&
          error && (
            <div
              role="status"
              className="mx-auto mt-12 max-w-2xl rounded-[2rem] border border-red-200 bg-red-50 px-6 py-12 text-center"
            >
              <ImageOff
                size={40}
                className="mx-auto text-red-300"
              />

              <p className="mt-4 text-sm font-semibold text-red-700">
                {error}
              </p>
            </div>
          )}

        {/* ===================================================
            EMPTY
            =================================================== */}

        {!loading &&
          !error &&
          visibleItems.length ===
            0 && (
            <div className="mx-auto mt-12 max-w-2xl rounded-[2rem] border border-dashed border-black/15 bg-white/45 px-6 py-14 text-center">
              <Images
                size={40}
                className="mx-auto text-black/20"
              />

              <h3 className="mt-5 text-xl font-black tracking-[-0.03em]">
                No gallery images
              </h3>

              <p className="mt-2 text-sm leading-6 text-black/45">
                Gallery images added
                through the Gallery CMS
                will appear here.
              </p>
            </div>
          )}

        {/* ===================================================
            GALLERY GRID
            =================================================== */}

        {!loading &&
          !error &&
          visibleItems.length >
            0 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.12,
              }}
              variants={{
                hidden: {},

                visible: {
                  transition: {
                    staggerChildren:
                      0.08,
                  },
                },
              }}
              className="mt-12 grid gap-4 sm:mt-16 lg:grid-cols-[1.4fr_0.6fr]"
            >
              {/* ===========================================
                  FEATURED IMAGE
                  =========================================== */}

              {visibleItems[0] && (
                <GalleryCard
                  item={
                    visibleItems[0]
                  }
                  index={0}
                  large
                />
              )}

              {/* ===========================================
                  SUPPORTING IMAGES
                  =========================================== */}

              <div className="grid gap-4">
                {visibleItems
                  .slice(1)
                  .map(
                    (
                      item,
                      index
                    ) => (
                      <GalleryCard
                        key={
                          item._id ||
                          item.id ||
                          index
                        }
                        item={
                          item
                        }
                        index={
                          index + 1
                        }
                      />
                    )
                  )}

                {/* Empty visual space when only one item */}

                {visibleItems.length ===
                  1 && (
                  <div className="hidden min-h-[220px] rounded-[2rem] border border-black/10 bg-white/35 lg:flex lg:items-center lg:justify-center">
                    <div className="text-center">
                      <Images
                        size={32}
                        className="mx-auto text-black/15"
                      />

                      <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-black/25">
                        More moments
                        coming soon
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        {/* ===================================================
            BOTTOM CMS CTA
            =================================================== */}

        {section.buttonLabel && (
          <motion.div
            initial={{
              opacity: 0,
              y: 16,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.4,
            }}
            transition={{
              duration: 0.6,
            }}
            className="mt-10 flex justify-center sm:mt-12"
          >
            <Button
              href={
                section.buttonHref ||
                "/gallery"
              }
              variant="outline"
              size="lg"
              className="group rounded-full border-black/15 bg-white/60"
            >
              {section.buttonLabel}

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
