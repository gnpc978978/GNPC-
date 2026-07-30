"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import OfficeBearerCard from "./OfficeBearerCard";
import OfficeBearersSkeleton from "./OfficeBearersSkeleton";
import { usePublicMembers } from "@/hooks/useMembers";

const optionsFrom = (values: Array<string | undefined>) => [...new Set(values.filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b));

export default function OfficeBearersPage() {
  const [search, setSearch] = useState("");
  const [organization, setOrganization] = useState("");
  const [designation, setDesignation] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [sort, setSort] = useState<"az" | "za" | "recent">("recent");
  const [page, setPage] = useState(1);
  const filters = useMemo(() => ({ search, organization, designation, state, district, sort }), [search, organization, designation, state, district, sort]);
  const { data, isLoading, isError } = usePublicMembers(page, 12, filters, true);
  const setFilter = (setter: (value: string) => void) => (value: string) => { setter(value); setPage(1); };
  const directoryOptions = data?.data ?? [];

  return <section className="min-h-screen bg-slate-50 py-16 sm:py-20"><div className="mx-auto max-w-7xl px-6"><div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">Leadership</p><h1 className="mt-3 text-4xl font-extrabold text-slate-900 sm:text-5xl">Office Bearers</h1><p className="mx-auto mt-4 max-w-2xl text-slate-600">Meet the office bearers of Greater Noida Press Club.</p></div><div className="mt-10 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5"><label className="relative block"><span className="sr-only">Search office bearers</span><input value={search} onChange={(event) => setFilter(setSearch)(event.target.value)} placeholder="Search by name, organization, designation, or email" className="w-full rounded-xl border border-slate-200 py-3 pl-4 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><select value={organization} onChange={(event) => setFilter(setOrganization)(event.target.value)} className="rounded-xl border border-slate-200 bg-white p-3"><option value="">All organizations</option>{optionsFrom(directoryOptions.map((member) => member.organization)).map((value) => <option key={value}>{value}</option>)}</select><select value={designation} onChange={(event) => setFilter(setDesignation)(event.target.value)} className="rounded-xl border border-slate-200 bg-white p-3"><option value="">All designations</option>{optionsFrom(directoryOptions.map((member) => member.designation)).map((value) => <option key={value}>{value}</option>)}</select><select value={state} onChange={(event) => setFilter(setState)(event.target.value)} className="rounded-xl border border-slate-200 bg-white p-3"><option value="">All states</option>{optionsFrom(directoryOptions.map((member) => member.state)).map((value) => <option key={value}>{value}</option>)}</select><select value={district} onChange={(event) => setFilter(setDistrict)(event.target.value)} className="rounded-xl border border-slate-200 bg-white p-3"><option value="">All districts</option>{optionsFrom(directoryOptions.map((member) => member.district)).map((value) => <option key={value}>{value}</option>)}</select><select value={sort} onChange={(event) => { setSort(event.target.value as "az" | "za" | "recent"); setPage(1); }} className="rounded-xl border border-slate-200 bg-white p-3"><option value="recent">Display order</option><option value="az">A → Z</option><option value="za">Z → A</option></select></div></div>{isLoading ? <div className="mt-10"><OfficeBearersSkeleton count={12} /></div> : isError ? <p className="mt-10 text-center text-red-600">Unable to load office bearers.</p> : data?.data.length ? <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">{data.data.map((member) => <OfficeBearerCard key={member._id} member={member} />)}</div> : <div className="mt-10 rounded-2xl bg-white py-16 text-center text-slate-500 shadow-sm"><SearchX className="mx-auto h-12 w-12 text-blue-600" aria-hidden="true" /><p className="mt-4 text-xl font-bold text-slate-800">No Results Found</p><p className="mt-2">Try changing your search or filters.</p></div>}</div></section>;
}
