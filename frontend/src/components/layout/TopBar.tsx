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

    return () => {
      window.clearInterval(timer);
    };
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
    <div className="relative w-full overflow-hidden bg-[#4a515b] text-white">
      {/* subtle top accent */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#c8102e] via-[#d6a928] to-[#0f4c81]"
      />

      <div
        className={[
          "mx-auto flex min-h-[48px]",
          "max-w-7xl items-center justify-between",
          "gap-3 px-4 sm:px-6 lg:px-8",
        ].join(" ")}
      >
        {/* LEFT */}

        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <div className="flex shrink-0 items-center gap-2">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full bg-[#d6a928] shadow-[0_0_10px_rgba(214,169,40,0.45)]"
            />

            <FaMapMarkerAlt
              size={11}
              className="text-white/75"
              aria-hidden="true"
            />

            <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.12em] sm:text-xs">
              Greater Noida
            </span>
          </div>

          <div className="hidden h-5 w-px bg-white/20 sm:block" />

          <div className="hidden items-center text-[10px] font-semibold uppercase tracking-[0.12em] text-white/65 md:flex">
            Est. 2003
          </div>

          <div className="hidden h-5 w-px bg-white/20 lg:block" />

          <div className="hidden text-[10px] font-bold uppercase tracking-[0.12em] text-white/85 lg:block">
            23 Years of Truthful Journalism
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          {/* Date */}

          <div className="hidden items-center gap-2 lg:flex">
            <HiCalendarDays
              size={14}
              className="text-[#d6a928]"
              aria-hidden="true"
            />

            <span className="text-xs font-semibold text-white/80">
              {date}
            </span>
          </div>

          {/* Time */}

          <div className="flex items-center gap-2">
            <HiClock
              size={15}
              className="text-[#c8102e]"
              aria-hidden="true"
            />

            <span className="whitespace-nowrap font-mono text-[10px] font-bold tracking-wide text-white sm:text-xs">
              {time}
            </span>
          </div>

          {/* Social */}

          {socialLinks.length > 0 && (
            <div className="hidden items-center gap-1 border-l border-white/15 pl-3 sm:flex">
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
                    className={[
                      "flex h-7 w-7 items-center justify-center",
                      "rounded-lg",
                      "text-white/60",
                      "transition-all duration-300",
                      "hover:-translate-y-0.5",
                      "hover:bg-white/10",
                      "hover:text-white",
                      "focus-visible:outline-none",
                      "focus-visible:ring-2",
                      "focus-visible:ring-white",
                    ].join(" ")}
                  >
                    <Icon
                      size={12}
                      aria-hidden="true"
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
