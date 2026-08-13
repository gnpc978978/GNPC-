"use client";

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
  const finalTitle =
    title?.trim() ||
    "Become a Part of Our Greater Noida Press Club";

  const finalDescription =
    description?.trim() ||
    "Join a community dedicated to ethical journalism, professional growth, networking, and media excellence. Together we build a stronger voice for journalists.";

  const finalPrimaryLabel =
    primaryLabel?.trim() ||
    "Become a Member";

  const finalSecondaryLabel =
    secondaryLabel?.trim() ||
    "Meet Our Office Bearers";

  return (
    <section className="px-4 pb-16 pt-8 sm:px-6 sm:pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl">
        <div
          className="
            relative
            overflow-hidden
            rounded-[28px]
            bg-gradient-to-br
            from-blue-950
            via-blue-800
            to-blue-600
            px-5
            py-12
            text-white
            shadow-2xl
            sm:px-8
            md:rounded-[32px]
            md:px-14
            md:py-16
            lg:px-20
          "
        >
          {/* Decorative background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_45%)]"
          />

          <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
            {/* CMS CTA Title */}
            <h2
              className="
                !m-0
                !text-white
                text-balance
                text-3xl
                font-black
                leading-[1.08]
                tracking-tight
                sm:text-4xl
                md:text-5xl
                lg:text-6xl
              "
            >
              {finalTitle}
            </h2>

            {/* CMS CTA Description */}
            {finalDescription && (
              <p
                className="
                  mx-auto
                  mt-6
                  max-w-3xl
                  !text-blue-50
                  text-base
                  font-normal
                  leading-7
                  sm:text-lg
                  sm:leading-8
                  md:text-xl
                "
              >
                {finalDescription}
              </p>
            )}

            {/* CTA Buttons */}
            <div
              className="
                mt-9
                flex
                w-full
                max-w-2xl
                flex-col
                items-stretch
                justify-center
                gap-4
                sm:flex-row
                sm:items-center
              "
            >
              {/* 
               * MembershipFormLink uses the CMS membership PDF.
               *
               * IMPORTANT:
               * We deliberately give BOTH available and unavailable
               * states explicit colors. This prevents the global
               * .gnpc-btn styles from making the text invisible.
               */}
              <MembershipFormLink
                unavailableLabel={finalPrimaryLabel}
                className="
                  inline-flex
                  min-h-14
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  !bg-white
                  !text-blue-800
                  px-6
                  py-3.5
                  text-base
                  font-extrabold
                  shadow-lg
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:!bg-blue-50
                  hover:shadow-xl
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-blue-800
                  sm:min-w-[220px]
                "
                unavailableClassName="
                  inline-flex
                  min-h-14
                  flex-1
                  cursor-not-allowed
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  !bg-white
                  !text-blue-800
                  px-6
                  py-3.5
                  text-base
                  font-extrabold
                  shadow-lg
                  sm:min-w-[220px]
                "
              >
                {finalPrimaryLabel}

                <FaArrowRight
                  size={17}
                  aria-hidden="true"
                />
              </MembershipFormLink>

              {/* 
               * Keep the destination stable.
               *
               * The label itself comes from CMS.
               */}
              <a
                href="/office-bearers"
                className="
                  inline-flex
                  min-h-14
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  !border-2
                  !border-white/60
                  !bg-white
                  !text-blue-800
                  px-6
                  py-3.5
                  text-base
                  font-extrabold
                  shadow-lg
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:!border-white
                  hover:!bg-blue-50
                  hover:shadow-xl
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-blue-800
                  sm:min-w-[220px]
                "
              >
                {finalSecondaryLabel}

                <FaArrowRight
                  size={17}
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
