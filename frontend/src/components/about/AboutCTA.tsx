"use client";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

import MembershipFormLink from "@/components/membership/MembershipFormLink";

type AboutCTAProps = {
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
};

export default function AboutCTA({
  title,
  description,
  primaryLabel,
  secondaryLabel,
}: AboutCTAProps) {
  return (
    <section className="bg-white px-6 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-blue-800 to-blue-600 px-7 py-12 text-center text-white shadow-2xl md:px-16 md:py-16">
          {/* Background Effects */}
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl"
          />

          <div className="relative mx-auto max-w-4xl">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
              {title ||
                "Become a Part of Our Greater Noida Press Club"}
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-blue-100 md:text-lg md:leading-8">
              {description ||
                "Join a community dedicated to ethical journalism, professional growth, networking, and media excellence. Together we build a stronger voice for journalists."}
            </p>

            <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
              {/* 
               * DO NOT use:
               *
               * href="/membership"
               *
               * MembershipFormLink handles the CMS-configured
               * membership document and backend endpoint.
               */}
              <MembershipFormLink
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-7 py-3 font-bold text-blue-800 transition-all hover:-translate-y-1 hover:bg-blue-50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-800"
                unavailableClassName="inline-flex min-h-12 cursor-not-allowed items-center justify-center rounded-xl bg-white px-7 py-3 font-bold text-blue-800 opacity-70"
                unavailableLabel="Membership Form Coming Soon"
              >
                {primaryLabel ||
                  "Become a Member"}
              </MembershipFormLink>

              <Link
                href="/office-bearers"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/50 px-7 py-3 font-bold text-white transition-all hover:-translate-y-1 hover:bg-white hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-800"
              >
                {secondaryLabel ||
                  "Meet Our Office Bearers"}

                <FaArrowRight
                  className="ml-3"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
