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
          weekday: "short",
          day: "numeric",
          month: "short",
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
    <div
      className={[
        "relative",
        "z-[110]",
        "w-full",
        "overflow-hidden",
        "border-b",
        "border-white/10",
        "bg-[#061827]",
        "text-white",
      ].join(" ")}
    >
      {/* Animated ambient light */}

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none",
          "absolute",
          "-left-20",
          "top-1/2",
          "h-24",
          "w-72",
          "-translate-y-1/2",
          "rounded-full",
          "bg-[#155eef]/20",
          "blur-3xl",
        ].join(" ")}
      />

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none",
          "absolute",
          "right-0",
          "top-0",
          "h-full",
          "w-1/3",
          "bg-gradient-to-l",
          "from-[#c8102e]/10",
          "to-transparent",
        ].join(" ")}
      />

      <div
        className={[
          "relative",
          "mx-auto",
          "flex",
          "h-[40px]",
          "max-w-[90rem]",
          "items-center",
          "justify-between",
          "gap-4",
          "px-4",
          "sm:px-6",
          "lg:px-8",
        ].join(" ")}
      >
        {/* LEFT */}

        <div
          className={[
            "flex",
            "min-w-0",
            "items-center",
            "gap-3",
            "sm:gap-5",
          ].join(" ")}
        >
          {/* Live marker */}

          <div
            className={[
              "hidden",
              "items-center",
              "gap-2",
              "sm:flex",
            ].join(" ")}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={[
                  "absolute",
                  "inline-flex",
                  "h-full",
                  "w-full",
                  "animate-ping",
                  "rounded-full",
                  "bg-[#c8102e]",
                  "opacity-60",
                ].join(" ")}
              />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#c8102e]" />
            </span>

            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/65">
              GNPC Live
            </span>
          </div>

          {/* Location */}

          <div
            className={[
              "flex",
              "items-center",
              "gap-1.5",
              "border-l",
              "border-white/10",
              "pl-3",
              "sm:pl-5",
            ].join(" ")}
          >
            <FaMapMarkerAlt
              size={10}
              className="text-[#8bbcff]"
              aria-hidden="true"
            />

            <span className="whitespace-nowrap text-[9px] font-bold tracking-wide text-white/80 sm:text-[10px]">
              Greater Noida
            </span>
          </div>

          {/* Scrolling editorial message */}

          <div className="hidden min-w-0 overflow-hidden md:block">
            <div
              className={[
                "whitespace-nowrap",
                "text-[9px]",
                "font-semibold",
                "uppercase",
                "tracking-[0.13em]",
                "text-white/45",
              ].join(" ")}
            >
              Est. 2003
              <span className="mx-2 text-[#c8102e]">
                •
              </span>
              23 Years of Truthful Journalism
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div
          className={[
            "flex",
            "shrink-0",
            "items-center",
            "gap-2",
            "sm:gap-4",
          ].join(" ")}
        >
          {/* Date */}

          <div className="hidden items-center gap-2 lg:flex">
            <HiCalendarDays
              size={12}
              className="text-[#8bbcff]"
              aria-hidden="true"
            />

            <span className="text-[10px] font-semibold text-white/60">
              {date}
            </span>
          </div>

          {/* Time */}

          <div
            className={[
              "flex",
              "items-center",
              "gap-1.5",
              "border-l",
              "border-white/10",
              "pl-2",
              "sm:pl-4",
            ].join(" ")}
          >
            <HiClock
              size={12}
              className="text-[#8bbcff]"
              aria-hidden="true"
            />

            <span className="whitespace-nowrap font-mono text-[9px] font-bold tabular-nums text-white/80 sm:text-[10px]">
              {time}
            </span>
          </div>

          {/* Social */}

          {socialLinks.length > 0 && (
            <div
              className={[
                "hidden",
                "items-center",
                "gap-1",
                "border-l",
                "border-white/10",
                "pl-3",
                "sm:flex",
              ].join(" ")}
            >
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
                      "group/social",
                      "relative",
                      "flex",
                      "h-6",
                      "w-6",
                      "items-center",
                      "justify-center",
                      "rounded-full",
                      "text-white/45",
                      "transition-all",
                      "duration-200",
                      "hover:-translate-y-0.5",
                      "hover:bg-white/10",
                      "hover:text-white",
                    ].join(" ")}
                  >
                    <Icon
                      size={10}
                      aria-hidden="true"
                    />

                    <span
                      aria-hidden="true"
                      className={[
                        "absolute",
                        "bottom-0",
                        "h-px",
                        "w-0",
                        "bg-[#8bbcff]",
                        "transition-all",
                        "duration-200",
                        "group-hover/social:w-3",
                      ].join(" ")}
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
