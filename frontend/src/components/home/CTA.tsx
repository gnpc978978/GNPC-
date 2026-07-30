"use client";

import Link from "next/link";
import MembershipFormLink from "@/components/membership/MembershipFormLink";

export default function CTA() {
  return (
    <section className="bg-slate-900 py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">


        <span className="inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          Join Our Community
        </span>


        <h2 className="mt-5 text-3xl font-extrabold text-white sm:mt-6 sm:text-4xl md:text-5xl">
          Become a Part of the Press Club
        </h2>


        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">
          Join a growing community of journalists, media professionals, and
          aspiring reporters. Expand your network, attend exclusive events,
          and strengthen your voice in journalism.
        </p>



        <div className="mt-8 flex flex-col justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">


          <MembershipFormLink className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white transition-all hover:-translate-y-1 hover:bg-blue-700 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 sm:px-8 sm:py-4" unavailableClassName="cursor-not-allowed rounded-xl bg-slate-500 px-6 py-3 text-center font-semibold text-white opacity-70 sm:px-8 sm:py-4">Download Form</MembershipFormLink>



          <Link
            href="/contact"
            className="rounded-xl border border-white px-6 py-3 text-center font-semibold text-white transition-all hover:-translate-y-1 hover:bg-white hover:text-slate-900 sm:px-8 sm:py-4"
          >
            Contact Us
          </Link>


        </div>


      </div>
    </section>
  );
}
