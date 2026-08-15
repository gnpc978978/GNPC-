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
        "group/logo",
        "relative",
        "inline-flex",
        "items-center",
        "gap-3",
        "rounded-xl",
        "py-1",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-[#155eef]",
        "focus-visible:ring-offset-2",
      ].join(" ")}
    >
      {/* Logo mark */}

      <span
        className={[
          "relative",
          "flex",
          "h-12",
          "w-12",
          "shrink-0",
          "items-center",
          "justify-center",
          "overflow-hidden",
          "rounded-[14px]",
          "border",
          "border-slate-200",
          "bg-white",
          "shadow-[0_5px_18px_rgba(15,23,42,0.07)]",
          "transition-all",
          "duration-300",
          "group-hover/logo:-translate-y-0.5",
          "group-hover/logo:rotate-1",
          "group-hover/logo:border-[#155eef]/30",
          "group-hover/logo:shadow-[0_10px_25px_rgba(21,94,239,0.16)]",
        ].join(" ")}
      >
        {/* Brand glow */}

        <span
          aria-hidden="true"
          className={[
            "absolute",
            "inset-0",
            "bg-gradient-to-br",
            "from-[#155eef]/10",
            "via-transparent",
            "to-[#c8102e]/10",
            "opacity-0",
            "transition-opacity",
            "duration-300",
            "group-hover/logo:opacity-100",
          ].join(" ")}
        />

        <Image
          src={logo}
          alt={siteName}
          width={48}
          height={48}
          priority
          className={[
            "relative",
            "z-10",
            "h-12",
            "w-12",
            "object-contain",
            "transition-transform",
            "duration-500",
            "group-hover/logo:scale-105",
          ].join(" ")}
        />

        {/* Corner accent */}

        <span
          aria-hidden="true"
          className={[
            "absolute",
            "bottom-0",
            "right-0",
            "h-2.5",
            "w-2.5",
            "rounded-tl-md",
            "bg-[#c8102e]",
            "opacity-80",
            "transition-all",
            "duration-300",
            "group-hover/logo:h-3.5",
            "group-hover/logo:w-3.5",
          ].join(" ")}
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
            "font-black",
            "leading-tight",
            "tracking-[-0.025em]",
            "transition-all",
            "duration-300",
            "sm:max-w-[235px]",
            "sm:text-[16px]",
            isDark
              ? "text-[#0b1f33] group-hover/logo:text-[#0f4c81]"
              : "text-white",
          ].join(" ")}
        >
          {siteName}
        </span>

        <span
          className={[
            "mt-1",
            "flex",
            "items-center",
            "gap-1.5",
            "text-[8px]",
            "font-black",
            "uppercase",
            "tracking-[0.18em]",
            "sm:text-[9px]",
            isDark
              ? "text-slate-400"
              : "text-white/60",
          ].join(" ")}
        >
          <span
            aria-hidden="true"
            className="h-1 w-1 rounded-full bg-[#c8102e]"
          />

          GNPC
          <span className="text-slate-300">
            •
          </span>
          Greater Noida
        </span>
      </span>
    </Link>
  );
}
