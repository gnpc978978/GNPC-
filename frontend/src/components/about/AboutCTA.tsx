"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

import MembershipFormLink from "@/components/membership/MembershipFormLink";

type AboutCTAProps = {
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export default function AboutCTA({
  title,
  description,
  primaryLabel,
  secondaryLabel,
  secondaryHref = "/office-bearers",
}: AboutCTAProps) {
  const finalTitle =
    title?.trim() ||
    "Become a Part of Our Greater Noida Press Club";

  const finalDescription =
    description?.trim() ||
    "Join a community dedicated to ethical journalism, professional growth, networking, and media excellence.";

  const finalPrimaryLabel =
    primaryLabel?.trim() ||
    "Become a Member";

  const finalSecondaryLabel =
    secondaryLabel?.trim() ||
    "Meet Our Office Bearers";

  const finalSecondaryHref =
    secondaryHref?.trim() ||
    "/office-bearers";

  return (
    <section className="bg-[#f4ede2] px-4 pb-16 pt-4 sm:px-6 sm:pb-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-black/10 bg-[#59684e] text-white shadow-[0_30px_80px_rgba(38,32,23,0.14)]">
          {/* Decorative shapes */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full border border-white/10"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-black/10 blur-3xl"
          />

          <div className="relative mx-auto max-w-[980px] px-5 py-12 text-center sm:px-8 sm:py-16 lg:px-16 lg:py-20">
            {/* Eyebrow */}

            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-white/30 sm:w-12" />

              <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-white/50 sm:text-[10px]">
                <Sparkles
                  size={11}
                />

                Membership
              </span>

              <span className="h-px w-8 bg-white/30 sm:w-12" />
            </div>

            <h2 className="mx-auto mt-5 max-w-[850px] text-4xl font-black leading-[0.98] tracking-[-0.055em] text-white sm:text-5xl lg:text-[4.5rem]">
              {finalTitle}
            </h2>

            {finalDescription && (
              <p className="mx-auto mt-6 max-w-[700px] text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                {
                  finalDescription
                }
              </p>
            )}

            {/* Buttons */}

            <div className="mx-auto mt-9 flex w-full max-w-[680px] flex-col gap-3 sm:flex-row">
              <MembershipFormLink
                unavailableLabel={
                  finalPrimaryLabel
                }
                className="group inline-flex min-h-14 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full !bg-white !px-6 !py-3.5 !text-sm !font-black !text-[#171717] shadow-[0_16px_40px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-0.5 hover:!bg-[#f4ede2] hover:shadow-[0_22px_50px_rgba(0,0,0,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#59684e]"
              >
                <span className="truncate">
                  {
                    finalPrimaryLabel
                  }
                </span>

                <ArrowRight
                  size={17}
                  className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                />
              </MembershipFormLink>

              <Link
                href={
                  finalSecondaryHref
                }
                className="group inline-flex min-h-14 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full !border !border-white/30 !bg-white !px-6 !py-3.5 !text-sm !font-black !text-[#171717] shadow-[0_16px_40px_rgba(0,0,0,0.1)] transition duration-300 hover:-translate-y-0.5 hover:!bg-[#f4ede2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#59684e]"
              >
                <span className="truncate">
                  {
                    finalSecondaryLabel
                  }
                </span>

                <ArrowRight
                  size={17}
                  className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
