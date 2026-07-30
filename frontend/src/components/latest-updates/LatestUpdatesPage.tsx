"use client";

import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, ChevronRight, FileText, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Container from "@/components/ui/Container";

type UpdateType = "press-releases" | "announcements" | "events";
type Tab = "all" | UpdateType;
type Update = { _id: string; slug?: string; title: string; content?: string; description?: string; image?: string; banner?: string; category?: string; createdAt?: string; publishedAt?: string; date?: string };
type FeedResponse = { pressReleases: Update[]; announcements: Update[]; events: Update[] };

const tabs: { value: Tab; label: string }[] = [{ value: "all", label: "All" }, { value: "press-releases", label: "Press Releases" }, { value: "announcements", label: "Announcements" }, { value: "events", label: "Events" }];
const typeLabels: Record<UpdateType, string> = { "press-releases": "Press Release", announcements: "Announcement", events: "Event" };
const detailPaths: Record<UpdateType, string> = { "press-releases": "/press-releases", announcements: "/announcements", events: "/events" };
const formatDate = (value?: string) => value ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value)) : "Recently published";
const plainText = (value?: string) => (value || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

function Skeletons() {
  return <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"><div className="aspect-[16/9] animate-pulse bg-slate-200" /><div className="space-y-4 p-6"><div className="h-4 w-24 animate-pulse rounded bg-slate-200" /><div className="h-7 animate-pulse rounded bg-slate-200" /><div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" /><div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" /></div></div>)}</div>;
}

function EmptyState() {
  return <div className="rounded-3xl border border-dashed border-blue-200 bg-white px-6 py-20 text-center shadow-sm"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-700"><Sparkles size={36} /></div><h2 className="mt-6 text-2xl font-bold text-slate-900">No updates available.</h2><p className="mx-auto mt-3 max-w-md text-slate-600">Please check back soon for press releases, announcements, and upcoming events.</p></div>;
}

export default function LatestUpdatesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const tab: Tab = tabs.some(({ value }) => value === requestedTab) ? requestedTab as Tab : "all";
  const [feed, setFeed] = useState<FeedResponse>({ pressReleases: [], announcements: [], events: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const loadFeed = () => {
    setLoading(true);
    setError(null);
    axios.get<FeedResponse>(`${process.env.NEXT_PUBLIC_API_URL}/latest-updates`)
      .then(({ data }) => setFeed({ pressReleases: data.pressReleases || [], announcements: data.announcements || [], events: data.events || [] }))
      .catch(() => setError("We couldn’t load the latest updates. Please try again."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;
    axios.get<FeedResponse>(`${process.env.NEXT_PUBLIC_API_URL}/latest-updates`)
      .then(({ data }) => { if (!cancelled) setFeed({ pressReleases: data.pressReleases || [], announcements: data.announcements || [], events: data.events || [] }); })
      .catch(() => { if (!cancelled) setError("We couldn’t load the latest updates. Please try again."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const updates = useMemo(() => {
    const source: Array<Update & { type: UpdateType }> = [...feed.pressReleases.map((item) => ({ ...item, type: "press-releases" as const })), ...feed.announcements.map((item) => ({ ...item, type: "announcements" as const })), ...feed.events.map((item) => ({ ...item, type: "events" as const }))];
    const normalizedQuery = query.trim().toLowerCase();
    return source.filter((item) => (tab === "all" || item.type === tab) && (!normalizedQuery || `${item.title} ${item.description || item.content || ""}`.toLowerCase().includes(normalizedQuery))).sort((a, b) => {
      const aDate = new Date(a.publishedAt || a.date || a.createdAt || 0).getTime();
      const bDate = new Date(b.publishedAt || b.date || b.createdAt || 0).getTime();
      return sortOrder === "newest" ? bDate - aDate : aDate - bDate;
    });
  }, [feed, query, sortOrder, tab]);

  const selectTab = (value: Tab) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("tab"); else params.set("tab", value);
    router.replace(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
  };

  return <section className="min-h-screen bg-slate-50 py-14 sm:py-20"><Container><div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0a3a61] via-[#0f4c81] to-blue-600 px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-16"><div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" /><div className="relative max-w-2xl"><p className="flex items-center gap-2 text-sm font-bold tracking-[0.2em] text-blue-100"><Sparkles size={16} /> STAY INFORMED</p><h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Latest Updates</h1><p className="mt-4 text-lg leading-8 text-blue-100">Press releases, important announcements, and upcoming events from Greater Noida Press Club.</p></div></div>
    <div className="mt-8 flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-wrap gap-2">{tabs.map(({ value, label }) => <button key={value} onClick={() => selectTab(value)} className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${tab === value ? "bg-blue-700 text-white shadow-lg shadow-blue-700/20" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}>{label}</button>)}</div><div className="flex flex-col gap-3 sm:flex-row"><label className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search updates" className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:w-60" /></label><select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as "newest" | "oldest")} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></div></div>
    <div className="mt-10">{loading ? <Skeletons /> : error ? <div className="rounded-3xl bg-red-50 px-6 py-12 text-center text-red-700"><p className="font-semibold">{error}</p><button onClick={loadFeed} className="mt-4 rounded-xl bg-red-700 px-4 py-2 text-sm font-bold text-white">Try again</button></div> : updates.length === 0 ? <EmptyState /> : <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{updates.map((item, index) => { const image = item.image || item.banner; const date = item.publishedAt || item.date || item.createdAt; const description = plainText(item.description || item.content) || "Read the latest update from Greater Noida Press Club."; return <motion.article key={`${item.type}-${item._id}`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38, delay: Math.min(index * 0.05, 0.25) }} whileHover={{ scale: 1.02 }} className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-xl"><div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-100 to-slate-100">{image ? <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-blue-700"><FileText size={48} /></div>}<span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-blue-800 shadow-sm">{item.category || typeLabels[item.type]}</span></div><div className="p-6"><div className="flex items-center gap-2 text-sm font-medium text-slate-500"><CalendarDays size={16} className="text-blue-600" />{formatDate(date)}</div><h2 className="mt-4 line-clamp-2 text-xl font-extrabold text-slate-900">{item.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{description}</p><Link href={`${detailPaths[item.type]}/${item.slug || item._id}`} className="mt-6 inline-flex items-center gap-1 text-sm font-extrabold text-blue-700 transition group-hover:gap-2">Read More <ChevronRight size={17} /></Link></div></motion.article>; })}</div>}</div>
  </Container></section>;
}
