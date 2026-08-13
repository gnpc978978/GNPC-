"use client";

import Image from "next/image";
import Link from "next/link";

import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";

type LogoProps = {
  variant?: "light" | "dark";
};

export default function Logo({
  variant = "dark",
}: LogoProps) {
  const { settings } =
    useWebsiteSettings();

  const siteName =
    settings.siteName ||
    "Greater Noida Press Club";

  const logo =
    settings.logo ||
    "/Logo.png";

  const isDark =
    variant === "dark";

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

          isDark
            ? "bg-white"
            : "bg-white/10",
        ].join(" ")}
      >
        <Image
          src={logo}
          alt={siteName}
          width={44}
          height={44}
          priority
          className="h-11 w-11 object-contain"
        />
      </span>

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

            isDark
              ? "text-slate-900 group-hover:text-[#0f4c81]"
              : "text-white",

            "transition-colors",
            "duration-200",
          ].join(" ")}
        >
          {siteName}
        </span>

        <span
          className={[
            "mt-0.5",
            "block",

            "text-[10px]",
            "font-semibold",
            "uppercase",
            "tracking-[0.13em]",

            isDark
              ? "text-slate-400"
              : "text-white/55",
          ].join(" ")}
        >
          Greater Noida
        </span>
      </span>
    </Link>
  );
}
