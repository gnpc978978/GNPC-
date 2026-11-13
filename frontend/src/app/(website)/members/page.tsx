"use client";

import { ArrowRight, Users } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import MembersSection from "@/components/website/MembersSection";
import MembershipFormLink from "@/components/membership/MembershipFormLink";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import { mergeHomeSettings } from "@/types/homeSettings";
import { mergePageSettings } from "@/types/pageSettings";

export default function MembersPage() {
  const { settings } = useWebsiteSettings();
  const pageSettings = mergePageSettings(
    settings.pageSettings
  ).members;
  const membership = mergeHomeSettings(settings.home).membership;

  return (
    <main>
      <PageHero
        eyebrow={pageSettings.pageEyebrow}
        title={pageSettings.pageTitle}
        description={pageSettings.pageDescription}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: pageSettings.pageTitle },
        ]}
      />

      <section className="relative z-10 mx-auto w-full max-w-[1840px] px-4 pb-2 pt-8 sm:px-6 sm:pt-10 lg:px-[2vw]">
        <div className="relative isolate overflow-hidden rounded-[1.6rem] border border-[#d4b06a]/25 bg-[linear-gradient(115deg,#071a2e_0%,#102e4b_58%,#153958_100%)] px-5 py-7 shadow-[0_24px_70px_rgba(7,26,46,.14)] sm:rounded-[2rem] sm:px-8 sm:py-9 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-11">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-2 -top-16 h-52 w-52 rounded-full bg-[#d4b06a]/[0.08] blur-3xl"
          />

          <div className="relative max-w-3xl">
            <p className="inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[.22em] text-[#e2c783] sm:text-[10px]">
              <Users size={14} aria-hidden="true" />
              Membership
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold leading-tight tracking-[-.035em] text-white sm:text-3xl lg:text-[2.15rem]">
              {membership.title || "Become a Part of the Press Club"}
            </h2>
            <p className="mt-3 max-w-2xl text-xs leading-6 text-white/65 sm:text-sm sm:leading-7">
              {membership.description ||
                "Join the Greater Noida Press Club community and connect with fellow media professionals."}
            </p>
          </div>

          <div className="relative mt-6 shrink-0 lg:mt-0">
            <MembershipFormLink
              unavailableLabel="Membership Form Unavailable"
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-[#e5c783] bg-[#d4b06a] px-6 py-3 text-sm font-extrabold text-[#07172b] shadow-[0_12px_30px_rgba(212,176,106,.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e5c783] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e5c783] sm:w-auto"
            >
              Become a Member
              <ArrowRight size={17} aria-hidden="true" />
            </MembershipFormLink>
            <p className="mt-2 text-center text-[9px] font-semibold uppercase tracking-[.12em] text-white/40">
              Download the membership application
            </p>
          </div>
        </div>
      </section>

      <MembersSection settings={pageSettings} />
    </main>
  );
}
