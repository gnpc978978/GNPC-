"use client";

import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";

export default function ContactInfo() {
  const { settings } = useWebsiteSettings();
  const contactInfo = [
    { icon: <FaMapMarkerAlt className="text-3xl text-blue-600" />, title: "Office Address", value: settings.address || "Address coming soon" },
    { icon: <FaPhoneAlt className="text-3xl text-blue-600" />, title: "Phone Number", value: settings.phone || "Phone coming soon" },
    { icon: <FaEnvelope className="text-3xl text-blue-600" />, title: "Email Address", value: settings.email || "Email coming soon" },
  ];
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contactInfo.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6"
            >
              <div className="mb-3 flex justify-center sm:mb-4">
                {item.icon}
              </div>

              <h3 className="text-sm font-bold text-slate-900 sm:text-lg">
                {item.title}
              </h3>

              <p className="mt-2 break-words text-xs text-slate-600 sm:mt-3 sm:text-sm">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
