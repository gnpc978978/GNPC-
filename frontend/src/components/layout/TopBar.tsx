"use client";

import { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HiCalendarDays, HiClock } from "react-icons/hi2";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";

export default function TopBar() {
  const { settings } = useWebsiteSettings();
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:true}));
      setDate(now.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"}));
    };
    update();
    const timer=window.setInterval(update,60_000);
    return ()=>window.clearInterval(timer);
  },[]);

  const socialLinks=[
    {label:"Facebook",href:settings.socialLinks?.facebook||"",icon:FaFacebookF},
    {label:"Instagram",href:settings.socialLinks?.instagram||"",icon:FaInstagram},
    {label:"X",href:settings.socialLinks?.twitter||"",icon:FaXTwitter},
  ].filter(x=>Boolean(x.href));

  return (
    <div className="relative z-[130] w-full overflow-hidden border-b border-white/10 bg-[#07172b] text-white/80">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c9a45c]/70 to-transparent"/>
      <div className="gnpc-container flex min-h-[38px] items-center justify-between gap-3 sm:min-h-[40px]">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-2">
          </div>
          <span className="hidden h-4 w-px bg-white/15 sm:block"/>
          <span className="hidden text-[10px] font-bold uppercase tracking-[.12em] text-white/45 md:inline">Est. 2003</span>
          <span className="hidden text-[10px] font-extrabold uppercase tracking-[.12em] text-[#e8d7ad] lg:inline">23 Years of Truthful Journalism</span>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-2 lg:flex">
            <HiCalendarDays size={13} className="text-[#c9a45c]" aria-hidden="true"/>
            <span className="text-[10px] font-bold uppercase tracking-[.06em] text-white/50">{date}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[.06] px-3 py-1.5">
            <span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full bg-[#c9a45c]/40"/><span className="relative h-2 w-2 rounded-full bg-[#c9a45c]"/></span>
            <HiClock size={13} className="text-white/45" aria-hidden="true"/>
            <span className="whitespace-nowrap text-[10px] font-black tracking-[.08em] text-white sm:text-xs">{time}</span>
          </div>
          {socialLinks.length>0 && <div className="hidden items-center gap-1 md:flex">
            {socialLinks.map(({label,href,icon:Icon})=>(
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[.05] text-white/55 transition duration-300 hover:-translate-y-1 hover:border-[#c9a45c] hover:bg-[#c9a45c] hover:text-[#0b1f3a]">
                <Icon size={11} aria-hidden="true"/>
              </a>
            ))}
          </div>}
        </div>
      </div>
    </div>
  );
}
