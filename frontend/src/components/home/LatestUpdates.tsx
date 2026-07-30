"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";

type Update = { _id: string; title: string; createdAt?: string; description?: string; content?: string };
const feeds = [
  { label: "Press Releases", key: "pressReleases", tab: "press-releases" },
  { label: "Announcements", key: "announcements", tab: "announcements" },
  { label: "Events", key: "events", tab: "events" },
] as const;

export default function LatestUpdates() {
  const [updates, setUpdates] = useState<Record<string, Update[]>>({});
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/latest-updates`)
      .then((response) => response.json())
      .then((data) => setUpdates(data || {}))
      .catch(() => setUpdates({}));
  }, []);

  return <section className="bg-slate-50 py-16 sm:py-24"><Container><div className="text-center"><p className="font-semibold text-blue-700">LATEST UPDATES</p><h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">News from GNPC</h2></div><div className="mt-10 grid gap-6 lg:grid-cols-3">{feeds.map(({ label, key, tab }) => <div key={label} className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="text-xl font-bold text-slate-900">{label}</h3><div className="mt-5 space-y-4">{updates[key]?.length ? updates[key].slice(0, 3).map((item) => <div key={item._id} className="border-b border-slate-100 pb-4 last:border-0"><p className="font-semibold text-slate-800">{item.title}</p><p className="mt-1 text-sm text-slate-500">{item.createdAt && new Date(item.createdAt).toLocaleDateString("en-IN")}</p></div>) : <p className="text-sm text-slate-500">No updates available.</p>}</div><Link href={`/latest-updates?tab=${tab}`} className="mt-5 inline-block text-sm font-semibold text-blue-700">View All →</Link></div>)}</div></Container></section>;
}
