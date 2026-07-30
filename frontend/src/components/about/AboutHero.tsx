"use client";

import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";

export default function AboutHero() {
  const { settings } = useWebsiteSettings();
  return <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 py-24 text-white"><div className="mx-auto max-w-7xl px-6 text-center"><h1 className="text-4xl font-bold md:text-5xl">{settings.siteName || "Press Club"}</h1><p className="mx-auto mt-5 max-w-2xl text-lg text-blue-100">Dedicated to empowering journalists, encouraging ethical reporting, and strengthening the voice of independent media.</p></div></section>;
}
