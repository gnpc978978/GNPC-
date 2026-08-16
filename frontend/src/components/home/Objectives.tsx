"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  GraduationCap,
  Images,
  Mic,
  Newspaper,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  motion,
  type Variants,
} from "framer-motion";

import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import { mergeHomeSettings } from "@/types/homeSettings";

type ObjectiveIconName =
  | "Newspaper"
  | "Users"
  | "Mic"
  | "GraduationCap"
  | "Award"
  | "Images";

type ObjectiveCard = {
  icon?: string;
  title: string;
  description: string;
};

const iconMap: Record<
  ObjectiveIconName,
  LucideIcon
> = {
  Newspaper,
  Users,
  Mic,
  GraduationCap,
  Award,
  Images,
};

function getIcon(
  name?: string
): LucideIcon {
  if (
    name &&
    name in iconMap
  ) {
    return iconMap[
      name as ObjectiveIconName
    ];
  }

  return BookOpen;
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [
        0.22,
        1,
        0.36,
        1,
      ],
    },
  },
};

function ObjectiveCard({
  objective,
  index,
  className = "",
  dark = false,
}: {
  objective: ObjectiveCard;
  index: number;
  className?: string;
  dark?: boolean;
}) {
  const Icon = getIcon(
    objective.icon
  );

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{
        y: -5,
        transition: {
          duration: 0.25,
        },
      }}
      className={[
        "group relative overflow-hidden rounded-[1.75rem] border p-5 shadow-[0_18px_45px_rgba(38,32,23,0.08)] transition-shadow duration-300 sm:p-7",
        dark
          ? "border-[#394631] bg-[#59684e] text-white hover:shadow-[0_25px_65px_rgba(38,32,23,0.18)]"
          : "border-black/10 bg-white/60 text-[#171717] backdrop-blur-md hover:bg-white hover:shadow-[0_25px_65px_rgba(38,32,23,0.12)]",
        className,
      ].join(" ")}
    >
      {/* Decorative shape */}

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-2xl transition duration-500 group-hover:scale-125",
          dark
            ? "bg-white/10"
            : "bg-[#d8c7af]/30",
        ].join(" ")}
      />

      <div className="relative z-10 flex h-full flex-col">
        {/* Number */}

        <div className="flex items-start justify-between gap-4">
          <div
            className={[
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105",
              dark
                ? "bg-white/15 text-white"
                : "bg-[#f4ede2] text-[#171717]",
            ].join(" ")}
          >
            <Icon
              size={20}
              strokeWidth={2}
            />
          </div>

          <span
            className={[
              "text-[9px] font-black uppercase tracking-[0.18em]",
              dark
                ? "text-white/45"
                : "text-black/30",
            ].join(" ")}
          >
            {String(index + 1).padStart(
              2,
              "0"
            )}
          </span>
        </div>

        {/* Content */}

        <div className="mt-auto pt-12 sm:pt-16">
          <h3
            className={[
              "max-w-[500px] text-xl font-black leading-[1.05] tracking-[-0.035em] sm:text-2xl",
              dark
                ? "text-white"
                : "text-[#171717]",
            ].join(" ")}
          >
            {objective.title}
          </h3>

          <p
            className={[
              "mt-3 max-w-[520px] text-xs leading-6 sm:text-sm sm:leading-7",
              dark
                ? "text-white/65"
                : "text-black/50",
            ].join(" ")}
          >
            {objective.description}
          </p>

          <div
            className={[
              "mt-5 h-px w-10 transition-all duration-300 group-hover:w-16",
              dark
                ? "bg-white/30"
                : "bg-black/15",
            ].join(" ")}
          />
        </div>
      </div>
    </motion.article>
  );
}

