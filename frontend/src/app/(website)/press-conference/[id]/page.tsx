"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Conference = { title: string; content: string; category?: string; createdAt?: string; image?: string };

export default function PressConferenceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Conference | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => { fetch(`${process.env.NEXT_PUBLIC_API_URL}/press-releases/${id}`).then((response) => response.json().then((data) => ({ response, data }))).then(({ response, data }) => { if (!response.ok) throw new Error(); setItem(data.data); }).catch(() => setError(true)); }, [id]);
  if (error) return <main className="mx-auto max-w-3xl px-6 py-24"><h1 className="text-3xl font-bold">Press conference not found</h1><Link href="/press-conference" className="mt-6 inline-block text-blue-700">Back to press conferences</Link></main>;
  if (!item) return <main className="py-24 text-center text-slate-500">Loading details...</main>;
  return <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24"><Link href="/press-conference" className="text-sm font-semibold text-blue-700">← All press conferences</Link><p className="mt-8 text-sm font-semibold text-blue-700">{item.category || "Press Conference"}</p><h1 className="mt-3 text-4xl font-extrabold text-slate-900">{item.title}</h1><p className="mt-4 text-slate-500">{item.createdAt && new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>{item.image && <img src={item.image} alt="" className="mt-8 max-h-[440px] w-full rounded-2xl object-cover" />}<article className="mt-8 whitespace-pre-line leading-8 text-slate-700">{item.content}</article></main>;
}
