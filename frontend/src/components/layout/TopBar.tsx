"use client";

import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HiClock, HiCalendarDays } from "react-icons/hi2";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";

export default function TopBar() {
  const { settings } = useWebsiteSettings();
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
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

    update();

    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-950 text-white border-b border-slate-800">
      <div className="mx-auto flex min-h-11 max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-2 sm:justify-between sm:px-6">

        {/* Left */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs sm:justify-start sm:gap-6 sm:text-sm">

          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-500" />
            <span>Greater Noida</span>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <HiCalendarDays className="text-yellow-400 text-base" />
            <span>{date}</span>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <HiClock className="text-sky-400 text-base" />
            <span>{time}</span>
          </div>
        </div>

        {/* Right */}
        <div className="hidden items-center gap-5 sm:flex">

          {settings.socialLinks?.facebook && <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="transition hover:text-blue-500"><FaFacebookF /></a>}
          {settings.socialLinks?.instagram && <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="transition hover:text-pink-500"><FaInstagram /></a>}
          {settings.socialLinks?.twitter && <a href={settings.socialLinks.twitter} target="_blank" rel="noreferrer" className="transition hover:text-white"><FaXTwitter /></a>}

        </div>

      </div>

    </div>
  );
}
