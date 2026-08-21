"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePublicMembers } from "@/hooks/useMembers";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import { mergeHomeSettings } from "@/types/homeSettings";
import PersonCard from "@/components/ui/PersonCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export default function OfficeBearersSection() {
  const { settings } = useWebsiteSettings();
  const section = mergeHomeSettings(settings.home).officeBearers;
  const count = Math.max(1, Math.min(12, Number(section.displayCount) || 4));
  const { data, isLoading, isError } = usePublicMembers(1, count);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(true);
  const members = data?.data || [];

  const updateControls = useCallback(() => {
    const node = carouselRef.current;
    if (!node) return;
    setCanGoBack(node.scrollLeft > 4);
    setCanGoForward(node.scrollLeft + node.clientWidth < node.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateControls();
    const node = carouselRef.current;
    if (!node) return;
    const observer = new ResizeObserver(updateControls);
    observer.observe(node);
    return () => observer.disconnect();
  }, [updateControls, members.length]);

  const move = (direction: -1 | 1) => {
    const node = carouselRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * Math.max(node.clientWidth * 0.82, 260), behavior: "smooth" });
    window.setTimeout(updateControls, 400);
  };

  return (
    <section className="bg-[#f8fafc] py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge={section.eyebrow || "Our People"}
          title={section.title || "Office Bearers"}
          description={section.description}
          action={section.showViewAll ? (
            <Button href={section.buttonHref || "/office-bearers"} variant="outline" size="md">
              {section.buttonLabel?.trim().toLowerCase() === "explore"
                ? "View All"
                : section.buttonLabel || "View All"}
              <ArrowRight size={16} />
            </Button>
          ) : undefined}
        />

        <div className="mt-9 sm:mt-11">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: Math.min(count, 4) }).map((_, index) => <div key={index} className="aspect-[4/5] animate-pulse rounded-xl bg-slate-200" />)}
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
              <Users className="mx-auto text-red-400" size={34} />
              <p className="mt-3 text-sm font-semibold text-red-700">Office bearers are unavailable right now.</p>
            </div>
          ) : members.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <Users className="mx-auto text-slate-400" size={34} />
              <p className="mt-3 text-sm font-semibold text-slate-600">No office bearers have been published yet.</p>
            </div>
          ) : (
            <div ref={carouselRef} onScroll={updateControls} className="-mx-4 grid snap-x snap-mandatory grid-flow-col auto-cols-[86%] gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:-mx-6 sm:auto-cols-[47%] sm:px-6 md:auto-cols-[31%] lg:mx-0 lg:auto-cols-[calc((100%_-_3rem)/4)] lg:px-0 [&::-webkit-scrollbar]:hidden">
              {members.map((member, index) => (
                <motion.div key={member._id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.3, delay: index * 0.04 }} className="snap-start">
                  <PersonCard href={`/office-bearers/${member._id}`} name={member.fullName} photo={member.photo} designation={member.designation} organization={member.organization} state={member.state} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {members.length > 1 && (
          <div className="mt-5 flex justify-start gap-2 lg:justify-end">
            <button
              type="button"
              onClick={() => move(-1)}
              disabled={!canGoBack}
              aria-label="Previous office bearers"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#d4b06a]/50 hover:text-[#d4b06a] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              disabled={!canGoForward}
              aria-label="Next office bearers"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#d4b06a]/50 hover:text-[#d4b06a] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
