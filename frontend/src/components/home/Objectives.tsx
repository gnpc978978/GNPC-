"use client";

import Image from "next/image";
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
} from "lucide-react";
import {
  motion,
  type Variants,
} from "framer-motion";

import {
  useWebsiteSettings,
} from "@/context/WebsiteSettingsContext";

import {
  mergeHomeSettings,
} from "@/types/homeSettings";

type ObjectiveCard = {
  icon?: string;
  title: string;
  description: string;
};

function ObjectiveIcon({ name }: { name?: string }) {
  const props = {
    size: 20,
    strokeWidth: 2,
  };

  switch (name) {
    case "Newspaper":
      return <Newspaper {...props} />;
    case "Users":
      return <Users {...props} />;
    case "Mic":
      return <Mic {...props} />;
    case "GraduationCap":
      return <GraduationCap {...props} />;
    case "Award":
      return <Award {...props} />;
    case "Images":
      return <Images {...props} />;
    default:
      return <BookOpen {...props} />;
  }
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.6,
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
  featured = false,
}: {
  objective: ObjectiveCard;
  index: number;
  featured?: boolean;
}) {
  return (
    <motion.article
      variants={cardVariants}
      whileHover={{
        y: -5,
      }}
      transition={{
        duration: 0.25,
      }}
      className={[
        "group relative overflow-hidden rounded-[1.75rem] border",
        "p-5 shadow-[0_18px_45px_rgba(38,32,23,0.08)]",
        "transition-all duration-300",
        featured
          ? "min-h-[260px] border-[#0b3b83] bg-[#0b3b83] text-white sm:min-h-[300px] lg:min-h-[320px]"
          : "min-h-[190px] border-slate-200 bg-white text-slate-900 shadow-sm hover:border-blue-200 sm:min-h-[210px]",
        featured
          ? "sm:p-7"
          : "sm:p-6",
      ].join(" ")}
    >
      {/* Decorative circle */}

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full blur-3xl",
          "transition duration-500 group-hover:scale-125",
          featured
            ? "bg-white/10"
            : "bg-blue-100/70",
        ].join(" ")}
      />

      {/* Number */}

      <div className="relative z-10 flex items-start justify-between">
        <div
          className={[
            "flex h-11 w-11 items-center justify-center rounded-2xl",
            "transition-transform duration-300 group-hover:scale-105",
            featured
              ? "bg-white/15 text-white"
              : "bg-blue-50 text-[#155eef]",
          ].join(" ")}
        >
          <ObjectiveIcon name={objective.icon} />
        </div>

        <span
          className={[
            "text-[9px] font-black uppercase tracking-[0.18em]",
            featured
              ? "text-white/40"
              : "text-slate-400",
          ].join(" ")}
        >
          {String(index + 1).padStart(
            2,
            "0"
          )}
        </span>
      </div>

      {/* Content */}

      <div className="relative z-10 mt-14">
        <h3
          className={[
            "max-w-[520px] font-black leading-[1.04] tracking-[-0.04em]",
            featured
              ? "text-2xl sm:text-3xl lg:text-[2.7rem]"
              : "text-xl sm:text-2xl",
          ].join(" ")}
        >
          {objective.title}
        </h3>

        <p
          className={[
            "mt-3 max-w-[560px] text-xs leading-6 sm:text-sm sm:leading-7",
            featured
              ? "text-white/65"
              : "text-slate-600",
          ].join(" ")}
        >
          {objective.description}
        </p>

        <div
          className={[
            "mt-5 h-px w-10 transition-all duration-300 group-hover:w-16",
            featured
              ? "bg-white/30"
              : "bg-blue-200",
          ].join(" ")}
        />
      </div>

      {/* Feature card visual detail */}

      {featured && (
        <div
          aria-hidden="true"
          className="absolute bottom-5 right-5 h-24 w-24 rounded-full border border-white/10 sm:bottom-7 sm:right-7 sm:h-32 sm:w-32"
        />
      )}
    </motion.article>
  );
}

