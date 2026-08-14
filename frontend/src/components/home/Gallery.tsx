"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  ImageOff,
} from "lucide-react";

import {
  apiFetch,
  responseJson,
} from "@/services/api";

type GalleryItem = {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  image?: string;
  imageUrl?: string;
  url?: string;
  category?: string;
  description?: string;
};

type GalleryResponse = {
  success?: boolean;
  data?: GalleryItem[];
};

export default function Gallery() {
  const [
    items,
    setItems,
  ] = useState<GalleryItem[]>(
    []
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response =
          await apiFetch(
            "/gallery"
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

        setItems(
          Array.isArray(
            payload.data
          )
            ? payload.data.slice(
                0,
                6
              )
            : []
        );
      } catch {
        if (
          !cancelled
        ) {
          setItems([]);
        }
      } finally {
        if (
          !cancelled
        ) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="gnpc-eyebrow">
              GALLERY
            </p>

            <h2 className="gnpc-section-title mt-3 text-3xl sm:text-4xl">
              Moments from GNPC
            </h2>

            <p className="gnpc-section-description">
              Explore recent events,
              press activities and
              memorable moments.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-700 px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-700 hover:text-white"
          >
            View Gallery

            <ArrowRight
              size={17}
            />
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-200"
                />
              )
            )}
          </div>
        ) : items.length ===
          0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <ImageOff
              className="mx-auto text-slate-400"
              size={38}
            />

            <p className="mt-4 font-semibold text-slate-700">
              No gallery images available
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {items.map(
              (item, index) => {
                const src =
                  item.image ||
                  item.imageUrl ||
                  item.url;

                if (!src) {
                  return (
                    <div
                      key={
                        item._id ||
                        item.id ||
                        index
                      }
                      className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-slate-100"
                    >
                      <ImageOff
                        className="text-slate-400"
                        size={32}
                      />
                    </div>
                  );
                }

                return (
                  <Link
                    key={
                      item._id ||
                      item.id ||
                      index
                    }
                    href="/gallery"
                    className="group relative min-w-0 overflow-hidden rounded-2xl bg-slate-100"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={src}
                        alt={
                          item.title ||
                          item.name ||
                          "GNPC Gallery"
                        }
                        fill
                        sizes="(min-width: 640px) 33vw, 50vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="line-clamp-2 text-sm font-semibold text-white sm:text-base">
                          {item.title ||
                            item.name ||
                            item.category ||
                            "GNPC Gallery"}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        )}
      </div>
    </section>
  );
}
