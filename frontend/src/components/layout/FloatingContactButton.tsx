"use client";

import { MessageCircle } from "lucide-react";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";

function normalizeWhatsAppNumber(value: string) {
  return value.replace(/\D/g, "");
}

export default function FloatingContactButton() {
  const { settings } = useWebsiteSettings();

  /*
   * WhatsApp number is controlled from CMS.
   *
   * Preferred:
   *   settings.whatsappNumber
   *
   * Fallback:
   *   settings.phone
   *
   * The CMS number can contain:
   * +91 98765 43210
   * 91-9876543210
   * 919876543210
   *
   * All non-numeric characters are removed before
   * creating the WhatsApp URL.
   */
  const whatsappNumber = normalizeWhatsAppNumber(
    settings.whatsappNumber || settings.phone || ""
  );

  /*
   * Button text is also CMS controlled.
   *
   * If no label has been configured in CMS,
   * "WhatsApp" is used as the safe default.
   */
  const whatsappLabel =
    settings.whatsappLabel?.trim() || "WhatsApp";

  /*
   * Do not render an invalid floating button.
   *
   * This prevents the website from showing a
   * WhatsApp button that does not have a number.
   */
  if (!whatsappNumber) {
    return null;
  }

  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Contact us on WhatsApp: ${whatsappLabel}`}
      title={whatsappLabel}
      className="
        group
        fixed
        bottom-4
        right-4
        z-50
        inline-flex
        min-h-11
        items-center
        gap-2
        rounded-full
        bg-[#25D366]
        px-3.5
        py-2.5
        text-sm
        font-bold
        text-white
        shadow-lg
        shadow-black/20
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:bg-[#1ebe5d]
        hover:shadow-xl
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#25D366]
        focus-visible:ring-offset-2
        sm:bottom-5
        sm:right-6
        sm:px-4
        sm:py-3
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
        <MessageCircle
          size={17}
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </span>

      <span className="whitespace-nowrap">
        {whatsappLabel}
      </span>
    </a>
  );
}