function MediaFrame({
  src,
  alt,
  className,
  priority = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  if (!src) {
    return null;
  }

  return (
    <div
      className={[
        "relative overflow-hidden rounded-[1.75rem] border-[6px] border-white bg-white",
        "shadow-[0_25px_65px_rgba(38,32,23,0.14)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 40vw, 100vw"
        className="object-cover transition duration-700 hover:scale-[1.035]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5"
      />
    </div>
  );
}

export default function Objectives() {
  const {
    settings,
  } = useWebsiteSettings();

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

  const visibleCount =
    objectiveSettings.displayCount >
    0
      ? Math.min(
          objectiveSettings.displayCount,
          objectives.length
        )
      : objectives.length;

  const visibleObjectives =
    objectives.slice(
      0,
      visibleCount
    );

  const media =
    Array.isArray(
      objectiveSettings.media
    )
      ? objectiveSettings.media.filter(
          Boolean
        )
      : [];

  const primaryImage =
    media[0];

  const secondaryImage =
    media[1];

  const tertiaryImage =
    media[2];

  return (
    <section
      id="objectives"
      className="relative overflow-hidden bg-[#f4ede2] py-10 text-[#171717] sm:py-14 lg:py-16"
    >
      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -right-40 top-0 h-[28rem] w-[28rem] rounded-full bg-white/70 blur-3xl" />

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
            HEADER
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
          }}
          className="gnpc-section-heading mx-auto max-w-[900px] text-center"
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
            <p className="mx-auto mt-5 max-w-[720px] text-sm leading-6 text-black/50 sm:text-base sm:leading-7">
              {
                objectiveSettings.description
              }
            </p>
          )}
        </motion.div>

        {/* ===================================================
            OPTIONAL CMS PHOTOS
            =================================================== */}

        {media.length > 0 && (
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
              amount: 0.15,
            }}
            transition={{
              duration: 0.8,
            }}
            className="relative mt-7 grid gap-3 sm:mt-8 lg:grid-cols-[1.25fr_0.75fr]"
          >
            {/* Primary */}

            {primaryImage && (
              <MediaFrame
                src={primaryImage}
                alt={
                  objectiveSettings.title ||
                  "Objectives"
                }
                priority
                className="aspect-[16/8] min-h-[250px] sm:min-h-[320px] lg:aspect-auto lg:min-h-[360px]"
              />
            )}

            {/* Secondary images */}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {secondaryImage && (
                <MediaFrame
                  src={
                    secondaryImage
                  }
                  alt={
                    objectiveSettings.title ||
                    "Objectives"
                  }
                  className="aspect-[16/7] min-h-[150px] sm:min-h-[170px] lg:min-h-[172px]"
                />
              )}

              {tertiaryImage && (
                <MediaFrame
                  src={
                    tertiaryImage
                  }
                  alt={
                    objectiveSettings.title ||
                    "Objectives"
                  }
                  className="aspect-[16/7] min-h-[150px] sm:min-h-[170px] lg:min-h-[172px]"
                />
              )}
            </div>
          </motion.div>
        )}

        {/* ===================================================
            BENTO OBJECTIVES
            =================================================== */}

        {visibleObjectives.length >
        0 ? (
          <motion.div
            variants={{
              hidden: {},

              visible: {
                transition: {
                  staggerChildren:
                    0.08,
                },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.1,
            }}
            className={[
              "mt-8 grid gap-3 sm:mt-10",
              visibleObjectives.length ===
                1
                ? "lg:grid-cols-1"
                : visibleObjectives.length ===
                    2
                  ? "lg:grid-cols-2"
                  : "lg:grid-cols-4 lg:grid-rows-2",
            ].join(" ")}
          >
            {visibleObjectives.map(
              (
                objective,
                index
              ) => (
                <ObjectiveCard
                  key={`${objective.title}-${index}`}
                  objective={
                    objective
                  }
                  index={index}
                  featured={
                    index ===
                      0 &&
                    visibleObjectives.length >=
                      3
                  }
                />
              )
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
            BOTTOM CTA
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
            className="mt-7 flex flex-col items-center justify-center gap-3 sm:mt-12"
          >
            <Link
              href={
                objectiveSettings.buttonHref ||
                "/about"
              }
              className="gnpc-btn group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-black text-[#171717] shadow-[0_10px_28px_rgba(23,23,23,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f7f2e9]"
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
