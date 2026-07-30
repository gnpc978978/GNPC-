"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PointerEvent, useEffect, useState } from "react";
import { getBanners } from "@/services/bannerService";
import type { Banner } from "@/types/banner";

type Props = { fallbackImage?: string; alt: string };

export default function HeroCarousel({ fallbackImage, alt }: Props) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        setBanners((await getBanners()).filter((banner) => banner.active));
      } catch {
        setBanners([]);
      }
    };
    void loadBanners();
  }, []);

  const slides = banners.length ? banners : fallbackImage ? [{ _id: "fallback", image: fallbackImage }] : [];
  const show = (index: number) => setActiveIndex((index + slides.length) % slides.length);

  useEffect(() => {
    if (slides.length < 2) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4000);
    return () => window.clearInterval(interval);
  }, [slides.length]);

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (startX === null) return;
    const distance = event.clientX - startX;
    if (Math.abs(distance) > 45 && slides.length > 1) show(activeIndex + (distance < 0 ? 1 : -1));
    setStartX(null);
  };

  if (!slides.length) return <div className="flex h-full items-center justify-center bg-blue-950 p-8 text-center text-xl font-semibold text-blue-100">Greater Noida Press Club</div>;
  const activeSlide = slides[activeIndex] ?? slides[0];

  return <div className="group relative h-full touch-pan-y" onPointerDown={(event) => setStartX(event.clientX)} onPointerUp={onPointerUp} onPointerCancel={() => setStartX(null)}>
    <AnimatePresence mode="wait"><motion.div key={activeSlide._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.55 }} className="absolute inset-0"><Image src={activeSlide.image} alt={alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /></motion.div></AnimatePresence>
    {slides.length > 1 && <><button type="button" onClick={() => show(activeIndex - 1)} aria-label="Previous banner" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-950/55 p-2 text-white opacity-0 transition hover:bg-slate-950/80 group-hover:opacity-100 focus:opacity-100"><ChevronLeft size={22} /></button><button type="button" onClick={() => show(activeIndex + 1)} aria-label="Next banner" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-950/55 p-2 text-white opacity-0 transition hover:bg-slate-950/80 group-hover:opacity-100 focus:opacity-100"><ChevronRight size={22} /></button><div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">{slides.map((slide, index) => <button key={slide._id} type="button" aria-label={`Show banner ${index + 1}`} aria-current={index === activeIndex} onClick={() => show(index)} className={`h-2.5 rounded-full transition ${index === activeIndex ? "w-7 bg-white" : "w-2.5 bg-white/55 hover:bg-white/80"}`} />)}</div></>}
  </div>;
}
