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
  actions,
  align = "center",
  className = "",
}: PageHeroProps) {
  const { settings } = useWebsiteSettings();
  const cmsContent = contentKey
    ? settings.pageContent?.[contentKey]
    : undefined;
  const resolvedEyebrow = cmsContent?.eyebrow?.trim() || eyebrow;
  const resolvedTitle = cmsContent?.title?.trim() || title;
  const resolvedDescription = cmsContent?.description?.trim() || description;
  const isCentered = align === "center";
  const alignment = isCentered
    ? "mx-auto items-center text-center"
    : "items-start text-left";

  return (
    <section
      aria-labelledby="page-hero-title"
      className={`relative overflow-hidden border-b border-black/10 bg-[#0b1f3a] text-white ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(201,164,92,.35), transparent 28%), radial-gradient(circle at 90% 70%, rgba(255,255,255,.12), transparent 25%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.8) 1px,transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="gnpc-container relative py-14 sm:py-16 lg:py-20">
        <div className={`flex w-full max-w-4xl flex-col ${alignment}`}>
          {resolvedEyebrow && (
            <div className="flex items-center gap-3 text-[#e8d7ad]">
              <span aria-hidden="true" className="h-px w-8 bg-[#c9a45c] sm:w-10" />
              <span className="text-[10px] font-black uppercase tracking-[.22em]">
                {resolvedEyebrow}
              </span>
              <span aria-hidden="true" className="h-px w-8 bg-[#c9a45c] sm:w-10" />
            </div>
          )}

          <motion.h1
            id="page-hero-title"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className={`mt-5 max-w-[15ch] font-[var(--gnpc-font-editorial)] text-4xl font-bold leading-[.98] tracking-[-.045em] text-white sm:text-5xl lg:text-6xl ${
              resolvedEyebrow ? "" : "mt-0"
            }`}
          >
            {resolvedTitle}
          </motion.h1>

          {resolvedDescription && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8"
            >
              {resolvedDescription}
            </motion.p>
          )}

          {actions && (
            <div className={`mt-7 flex flex-wrap gap-3 ${isCentered ? "justify-center" : "justify-start"}`}>
              {actions}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
