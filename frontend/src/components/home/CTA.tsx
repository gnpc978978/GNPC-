"use client";

import {
  ArrowRight,
  CheckCircle2,
  FileDown,
  Users,
  Sparkles,
} from "lucide-react";
import {
  motion,
} from "framer-motion";

import MembershipFormLink from "@/components/membership/MembershipFormLink";
import Button from "@/components/ui/Button";

import {
  useWebsiteSettings,
} from "@/context/WebsiteSettingsContext";

import {
  mergeHomeSettings,
} from "@/types/homeSettings";

export default function CTA() {
  const {
    settings,
  } = useWebsiteSettings();

  const home =
    mergeHomeSettings(
      settings.home
    );

  const section =
    home.membership;

  const eyebrow =
    section.eyebrow ||
    "Membership";

  const title =
    section.title ||
    "Become a Part of the Press Club";

  const description =
    section.description ||
    "";

  const primaryLabel =
    section.primaryLabel ||
    "Download Form";

  const secondaryLabel =
    section.secondaryLabel ||
    "Contact Us";

  const secondaryHref =
    section.secondaryHref ||
    "/contact";

  return (
    <section
      id="membership"
      className="relative overflow-hidden bg-[#edf3f8] px-4 py-14 text-[#171717] sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        {/* Soft glow */}

        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-[#b8a68d]/10 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-white/[0.045] blur-3xl" />

        {/* Dot texture */}

        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize:
              "26px 26px",
          }}
        />
      </div>

      {/* =====================================================
          MAIN CARD
          ===================================================== */}

      <div className="relative mx-auto max-w-[1280px]">
        <motion.div
          initial={{
            opacity: 0,
            y: 28,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.8,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="relative overflow-hidden rounded-xl border border-blue-900 bg-[#0b1f3a] shadow-[0_18px_45px_rgba(15,59,131,0.18)]"
        >
          {/* =================================================
              DECORATIVE CIRCLES
              ================================================= */}

          <div
            aria-hidden="true"
            className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10"
          />

          <div
            aria-hidden="true"
            className="absolute -right-14 -top-14 h-60 w-60 rounded-full border border-white/10"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-black/10 blur-2xl"
          />

          {/* =================================================
              CONTENT
              ================================================= */}

          <div className="relative mx-auto max-w-[950px] px-5 py-12 text-center sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-16 lg:py-24">
            {/* Eyebrow */}

            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration:
                  0.5,
              }}
              className="flex items-center justify-center gap-3"
            >
              <span className="h-px w-8 bg-white/30 sm:w-12" />

              <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-white/50 sm:text-[10px]">
                <Sparkles
                  size={11}
                />

                {eyebrow}
              </span>

              <span className="h-px w-8 bg-white/30 sm:w-12" />
            </motion.div>

            {/* Title */}

            <motion.h2
              initial={{
                opacity: 0,
                y: 15,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration:
                  0.65,
                delay: 0.08,
              }}
              className="mx-auto mt-5 max-w-[850px] text-4xl font-black leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl lg:text-[4.4rem]"
            >
              {title}
            </motion.h2>

            {/* Description */}

            {description && (
              <motion.p
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration:
                    0.55,
                  delay: 0.16,
                }}
                className="mx-auto mt-6 max-w-[700px] text-sm leading-7 text-white/62 sm:text-base sm:leading-8"
              >
                {
                  description
                }
              </motion.p>
            )}

            {/* =================================================
                TRUST POINTS
                ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration:
                  0.55,
                delay: 0.22,
              }}
              className="mx-auto mt-7 flex max-w-[720px] flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[9px] font-bold uppercase tracking-[0.12em] text-white/45 sm:text-[10px]"
            >
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2
                  size={13}
                />

                Professional Community
              </span>

              <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />

              <span className="inline-flex items-center gap-1.5">
                <Users
                  size={13}
                />

                Media Network
              </span>

              <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />

              <span className="inline-flex items-center gap-1.5">
                <FileDown
                  size={13}
                />

                Membership Access
              </span>
            </motion.div>

            {/* =================================================
                ACTIONS
                ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration:
                  0.6,
                delay: 0.28,
              }}
              className="mx-auto mt-9 flex w-full max-w-[700px] flex-col justify-center gap-3 sm:flex-row"
            >
              {/* =================================================
                  PRIMARY — MEMBERSHIP FORM
                  =================================================
                  
                  This intentionally keeps MembershipFormLink
                  instead of a normal href.
                  
                  It resolves the current membership-form API
                  and handles unavailable form states.
                  ================================================= */}

              <MembershipFormLink
                unavailableLabel={primaryLabel}
                className="gnpc-btn gnpc-btn-md group flex-1"
                unavailableClassName="gnpc-btn gnpc-btn-md flex-1 cursor-not-allowed border border-white/30 bg-white/15 text-white/55"
              >
                {primaryLabel}
                <ArrowRight size={17} />
              </MembershipFormLink>

              <Button
                href={secondaryHref}
                variant="outline"
                size="md"
                className="flex-1 border-white bg-transparent text-white hover:border-white hover:bg-white hover:text-[#0b1f3a] focus-visible:ring-white focus-visible:ring-offset-[#0b1f3a]"
              >
                {secondaryLabel}
                <ArrowRight size={17} />
              </Button>
            </motion.div>

            {/* =================================================
                CMS ROUTE INDICATOR
                ================================================= */}

            <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.15em] text-white/25">
              {secondaryHref}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
