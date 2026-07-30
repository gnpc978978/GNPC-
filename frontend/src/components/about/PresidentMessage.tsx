"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import OfficeBearersSection from "@/components/home/OfficeBearersSection";

type President = { presidentName: string; presidentDesignation: string; presidentMessage: string; presidentPhoto?: string };
const empty: President = { presidentName: "", presidentDesignation: "", presidentMessage: "", presidentPhoto: "" };

export default function PresidentMessage() {
  const [president, setPresident] = useState<President>(empty);
  useEffect(() => { void fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/about`).then((response) => response.json()).then((payload) => { if (payload.success) setPresident({ ...empty, ...payload.data }); }).catch(() => undefined); }, []);
  return <><section className="bg-slate-50 py-16 sm:py-24"><div className="mx-auto max-w-7xl px-6"><div className="mb-12 text-center"><span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-blue-700">Leadership</span><h2 className="mt-5 text-4xl font-extrabold text-slate-900 md:text-5xl">President&apos;s Message</h2></div>{president.presidentMessage ? <div className="grid items-center gap-10 lg:grid-cols-[minmax(260px,.8fr)_1.2fr] lg:gap-16">{president.presidentPhoto && <div className="mx-auto w-full max-w-md"><div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-white p-3 shadow-xl"><Image src={president.presidentPhoto} alt={president.presidentName || "President"} fill sizes="(min-width: 1024px) 32vw, 90vw" className="rounded-2xl object-cover" /></div></div>}<div className="space-y-5 text-base leading-8 text-slate-600 sm:text-lg"><p className="whitespace-pre-line">{president.presidentMessage}</p><div className="rounded-2xl border-l-4 border-blue-600 bg-white p-5 shadow-sm"><h3 className="text-xl font-bold text-slate-900">{president.presidentName}</h3>{president.presidentDesignation && <p className="text-slate-500">{president.presidentDesignation}</p>}</div></div></div> : <p className="text-center text-slate-500">President&apos;s message will be shared soon.</p>}</div></section><OfficeBearersSection /></>;
}
