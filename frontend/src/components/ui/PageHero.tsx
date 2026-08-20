"use client";

import { motion } from "framer-motion";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";

export type PageHeroBreadcrumb = {
  label: string;
  href?: string;
};

export type PageHeroProps = {
  contentKey?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: PageHeroBreadcrumb[];
  actions?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export default function PageHero({
  contentKey,
  eyebrow,
  title,
  description,
  breadcrumbs = [],
  actions,
  align = "center",
  className = "",
}: PageHeroProps) {
  const { settings } = useWebsiteSettings();

  const cmsContent = contentKey
    ? settings.pageContent?.[contentKey]
    : undefined;

  const resolvedEyebrow =
    cmsContent?.eyebrow?.trim() || eyebrow;

  const resolvedTitle =
    cmsContent?.title?.trim() || title;

  const resolvedDescription =
    cmsContent?.description?.trim() || description;

  const centered = align === "center";

  return (
    <section
      aria-labelledby="page-hero-title"
      className={[
        "relative",
        "overflow-hidden",
        "border-b",
        "border-blue-100",
        "bg-[#eff6ff]",
        className,
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="
            absolute
            -left-40
            -top-40
            h-[28rem]
            w-[28rem]
            rounded-full
            bg-white/70
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -right-40
            h-[26rem]
            w-[26rem]
            rounded-full
            bg-blue-200/40
            blur-3xl
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.03]
          "
          style={{
            backgroundImage:
              "linear-gradient(#155eef 1px, transparent 1px), linear-gradient(90deg, #155eef 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div
        className={[
          "relative",
          "mx-auto",
          "max-w-7xl",
          "px-4",
          "py-10",
          "sm:px-6",
          "sm:py-12",
          "lg:px-8",
          "lg:py-16",
          "xl:py-20",
          centered ? "text-center" : "text-left",
        ].join(" ")}
      >
        {resolvedEyebrow && (
          <div
            className={[
              "flex",
              "items-center",
              "gap-3",
              centered
                ? "justify-center"
                : "justify-start",
            ].join(" ")}
          >
            <span
              aria-hidden="true"
              className="
                h-0.5
                w-8
                rounded-full
                bg-[#155eef]
              "
            />

            <span
              className="
                text-xs
                font-extrabold
                uppercase
                tracking-[0.18em]
                text-[#155eef]
                sm:text-sm
              "
            >
              {resolvedEyebrow}
            </span>
          </div>
        )}

        <motion.h1
          id="page-hero-title"
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            ease: "easeOut",
          }}
          className={[
            resolvedEyebrow
              ? "mt-4"
              : "mt-0",
            "max-w-4xl",
            "text-[2.15rem]",
            "font-black",
            "leading-[1.08]",
            "tracking-[-0.035em]",
            "text-[#101828]",
            "sm:text-4xl",
            "md:text-5xl",
            "lg:text-[3.5rem]",
            centered ? "mx-auto" : "",
          ].join(" ")}
        >
          {resolvedTitle}
        </motion.h1>

        {resolvedDescription && (
          <motion.p
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
              delay: 0.08,
              ease: "easeOut",
            }}
            className={[
              "mt-5",
              "max-w-2xl",
              "text-base",
              "leading-7",
              "text-slate-600",
              "sm:text-lg",
              "sm:leading-8",
              centered ? "mx-auto" : "",
            ].join(" ")}
          >
            {resolvedDescription}
          </motion.p>
        )}

        {actions && (
          <div
            className={[
              "mt-7",
              "flex",
              "flex-wrap",
              "gap-3",
              centered
                ? "justify-center"
                : "justify-start",
            ].join(" ")}
          >
            {actions}
          </div>
        )}

      </div>
    </section>
  );
}
