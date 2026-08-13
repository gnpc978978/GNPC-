"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export type PageHeroBreadcrumb = {
  label: string;
  href?: string;
};

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;

  breadcrumbs?: PageHeroBreadcrumb[];

  actions?: React.ReactNode;

  align?: "left" | "center";

  className?: string;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs = [],
  actions,
  align = "left",
  className = "",
}: PageHeroProps) {
  const isCentered = align === "center";

  return (
    <section
      aria-labelledby="page-hero-title"
      className={[
        "relative",
        "overflow-hidden",
        "border-b",
        "border-slate-200",
        "bg-white",
        className,
      ].join(" ")}
    >
      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-blue-50 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 h-[26rem] w-[26rem] rounded-full bg-slate-100 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#155eef 1px, transparent 1px), linear-gradient(90deg, #155eef 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* =====================================================
          CONTENT
          ===================================================== */}

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
          isCentered
            ? "text-center"
            : "text-left",
        ].join(" ")}
      >
        {/* ===================================================
            BREADCRUMBS
            =================================================== */}

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
              isCentered
                ? "justify-center"
                : "justify-start",
            ].join(" ")}
          >
            {breadcrumbs.map(
              (breadcrumb, index) => {
                const isLast =
                  index ===
                  breadcrumbs.length - 1;

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

                    {breadcrumb.href &&
                    !isLast ? (
                      <Link
                        href={breadcrumb.href}
                        className={[
                          "font-medium",
                          "text-slate-500",
                          "transition-colors",
                          "hover:text-[#155eef]",
                        ].join(" ")}
                      >
                        {breadcrumb.label}
                      </Link>
                    ) : (
                      <span
                        aria-current={
                          isLast
                            ? "page"
                            : undefined
                        }
                        className={[
                          "font-semibold",
                          isLast
                            ? "text-[#101828]"
                            : "text-slate-500",
                        ].join(" ")}
                      >
                        {breadcrumb.label}
                      </span>
                    )}
                  </div>
                );
              }
            )}
          </nav>
        )}

        {/* ===================================================
            EYEBROW
            =================================================== */}

        {eyebrow && (
          <div
            className={[
              "flex",
              "items-center",
              "gap-3",
              isCentered
                ? "justify-center"
                : "justify-start",
            ].join(" ")}
          >
            <span
              aria-hidden="true"
              className="h-0.5 w-8 rounded-full bg-[#155eef]"
            />

            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#155eef] sm:text-sm">
              {eyebrow}
            </span>
          </div>
        )}

        {/* ===================================================
            TITLE
            =================================================== */}

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
            eyebrow
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

            isCentered
              ? "mx-auto"
              : "",
          ].join(" ")}
        >
          {title}
        </motion.h1>

        {/* ===================================================
            DESCRIPTION
            =================================================== */}

        {description && (
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
              isCentered
                ? "mx-auto"
                : "",
            ].join(" ")}
          >
            {description}
          </motion.p>
        )}

        {/* ===================================================
            ACTIONS
            =================================================== */}

        {actions && (
          <div
            className={[
              "mt-7",
              "flex",
              "flex-wrap",
              "gap-3",
              isCentered
                ? "justify-center"
                : "justify-start",
            ].join(" ")}
          >
            {actions}
          </div>
        )}

        {/* ===================================================
            BACK LINK
            =================================================== */}

        {breadcrumbs.length === 0 && (
          <Link
            href="/"
            className={[
              "mt-7",
              "inline-flex",
              "items-center",
              "gap-2",
              "text-sm",
              "font-semibold",
              "text-slate-500",
              "transition-colors",
              "hover:text-[#155eef]",
            ].join(" ")}
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
