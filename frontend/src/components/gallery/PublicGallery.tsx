"use client";

import { useEffect, useMemo, useState } from "react";

type Gallery = { _id: string; title: string; coverImage: string; images: string[]; category: string; description?: string; status: string };
const pageSize = 9;

export default function PublicGallery() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<{ src: string; title: string } | null>(null);
  useEffect(() => { fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`).then((response) => response.json()).then((data) => setGalleries(Array.isArray(data.gallery) ? data.gallery.filter((item: Gallery) => item.status !== "inactive") : [])).catch(() => setGalleries([])); }, []);
  const categories = ["All", ...Array.from(new Set(galleries.map((item) => item.category).filter(Boolean)))];
  const images = useMemo(() => galleries.filter((item) => category === "All" || item.category === category).flatMap((item) => [{ src: item.coverImage, title: item.title, category: item.category }, ...item.images.map((src) => ({ src, title: item.title, category: item.category }))]).filter((item) => Boolean(item.src)), [galleries, category]);
  const totalPages = Math.max(1, Math.ceil(images.length / pageSize));
  const visible = images.slice((page - 1) * pageSize, page * pageSize);
  const selectCategory = (value: string) => { setCategory(value); setPage(1); };
  return <section className="bg-white py-16 sm:py-20"><div className="mx-auto max-w-7xl px-6"><div className="mb-10 flex flex-wrap justify-center gap-3">{categories.map((item) => <button key={item} onClick={() => selectCategory(item)} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${category === item ? "bg-blue-700 text-white" : "border border-slate-200 text-slate-700 hover:border-blue-300"}`}>{item}</button>)}</div>{visible.length === 0 ? <p className="py-10 text-center text-slate-500">No gallery images are available yet.</p> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visible.map((image) => <button key={image.src} onClick={() => setSelected(image)} className="group overflow-hidden rounded-2xl bg-slate-100 text-left"><img src={image.src} alt={image.title} className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" /><span className="block p-4"><span className="text-sm font-semibold text-blue-700">{image.category}</span><span className="mt-1 block font-bold text-slate-900">{image.title}</span></span></button>)}</div>}{totalPages > 1 && <div className="mt-10 flex justify-center gap-2">{Array.from({ length: totalPages }, (_, index) => <button key={index} onClick={() => setPage(index + 1)} className={`h-10 w-10 rounded-lg font-semibold ${page === index + 1 ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-700"}`}>{index + 1}</button>)}</div>}</div>{selected && <div role="dialog" aria-modal="true" className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4" onClick={() => setSelected(null)}><button aria-label="Close image" className="absolute right-5 top-4 text-4xl text-white" onClick={() => setSelected(null)}>×</button><img src={selected.src} alt={selected.title} className="max-h-[85vh] max-w-full rounded-xl object-contain" onClick={(event) => event.stopPropagation()} /></div>}</section>;
}
