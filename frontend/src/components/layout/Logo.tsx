"use client";

import Image from "next/image";
import Link from "next/link";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";

export default function Logo() {
  const { settings } = useWebsiteSettings();
  return (
    <Link href="/" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      <Image
        src={settings.logo || "/Logo.png"}
        alt={settings.siteName || "Press Club"}
        width={44}
        height={44}
        priority
        className="object-contain"
      />

      <div className="hidden sm:block">
        <h2 className="text-[15px] font-bold leading-tight text-slate-900">
          {settings.siteName || "Press Club"}
        </h2>

        <p className="text-xs text-slate-500">
          Press Club
        </p>
      </div>
    </Link>
  );
}
