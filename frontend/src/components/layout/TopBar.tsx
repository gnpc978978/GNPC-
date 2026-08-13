"use client";

import { useEffect, useState } from "react";

import {
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

import {
  FaMapMarkerAlt,
} from "react-icons/fa";

import {
  HiClock,
  HiCalendarDays,
} from "react-icons/hi2";

import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";

export default function TopBar() {
  const { settings } =
    useWebsiteSettings();

  const [time, setTime] =
    useState("");

  const [date, setDate] =
    useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }
        )
      );

      setDate(
        now.toLocaleDateString(
          "en-IN",
          {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        )
      );
    };

    updateDateTime();

    const timer =
      window.setInterval(
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
      href:
        settings.socialLinks
          ?.facebook || "",
      icon: FaFacebookF,
    },
    {
      label: "Instagram",
      href:
        settings.socialLinks
          ?.instagram || "",
      icon: FaInstagram,
    },
    {
      label: "X",
      href:
        settings.socialLinks
          ?.twitter || "",
      icon: FaXTwitter,
    },
  ].filter(
    (item) => Boolean(item.href)
  );

  return (
    <div
      className={[
        "border-b",
        "border-white/10",

        "bg-[#0a3a61]",

        "text-white",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto",
          "flex",
          "min-h-10",
          "max-w-7xl",

          "flex-wrap",
          "items-center",
          "justify-between",

          "gap-x-6",
          "gap-y-1",

          "px-4",
          "py-2",

          "sm:px-6",
          "lg:px-8",
        ].join(" ")}
      >
        {/* ---------------------------------------------
            LEFT INFORMATION
           --------------------------------------------- */}
        <div
          className={[
            "flex",
            "flex-wrap",
            "items-center",

            "gap-x-5",
            "gap-y-1",

            "text-[11px]",
            "font-medium",

            "sm:text-xs",
          ].join(" ")}
        >
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt
              size={12}
              className="text-white/70"
              aria-hidden="true"
            />

            <span>
              Greater Noida
            </span>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <HiCalendarDays
              size={14}
              className="text-white/70"
              aria-hidden="true"
            />

            <span>
              {date}
            </span>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <HiClock
              size={14}
              className="text-white/70"
              aria-hidden="true"
            />

            <span>
              {time}
            </span>
          </div>
        </div>

        {/* ---------------------------------------------
            SOCIAL LINKS
           --------------------------------------------- */}
        {socialLinks.length > 0 && (
          <div className="hidden items-center gap-2 sm:flex">
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

                    "rounded-lg",

                    "text-white/70",

                    "transition-colors",
                    "duration-200",

                    "hover:bg-white/10",
                    "hover:text-white",

                    "focus-visible:outline-none",
                    "focus-visible:ring-2",
                    "focus-visible:ring-white",
                    "focus-visible:ring-offset-1",
                    "focus-visible:ring-offset-[#0a3a61]",
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
  );
}
