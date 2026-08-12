"use client";

import Logo from "./Logo";
import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";

const FALLBACK_LOGO = "/gnpc-logo.png";

export default function Footer() {
  const { settings } = useWebsiteSettings();

  /*
   * Keep the footer tolerant of the existing settings schema.
   * This prevents the footer from breaking if some optional
   * CMS fields are not present in the TypeScript interface.
   */
  const siteSettings =
    (settings ?? {}) as Record<string, unknown>;

  const getString = (
    ...keys: string[]
  ): string => {
    for (const key of keys) {
      const value = siteSettings[key];

      if (
        typeof value === "string" &&
        value.trim().length > 0
      ) {
        return value.trim();
      }
    }

    return "";
  };

  const logo =
    getString(
      "logo",
      "websiteLogo",
      "siteLogo"
    ) || FALLBACK_LOGO;

  const siteName =
    getString(
      "siteName",
      "websiteName",
      "name"
    ) || "Greater Noida Press Club";

  const description =
    getString(
      "footerDescription",
      "siteDescription",
      "description"
    ) ||
    "Greater Noida Press Club is a professional platform connecting journalists, media professionals and the community.";

  const address =
    getString(
      "address",
      "officeAddress",
      "contactAddress"
    ) ||
    "Greater Noida, Uttar Pradesh, India";

  const phone = getString(
    "phone",
    "contactPhone",
    "mobile"
  );

  const email = getString(
    "email",
    "contactEmail"
  );

  const socialLinks = [
    {
      label: "Facebook",
      href: getString(
        "facebookUrl",
        "facebook",
        "facebookLink"
      ),
    },
    {
      label: "Instagram",
      href: getString(
        "instagramUrl",
        "instagram",
        "instagramLink"
      ),
    },
    {
      label: "LinkedIn",
      href: getString(
        "linkedinUrl",
        "linkedin",
        "linkedinLink"
      ),
    },
    {
      label: "YouTube",
      href: getString(
        "youtubeUrl",
        "youtube",
        "youtubeLink"
      ),
    },
    {
      label: "X",
      href: getString(
        "twitterUrl",
        "twitter",
        "twitterLink",
        "xUrl",
        "x"
      ),
    },
  ].filter(
    (
      item
    ): item is {
      label: string;
      href: string;
    } => Boolean(item.href)
  );

  const quickLinks = [
    {
      label: "About Us",
      href: "/about",
    },
    {
      label: "Latest Updates",
      href: "/latest-updates",
    },
    {
      label: "Gallery",
      href: "/gallery",
    },
    {
      label: "Office Bearers",
      href: "/office-bearers",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ];

  const latestUpdateLinks = [
    {
      label: "Press Releases",
      href: "/press-releases",
    },
    {
      label: "Announcements",
      href: "/announcements",
    },
    {
      label: "Events",
      href: "/events",
    },
  ];

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:gap-12">
          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label={`${siteName} home`}
              className="group inline-flex items-center"
            >
              <div className="relative flex h-16 min-w-16 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white px-3 py-2 shadow-lg transition-transform duration-300 group-hover:-translate-y-0.5">
                <Image
                  src={logo}
                  alt={`${siteName} logo`}
                  width={150}
                  height={70}
                  priority
                  className="h-auto max-h-14 w-auto max-w-[150px] object-contain"
                />
              </div>
            </Link>

            <h2 className="mt-5 text-lg font-bold text-white">
              {siteName}
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
              {description}
            </p>

            {/* Address */}
            {address && (
              <div className="mt-6 flex items-start gap-3 text-sm text-slate-400">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-blue-400"
                  aria-hidden="true"
                />

                <span>{address}</span>
              </div>
            )}

            {/* Phone */}
            {phone && (
              <a
                href={`tel:${phone}`}
                className="mt-3 flex items-center gap-3 text-sm text-slate-400 transition hover:text-white"
              >
                <Phone
                  size={17}
                  className="shrink-0 text-blue-400"
                  aria-hidden="true"
                />

                <span>{phone}</span>
              </a>
            )}

            {/* Email */}
            {email && (
              <a
                href={`mailto:${email}`}
                className="mt-3 flex items-center gap-3 break-all text-sm text-slate-400 transition hover:text-white"
              >
                <Mail
                  size={17}
                  className="shrink-0 text-blue-400"
                  aria-hidden="true"
                />

                <span>{email}</span>
              </a>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
                  >
                    <span>{link.label}</span>

                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Latest Updates */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
              Latest Updates
            </h3>

            <ul className="mt-5 space-y-3">
              {latestUpdateLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
                  >
                    <span>{link.label}</span>

                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
              Connect With Us
            </h3>

            <p className="mt-5 text-sm leading-6 text-slate-400">
              Stay connected with GNPC for the latest
              announcements, press activities and updates.
            </p>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {socialLinks.map(
                  ({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white"
                    >
                      {label}
                    </a>
                  )
                )}
              </div>
            )}

            {/* Contact CTA */}
            <Link
              href="/contact"
              className="group mt-6 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10"
            >
              Get in touch

              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="text-xs leading-5 text-slate-500 sm:text-sm">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm">
            <Link
              href="/privacy-policy"
              className="text-slate-500 transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-slate-500 transition hover:text-white"
            >
              Terms & Conditions
            </Link>

            <span className="text-slate-600">
              Designed & Developed by Ayzent Solutions
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
