]"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
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
        "border-black/5",
        "bg-[#f4ede2]",
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
            bg-[#d8c7af]/30
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
        {breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className={[
              "mb-6",
              "flex",
              "flex-wrap",
              "items-center",
              "gap-1.5",
              "text-sm",
              centered
                ? "justify-center"
                : "justify-start",
            ].join(" ")}
          >
            {breadcrumbs.map((breadcrumb, index) => {
              const last =
                index === breadcrumbs.length - 1;

              return (
                <div
                  key={`${breadcrumb.label}-${index}`}
                  className="flex items-center gap-1.5"
                >
                  {index > 0 && (
                    <ChevronRight
                      size={15}
                      aria-hidden="true"
                      className="text-slate-400"
                    />
                  )}

                  {breadcrumb.href && !last ? (
                    <Link
                      href={breadcrumb.href}
                      className="
                        font-medium
                        text-slate-500
                        transition-colors
                        hover:text-[#171717]
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-[#839669]
                        focus-visible:ring-offset-2
                      "
                    >
                      {breadcrumb.label}
                    </Link>
                  ) : (
                    <span
                      aria-current={
                        last ? "page" : undefined
                      }
                      className={[
                        "font-semibold",
                        last
                          ? "text-[#101828]"
                          : "text-slate-500",
                      ].join(" ")}
                    >
                      {breadcrumb.label}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
        )}

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
                bg-[#171717]
              "
            />

            <span
              className="
                text-xs
                font-extrabold
                uppercase
                tracking-[0.18em]
                text-[#171717]
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

        {breadcrumbs.length === 0 && (
          <Link
            href="/"
            className="
              gnpc-btn
              mt-7
              inline-flex
              min-h-11
              items-center
              gap-2
              rounded-full
              border
              border-black/10
              bg-white/70
              px-5
              py-3
              text-sm
              font-extrabold
              text-[#171717]
              shadow-[0_10px_28px_rgba(23,23,23,0.08)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-white
              hover:shadow-[0_16px_36px_rgba(23,23,23,0.12)]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#839669]
              focus-visible:ring-offset-2
            "
          >
            <ArrowLeft
              size={16}
              aria-hidden="true"
            />

            Back to Home
          </Link>
        )}
      </div>
    </section>
  );
}
