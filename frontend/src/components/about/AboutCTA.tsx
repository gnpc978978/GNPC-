"use client";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import MembershipFormLink from "@/components/membership/MembershipFormLink";

export default function AboutCTA() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-blue-800 to-blue-600 px-8 py-16 text-center text-white shadow-2xl md:px-16">
          {/* Background Effects */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl" />

          <div className="relative">
            <h2 className="text-4xl font-extrabold md:text-5xl">
              Become a Part of Our Greater Noida Press Club
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
              Join a community dedicated to ethical journalism,
              professional growth, networking, and media excellence.
              Together we build a stronger voice for journalists.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-5 sm:flex-row">
              {/* 
               * IMPORTANT:
               * Do not use href="/membership".
               *
               * There is no public /membership page in this project.
               * MembershipFormLink uses the CMS-configured membership
               * PDF endpoint:
               *
               * /api/settings/membership-form
               */
              <MembershipFormLink
                className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 font-bold text-blue-800 transition-all hover:-translate-y-1 hover:bg-blue-50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-800"
                unavailableClassName="inline-flex cursor-not-allowed items-center justify-center rounded-xl bg-white px-8 py-4 font-bold text-blue-800 opacity-70"
                unavailableLabel="Membership Form Coming Soon"
              >
                Become a Member
              </MembershipFormLink>

              <Link
                href="/office-bearers"
                className="inline-flex items-center justify-center rounded-xl border border-white/50 px-8 py-4 font-bold transition-all hover:-translate-y-1 hover:bg-white hover:text-blue-800"
              >
                Meet Our Office Bearers

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
