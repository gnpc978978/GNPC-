"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
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

type FooterLink = {
  label: string;
  href: string;
};

export default function Footer() {
  const { settings } = useWebsiteSettings();

  const siteName = settings.siteName || "Greater Noida Press Club";
  const description =
    settings.heroDescription ||
    "Greater Noida Press Club is a professional platform connecting journalists, media professionals and the community.";
  const address =
    settings.address || "Greater Noida, Uttar Pradesh, India";
  const phone = settings.phone || "";
  const email = settings.email || "";

  const socialLinks = [
    { label: "Facebook", href: settings.socialLinks?.facebook || "", icon: FaFacebookF },
    { label: "Instagram", href: settings.socialLinks?.instagram || "", icon: FaInstagram },
    { label: "X", href: settings.socialLinks?.twitter || "", icon: FaXTwitter },
    { label: "LinkedIn", href: settings.socialLinks?.linkedin || "", icon: FaLinkedinIn },
    { label: "YouTube", href: settings.socialLinks?.youtube || "", icon: FaYoutube },
  ].filter((item) => Boolean(item.href));

  const quickLinks: FooterLink[] = [
    { label: "About Us", href: "/about" },
    { label: "Office Bearers", href: "/office-bearers" },
    { label: "Members", href: "/members" },
    { label: "Photo Gallery", href: "/gallery" },
    { label: "Latest Updates", href: "/latest-updates" },
    { label: "Contact Us", href: "/contact" },
  ];

  const newsroomLinks: FooterLink[] = [
    { label: "Press Releases", href: "/press-releases" },
    { label: "Announcements", href: "/announcements" },
    { label: "Press Conferences", href: "/press-conference" },
    { label: "Events", href: "/events" },
  ];

  return (
    <footer className="relative isolate overflow-hidden bg-[#061629] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-[#c9a45c]/[0.09] blur-[100px]" />
        <div className="absolute -bottom-56 -left-40 h-[36rem] w-[36rem] rounded-full bg-[#17436a]/45 blur-[110px]" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "linear-gradient(to bottom, black, transparent 75%)",
          }}
        />
      </div>

      <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#c9a45c] to-transparent" />

      <div className="gnpc-container relative">
        <section className="relative overflow-hidden border-b border-white/10 py-9 sm:py-12">
          <div className="relative flex flex-col gap-6 rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-[#102b47]/95 via-[#0d243d]/95 to-[#0a1d32]/95 p-5 shadow-[0_24px_70px_rgba(0,0,0,.2)] sm:rounded-[2rem] sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-9">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full border border-[#c9a45c]/15"
            />
            <div className="relative max-w-2xl">
              <p className="flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[.24em] text-[#dfc17f] sm:text-[10px]">
                <span className="h-px w-7 bg-[#c9a45c]" />
                Greater Noida Press Club
              </p>
              <h2 className="mt-3 font-serif text-[1.8rem] font-semibold leading-tight tracking-[-.035em] text-white sm:text-3xl lg:text-[2.15rem]">
                Let’s stay connected.
              </h2>
              <p className="mt-2 max-w-xl text-xs leading-6 text-white/60 sm:text-sm sm:leading-7">
                For enquiries, information and updates from {siteName}, get in touch with our team.
              </p>
            </div>

            <Link
              href="/contact"
              className="group relative inline-flex min-h-12 shrink-0 items-center justify-center gap-3 self-start rounded-full bg-[#d4b06a] px-5 py-3 text-xs font-extrabold text-[#07172b] shadow-[0_12px_30px_rgba(212,176,106,.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e5c783] hover:shadow-[0_16px_38px_rgba(212,176,106,.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e5c783] sm:self-auto sm:px-6 sm:text-sm"
            >
              Contact the Press Club
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </section>

        <div className="grid gap-11 py-11 sm:py-14 md:grid-cols-2 md:gap-x-12 lg:grid-cols-12 lg:gap-8 lg:py-16">
          <div className="lg:col-span-4">
            <div className="inline-flex max-w-full items-center">
              <Logo variant="light" />
            </div>
            <p className="mt-5 max-w-sm text-[13px] leading-7 text-[#c0ccda]">
              {description}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#d4b06a]/20 bg-[#d4b06a]/[0.07] px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4b06a]" />
              <span className="text-[9px] font-bold uppercase tracking-[.18em] text-[#e2c783]">
                Greater Noida · Uttar Pradesh
              </span>
            </div>
          </div>

          <FooterColumn title="Explore" links={quickLinks} className="lg:col-span-2" />
          <FooterColumn title="Newsroom" links={newsroomLinks} className="lg:col-span-2" />

          <div className="lg:col-span-4">
            <FooterHeading>Get in touch</FooterHeading>
            <div className="mt-5 space-y-3">
              {address && (
                <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.035] p-3.5">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-[#d4b06a]" aria-hidden="true" />
                  <span className="text-xs leading-6 text-[#c0ccda]">{address}</span>
                </div>
              )}

              {phone && (
                <a
                  href={"tel:" + phone}
                  className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.035] p-3.5 transition hover:border-[#d4b06a]/35 hover:bg-white/[0.065]"
                >
                  <Phone size={16} className="shrink-0 text-[#d4b06a]" aria-hidden="true" />
                  <span className="min-w-0 flex-1 break-words text-xs text-[#c0ccda] transition group-hover:text-white">
                    {phone}
                  </span>
                  <ArrowUpRight size={14} className="shrink-0 text-white/25 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#d4b06a]" aria-hidden="true" />
                </a>
              )}

              {email && (
                <a
                  href={"mailto:" + email}
                  className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.035] p-3.5 transition hover:border-[#d4b06a]/35 hover:bg-white/[0.065]"
                >
                  <Mail size={16} className="shrink-0 text-[#d4b06a]" aria-hidden="true" />
                  <span className="min-w-0 flex-1 break-all text-xs text-[#c0ccda] transition group-hover:text-white">
                    {email}
                  </span>
                  <ArrowUpRight size={14} className="shrink-0 text-white/25 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#d4b06a]" aria-hidden="true" />
                </a>
              )}
            </div>

            {socialLinks.length > 0 && (
              <div className="mt-6">
                <p className="text-[9px] font-extrabold uppercase tracking-[.2em] text-white/45">
                  Follow GNPC
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {socialLinks.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={"Follow GNPC on " + label}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.045] text-white/65 transition duration-200 hover:-translate-y-1 hover:border-[#d4b06a]/60 hover:bg-[#d4b06a] hover:text-[#07172b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#e5c783]"
                    >
                      <Icon size={15} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative border-t border-white/10 py-6 sm:py-7">
          <div className="grid grid-cols-1 items-center gap-4 text-center text-[11px] text-white/45 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:text-left">
            <p className="leading-6 md:justify-self-start">
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </p>

            <Link
              href="/credits"
              className="group inline-flex w-fit items-center justify-self-center gap-2 rounded-full border border-[#d4b06a]/25 bg-[#d4b06a]/[0.06] px-4 py-2.5 text-[10px] font-semibold text-[#e2c783] transition hover:border-[#d4b06a]/60 hover:bg-[#d4b06a]/[0.12] hover:text-[#f1d99e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#e5c783]"
            >
              Website credits
              <span className="text-white/45">·</span>
              Ayush &amp; Shreyansh
              <ArrowUpRight
                size={13}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>

            <nav
              aria-label="Legal information"
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 md:justify-self-end"
            >
              <Link href="/privacy-policy" className="transition hover:text-[#e2c783]">
                Privacy Policy
              </Link>
              <Link href="/terms" className="transition hover:text-[#e2c783]">
                Terms &amp; Conditions
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#d4b06a]">
      {children}
    </h3>
  );
}

function FooterColumn({
  title,
  links,
  className = "",
}: {
  title: string;
  links: FooterLink[];
  className?: string;
}) {
  return (
    <div className={className}>
      <FooterHeading>{title}</FooterHeading>
      <ul className="mt-5 space-y-3.5">
        {links.map(({ label, href }) => (
          <li key={href}>
            <Link
              href={href}
              className="group inline-flex items-center gap-2 text-[13px] text-[#aebdcd] transition duration-200 hover:translate-x-0.5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e5c783]"
            >
              <span>{label}</span>
              <ArrowUpRight
                size={13}
                className="opacity-0 transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
