"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Images,
  X,
  ZoomIn,
} from "lucide-react";
import { apiFetch, responseJson } from "@/services/api";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import { mergePageSettings } from "@/types/pageSettings";

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
};

type GalleryCategory = {
  slug: string;
  name: string;
  albums: number;
  photoCount: number;
  coverImage?: string;
  description?: string;
};

function slugifyCategory(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "uncategorized";
}

function getAlbumImages(gallery: Gallery) {
  return Array.from(
    new Set(
      [gallery.coverImage, ...(gallery.images || [])].filter(
        (src): src is string => typeof src === "string" && src.trim().length > 0
      )
    )
  );
}

function CategoryCard({ category }: { category: GalleryCategory }) {
  return (
    <Link
      href={"/gallery/category/" + encodeURIComponent(category.slug)}
      aria-label={"Open " + category.name + " photo category"}
      className="group block overflow-hidden rounded-2xl border border-[#e3e8ee] bg-white text-left shadow-[0_8px_24px_rgba(7,26,46,0.045)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45c]/60 hover:shadow-[0_18px_36px_rgba(7,26,46,0.10)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a45c]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#e9eef3]">
        {category.coverImage ? (
          <Image
            src={category.coverImage}
            alt={category.name + " gallery"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.045]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#aab5c0]">
            <Images size={38} strokeWidth={1.25} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#071a2e]/85 via-[#071a2e]/10 to-transparent" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-[#071a2e]/40 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-white backdrop-blur-sm">
          <FolderOpen size={12} aria-hidden="true" />
          {category.albums} {category.albums === 1 ? "album" : "albums"}
        </span>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
          <div className="min-w-0">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-white sm:text-[1.7rem]">
              {category.name}
            </h2>
            <p className="mt-1 text-xs font-medium text-white/75">
              {category.photoCount} {category.photoCount === 1 ? "photograph" : "photographs"}
            </p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white transition-all duration-300 group-hover:border-[#d4b06a] group-hover:bg-[#d4b06a] group-hover:text-[#071a2e]">
            <ArrowRight size={16} aria-hidden="true" />
          </span>
        </div>
      </div>
      {category.description && (
        <p className="line-clamp-2 min-h-[3.25rem] px-5 py-3 text-xs leading-5 text-[#687789]">
          {category.description}
        </p>
      )}
    </Link>
  );
}

export default function PublicGallery({
  categorySlug,
}: {
  categorySlug?: string;
}) {
  const { settings: websiteSettings } = useWebsiteSettings();
  const settings = mergePageSettings(websiteSettings.pageSettings).gallery;

  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const pageSize = Math.max(1, Math.min(100, Number(settings.pageSize) || 12));

  const loadGallery = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch("/gallery", {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      const data = await responseJson<any>(response);
      const items = Array.isArray(data?.gallery)
        ? data.gallery
        : Array.isArray(data?.data)
          ? data.data
          : [];

      setGalleries(items.filter((item: Gallery) => item && item.status !== "inactive"));
    } catch (requestError) {
      console.error("[Gallery] Failed to load gallery:", requestError);
      setGalleries([]);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load gallery."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGallery();
  }, [loadGallery]);

  useEffect(() => {
    setPage(1);
    setSelectedIndex(null);
  }, [categorySlug]);

  const categories = useMemo<GalleryCategory[]>(() => {
    const grouped = new Map<string, {
      name: string;
      albums: Gallery[];
      images: Set<string>;
      coverImage?: string;
      description?: string;
    }>();

    galleries.forEach((gallery) => {
      const name = gallery.category?.trim() || "Uncategorized";
      const slug = slugifyCategory(name);
      const images = getAlbumImages(gallery);
      const current = grouped.get(slug);

      if (current) {
        current.albums.push(gallery);
        images.forEach((src) => current.images.add(src));
        if (!current.coverImage && images[0]) {
          current.coverImage = images[0];
        }
        if (!current.description && gallery.description?.trim()) {
          current.description = gallery.description.trim();
        }
      } else {
        grouped.set(slug, {
          name,
          albums: [gallery],
          images: new Set(images),
          coverImage: images[0],
          description: gallery.description?.trim() || undefined,
        });
      }
    });

    return Array.from(grouped.entries())
      .map(([slug, group]) => ({
        slug,
        name: group.name,
        albums: group.albums.length,
        photoCount: group.images.size,
        coverImage: group.coverImage,
        description: group.description,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [galleries]);

  const selectedCategory = categories.find((item) => item.slug === categorySlug);

  const photos = useMemo<GalleryPhoto[]>(() => {
    if (!categorySlug) return [];

    const matchingAlbums = galleries.filter(
      (gallery) => slugifyCategory(gallery.category?.trim() || "Uncategorized") === categorySlug
    );
    const result: GalleryPhoto[] = [];

    matchingAlbums.forEach((gallery) => {
      getAlbumImages(gallery).forEach((src, index) => {
        result.push({
          id: gallery._id + "-" + index,
          src,
          title: gallery.title || "GNPC Gallery",
          category: gallery.category?.trim() || "Uncategorized",
        });
      });
    });

    return result.filter(
      (photo, index, all) =>
        all.findIndex((item) => item.src === photo.src) === index
    );
  }, [galleries, categorySlug]);

  const totalPages = Math.max(1, Math.ceil(photos.length / pageSize));
  const visiblePhotos = photos.slice((page - 1) * pageSize, page * pageSize);
  const selectedPhoto = selectedIndex === null ? null : photos[selectedIndex];

  const showPrevious = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null || photos.length === 0) return current;
      return current === 0 ? photos.length - 1 : current - 1;
    });
  }, [photos.length]);

  const showNext = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null || photos.length === 0) return current;
      return current === photos.length - 1 ? 0 : current + 1;
    });
  }, [photos.length]);

  const closeLightbox = useCallback(() => setSelectedIndex(null), []);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedIndex, closeLightbox, showPrevious, showNext]);

  if (loading) {
    return (
      <section className="bg-[#f8fafc] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 h-8 w-52 animate-pulse rounded bg-slate-100" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="aspect-[16/10] animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-[#f8fafc] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-lg font-bold text-slate-900">Gallery unavailable</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p>
          <button
            type="button"
            onClick={loadGallery}
            className="mt-5 rounded-lg bg-[#d4b06a] px-5 py-2.5 text-sm font-semibold text-[#071a2e] transition hover:bg-[#e2c27d]"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (!categorySlug) {
    return (
      <section className="bg-[#f8fafc] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:mb-10 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a1844e]">
                Browse Collections
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#14243a] sm:text-4xl">
                Explore by Category
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#687789]">
                Choose a collection to explore its albums and photographs.
              </p>
            </div>
            <p className="text-xs font-medium text-[#7a8795]">
              {categories.length} {categories.length === 1 ? "category" : "categories"}
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#d9e0e8] bg-white px-6 text-center">
              <Images size={38} strokeWidth={1.3} className="text-[#aab5c0]" />
              <h3 className="mt-4 text-lg font-semibold text-[#172333]">No photo collections yet</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#7b8794]">
                Published gallery albums will appear here, organized by their CMS category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  if (!selectedCategory) {
    return (
      <section className="bg-[#f8fafc] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#e3e8ee] bg-white px-6 py-12 text-center">
          <FolderOpen size={38} strokeWidth={1.3} className="mx-auto text-[#aab5c0]" />
          <h1 className="mt-4 font-serif text-2xl font-semibold text-[#14243a]">Category not found</h1>
          <p className="mt-2 text-sm text-[#687789]">
            This gallery category may have been removed or is no longer published.
          </p>
          <Link
            href="/gallery"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#d4b06a] px-4 py-2.5 text-sm font-semibold text-[#071a2e] transition hover:bg-[#e2c27d]"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back to all categories
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-[#f8fafc] px-4 pb-8 pt-8 sm:px-6 sm:pb-10 sm:pt-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#687789] transition-colors hover:text-[#9a7942] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a45c]"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            All categories
          </Link>
          <div className="mt-6 flex flex-col justify-between gap-3 border-b border-[#e1e7ed] pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a1844e]">
                Photo Collection
              </p>
              <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#14243a] sm:text-4xl">
                {selectedCategory.name}
              </h1>
              {selectedCategory.description && (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#687789]">
                  {selectedCategory.description}
                </p>
              )}
            </div>
            <p className="text-xs font-medium text-[#7a8795]">
              {selectedCategory.albums} {selectedCategory.albums === 1 ? "album" : "albums"}
              <span className="mx-2 text-[#c5cdd6]">•</span>
              {photos.length} {photos.length === 1 ? "photo" : "photos"}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {photos.length === 0 ? (
            <div className="flex min-h-[250px] items-center justify-center rounded-2xl border border-dashed border-[#d9e0e8] bg-white px-6 text-center">
              <div>
                <Images size={34} strokeWidth={1.3} className="mx-auto text-[#aab5c0]" />
                <h2 className="mt-4 text-lg font-semibold text-[#172333]">No photos in this category</h2>
                <p className="mt-2 text-sm text-[#7b8794]">
                  Published photographs from this collection will appear here.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visiblePhotos.map((photo, index) => {
                  const globalIndex = (page - 1) * pageSize + index;
                  return (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => setSelectedIndex(globalIndex)}
                      aria-label={"View photo: " + photo.title}
                      className="group relative block w-full overflow-hidden rounded-xl border border-[#e2e7ed] bg-white text-left outline-none transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d4b06a]/60 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#d4b06a] focus-visible:ring-offset-4"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#e9eef3]">
                        <Image
                          src={photo.src}
                          alt={photo.title + " — " + photo.category}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                          priority={index < 4}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#071a2e]/75 via-transparent to-transparent opacity-80" />
                        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#172333] opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                          <ZoomIn size={16} aria-hidden="true" />
                        </span>
                        <div className="absolute inset-x-0 bottom-0 p-4">
                          <p className="line-clamp-1 text-sm font-semibold text-white">{photo.title}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {settings.showPagination !== false && totalPages > 1 && (
                <nav aria-label="Gallery pages" className="mt-9 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    aria-label="Previous page"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#dfe5eb] bg-white text-[#526274] transition hover:bg-[#f2f5f8] disabled:pointer-events-none disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="min-w-20 text-center text-xs font-semibold text-[#687789]">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    aria-label="Next page"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#dfe5eb] bg-white text-[#526274] transition hover:bg-[#f2f5f8] disabled:pointer-events-none disabled:opacity-40"
                  >
                    <ChevronRight size={18} />
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm sm:p-8"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close photo viewer"
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6 sm:top-6"
          >
            <X size={22} />
          </button>

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
              <ChevronLeft size={24} />
            </button>
          )}

          <div
            className="relative flex max-h-[90vh] max-w-[90vw] items-center justify-center"
            onClick={(event) => event.stopPropagation()}
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
            <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-gradient-to-t from-black/80 to-transparent px-5 pb-4 pt-12 text-white">
              <p className="text-sm font-semibold sm:text-base">{selectedPhoto.title}</p>
              <p className="mt-1 text-xs text-white/70 sm:text-sm">{selectedPhoto.category}</p>
            </div>
          </div>

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
              <ChevronRight size={24} />
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
            {(selectedIndex ?? 0) + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
