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
import Button from "@/components/ui/Button";

export default function Footer() {
  const { settings } = useWebsiteSettings();

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

  const socialLinks = [
    {
      label: "Facebook",
      href: settings.socialLinks?.facebook || "",
      icon: FaFacebookF,
    },
    {
      label: "Instagram",
      href: settings.socialLinks?.instagram || "",
      icon: FaInstagram,
    },
    {
      label: "X",
      href: settings.socialLinks?.twitter || "",
      icon: FaXTwitter,
    },
    {
      label: "LinkedIn",
      href: settings.socialLinks?.linkedin || "",
      icon: FaLinkedinIn,
    },
    {
      label: "YouTube",
      href: settings.socialLinks?.youtube || "",
      icon: FaYoutube,
    },
  ].filter((x) => Boolean(x.href));

  const quickLinks = [
    ["About Us", "/about"],
    ["Latest Updates", "/latest-updates"],
    ["Gallery", "/gallery"],
    ["Office Bearers", "/office-bearers"],
    ["Members", "/members"],
    ["Contact", "/contact"],
  ];

  const updateLinks = [
    ["Press Releases", "/press-releases"],
    ["Announcements", "/announcements"],
    ["Events", "/events"],
    ["Press Conferences", "/press-conference"],
  ];

  return (
    <footer className="relative overflow-hidden bg-[#07172b] text-white">
      {/* Background Effects */}
      <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#c9a45c]/10 blur-3xl" />

      <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-[#17395f]/50 blur-3xl" />

      {/* Main Footer */}
      <div className="gnpc-container relative py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_.7fr_.8fr_1fr] lg:gap-16">

          {/* Company Information */}
          <div>
            <Link
              href="/"
              aria-label={`${siteName} home`}
              className="inline-flex rounded-2xl bg-white p-3 shadow-2xl"
            >
              <Logo />
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/55">
              {description}
            </p>

            <div className="mt-7 space-y-3 text-sm text-white/65">

              {address && (
                <div className="flex items-start gap-3">
                  <MapPin
                    size={17}
                    className="mt-0.5 shrink-0 text-[#c9a45c]"
                  />

                  <span>{address}</span>
                </div>
              )}

              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 hover:text-white"
                >
                  <Phone
                    size={17}
                    className="text-[#c9a45c]"
                  />

                  <span>{phone}</span>
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 break-all hover:text-white"
                >
                  <Mail
                    size={17}
                    className="text-[#c9a45c]"
                  />

                  <span>{email}</span>
                </a>
              )}

            </div>
          </div>

          {/* Quick Links */}
          <FooterColumn
            title="Quick Links"
            links={quickLinks}
          />

          {/* Latest Updates */}
          <FooterColumn
            title="Latest Updates"
            links={updateLinks}
          />

          {/* Social Links */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.22em] text-[#c9a45c]">
              Connect With Us
            </p>

            <p className="mt-5 text-sm leading-7 text-white/55">
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
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[.05] text-white/55 transition hover:-translate-y-1 hover:border-[#c9a45c] hover:bg-[#c9a45c] hover:text-[#07172b]"
                    >
                      <Icon size={16} />
                    </a>
                  )
                )}

              </div>
            )}

            <Button
              href="/contact"
              variant="inverse"
              className="mt-6"
            >
              Get in touch
              <ArrowUpRight size={16} />
            </Button>

          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="relative border-t border-white/10">

        <div className="gnpc-container flex flex-col gap-4 py-5 text-xs text-white/45">

          {/* Copyright */}
          <p>
            © {new Date().getFullYear()}{" "}
            {siteName}. All rights reserved.
          </p>

          {/* Legal Links */}
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href="/privacy-policy"
              className="hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="hover:text-white"
            >
              Terms & Conditions
            </Link>
          </div>

          {/* Developer Credits */}
          <div className="flex flex-wrap items-center gap-1">

            <span>
              Designed & Developed by
            </span>

            <a
              href="https://www.linkedin.com/in/itxayushrajput"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#c9a45c] transition hover:text-white"
            >
              Ayush
            </a>

            <span>&</span>

            <a
              href="https://www.linkedin.com/in/shreyansh-mishra-66615437b"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#c9a45c] transition hover:text-white"
            >
              Shreyansh
            </a>

          </div>

          {/* Content Management */}
          <p>
            Content Managed by{" "}

            <span className="font-medium text-white/70">
              Greater Noida Press Club
            </span>
          </p>

          {/* Maintenance */}
          <div className="flex flex-wrap items-center gap-1">

            <span>
              Maintained by
            </span>

            <a
              href="https://www.linkedin.com/in/ayzent-solutions-983a86432"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#c9a45c] transition hover:text-white"
            >
              Ayzent Solutions
            </a>

          </div>

        </div>
      </div>
    </footer>
  );
}


function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: string[][];
}) {
  return (
    <div>

      <p className="text-[10px] font-black uppercase tracking-[.22em] text-[#c9a45c]">
        {title}
      </p>

      <ul className="mt-5 space-y-3">

        {links.map(([label, href]) => (

          <li key={href}>

            <Link
              href={href}
              className="group inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white"
            >

              <span>
                {label}
              </span>

              <ArrowUpRight
                size={13}
                className="opacity-0 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
              />

            </Link>

          </li>

        ))}

      </ul>

    </div>
  );
}
