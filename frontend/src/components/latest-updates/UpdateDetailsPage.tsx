"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";

type Update = { title: string; content?: string; description?: string; image?: string; banner?: string; category?: string; createdAt?: string; publishedAt?: string; date?: string; location?: string };
type Props = { type: "press-releases" | "announcements" | "events"; label: string };
const formatDate = (value?: string) => value ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value)) : "Recently published";

export default function UpdateDetailsPage({ type, label }: Props) {
  const { slug } = useParams<{ slug: string }>();
  const [item, setItem] = useState<Update | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/${type}/${slug}`)
      .then(async (response) => ({ response, data: await response.json() }))
      .then(({ response, data }) => { if (!response.ok) throw new Error(); setItem(data.data); })
      .catch(() => setError(true));
  }, [slug, type]);

  if (error) return <Container><main className="py-24 text-center"><h1 className="text-3xl font-extrabold text-slate-900">Update not found</h1><Link href="/latest-updates" className="mt-6 inline-block font-bold text-blue-700">Back to latest updates</Link></main></Container>;
  if (!item) return <main className="py-24 text-center text-slate-500">Loading update...</main>;
  const image = item.image || item.banner;
  const date = item.publishedAt || item.date || item.createdAt;
  return <main className="bg-slate-50 py-14 sm:py-20"><Container><article className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-10"><Link href="/latest-updates" className="text-sm font-bold text-blue-700">← Back to latest updates</Link><p className="mt-8 text-sm font-extrabold uppercase tracking-[0.16em] text-blue-700">{item.category || label}</p><h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">{item.title}</h1><div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-500"><span className="flex items-center gap-2"><CalendarDays size={17} className="text-blue-600" />{formatDate(date)}</span>{item.location && <span className="flex items-center gap-2"><MapPin size={17} className="text-blue-600" />{item.location}</span>}</div>{image && <img src={image} alt="" className="mt-8 max-h-[480px] w-full rounded-2xl object-cover" />}<div className="mt-8 whitespace-pre-line text-base leading-8 text-slate-700">{item.content || item.description}</div></article></Container></main>;
}
