"use client";

import { useEffect, useState } from "react";

import {
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

import {
  HiCalendarDays,
  HiClock,
} from "react-icons/hi2";

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

    const timer = window.setInterval(
      updateDateTime,
      1000
    );

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
    <div className="relative z-[110] w-full overflow-hidden bg-[#050d18] text-white">
      {/* Ambient accent */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(21,94,239,.22),transparent_24%),radial-gradient(circle_at_85%_50%,rgba(215,25,63,.12),transparent_22%)]"
      />

      {/* Top accent line */}
      <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-[#d7193f] via-[#155eef] to-[#d7193f]" />

      <div className="relative mx-auto flex min-h-[42px] max-w-[82rem] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

        <div className="flex min-w-0 items-center gap-3 sm:gap-5">

          <div className="flex shrink-0 items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d7193f] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d7193f]" />
            </span>

            <FaMapMarkerAlt
              size={11}
              className="text-white/60"
              aria-hidden="true"
            />

            <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.12em] text-white/85 sm:text-xs">
              Greater Noida
            </span>
          </div>

          <div className="hidden h-4 w-px bg-white/15 sm:block" />

          <span className="hidden whitespace-nowrap text-[10px] font-semibold tracking-[0.08em] text-white/50 md:block">
            EST. 2003
          </span>

          <span className="hidden whitespace-nowrap text-[10px] font-semibold text-white/70 lg:block">
            23 YEARS OF TRUTHFUL JOURNALISM
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">

          <div className="hidden items-center gap-2 xl:flex">
            <HiCalendarDays
              size={13}
              className="text-[#155eef]"
              aria-hidden="true"
            />

            <span className="text-[10px] font-semibold tracking-wide text-white/65">
              {date}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <HiClock
              size={13}
              className="text-[#d7193f]"
              aria-hidden="true"
            />

            <span className="font-mono text-[10px] font-bold tracking-wide text-white sm:text-xs">
              {time}
            </span>
          </div>

          {socialLinks.length > 0 && (
            <div className="hidden items-center gap-1 border-l border-white/10 pl-3 sm:flex">
              {socialLinks.map(
                ({
                  label,
                  href,
                  icon: Icon,
                }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="group flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-white/50 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#155eef]/50 hover:bg-[#155eef] hover:text-white"
                  >
                    <Icon
                      size={11}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </a>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
