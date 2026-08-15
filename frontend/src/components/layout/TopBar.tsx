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
      href:
        settings.socialLinks?.facebook || "",
      icon: FaFacebookF,
    },
    {
      label: "Instagram",
      href:
        settings.socialLinks?.instagram || "",
      icon: FaInstagram,
    },
    {
      label: "X",
      href:
        settings.socialLinks?.twitter || "",
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
        "bg-[#071c2d]",
        "text-white",
      ].join(" ")}
    >
      {/* =====================================================
          SUBTLE BACKGROUND DETAIL
          ===================================================== */}

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none",
          "absolute",
          "inset-0",
          "opacity-40",
        ].join(" ")}
      >
        <div
          className={[
            "absolute",
            "left-0",
            "top-0",
            "h-full",
            "w-48",
            "bg-gradient-to-r",
            "from-[#155eef]/10",
            "to-transparent",
          ].join(" ")}
        />

        <div
          className={[
            "absolute",
            "right-0",
            "top-0",
            "h-full",
            "w-72",
            "bg-gradient-to-l",
            "from-[#155eef]/10",
            "to-transparent",
          ].join(" ")}
        />
      </div>

      <div
        className={[
          "relative",
          "mx-auto",
          "flex",
          "min-h-[38px]",
          "max-w-[80rem]",
          "items-center",
          "justify-between",
          "gap-4",
          "px-4",
          "sm:min-h-[40px]",
          "sm:px-6",
          "lg:px-8",
        ].join(" ")}
      >
        {/* =================================================
            LEFT
            ================================================= */}

        <div
          className={[
            "flex",
            "min-w-0",
            "items-center",
            "gap-3",
            "sm:gap-5",
          ].join(" ")}
        >
          {/* Location */}

          <div
            className={[
              "flex",
              "shrink-0",
              "items-center",
              "gap-1.5",
              "text-white/85",
            ].join(" ")}
          >
            <FaMapMarkerAlt
              size={10}
              className="text-[#7eb0ff]"
              aria-hidden="true"
            />

            <span
              className={[
                "whitespace-nowrap",
                "text-[9px]",
                "font-semibold",
                "tracking-wide",
                "sm:text-[11px]",
              ].join(" ")}
            >
              Greater Noida
            </span>
          </div>

          {/* Divider */}

          <span
            aria-hidden="true"
            className="hidden h-4 w-px bg-white/15 sm:block"
          />

          {/* Established */}

          <div
            className={[
              "hidden",
              "items-center",
              "text-[10px]",
              "font-medium",
              "tracking-wide",
              "text-white/60",
              "sm:flex",
              "sm:text-[11px]",
            ].join(" ")}
          >
            Est. 2003
          </div>

          <span
            aria-hidden="true"
            className="hidden h-1 w-1 rounded-full bg-[#c8102e] sm:block"
          />

          <div
            className={[
              "hidden",
              "text-[10px]",
              "font-semibold",
              "tracking-wide",
              "text-white/75",
              "md:block",
              "md:text-[11px]",
            ].join(" ")}
          >
            23 Years of Truthful Journalism
          </div>
        </div>

        {/* =================================================
            RIGHT
            ================================================= */}

        <div
          className={[
            "flex",
            "shrink-0",
            "items-center",
            "gap-2.5",
            "sm:gap-4",
          ].join(" ")}
        >
          {/* Date */}

          <div
            className={[
              "hidden",
              "items-center",
              "gap-2",
              "border-l",
              "border-white/10",
              "pl-4",
              "lg:flex",
            ].join(" ")}
          >
            <HiCalendarDays
              size={13}
              className="text-[#7eb0ff]"
              aria-hidden="true"
            />

            <span
              className={[
                "text-[10px]",
                "font-medium",
                "tracking-wide",
                "text-white/65",
              ].join(" ")}
            >
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
              "pl-3",
              "sm:gap-2",
              "sm:pl-4",
            ].join(" ")}
          >
            <HiClock
              size={13}
              className="text-[#7eb0ff]"
              aria-hidden="true"
            />

            <span
              className={[
                "whitespace-nowrap",
                "text-[9px]",
                "font-bold",
                "tracking-wide",
                "text-white/85",
                "tabular-nums",
                "sm:text-[11px]",
              ].join(" ")}
            >
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
                "sm:pl-4",
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
                      "flex",
                      "h-6.5",
                      "w-6.5",
                      "items-center",
                      "justify-center",
                      "rounded-md",
                      "border",
                      "border-white/10",
                      "text-white/55",
                      "transition-all",
                      "duration-200",
                      "hover:border-white/20",
                      "hover:bg-white/10",
                      "hover:text-white",
                      "focus-visible:outline-none",
                      "focus-visible:ring-2",
                      "focus-visible:ring-white",
                    ].join(" ")}
                  >
                    <Icon
                      size={10}
                      aria-hidden="true"
                    />
                  </a>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          EDITORIAL ACCENT
          ===================================================== */}

      <div
        aria-hidden="true"
        className={[
          "absolute",
          "bottom-0",
          "left-0",
          "h-px",
          "w-24",
          "bg-[#c8102e]",
        ].join(" ")}
      />

      <div
        aria-hidden="true"
        className={[
          "absolute",
          "bottom-0",
          "right-0",
          "h-px",
          "w-32",
          "bg-[#155eef]",
        ].join(" ")}
      />
    </div>
  );
}
