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
    <div className="w-full bg-[#0f4c81] text-white">
      <div
        className={[
          "mx-auto",
          "flex",
          "min-h-[48px]",
          "max-w-7xl",
          "items-center",
          "justify-between",
          "gap-2",
          "px-4",
          "sm:px-6",
          "lg:px-8",
        ].join(" ")}
      >
        {/* =====================================================
            LEFT SIDE
            ===================================================== */}

        <div
          className={[
            "flex",
            "min-w-0",
            "items-center",
            "gap-2",
            "sm:gap-5",
          ].join(" ")}
        >
          {/* Location */}

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <FaMapMarkerAlt
              size={11}
              className="text-white/75"
              aria-hidden="true"
            />

            <span className="whitespace-nowrap text-[9px] font-medium sm:text-xs">
              Greater Noida
            </span>
          </div>

          {/* Established message */}

          <div
            className={[
              "flex",
              "items-center",
              "border-l",
              "border-white/20",
              "pl-2",
              "text-[8px]",
              "font-medium",
              "tracking-normal",
              "text-white/90",
              "whitespace-nowrap",
              "sm:text-[11px]",
              "sm:tracking-wide",
              "sm:pl-5",
            ].join(" ")}
          >
            Est. 2003 – 23 Years of Truthful Journalism
          </div>
        </div>

        {/* =====================================================
            RIGHT SIDE
            ===================================================== */}

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {/* Date */}

          <div className="hidden items-center gap-2 lg:flex">
            <HiCalendarDays
              size={11}
              className="text-white/70"
              aria-hidden="true"
            />

            <span className="text-xs font-medium text-white/90">
              {date}
            </span>
          </div>

          {/* Time */}

          <div className="flex items-center gap-1 sm:gap-2">
            <HiClock
              size={14}
              className="text-white/70"
              aria-hidden="true"
            />

            <span className="whitespace-nowrap text-[9px] font-medium text-white/90 sm:text-xs">
              {time}
            </span>
          </div>

          {/* Social links */}

          {socialLinks.length > 0 && (
            <div className="hidden items-center gap-1 sm:flex">
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
                      "flex",
                      "h-7",
                      "w-7",
                      "items-center",
                      "justify-center",
                      "rounded-full",
                      "text-white/75",
                      "transition-colors",
                      "duration-200",
                      "hover:bg-white/10",
                      "hover:text-white",
                      "focus-visible:outline-none",
                      "focus-visible:ring-2",
                      "focus-visible:ring-white",
                      "focus-visible:ring-offset-2",
                      "focus-visible:ring-offset-[#0f4c81]",
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
