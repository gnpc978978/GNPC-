"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { usePublicMembers } from "@/hooks/useMembers";
import OfficeBearerCard from "@/components/office-bearers/OfficeBearerCard";
import OfficeBearersSkeleton from "@/components/office-bearers/OfficeBearersSkeleton";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export default function OfficeBearersSection() {
  const { data, isLoading, isError } = usePublicMembers(1, 3);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(true);

  const updateControls = () => {
    const node = carouselRef.current;
    if (!node) return;
    setCanGoBack(node.scrollLeft > 4);
    setCanGoForward(node.scrollLeft + node.clientWidth < node.scrollWidth - 4);
  };

  const move = (direction: 1 | -1) => {
    const node = carouselRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * Math.max(node.clientWidth * 0.84, 240), behavior: "smooth" });
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading badge="Our people" title="Office Bearers" description="Meet the people leading Greater Noida Press Club." action={<div className="flex items-center gap-2" aria-label="Office bearers carousel controls">
            <Button href="/office-bearers" variant="outline" size="lg">View All</Button>
            <button type="button" onClick={() => move(-1)} disabled={!canGoBack} aria-label="Previous office bearers" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => move(1)} disabled={!canGoForward} aria-label="Next office bearers" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>} />

        <div className="mt-9">
          {isLoading ? <OfficeBearersSkeleton count={4} /> : isError ? (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 py-12 text-center text-slate-600">Office bearers are unavailable right now.</p>
          ) : data?.data.length ? (
            <div ref={carouselRef} onScroll={updateControls} className="-mx-4 grid snap-x snap-mandatory grid-flow-col auto-cols-[calc((100%_-_0.75rem)/2)] gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:thin] sm:mx-0 sm:auto-cols-[calc((100%_-_2rem)/3)] sm:gap-4 sm:px-0 lg:auto-cols-[calc((100%_-_3.75rem)/4)] lg:gap-5">
              {data.data.map((member) => <div key={member._id} className="snap-start"><OfficeBearerCard member={member} /></div>)}
            </div>
          ) : (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 py-12 text-center text-slate-500">No office bearers have been published yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
