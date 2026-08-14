"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { getAdvertisement, updateAdvertisement } from "@/services/advertisementService";

type FormState = {
  title: string;
  sponsor: string;
  url: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Inactive";
};

const dateInputValue = (value: string) => value ? new Date(value).toISOString().slice(0, 10) : "";

export default function EditAdvertisementPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<FormState | null>(null);
  const [preview, setPreview] = useState("");
  const [banner, setBanner] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const advertisement = await getAdvertisement(params.id);
        if (!active) return;
        setForm({
          title: advertisement.title,
          sponsor: advertisement.sponsor,
          url: advertisement.url || "",
          startDate: dateInputValue(advertisement.startDate),
          endDate: dateInputValue(advertisement.endDate),
          status: advertisement.status,
        });
        setPreview(advertisement.banner);
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load this advertisement.");
      }
    };
    void load();
    return () => { active = false; };
  }, [params.id]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!form) return;
    setForm({ ...form, [event.target.name]: event.target.value } as FormState);
  };

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBanner(file);
    setPreview(URL.createObjectURL(file));
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;
    setError("");
    setSaving(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, value));
      if (banner) body.append("banner", banner);
      await updateAdvertisement(params.id, body);
      router.replace("/admin/advertisements");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save this advertisement.");
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <div className="p-6">{error || "Loading advertisement…"}</div>;

  return (
    <form onSubmit={save} className="mx-auto max-w-3xl space-y-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7">
      <div><h1 className="text-2xl font-bold text-slate-900">Edit advertisement</h1><p className="mt-1 text-sm text-slate-600">Changes are saved directly to the CMS record.</p></div>
      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">Title<input required name="title" value={form.title} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-300 p-3" /></label>
        <label className="block text-sm font-medium text-slate-700">Sponsor<input required name="sponsor" value={form.sponsor} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-300 p-3" /></label>
        <label className="block text-sm font-medium text-slate-700">Destination URL<input type="url" name="url" value={form.url} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-300 p-3" /></label>
        <label className="block text-sm font-medium text-slate-700">Status<select name="status" value={form.status} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-300 p-3"><option value="Active">Active</option><option value="Inactive">Inactive</option></select></label>
        <label className="block text-sm font-medium text-slate-700">Start date<input required type="date" name="startDate" value={form.startDate} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-300 p-3" /></label>
        <label className="block text-sm font-medium text-slate-700">End date<input required type="date" name="endDate" value={form.endDate} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-300 p-3" /></label>
      </div>
      <div><label className="block text-sm font-medium text-slate-700">Replace banner<input accept="image/jpeg,image/png,image/webp" type="file" onChange={handleImage} className="mt-2 block w-full text-sm" /></label>{preview && <div className="relative mt-4 aspect-[3/1] overflow-hidden rounded-lg bg-slate-100"><Image src={preview} alt="Advertisement banner preview" fill className="object-cover" sizes="(min-width: 768px) 700px, 100vw" /></div>}</div>
      <div className="flex gap-3"><button disabled={saving} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button><button type="button" onClick={() => router.back()} className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700">Cancel</button></div>
    </form>
  );
}
