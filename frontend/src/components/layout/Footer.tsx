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

import Logo from "./Logo";

export default function Footer() {
  const { settings } =
    useWebsiteSettings();

  const siteName =
    settings.siteName ||
    "Greater Noida Press Club";

  const description =
    settings.heroDescription ||
    "Greater Noida Press Club is a professional platform connecting journalists, media professionals and the community.";

  const address =
    settings.address ||
    "Greater Noida, Uttar Pradesh, India";

  const phone =
    settings.phone || "";

  const email =
    settings.email || "";

  /*
   * -------------------------------------------------------
   * SOCIAL LINKS
   * -------------------------------------------------------
   *
   * These come from CMS Website Settings.
   */
  const socialLinks = [
    {
      label: "Facebook",
      href:
        settings.socialLinks
          ?.facebook || "",
      icon: FaFacebookF,
    },
    {
      label: "Instagram",
      href:
        settings.socialLinks
          ?.instagram || "",
      icon: FaInstagram,
    },
    {
      label: "X",
      href:
        settings.socialLinks
          ?.twitter || "",
      icon: FaXTwitter,
    },
    {
      label: "LinkedIn",
      href:
        settings.socialLinks
          ?.linkedin || "",
      icon: FaLinkedinIn,
    },
    {
      label: "YouTube",
      href:
        settings.socialLinks
          ?.youtube || "",
      icon: FaYoutube,
    },
  ].filter(
    (item) => Boolean(item.href)
  );

  /*
   * -------------------------------------------------------
   * FOOTER NAVIGATION
   * -------------------------------------------------------
   */

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
      label: "Executive Committee",
      href: "/committee",
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

  return (
    <footer className="border-t border-[#0a3a61] bg-[#0a3a61] text-white">
      {/* ===================================================
          MAIN FOOTER
          =================================================== */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:gap-12">
          {/* =============================================
              BRAND
             ============================================= */}
          <div>
            {/*
             * IMPORTANT:
             *
             * This is the same Logo component used by the
             * Navbar.
             *
             * Clicking it routes to "/".
             *
             * The image therefore remains controlled by
             * Website Settings.
             */}
            <Link
              href="/"
              aria-label={`${siteName} home`}
              className="inline-flex rounded-xl bg-white px-3 py-2"
            >
              <Logo />
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/65">
              {description}
            </p>

            {/* Contact information */}
            <div className="mt-6 space-y-3">
              {address && (
                <div className="flex items-start gap-3 text-sm text-white/65">
                  <MapPin
                    size={17}
                    className="mt-0.5 shrink-0 text-white/75"
                    aria-hidden="true"
                  />

                  <span>
                    {address}
                  </span>
                </div>
              )}

              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 text-sm text-white/65 transition-colors duration-200 hover:text-white"
                >
                  <Phone
                    size={17}
                    className="shrink-0 text-white/75"
                    aria-hidden="true"
                  />

                  <span>
                    {phone}
                  </span>
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 break-all text-sm text-white/65 transition-colors duration-200 hover:text-white"
                >
                  <Mail
                    size={17}
                    className="shrink-0 text-white/75"
                    aria-hidden="true"
                  />

                  <span>
                    {email}
                  </span>
                </a>
              )}
            </div>
          </div>

          {/* =============================================
              QUICK LINKS
             ============================================= */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-white">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">
              {quickLinks.map(
                (link) => (
                  <li
                    key={
                      link.href
                    }
                  >
                    <Link
                      href={
                        link.href
                      }
                      className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors duration-200 hover:text-white"
                    >
                      <span>
                        {link.label}
                      </span>

                      <ArrowUpRight
                        size={13}
                        className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* =============================================
              LATEST UPDATES
             ============================================= */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-white">
              Latest Updates
            </h3>

            <ul className="mt-5 space-y-3">
              {latestUpdateLinks.map(
                (link) => (
                  <li
                    key={
                      link.href
                    }
                  >
                    <Link
                      href={
                        link.href
                      }
                      className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors duration-200 hover:text-white"
                    >
                      <span>
                        {link.label}
                      </span>

                      <ArrowUpRight
                        size={13}
                        className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* =============================================
              CONNECT
             ============================================= */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-white">
              Connect With Us
            </h3>

            <p className="mt-5 text-sm leading-7 text-white/60">
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
                      className={[
                        "flex",
                        "h-10",
                        "w-10",

                        "items-center",
                        "justify-center",

                        "rounded-xl",

                        "border",
                        "border-white/10",

                        "bg-white/5",

                        "text-white/60",

                        "transition-all",
                        "duration-200",

                        "hover:-translate-y-0.5",
                        "hover:border-white/20",
                        "hover:bg-white/10",
                        "hover:text-white",

                        "focus-visible:outline-none",
                        "focus-visible:ring-2",
                        "focus-visible:ring-white",
                        "focus-visible:ring-offset-2",
                        "focus-visible:ring-offset-[#0a3a61]",
                      ].join(" ")}
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
              className={[
                "group",
                "mt-6",
                "inline-flex",
                "items-center",
                "gap-2",

                "rounded-xl",

                "border",
                "border-white/20",

                "bg-white/5",

                "px-4",
                "py-3",

                "text-sm",
                "font-bold",
                "text-white",

                "transition-all",
                "duration-200",

                "hover:border-white/30",
                "hover:bg-white/10",

                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-white",
                "focus-visible:ring-offset-2",
                "focus-visible:ring-offset-[#0a3a61]",
              ].join(" ")}
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

      {/* ===================================================
          BOTTOM BAR
          =================================================== */}
      <div className="border-t border-white/10">
        <div
          className={[
            "mx-auto",
            "flex",
            "max-w-7xl",

            "flex-col",
            "gap-4",

            "px-4",
            "py-5",

            "sm:px-6",

            "md:flex-row",
            "md:items-center",
            "md:justify-between",

            "lg:px-8",
          ].join(" ")}
        >
          <p className="text-xs leading-5 text-white/45 sm:text-sm">
            ©{" "}
            {new Date().getFullYear()}{" "}
            {siteName}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm">
            <Link
              href="/privacy-policy"
              className="text-white/45 transition-colors duration-200 hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-white/45 transition-colors duration-200 hover:text-white"
            >
              Terms & Conditions
            </Link>

            <span className="text-white/35">
              Designed & Developed by Ayzent Solutions
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
