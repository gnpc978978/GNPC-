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
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {contactInfo.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-5 flex justify-center">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-3 text-slate-600">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
