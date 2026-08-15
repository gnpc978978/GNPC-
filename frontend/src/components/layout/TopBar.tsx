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
    <div
      className={[
        "relative",
        "z-50",
        "w-full",
        "overflow-hidden",
        "border-b",
        "border-white/10",
        "bg-[#092f4f]",
        "text-white",
      ].join(" ")}
    >
      {/* Subtle premium highlight */}
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none",
          "absolute",
          "inset-0",
          "bg-[linear-gradient(90deg,rgba(255,255,255,0.025),transparent_35%,rgba(255,255,255,0.025))]",
        ].join(" ")}
      />

      <div
        className={[
          "relative",
          "mx-auto",
          "flex",
          "min-h-[42px]",
          "max-w-[80rem]",
          "items-center",
          "justify-between",
          "gap-3",
          "px-4",
          "sm:min-h-[44px]",
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
            "sm:gap-4",
          ].join(" ")}
        >
          {/* Location */}

          <div
            className={[
              "flex",
              "shrink-0",
              "items-center",
              "gap-1.5",
              "text-white/90",
              "sm:gap-2",
            ].join(" ")}
          >
            <FaMapMarkerAlt
              size={11}
              className="text-white/55"
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

          {/* Vertical divider */}

          <span
            aria-hidden="true"
            className="h-4 w-px bg-white/15"
          />

          {/* Established message */}

          <div
            className={[
              "hidden",
              "items-center",
              "text-[10px]",
              "font-medium",
              "tracking-[0.04em]",
              "text-white/65",
              "sm:flex",
              "sm:text-[11px]",
            ].join(" ")}
          >
            Est. 2003
          </div>

          <span
            aria-hidden="true"
            className="hidden h-1 w-1 rounded-full bg-white/25 sm:block"
          />

          <div
            className={[
              "hidden",
              "items-center",
              "text-[10px]",
              "font-semibold",
              "tracking-[0.025em]",
              "text-white/85",
              "md:flex",
              "sm:text-[11px]",
            ].join(" ")}
          >
            23 Years of Truthful Journalism
          </div>
        </div>

        {/* =====================================================
            RIGHT SIDE
            ===================================================== */}

        <div
          className={[
            "flex",
            "shrink-0",
            "items-center",
            "gap-2",
            "sm:gap-3",
            "lg:gap-5",
          ].join(" ")}
        >
          {/* Date */}

          <div
            className={[
              "hidden",
              "items-center",
              "gap-2",
              "lg:flex",
            ].join(" ")}
          >
            <HiCalendarDays
              size={13}
              className="text-white/45"
              aria-hidden="true"
            />

            <span
              className={[
                "whitespace-nowrap",
                "text-[11px]",
                "font-medium",
                "tracking-wide",
                "text-white/70",
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
              "sm:gap-2",
            ].join(" ")}
          >
            <HiClock
              size={13}
              className="text-white/45"
              aria-hidden="true"
            />

            <span
              className={[
                "whitespace-nowrap",
                "text-[9px]",
                "font-semibold",
                "tabular-nums",
                "tracking-wide",
                "text-white/85",
                "sm:text-[11px]",
              ].join(" ")}
            >
              {time}
            </span>
          </div>

          {/* Social links */}

          {socialLinks.length > 0 && (
            <>
              <span
                aria-hidden="true"
                className="hidden h-5 w-px bg-white/10 sm:block"
              />

              <div className="hidden items-center gap-0.5 sm:flex">
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
                        "text-white/50",
                        "transition-all",
                        "duration-200",
                        "hover:bg-white/10",
                        "hover:text-white",
                        "focus-visible:outline-none",
                        "focus-visible:ring-2",
                        "focus-visible:ring-white",
                        "focus-visible:ring-offset-2",
                        "focus-visible:ring-offset-[#092f4f]",
                      ].join(" ")}
                    >
                      <Icon
                        size={11}
                        aria-hidden="true"
                      />
                    </a>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
