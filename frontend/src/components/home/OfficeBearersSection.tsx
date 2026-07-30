"use client";

import Link from "next/link";
import { usePublicMembers } from "@/hooks/useMembers";
import OfficeBearerCard from "@/components/office-bearers/OfficeBearerCard";
import OfficeBearersSkeleton from "@/components/office-bearers/OfficeBearersSkeleton";

export default function OfficeBearersSection() { const { data, isLoading } = usePublicMembers(1, 5); return <section className="bg-white py-16 sm:py-20"><div className="mx-auto max-w-7xl px-6"><div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">Our Office Bearers</p><h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">Office Bearers</h2><p className="mx-auto mt-4 max-w-2xl text-slate-600">Meet our office bearers of Greater Noida Press Club.</p></div><div className="mt-10">{isLoading ? <OfficeBearersSkeleton count={5} /> : data?.data.length ? <div className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-3 sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">{data.data.map((member) => <div key={member._id} className="w-[76vw] shrink-0 snap-center sm:w-auto sm:shrink"><OfficeBearerCard member={member} /></div>)}</div> : <p className="rounded-2xl bg-slate-50 py-12 text-center text-slate-500">No Office Bearers Found</p>}</div><div className="mt-10 text-center"><Link href="/office-bearers" className="inline-flex rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800">View All Office Bearers</Link></div></div></section>; }
