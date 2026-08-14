"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import { apiFetch, responseJson } from "@/services/api";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
} from "lucide-react";

type Gallery = {
  _id: string;
  title: string;
  coverImage?: string;
  images?: string[];
  category?: string;
  description?: string;
  status?: string;
};

type GalleryPhoto = {
  id: string;
  src: string;
  title: string;
  category: string;
  galleryId: string;
};

const PAGE_SIZE = 12;

export default function PublicGallery() {
  const [galleries, setGalleries] = useState<
    Gallery[]
  >([]);

  const [category, setCategory] =
    useState("All");

  const [page, setPage] = useState(1);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [selectedIndex, setSelectedIndex] =
    useState<number | null>(null);

  /*
   * -------------------------------------------------------
   * FETCH GALLERY
   * -------------------------------------------------------
   */

  const loadGallery = useCallback(
    async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFetch("/gallery", {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        const data = await responseJson<any>(response);

        const galleryData =
          Array.isArray(data?.gallery)
            ? data.gallery
            : Array.isArray(data?.data)
              ? data.data
              : [];

        setGalleries(
          galleryData.filter(
            (item: Gallery) =>
              item.status !== "inactive"
          )
        );
      } catch (err) {
        console.error(
          "[Gallery] Failed to load gallery:",
          err
        );

        setGalleries([]);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load gallery."
        );
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  /*
   * -------------------------------------------------------
   * CATEGORIES
   * -------------------------------------------------------
   */

  const categories = useMemo(() => {
    const values = galleries
      .map(
        (gallery) =>
          gallery.category?.trim()
      )
      .filter(Boolean) as string[];

    return [
      "All",
      ...Array.from(
        new Set(values)
      ),
    ];
  }, [galleries]);

  /*
   * -------------------------------------------------------
   * NORMALIZE PHOTOS
   * -------------------------------------------------------
   *
   * Convert album/gallery data into a single
   * professional photo collection.
   */

  const photos = useMemo<GalleryPhoto[]>(
    () => {
      const result: GalleryPhoto[] = [];

      galleries
        .filter(
          (gallery) =>
            category === "All" ||
            gallery.category === category
        )
        .forEach((gallery) => {
          /*
           * Cover image first.
           */
          if (gallery.coverImage) {
            result.push({
              id: `${gallery._id}-cover`,
              src: gallery.coverImage,
              title:
                gallery.title ||
                "GNPC Gallery",
              category:
                gallery.category ||
                "Gallery",
              galleryId: gallery._id,
            });
          }

          /*
           * Remaining gallery images.
           */
          if (Array.isArray(gallery.images)) {
            gallery.images.forEach(
              (src, index) => {
                if (!src) return;

                result.push({
                  id: `${gallery._id}-${index}`,
                  src,
                  title:
                    gallery.title ||
                    "GNPC Gallery",
                  category:
                    gallery.category ||
                    "Gallery",
                  galleryId:
                    gallery._id,
                });
              }
            );
          }
        });

      /*
       * Remove duplicate image URLs.
       */
      return result.filter(
        (photo, index, array) =>
          array.findIndex(
            (item) =>
              item.src === photo.src
          ) === index
      );
    },
    [galleries, category]
  );

  /*
   * -------------------------------------------------------
   * PAGINATION
   * -------------------------------------------------------
   */

  const totalPages = Math.max(
    1,
    Math.ceil(
      photos.length / PAGE_SIZE
    )
  );

  const visiblePhotos = photos.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /*
   * -------------------------------------------------------
   * CATEGORY CHANGE
   * -------------------------------------------------------
   */

  const selectCategory = (
    value: string
  ) => {
    setCategory(value);
    setPage(1);
    setSelectedIndex(null);
  };

  /*
   * -------------------------------------------------------
   * LIGHTBOX
   * -------------------------------------------------------
   */

  const selectedPhoto =
    selectedIndex !== null
      ? photos[selectedIndex]
      : null;

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const showPrevious = () => {
    if (
      selectedIndex === null ||
      photos.length === 0
    ) {
      return;
    }

    setSelectedIndex(
      selectedIndex === 0
        ? photos.length - 1
        : selectedIndex - 1
    );
  };

  const showNext = () => {
    if (
      selectedIndex === null ||
      photos.length === 0
    ) {
      return;
    }

    setSelectedIndex(
      selectedIndex ===
        photos.length - 1
        ? 0
        : selectedIndex + 1
    );
  };

  /*
   * -------------------------------------------------------
   * KEYBOARD CONTROLS
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (selectedIndex === null) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        "";
    };
  }, [selectedIndex]);

  /*
   * -------------------------------------------------------
   * LOADING
   * -------------------------------------------------------
   */

  if (loading) {
    return (
      <section className="bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex gap-2 overflow-hidden">
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="h-9 w-20 shrink-0 animate-pulse rounded-full bg-slate-100"
                />
              )
            )}
          </div>

          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {Array.from({
              length: 8,
            }).map((_, index) => (
              <div
                key={index}
                className="mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-slate-100"
              >
                <div
                  className={`animate-pulse ${
                    index % 3 === 0
                      ? "h-80"
                      : index % 3 === 1
                        ? "h-64"
                        : "h-72"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /*
   * -------------------------------------------------------
   * ERROR
   * -------------------------------------------------------
   */

  if (error) {
    return (
      <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-lg font-bold text-slate-900">
            Gallery unavailable
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {error}
          </p>

          <button
            type="button"
            onClick={loadGallery}
            className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* =====================================================
          PHOTO GALLERY
          ===================================================== */}

      <section className="bg-white px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          {/* =================================================
              FILTERS
              ================================================= */}

          {categories.length > 1 && (
            <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide sm:mb-10 sm:flex-wrap sm:overflow-visible">
              {categories.map(
                (item) => {
                  const active =
                    category === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        selectCategory(
                          item
                        )
                      }
                      className={[
                        "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
                        active
                          ? "bg-slate-900 text-white shadow-sm"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900",
                      ].join(" ")}
                    >
                      {item}
                    </button>
                  );
                }
              )}
            </div>
          )}

          {/* =================================================
              EMPTY STATE
              ================================================= */}

          {visiblePhotos.length === 0 ? (
            <div className="flex min-h-[280px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                  <ZoomIn
                    size={22}
                    className="text-slate-400"
                  />
                </div>

                <h2 className="mt-5 text-lg font-bold text-slate-900">
                  No photos available
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Photos from this category
                  will appear here when
                  published.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* =================================================
                  MASONRY PHOTO GRID
                  ================================================= */}

              <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
                {visiblePhotos.map(
                  (photo, index) => {
                    const globalIndex =
                      (page - 1) *
                        PAGE_SIZE +
                      index;

                    return (
                      <button
                        key={photo.id}
                        type="button"
                        onClick={() =>
                          setSelectedIndex(
                            globalIndex
                          )
                        }
                        className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-slate-100 text-left outline-none ring-offset-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-slate-900"
                      >
                        <div className="relative overflow-hidden">
                          <Image
                            src={photo.src}
                            alt={photo.title}
                            width={900}
                            height={700}
                            className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                            sizes="
                              (max-width: 640px) 100vw,
                              (max-width: 1024px) 50vw,
                              (max-width: 1280px) 33vw,
                              25vw
                            "
                            priority={
                              index < 4
                            }
                          />

                          {/* Subtle overlay */}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                          {/* Zoom indicator */}

                          <div className="absolute right-4 top-4 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white/90 text-slate-900 opacity-0 shadow-lg backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <ZoomIn
                              size={17}
                              aria-hidden="true"
                            />
                          </div>

                          {/* Photo information */}

                          <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <span className="inline-flex max-w-full rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-700 backdrop-blur">
                              {photo.category}
                            </span>

                            <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-white">
                              {photo.title}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>

              {/* =================================================
                  PAGINATION
                  ================================================= */}

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2 sm:mt-12">
                  <button
                    type="button"
                    disabled={
                      page === 1
                    }
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.max(
                            1,
                            current - 1
                          )
                      )
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft
                      size={18}
                    />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({
                      length: totalPages,
                    }).map(
                      (_, index) => {
                        const pageNumber =
                          index + 1;

                        /*
                         * Keep large pagination
                         * sets compact.
                         */
                        if (
                          totalPages >
                            7 &&
                          pageNumber !== 1 &&
                          pageNumber !==
                            totalPages &&
                          Math.abs(
                            pageNumber -
                              page
                          ) > 1
                        ) {
                          if (
                            pageNumber ===
                            2 ||
                            pageNumber ===
                            totalPages -
                              1
                          ) {
                            return (
                              <span
                                key={
                                  pageNumber
                                }
                                className="px-1 text-slate-400"
                              >
                                …
                              </span>
                            );
                          }

                          return null;
                        }

                        return (
                          <button
                            key={
                              pageNumber
                            }
                            type="button"
                            onClick={() =>
                              setPage(
                                pageNumber
                              )
                            }
                            className={[
                              "h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition",
                              page ===
                              pageNumber
                                ? "bg-slate-900 text-white"
                                : "text-slate-600 hover:bg-slate-100",
                            ].join(
                              " "
                            )}
                          >
                            {
                              pageNumber
                            }
                          </button>
                        );
                      }
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={
                      page ===
                      totalPages
                    }
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.min(
                            totalPages,
                            current + 1
                          )
                      )
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight
                      size={18}
                    />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* =====================================================
          LIGHTBOX
          ===================================================== */}

      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm sm:p-8"
          onClick={closeLightbox}
        >
          {/* Close */}

          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close photo viewer"
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6 sm:top-6"
          >
            <X size={22} />
          </button>

          {/* Previous */}

          {photos.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6 sm:h-12 sm:w-12"
            >
              <ChevronLeft
                size={24}
              />
            </button>
          )}

          {/* Image */}

          <div
            className="relative flex max-h-[90vh] max-w-[90vw] items-center justify-center"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <Image
              src={selectedPhoto.src}
              alt={selectedPhoto.title}
              width={1600}
              height={1200}
              className="max-h-[82vh] w-auto max-w-[88vw] rounded-lg object-contain shadow-2xl sm:max-h-[86vh]"
              sizes="90vw"
              priority
            />

            {/* Caption */}

            <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-gradient-to-t from-black/80 to-transparent px-5 pb-4 pt-12 text-white">
              <p className="text-sm font-semibold sm:text-base">
                {selectedPhoto.title}
              </p>

              {selectedPhoto.category && (
                <p className="mt-1 text-xs text-white/70 sm:text-sm">
                  {selectedPhoto.category}
                </p>
              )}
            </div>
          </div>

          {/* Next */}

          {photos.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6 sm:h-12 sm:w-12"
            >
              <ChevronRight
                size={24}
              />
            </button>
          )}

          {/* Counter */}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
            {(selectedIndex ?? 0) + 1}{" "}
            / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
