"use client";

import { MessageCircle } from "lucide-react";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";

function normalizeWhatsAppNumber(value: string) {
  return value.replace(/\D/g, "");
}

export default function FloatingContactButton() {
  const { settings } = useWebsiteSettings();

  const rawNumber =
    settings.whatsappNumber?.trim() ||
    settings.phone?.trim() ||
    "";

  const number = normalizeWhatsAppNumber(rawNumber);
  const label = settings.whatsappLabel?.trim() || "WhatsApp";

  if (!number) {
    return null;
  }

  const whatsappUrl = `https://wa.me/${number}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} - Greater Noida Press Club`}
      title={label}
      className="
        group
        fixed
        bottom-5
        right-4
        z-[999]
        inline-flex
        min-h-12
        items-center
        gap-2
        rounded-full
        bg-[#25D366]
        px-4
        py-3
        text-sm
        font-bold
        text-white
        shadow-xl
        shadow-slate-950/20
        transition-all
        duration-300
        hover:-translate-y-1
        hover:bg-[#1ebe5d]
        hover:shadow-2xl
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#25D366]
        focus-visible:ring-offset-2
        sm:bottom-6
        sm:right-6
        sm:px-5
        sm:py-3.5
      "
    >
      <span
        aria-hidden="true"
        className="
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-white/15
        "
      >
        <MessageCircle size={17} />
      </span>

      <span>{label}</span>
    </a>
  );
}
