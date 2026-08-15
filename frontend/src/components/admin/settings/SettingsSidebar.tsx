"use client";

import Link from "next/link";

import {
  FaGlobe,
  FaImage,
  FaHome,
  FaPhone,
  FaShareAlt,
  FaFilePdf,
  FaSearch,
  FaInfoCircle,
} from "react-icons/fa";

const menu = [
  {
    name: "Site Details",
    link: "/admin/settings/site-details",
    icon: <FaGlobe />,
  },

  {
    name: "Logo Upload",
    link: "/admin/settings/logo",
    icon: <FaImage />,
  },

  {
    name: "Home Section",
    link: "/admin/settings/home",
    icon: <FaHome />,
  },

  {
    name: "About Section",
    link: "/admin/settings/about",
    icon: <FaInfoCircle />,
  },

  {
    name: "Contact Information",
    link: "/admin/settings/contact",
    icon: <FaPhone />,
  },

  {
    name: "Social Links",
    link: "/admin/settings/social-links",
    icon: <FaShareAlt />,
  },

  {
    name: "Membership Form",
    link: "/admin/settings/membership",
    icon: <FaFilePdf />,
  },

  {
    name: "SEO Settings",
    link: "/admin/settings/seo",
    icon: <FaSearch />,
  },
];

export default function SettingsSidebar() {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <h2 className="mb-5 text-xl font-bold">
        Website Settings
      </h2>

      <div className="space-y-3">
        {menu.map((item) => (
          <Link
            key={item.link}
            href={item.link}
            className="flex items-center gap-3 rounded-lg p-3 text-gray-700 transition hover:bg-blue-50"
          >
            <span className="text-blue-600">
              {item.icon}
            </span>

            <span>
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
