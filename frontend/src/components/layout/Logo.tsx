"use client";

import Image from "next/image";
import Link from "next/link";

import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";

export default function Logo() {
  const { settings } =
    useWebsiteSettings();

  const siteName =
    settings.siteName ||
    "Greater Noida Press Club";

  const logo =
    settings.logo ||
    "/Logo.png";

  return (
    <Link
      href="/"
      aria-label={`${siteName} home`}
      className={[
        "group",
        "inline-flex",
        "items-center",
        "gap-3",

        "rounded-xl",

        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-[#0f4c81]",
        "focus-visible:ring-offset-4",
      ].join(" ")}
    >
      {/* Logo image */}
      <span
        className={[
          "flex",
          "h-11",
          "w-11",
          "shrink-0",
          "items-center",
          "justify-center",

          "overflow-hidden",
          "rounded-xl",

          "bg-white",
        ].join(" ")}
      >
        <Image
          src={logo}
          alt={siteName}
          width={44}
          height={44}
          priority
          className={[
            "h-11",
            "w-11",
            "object-contain",

            "transition-transform",
            "duration-200",

            "group-hover:scale-[1.03]",
          ].join(" ")}
        />
      </span>

      {/* Website name */}
      <span className="hidden min-w-0 sm:block">
        <span
          className={[
            "block",
            "max-w-[220px]",

            "truncate",

            "text-[15px]",
            "font-extrabold",
            "leading-tight",

            "tracking-[-0.01em]",

            "text-slate-900",

            "transition-colors",
            "duration-200",

            "group-hover:text-[#0f4c81]",
          ].join(" ")}
        >
          {siteName}
        </span>

        <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
          Greater Noida
        </span>
      </span>
    </Link>
  );
}
