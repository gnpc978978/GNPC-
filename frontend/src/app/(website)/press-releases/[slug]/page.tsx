"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, FileText } from "lucide-react";

import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import { apiFetch, responseJson } from "@/services/api";

type PressRelease = {
  _id: string;
  slug?: string;
  title: string;
  content?: string;
  category?: string;
  image?: string;
  createdAt?: string;
  publishedAt?: string;
  status?: string;
};

type Response = {
  success?: boolean;
  data?: PressRelease[];
  message?: string;
};

function formatDate(value?: string) {
  if (!value) return "Date not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not available";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function excerpt(value?: string) {
  const text = (value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 170 ? `${text.slice(0, 167)}...` : text;
}

export default function PressReleasesPage() {
  const [items, setItems] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFetch("/press-releases", {
          method: "GET",
          cache: "no-store",
        });
        const payload = await responseJson<Response>(response);

        if (!cancelled) {
          setItems(Array.isArray(payload.data) ? payload.data : []);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load press releases."
          );
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="bg-[#f8fafc]">
      <PageHero
        eyebrow="News & Updates"
        title="Press Releases"
        description="Read official press releases and updates from Greater Noida Press Club."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Press Releases" },
        ]}
      />

      <section className="bg-[#f4f7fb] px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Container>
          {loading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-64 animate-pulse rounded-3xl bg-slate-200" />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="font-semibold text-red-800">Unable to load press releases.</p>
              <p className="mt-2 text-sm text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
              <FileText className="mx-auto text-slate-400" size={36} aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold text-slate-900">No press releases available</h2>
              <p className="mt-2 text-slate-500">Please check back for the latest updates.</p>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const href = `/press-releases/${encodeURIComponent(item.slug || item._id)}`;

                return (
                  <article
                    key={item._id}
                    className="min-w-0 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    {item.image ? (
                      <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover transition duration-500 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[16/9] items-center justify-center bg-slate-100 text-[#b08a3e]">
                        <FileText size={34} aria-hidden="true" />
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
                        {item.category && <span>{item.category}</span>}
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays size={14} aria-hidden="true" />
                          {formatDate(item.publishedAt || item.createdAt)}
                        </span>
                      </div>

                      <h2 className="mt-4 line-clamp-3 text-xl font-extrabold leading-tight text-slate-900">
                        {item.title}
                      </h2>

                      {excerpt(item.content) && (
                        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
                          {excerpt(item.content)}
                        </p>
                      )}

                      <Link
                        href={href}
                        className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[#9a7631] transition hover:text-[#071a2e]"
                      >
                        Read Press Release
                        <ArrowRight size={16} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
