"use client";

import { useEffect, useState } from "react";

import {
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HiCalendarDays, HiClock } from "react-icons/hi2";

import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";

export default function TopBar() {
  const { settings } = useWebsiteSettings();

  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );

      setDate(
        now.toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    };

    updateDateTime();
    const timer = window.setInterval(updateDateTime, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const socialLinks = [
    {
      label: "Facebook",
      href: settings.socialLinks?.facebook || "",
      icon: FaFacebookF,
    },
    {
      label: "Instagram",
      href: settings.socialLinks?.instagram || "",
      icon: FaInstagram,
    },
    {
      label: "X",
      href: settings.socialLinks?.twitter || "",
      icon: FaXTwitter,
    },
  ].filter((item) => Boolean(item.href));

  return (
    <div className="relative z-[130] w-full overflow-hidden border-b border-slate-200 bg-[#eef1f4] text-slate-700">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8102e]/60 to-transparent"
      />

      <div className="mx-auto flex min-h-[40px] w-full max-w-[1500px] items-center justify-between gap-3 px-3 sm:min-h-[42px] sm:px-5 lg:px-7 xl:px-9">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <div className="group flex shrink-0 items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#c8102e] shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md">
              <FaMapMarkerAlt size={10} aria-hidden="true" />
            </span>
            <span className="hidden text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-600 sm:inline">
              Greater Noida
            </span>
          </div>

          <span aria-hidden="true" className="hidden h-5 w-px bg-slate-300 sm:block" />

          <span className="hidden text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 md:inline">
            Est. 2003
          </span>

          <span className="hidden text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-700 lg:inline">
            23 Years of Truthful Journalism
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-2 lg:flex">
            <HiCalendarDays size={13} className="text-[#c8102e]" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-slate-500">
              {date}
            </span>
          </div>

          <div className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c8102e]/40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#c8102e]" />
            </span>
            <HiClock size={13} className="text-slate-500" aria-hidden="true" />
            <span className="whitespace-nowrap text-[10px] font-black tracking-[0.08em] text-slate-700 sm:text-xs">
              {time}
            </span>
          </div>

          {socialLinks.length > 0 && (
            <div className="hidden items-center gap-1 md:flex">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-900 hover:text-white hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]"
                >
                  <Icon size={11} aria-hidden="true" className="transition-transform duration-300 group-hover:scale-110" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
