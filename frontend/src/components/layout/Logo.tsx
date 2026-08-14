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
        "rounded-lg",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-[#0f4c81]",
        "focus-visible:ring-offset-2",
      ].join(" ")}
    >
      {/* Logo */}

      <span
        className={[
          "flex",
          "h-11",
          "w-11",
          "shrink-0",
          "items-center",
          "justify-center",
          "overflow-hidden",
          "rounded-full",
          "border",
          "border-slate-200",
          "bg-white",
          isDark
            ? ""
            : "border-white/20",
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

      {/* Brand text */}

      <span className="block min-w-0">
        <span
          className={[
            "block",
            "max-w-[165px]",
            "truncate",
            "text-[13px]",
            "font-extrabold",
            "leading-tight",
            "tracking-[-0.02em]",
            "sm:max-w-[230px]",
            "sm:text-[16px]",
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
            "mt-1",
            "block",
            "text-[9px]",
            "font-bold",
            "uppercase",
            "tracking-[0.16em]",
            isDark
              ? "text-slate-400"
              : "text-white/60",
          ].join(" ")}
        >
          GNPC · Greater Noida
        </span>
      </span>
    </Link>
  );
}
