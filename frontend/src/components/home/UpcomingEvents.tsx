"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { motion } from "framer-motion";

import Button from "@/components/ui/Button";
import { apiFetch, responseJson } from "@/services/api";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import { mergeHomeSettings } from "@/types/homeSettings";

type LatestFeedItem = {
  _id: string;
  slug?: string;
  title: string;
  type?: string;
  description?: string;
  content?: string;
  image?: string;
  banner?: string;
  date?: string;
  location?: string;
  publishedAt?: string;
};

type LatestUpdatesResponse = {
  success?: boolean;
  data?: LatestFeedItem[];
};

function formatDate(value?: string) {
  if (!value) return "Date to be announced";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date to be announced";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getExcerpt(value?: string) {
  return (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function UpcomingEvents() {
  const { settings } = useWebsiteSettings();
  const section = mergeHomeSettings(settings.home).pressConferences;

  const [items, setItems] = useState<LatestFeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadUpcomingEvents = async () => {
      try {
        const response = await apiFetch("/latest-updates", {
          method: "GET",
          cache: "no-store",
        });
        const payload = await responseJson<LatestUpdatesResponse>(response);

        if (cancelled) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = (Array.isArray(payload.data) ? payload.data : [])
          .filter((item) => {
            if (item.type !== "Event" || !item.date) return false;
            const date = new Date(item.date);
            return !Number.isNaN(date.getTime()) && date >= today;
          })
          .sort((a, b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime());

        setItems(upcoming);
      } catch (error) {
        console.error("Failed to load upcoming GNPC events:", error);
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadUpcomingEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleItems = useMemo(
    () => items.slice(0, Math.max(1, Math.min(6, section.displayCount || 3))),
    [items, section.displayCount]
  );

  const heading =
    section.title && !/latest press conference/i.test(section.title)
      ? section.title
      : "Upcoming Events & Activities";

  const description =
    section.description && !/media interaction and official briefing/i.test(section.description)
      ? section.description
      : "Discover upcoming workshops, meetings, seminars and activities organised by Greater Noida Press Club.";

  return (
    <section className="relative overflow-hidden bg-[#f8fafc] py-12 text-[#171717] sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1840px] px-4 sm:px-6 lg:px-[2vw]">
        <div className="gnpc-home-editorial-heading mx-auto max-w-4xl text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#9a7631]">
            {section.eyebrow && section.eyebrow !== "Media & Journalism"
              ? section.eyebrow
              : "What's Coming Up"}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl lg:text-5xl">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            {description}
          </p>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="aspect-[16/9] animate-pulse bg-slate-200" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
                  <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : visibleItems.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((item, index) => {
              const image = item.image || item.banner;
              const href = `/events/${encodeURIComponent(item.slug || item._id)}`;

              return (
                <motion.article
                  key={item._id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link href={href} className="relative block aspect-[16/9] overflow-hidden bg-slate-100" aria-label={`View event: ${item.title}`}>
                    {image ? (
                      <Image src={image} alt={item.title} fill sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <CalendarDays size={42} />
                      </div>
                    )}
                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#7c5e25] shadow-sm">
                      Event
                    </span>
                  </Link>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={14} className="text-[#b08a3e]" />
                        {formatDate(item.date)}
                      </span>
                      {item.location && (
                        <span className="inline-flex min-w-0 items-center gap-1.5">
                          <MapPin size={14} className="shrink-0 text-[#b08a3e]" />
                          <span className="truncate">{item.location}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 line-clamp-2 text-lg font-extrabold leading-snug text-slate-900">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                        {getExcerpt(item.description)}
                      </p>
                    )}

                    <Link href={href} className="mt-auto inline-flex w-fit items-center gap-2 pt-5 text-sm font-bold text-[#9a7631] transition group-hover:gap-3">
                      Event details <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center">
            <CalendarDays size={32} className="mx-auto text-slate-300" />
            <h3 className="mt-3 text-lg font-bold text-slate-800">No upcoming events scheduled</h3>
            <p className="mt-2 text-sm text-slate-500">Check the events page for completed activities and new dates as they are announced.</p>
          </div>
        )}

        <div className="mt-7 flex justify-center">
          <Button href="/events" variant="outline" size="md">
            {section.buttonLabel && section.buttonLabel !== "View All"
              ? section.buttonLabel
              : "View All Events"}
            <ArrowRight size={17} />
          </Button>
        </div>
      </div>
    </section>
  );
}
