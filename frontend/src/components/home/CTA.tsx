"use client";

import MembershipFormLink from "@/components/membership/MembershipFormLink";
import Button from "@/components/ui/Button";

export default function CTA() {
  return (
    <section className="bg-blue-50 py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">


        <span className="gnpc-eyebrow">
          Join Our Community
        </span>


        <h2 className="gnpc-section-title mt-3 text-3xl sm:text-4xl lg:text-5xl">
          Become a Part of the Press Club
        </h2>


        <p className="gnpc-section-description mx-auto text-center">
          Join a growing community of journalists, media professionals, and
          aspiring reporters. Expand your network, attend exclusive events,
          and strengthen your voice in journalism.
        </p>



        <div className="mt-8 flex flex-col justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">


          <MembershipFormLink className="gnpc-btn gnpc-btn-primary gnpc-btn-lg" unavailableClassName="gnpc-btn gnpc-btn-lg cursor-not-allowed bg-slate-400 text-white opacity-70">Download Form</MembershipFormLink>



          <Button href="/contact" variant="outline" size="lg">Contact Us</Button>


        </div>


      </div>
    </section>
  );
}