export default function Objectives() {
  const { settings } =
    useWebsiteSettings();

  const home =
    mergeHomeSettings(
      settings.home
    );

  const objectiveSettings =
    home.objectives;

  const objectives =
    Array.isArray(
      objectiveSettings.cards
    )
      ? objectiveSettings.cards
      : [];

  const displayCount =
    Math.max(
      1,
      Math.min(
        objectiveSettings.displayCount ||
          objectives.length,
        objectives.length
      )
    );

  const visibleObjectives =
    objectives.slice(
      0,
      displayCount
    );

  /*
   * The bento layout uses the first
   * card as the large feature card.
   * Remaining CMS cards populate the
   * smaller cards.
   */

  return (
    <section
      id="objectives"
      className="relative overflow-hidden bg-[#f4ede2] py-16 text-[#171717] sm:py-24 lg:py-28"
    >
      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -right-40 top-10 h-[28rem] w-[28rem] rounded-full bg-white/70 blur-3xl" />

        <div className="absolute -left-40 bottom-0 h-[24rem] w-[24rem] rounded-full bg-[#d8c7af]/30 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.11]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(23,23,23,0.14) 1px, transparent 1px)",
            backgroundSize:
              "24px 24px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* ===================================================
            HEADING
            =================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
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
            duration: 0.7,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="mx-auto max-w-[900px] text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-8 bg-black/20 sm:w-12"
            />

            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-black/45 sm:text-[10px]">
              {objectiveSettings.eyebrow ||
                "Our Objectives"}
            </span>

            <span
              aria-hidden="true"
              className="h-px w-8 bg-black/20 sm:w-12"
            />
          </div>

          <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-[4.5rem]">
            {objectiveSettings.title}
          </h2>

          {objectiveSettings.description && (
            <p className="mx-auto mt-5 max-w-[700px] text-sm leading-6 text-black/50 sm:text-base sm:leading-7">
              {objectiveSettings.description}
            </p>
          )}
        </motion.div>

        {/* ===================================================
            BENTO GRID
            =================================================== */}

        {visibleObjectives.length >
        0 ? (
          <motion.div
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.12,
            }}
            className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2"
          >
            {/* =================================================
                CARD 1 — LARGE FEATURE
                ================================================= */}

            {visibleObjectives[0] && (
              <ObjectiveCard
                objective={
                  visibleObjectives[0]
                }
                index={0}
                dark
                className="min-h-[390px] sm:min-h-[430px] lg:col-span-2 lg:row-span-2"
              />
            )}

            {/* =================================================
                CARD 2
                ================================================= */}

            {visibleObjectives[1] && (
              <ObjectiveCard
                objective={
                  visibleObjectives[1]
                }
                index={1}
                className="min-h-[230px] sm:min-h-[250px]"
              />
            )}

            {/* =================================================
                CARD 3
                ================================================= */}

            {visibleObjectives[2] && (
              <ObjectiveCard
                objective={
                  visibleObjectives[2]
                }
                index={2}
                className="min-h-[230px] sm:min-h-[250px]"
              />
            )}

            {/* =================================================
                CARD 4
                ================================================= */}

            {visibleObjectives[3] && (
              <ObjectiveCard
                objective={
                  visibleObjectives[3]
                }
                index={3}
                className="min-h-[230px] sm:min-h-[250px]"
              />
            )}

            {/* =================================================
                CARD 5
                ================================================= */}

            {visibleObjectives[4] && (
              <ObjectiveCard
                objective={
                  visibleObjectives[4]
                }
                index={4}
                className="min-h-[230px] sm:min-h-[250px]"
              />
            )}

            {/* =================================================
                CARD 6
                ================================================= */}

            {visibleObjectives[5] && (
              <ObjectiveCard
                objective={
                  visibleObjectives[5]
                }
                index={5}
                dark
                className="min-h-[230px] sm:min-h-[250px]"
              />
            )}
          </motion.div>
        ) : (
          <div className="mt-12 rounded-[2rem] border border-dashed border-black/15 bg-white/45 px-6 py-14 text-center sm:mt-16">
            <p className="text-sm font-semibold text-black/45">
              No objectives are currently
              configured.
            </p>
          </div>
        )}

        {/* ===================================================
            CTA
            =================================================== */}

        {objectiveSettings.buttonLabel && (
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
              amount: 0.4,
            }}
            transition={{
              duration: 0.6,
            }}
            className="mt-10 flex justify-center sm:mt-12"
          >
            <Link
              href={
                objectiveSettings.buttonHref ||
                "/about"
              }
              className="group inline-flex items-center gap-2 rounded-full bg-[#171717] px-6 py-3.5 text-sm font-black text-white shadow-[0_14px_35px_rgba(23,23,23,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2a2a2a]"
            >
              {objectiveSettings.buttonLabel}

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
