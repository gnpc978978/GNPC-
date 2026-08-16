"use client";

import Image from "next/image";
import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Trash2,
  Upload,
  Images,
} from "lucide-react";
import { toast } from "sonner";

import {
  createBanners,
  deleteBanner,
  getBanners,
  reorderBanners,
  updateBanner,
} from "@/services/bannerService";

import type { Banner } from "@/types/banner";

export default function BannerManager() {
  const [banners, setBanners] =
    useState<Banner[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const loadBanners = async () => {
    try {
      setLoading(true);

      const data =
        await getBanners();

      setBanners(
        [...data].sort(
          (a, b) =>
            (a.order ?? 0) -
            (b.order ?? 0)
        )
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load hero photos."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        void loadBanners();
      }, 0);

    return () =>
      window.clearTimeout(timer);
  }, []);

  /*
   * ============================================================
   * UPLOAD MULTIPLE HERO PHOTOS
   * ============================================================
   */

  const upload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      event.target.files ?? []
    );

    event.target.value = "";

    if (!files.length) {
      return;
    }

    if (files.length > 10) {
      toast.error(
        "You can upload a maximum of 10 photos at once."
      );

      return;
    }

    try {
      setSaving(true);

      const response =
        await createBanners(files);

      setBanners((current) =>
        [
          ...current,
          ...response.data,
        ].sort(
          (a, b) =>
            (a.order ?? 0) -
            (b.order ?? 0)
        )
      );

      toast.success(
        `${files.length} hero photo${
          files.length === 1
            ? ""
            : "s"
        } uploaded successfully.`
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to upload hero photos."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * ============================================================
   * REPLACE
   * ============================================================
   */

  const replace = async (
    banner: Banner,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const image =
      event.target.files?.[0];

    event.target.value = "";

    if (!image) {
      return;
    }

    try {
      setSaving(true);

      const response =
        await updateBanner(
          banner._id,
          {
            image,
          }
        );

      setBanners((current) =>
        current.map((item) =>
          item._id ===
          banner._id
            ? response.data
            : item
        )
      );

      toast.success(
        "Hero photo replaced."
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to replace hero photo."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * ============================================================
   * TOGGLE ACTIVE
   * ============================================================
   */

  const toggleActive = async (
    banner: Banner
  ) => {
    try {
      setSaving(true);

      const response =
        await updateBanner(
          banner._id,
          {
            active:
              !banner.active,
          }
        );

      setBanners((current) =>
        current.map((item) =>
          item._id ===
          banner._id
            ? response.data
            : item
        )
      );

      toast.success(
        response.data.active
          ? "Hero photo activated."
          : "Hero photo hidden."
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update hero photo."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * ============================================================
   * DELETE
   * ============================================================
   */

  const remove = async (
    banner: Banner
  ) => {
    if (
      !window.confirm(
        "Delete this hero photo? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      setSaving(true);

      await deleteBanner(
        banner._id
      );

      setBanners((current) =>
        current.filter(
          (item) =>
            item._id !==
            banner._id
        )
      );

      toast.success(
        "Hero photo deleted."
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete hero photo."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * ============================================================
   * MOVE
   * ============================================================
   */

  const move = (
    index: number,
    direction: -1 | 1
  ) => {
    const nextIndex =
      index + direction;

    if (
      nextIndex < 0 ||
      nextIndex >=
        banners.length
    ) {
      return;
    }

    setBanners((current) => {
      const next = [
        ...current,
      ];

      [
        next[index],
        next[nextIndex],
      ] = [
        next[nextIndex],
        next[index],
      ];

      return next;
    });
  };

  /*
   * ============================================================
   * SAVE ORDER
   * ============================================================
   */

  const saveOrder = async () => {
    try {
      setSaving(true);

      const response =
        await reorderBanners(
          banners
        );

      setBanners(
        response.data
      );

      toast.success(
        "Hero photo order saved."
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save hero photo order."
      );
    } finally {
      setSaving(false);
    }
  };

  const activeCount =
    banners.filter(
      (banner) =>
        banner.active
    ).length;

  return (
    <section className="space-y-7 rounded-3xl bg-white p-5 shadow-sm sm:p-7">
      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="rounded-3xl border border-[#e5ddd1] bg-[#f7f1e7] p-5 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#171717] text-white">
                <Images size={20} />
              </span>

              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  Hero Photos
                </h1>

                <p className="mt-1 text-sm text-slate-600">
                  Manage the photos displayed in
                  the homepage hero.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-black/5 bg-white/70 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Total Photos
                </p>

                <p className="mt-1 text-2xl font-black text-slate-900">
                  {banners.length}
                </p>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white/70 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Active
                </p>

                <p className="mt-1 text-2xl font-black text-slate-900">
                  {activeCount}
                </p>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white/70 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Recommended
                </p>

                <p className="mt-1 text-sm font-black text-slate-900">
                  7–9 photos
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#171717] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#292929]">
              <Upload size={17} />

              Add Hero Photos

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={upload}
                disabled={saving}
              />
            </label>

            <button
              type="button"
              onClick={() =>
                void saveOrder()
              }
              disabled={
                saving ||
                banners.length < 2
              }
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save Photo Order
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-black/5 bg-white/60 p-4">
          <p className="text-sm font-bold text-slate-900">
            Recommended setup
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Upload 7–9 landscape or portrait
            photos for the full layered hero
            effect. The first 9 active photos are
            displayed on the public homepage.
            You can upload up to 10 photos at a
            time.
          </p>
        </div>
      </div>

      {/* ======================================================
          LOADING
          ====================================================== */}

      {loading ? (
        <div className="flex justify-center py-20 text-slate-500">
          <Loader2
            className="animate-spin"
            size={28}
          />
        </div>
      ) : banners.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
            <Images size={24} />
          </div>

          <h2 className="mt-5 text-lg font-black text-slate-900">
            No hero photos yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Upload several photos to create the
            layered homepage hero shown in the new
            design.
          </p>
        </div>
      ) : (
        /* ====================================================
           PHOTO GRID
           ==================================================== */

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {banners.map(
            (banner, index) => (
              <article
                key={banner._id}
                className={[
                  "overflow-hidden rounded-3xl border bg-white transition-all duration-300",
                  banner.active
                    ? "border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-xl"
                    : "border-slate-200 opacity-60",
                ].join(" ")}
              >
                {/* IMAGE */}

                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <Image
                    src={
                      banner.image
                    }
                    alt={`Homepage hero photo ${
                      index + 1
                    }`}
                    fill
                    sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />

                  {/* ORDER */}

                  <div className="absolute left-3 top-3 flex h-9 min-w-9 items-center justify-center rounded-full bg-black/70 px-3 text-xs font-black text-white backdrop-blur-md">
                    {String(
                      index + 1
                    ).padStart(2, "0")}
                  </div>

                  {/* STATUS */}

                  <div
                    className={[
                      "absolute right-3 top-3 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] backdrop-blur-md",
                      banner.active
                        ? "bg-emerald-500/90 text-white"
                        : "bg-black/60 text-white",
                    ].join(" ")}
                  >
                    {banner.active
                      ? "Active"
                      : "Hidden"}
                  </div>
                </div>

                {/* CONTROLS */}

                <div className="space-y-4 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-slate-900">
                        Hero Photo{" "}
                        {index + 1}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Position{" "}
                        {index + 1}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        void toggleActive(
                          banner
                        )
                      }
                      disabled={saving}
                      className={[
                        "rounded-full px-3 py-1.5 text-xs font-bold transition",
                        banner.active
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                      ].join(" ")}
                    >
                      {banner.active
                        ? "Hide"
                        : "Show"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* REPLACE */}

                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
                      <Upload size={14} />

                      Replace

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(
                          event
                        ) =>
                          void replace(
                            banner,
                            event
                          )
                        }
                        disabled={
                          saving
                        }
                      />
                    </label>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        void remove(
                          banner
                        )
                      }
                      disabled={
                        saving
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 px-3 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                    >
                      <Trash2
                        size={14}
                      />

                      Delete
                    </button>
                  </div>

                  {/* ORDER */}

                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-2">
                    <span className="px-2 text-xs font-semibold text-slate-500">
                      Change position
                    </span>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          move(
                            index,
                            -1
                          )
                        }
                        disabled={
                          index ===
                            0 ||
                          saving
                        }
                        aria-label="Move hero photo earlier"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ArrowUp
                          size={15}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          move(
                            index,
                            1
                          )
                        }
                        disabled={
                          index ===
                            banners.length -
                              1 ||
                          saving
                        }
                        aria-label="Move hero photo later"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ArrowDown
                          size={15}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      )}
    </section>
  );
}
