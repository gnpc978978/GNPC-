"use client";

import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";

export default function FloatingContactButton() {
  return (
    <Link
      href="/contact"
      aria-label="Get in touch with Greater Noida Press Club"
      className="group fixed bottom-5 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0f4c81] px-4 py-3 text-sm font-bold text-white shadow-xl shadow-slate-950/25 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#0a3a61] hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:bottom-6 sm:right-6 sm:px-5 sm:py-3.5"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
        <MessageCircle
          size={15}
          aria-hidden="true"
        />
      </span>

      <span>Get in touch</span>

      <ArrowUpRight
        size={16}
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}
