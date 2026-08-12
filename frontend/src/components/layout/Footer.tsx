"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";

export default function Footer() {
  const { settings } = useWebsiteSettings();

  const siteName =
    settings.siteName ||
    "Greater Noida Press Club";

  const description =
    settings.footerDescription ||
    settings.siteDescription ||
    "Greater Noida Press Club is a professional platform connecting journalists, media professionals and the community.";

  const address =
    settings.address ||
    "Greater Noida, Uttar Pradesh, India";

  const phone =
    settings.phone ||
    settings.contactPhone ||
    "";

  const email =
    settings.email ||
    settings.contactEmail ||
    "";

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
    {
      label: "Press Conferences",
      href: "/press-conference",
    },
  ];

  const socialLinks = [
    {
      label: "Facebook",
      href: settings.facebookUrl,
      icon: FaFacebookF,
    },
    {
      label: "Instagram",
      href: settings.instagramUrl,
      icon: FaInstagram,
    },
    {
      label: "X",
      href: settings.twitterUrl,
      icon: FaXTwitter,
    },
    {
      label: "LinkedIn",
      href: settings.linkedinUrl,
      icon: FaLinkedinIn,
    },
    {
      label: "YouTube",
      href: settings.youtubeUrl,
      icon: FaYoutube,
    },
  ].filter(
    (
      item
    ): item is typeof item & {
      href: string;
    } => Boolean(item.href)
  );

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-white">
      {/* =====================================================
          MAIN FOOTER
          ===================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1fr] lg:gap-12">

          {/* =================================================
              BRAND / CONTACT
              ================================================= */}

          <div>
            <Link
              href="/"
              aria-label={`${siteName} home`}
              className="inline-flex items-center"
            >
              <span className="text-xl font-extrabold tracking-tight text-white">
                {siteName}
              </span>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
              {description}
            </p>

            <div className="mt-6 space-y-3">
              {address && (
                <div className="flex items-start gap-3 text-sm text-slate-400">
                  <MapPin
                    size={17}
                    className="mt-0.5 shrink-0 text-[#5da9e9]"
                    aria-hidden="true"
                  />

                  <span>{address}</span>
                </div>
              )}

              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                >
                  <Phone
                    size={17}
                    className="shrink-0 text-[#5da9e9]"
                    aria-hidden="true"
                  />

                  <span>{phone}</span>
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 break-all text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                >
                  <Mail
                    size={17}
                    className="shrink-0 text-[#5da9e9]"
                    aria-hidden="true"
                  />

                  <span>{email}</span>
                </a>
              )}
            </div>
          </div>

          {/* =================================================
              QUICK LINKS
              ================================================= */}

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    <span>{link.label}</span>

                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* =================================================
              LATEST UPDATES
              ================================================= */}

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Latest Updates
            </h3>

            <ul className="mt-5 space-y-3">
              {latestUpdateLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    <span>{link.label}</span>

                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* =================================================
              CONNECT
              ================================================= */}

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Connect With Us
            </h3>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              Stay connected with GNPC for the latest
              announcements, press activities and updates.
            </p>

            {socialLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {socialLinks.map(
                  ({
                    label,
                    href,
                    icon: Icon,
                  }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.04]
                        text-slate-400
                        transition-all
                        duration-200
                        hover:-translate-y-0.5
                        hover:border-white/20
                        hover:bg-white/10
                        hover:text-white
                      "
                    >
                      <Icon
                        size={16}
                        aria-hidden="true"
                      />
                    </a>
                  )
                )}
              </div>
            )}

            <Link
              href="/contact"
              className="
                group
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-white/15
                bg-white/[0.05]
                px-4
                py-3
                text-sm
                font-semibold
                text-white
                transition-all
                duration-200
                hover:border-white/25
                hover:bg-white/10
              "
            >
              Get in touch

              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM BAR
          ===================================================== */}

      <div className="border-t border-white/10">
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            flex-col
            gap-4
            px-4
            py-5
            sm:px-6
            md:flex-row
            md:items-center
            md:justify-between
            lg:px-8
          "
        >
          <p className="text-xs leading-5 text-slate-500 sm:text-sm">
            © {new Date().getFullYear()}{" "}
            {siteName}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm">
            <Link
              href="/privacy-policy"
              className="text-slate-500 transition-colors duration-200 hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-slate-500 transition-colors duration-200 hover:text-white"
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
