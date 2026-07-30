"use client";

import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type Section = "site" | "logo" | "hero" | "contact" | "social" | "membership" | "seo";
type SocialLinks = { facebook?: string; twitter?: string; instagram?: string; linkedin?: string };
type Seo = { title?: string; description?: string; keywords?: string[] };
type WebsiteSettings = {
  siteName: string; heroTitle?: string; heroDescription?: string; email?: string; phone?: string; address?: string;
  logo?: string; favicon?: string; heroImage?: string; membershipPdf?: string; socialLinks?: SocialLinks; seo?: Seo;
};

const getAuthHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token") || ""}` });
const getSettings = async () => (await axios.get<{ data: WebsiteSettings }>(`${apiUrl}/settings`)).data.data;

const labels: Record<Section, string> = { site: "Site Details", logo: "Logo & Favicon", hero: "Hero Section", contact: "Contact Information", social: "Social Links", membership: "Membership Form", seo: "SEO Settings" };

export default function SettingsSectionEditor({ section }: { section: Section }) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({ queryKey: ["website-settings"], queryFn: getSettings, staleTime: 30_000 });
  const [form, setForm] = useState<WebsiteSettings>({ siteName: "", socialLinks: {}, seo: {} });
  const [files, setFiles] = useState<Record<string, File | null>>({});

  useEffect(() => { if (data) setForm({ ...data, socialLinks: data.socialLinks || {}, seo: data.seo || {} }); }, [data]);

  const mutation = useMutation({
    mutationFn: async () => {
      const changes: Partial<WebsiteSettings> = section === "site" ? { siteName: form.siteName } : section === "hero" ? { heroTitle: form.heroTitle, heroDescription: form.heroDescription } : section === "contact" ? { email: form.email, phone: form.phone, address: form.address } : section === "social" ? { socialLinks: form.socialLinks } : section === "seo" ? { seo: form.seo } : {};
      if (Object.keys(changes).length) await axios.put(`${apiUrl}/settings`, changes, { headers: getAuthHeaders(), withCredentials: true });
      if (Object.values(files).some(Boolean)) { const payload = new FormData(); Object.entries(files).forEach(([key, file]) => { if (file) payload.append(key, file); }); await axios.put(`${apiUrl}/settings/upload`, payload, { headers: getAuthHeaders(), withCredentials: true }); }
    },
    onSuccess: () => { setFiles({}); queryClient.invalidateQueries({ queryKey: ["website-settings"] }); window.dispatchEvent(new Event("website-settings-updated")); toast.success(`${labels[section]} saved successfully.`); },
    onError: (error) => toast.error(axios.isAxiosError(error) ? error.response?.data?.message || "Unable to save settings." : "Unable to save settings."),
  });

  const update = (field: keyof WebsiteSettings) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const setFile = (field: string) => (event: ChangeEvent<HTMLInputElement>) => setFiles((current) => ({ ...current, [field]: event.target.files?.[0] || null }));
  const submit = (event: FormEvent) => { event.preventDefault(); if (section === "site" && !form.siteName.trim()) return toast.error("Site name is required."); mutation.mutate(); };

  if (isLoading) return <div className="space-y-5 rounded-xl bg-white p-6 shadow"><div className="h-8 w-1/3 animate-pulse rounded bg-slate-200" /><div className="h-12 animate-pulse rounded bg-slate-200" /><div className="h-28 animate-pulse rounded bg-slate-200" /></div>;
  if (isError) return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">Unable to load settings. Refresh and try again.</div>;

  const imageUpload = (label: string, field: string, current?: string, accept = "image/*") => <div><label className="font-medium text-slate-800">{label}</label><input type="file" accept={accept} onChange={setFile(field)} className="mt-2 block w-full rounded-lg border p-2" />{current && !files[field] && (accept === "image/*" ? <img src={current} alt={`Current ${label}`} className="mt-3 h-24 rounded-lg object-contain" /> : <a href={current} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-blue-600 underline">View current file</a>)}</div>;

  return <form onSubmit={submit} className="space-y-6 rounded-xl bg-white p-6 shadow">
    {section === "site" && <div><label className="font-medium">Website Name</label><input value={form.siteName} onChange={update("siteName")} className="mt-1 w-full rounded-lg border p-3" placeholder="Greater Noida Press Club" /></div>}
    {section === "logo" && <div className="space-y-6">{imageUpload("Logo", "logo", form.logo)}{imageUpload("Favicon", "favicon", form.favicon, "image/png,image/x-icon,image/svg+xml")}</div>}
    {section === "hero" && <div className="space-y-5"><div><label className="font-medium">Hero Title</label><input value={form.heroTitle || ""} onChange={update("heroTitle")} className="mt-1 w-full rounded-lg border p-3" /></div><div><label className="font-medium">Hero Description</label><textarea value={form.heroDescription || ""} onChange={update("heroDescription")} rows={5} className="mt-1 w-full rounded-lg border p-3" /></div>{imageUpload("Hero Image", "heroImage", form.heroImage)}</div>}
    {section === "contact" && <div className="grid gap-5 md:grid-cols-2"><div><label className="font-medium">Email</label><input type="email" value={form.email || ""} onChange={update("email")} className="mt-1 w-full rounded-lg border p-3" /></div><div><label className="font-medium">Phone</label><input value={form.phone || ""} onChange={update("phone")} className="mt-1 w-full rounded-lg border p-3" /></div><div className="md:col-span-2"><label className="font-medium">Address</label><textarea value={form.address || ""} onChange={update("address")} rows={4} className="mt-1 w-full rounded-lg border p-3" /></div></div>}
    {section === "social" && <div className="space-y-4">{(["facebook", "twitter", "instagram", "linkedin"] as const).map((network) => <div key={network}><label className="font-medium capitalize">{network} URL</label><input type="url" value={form.socialLinks?.[network] || ""} onChange={(event) => setForm((current) => ({ ...current, socialLinks: { ...current.socialLinks, [network]: event.target.value } }))} className="mt-1 w-full rounded-lg border p-3" /></div>)}</div>}
    {section === "membership" && <div><label className="font-medium text-slate-800">Membership PDF</label><input type="file" accept="application/pdf,.pdf" onChange={setFile("membershipPdf")} className="mt-2 block w-full rounded-lg border p-2" />{form.membershipPdf && !files.membershipPdf && <a href={`${apiUrl}/settings/membership-form`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-blue-600 underline">View current membership form</a>}</div>}
    {section === "seo" && <div className="space-y-5"><div><label className="font-medium">SEO Title</label><input value={form.seo?.title || ""} onChange={(event) => setForm((current) => ({ ...current, seo: { ...current.seo, title: event.target.value } }))} className="mt-1 w-full rounded-lg border p-3" /></div><div><label className="font-medium">SEO Description</label><textarea value={form.seo?.description || ""} onChange={(event) => setForm((current) => ({ ...current, seo: { ...current.seo, description: event.target.value } }))} rows={5} className="mt-1 w-full rounded-lg border p-3" /></div><div><label className="font-medium">Keywords</label><input value={form.seo?.keywords?.join(", ") || ""} onChange={(event) => setForm((current) => ({ ...current, seo: { ...current.seo, keywords: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) } }))} className="mt-1 w-full rounded-lg border p-3" placeholder="press club, journalism, Greater Noida" /></div></div>}
    <button disabled={mutation.isPending} className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{mutation.isPending ? "Saving..." : `Save ${labels[section]}`}</button>
  </form>;
}
