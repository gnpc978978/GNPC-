"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { createBanners, deleteBanner, getBanners, reorderBanners, updateBanner } from "@/services/bannerService";
import type { Banner } from "@/types/banner";

export default function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadBanners = async () => {
    try {
      setLoading(true);
      setBanners(await getBanners());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadBanners(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    try {
      setSaving(true);
      const response = await createBanners(files);
      setBanners((current) => [...current, ...response.data]);
      toast.success("Banner images uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to upload banners");
    } finally {
      setSaving(false);
    }
  };

  const replace = async (banner: Banner, event: ChangeEvent<HTMLInputElement>) => {
    const image = event.target.files?.[0];
    event.target.value = "";
    if (!image) return;
    try {
      setSaving(true);
      const response = await updateBanner(banner._id, { image });
      setBanners((current) => current.map((item) => item._id === banner._id ? response.data : item));
      toast.success("Banner image replaced");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to replace banner");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      setSaving(true);
      const response = await updateBanner(banner._id, { active: !banner.active });
      setBanners((current) => current.map((item) => item._id === banner._id ? response.data : item));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update banner");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (banner: Banner) => {
    if (!window.confirm("Delete this banner image?")) return;
    try {
      setSaving(true);
      await deleteBanner(banner._id);
      setBanners((current) => current.filter((item) => item._id !== banner._id));
      toast.success("Banner deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete banner");
    } finally {
      setSaving(false);
    }
  };

  const move = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= banners.length) return;
    setBanners((current) => {
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const saveOrder = async () => {
    try {
      setSaving(true);
      const response = await reorderBanners(banners);
      setBanners(response.data);
      toast.success("Banner order saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save banner order");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-6 rounded-2xl bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-slate-900">Homepage Banners</h1><p className="mt-1 text-sm text-slate-600">Upload, replace, reorder, and activate homepage carousel images.</p></div>
        <div className="flex flex-wrap gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"><Upload size={17} /> Upload images<input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={upload} disabled={saving} /></label>
          <button type="button" onClick={() => void saveOrder()} disabled={saving || banners.length < 2} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Save order</button>
        </div>
      </div>

      {loading ? <div className="flex justify-center py-16 text-slate-500"><Loader2 className="animate-spin" /></div> : banners.length === 0 ? <p className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">No banners uploaded yet.</p> : <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{banners.map((banner, index) => <article key={banner._id} className="overflow-hidden rounded-xl border border-slate-200 bg-white"><div className="relative aspect-[16/9] bg-slate-100"><Image src={banner.image} alt={`Homepage banner ${index + 1}`} fill sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover" /><span className="absolute left-3 top-3 rounded-full bg-slate-950/75 px-2.5 py-1 text-xs font-semibold text-white">#{index + 1}</span></div><div className="space-y-3 p-4"><label className="flex cursor-pointer items-center justify-between text-sm font-medium text-slate-700">Active<input type="checkbox" checked={banner.active} onChange={() => void toggleActive(banner)} disabled={saving} className="h-4 w-4 rounded" /></label><div className="flex flex-wrap gap-2"><label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Replace<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => void replace(banner, event)} disabled={saving} /></label><button type="button" onClick={() => move(index, -1)} disabled={index === 0 || saving} aria-label="Move banner earlier" className="rounded-md border border-slate-300 p-2 text-slate-700 disabled:opacity-40"><ArrowUp size={16} /></button><button type="button" onClick={() => move(index, 1)} disabled={index === banners.length - 1 || saving} aria-label="Move banner later" className="rounded-md border border-slate-300 p-2 text-slate-700 disabled:opacity-40"><ArrowDown size={16} /></button><button type="button" onClick={() => void remove(banner)} disabled={saving} aria-label="Delete banner" className="ml-auto rounded-md p-2 text-red-600 hover:bg-red-50 disabled:opacity-40"><Trash2 size={18} /></button></div></div></article>)}</div>}
    </section>
  );
}
