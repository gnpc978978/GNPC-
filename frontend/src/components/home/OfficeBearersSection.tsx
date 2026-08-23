"use client";

import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

import { usePublicOfficeBearers } from "@/hooks/useOfficeBearers";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import { mergeHomeSettings } from "@/types/homeSettings";
import Button from "@/components/ui/Button";

export default function OfficeBearersSection() {
  const { settings } = useWebsiteSettings();

  const section =
    mergeHomeSettings(settings.home).officeBearers;

  const count = Math.max(
    1,
    Math.min(12, Number(section.displayCount) || 6)
  );

  const {
    data,
    isLoading,
    isError,
  } = usePublicOfficeBearers(1, count);

  const members = data?.data || [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /*
   * Keep active index valid when CMS data changes.
   */
  useEffect(() => {
    if (members.length === 0) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex((current) =>
      Math.min(current, members.length - 1)
    );
  }, [members.length, setActiveIndex]);

  /*
   * Move carousel forward.
   */
  const next = useCallback(() => {
    if (members.length <= 1) return;

    setActiveIndex((current) =>
      current === members.length - 1
        ? 0
        : current + 1
    );
  }, [members.length, setActiveIndex]);

  /*
   * Move carousel backward.
   */
  const previous = useCallback(() => {
    if (members.length <= 1) return;

    setActiveIndex((current) =>
      current === 0
        ? members.length - 1
        : current - 1
    );
  }, [members.length, setActiveIndex]);

  /*
   * Automatic carousel.
   */
  useEffect(() => {
    if (
      isPaused ||
      members.length <= 1 ||
      isLoading ||
      isError
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      next();
    }, 4500);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    isPaused,
    members.length,
    isLoading,
    isError,
    next,
  ]);

  /*
   * Calculate how far each card is from
   * the currently active card.
   *
   * This also makes the carousel circular.
   */
  const getRelativePosition = useCallback(
    (index: number) => {
      if (members.length === 0) return 0;

      let difference = index - activeIndex;

      const total = members.length;

      if (difference > total / 2) {
        difference -= total;
      }

      if (difference < -total / 2) {
        difference += total;
      }

      return difference;
    },
    [activeIndex, members.length]
  );

  /*
   * Only render cards that are close to the
   * active card. This gives the carousel its
   * layered appearance without showing every
   * member simultaneously.
   */
  const visibleMembers = useMemo(() => {
    return members.map((member, index) => ({
      member,
      index,
      position: getRelativePosition(index),
    }));
  }, [members, getRelativePosition]);

  return (
    <section className="relative overflow-hidden bg-[#f8fafc] py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">

        {/* =========================================
            SECTION HEADER
        ========================================== */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          className="gnpc-section-heading mx-auto max-w-[900px] text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-black/20 sm:w-12" />
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-black/45 sm:text-[10px]">
              {section.eyebrow || "Our Leaders"}
            </span>
            <span aria-hidden="true" className="h-px w-8 bg-black/20 sm:w-12" />
          </div>

          <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-[4.5rem]">
            {section.title || "Office Bearers"}
          </h2>

          {section.description && (
            <p className="mx-auto mt-5 max-w-[720px] text-sm leading-6 text-black/50 sm:text-base sm:leading-7">
              {section.description}
            </p>
          )}

          {section.showViewAll && (
            <div className="mt-7 flex justify-center">
              <Button
                href={section.buttonHref || "/office-bearers"}
                variant="outline"
                size="md"
              >
                {section.buttonLabel?.trim().toLowerCase() === "explore"
                  ? "View All"
                  : section.buttonLabel || "View All"}
                <ArrowRight size={16} />
              </Button>
            </div>
          )}
        </motion.div>

        {/* =========================================
            LOADING STATE
        ========================================== */}
        {isLoading && (
          <div className="mt-10 flex min-h-[500px] items-center justify-center">
            <div className="relative h-[400px] w-full max-w-[900px]">

              <div className="absolute left-1/2 top-1/2 h-[270px] w-[210px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-2xl bg-slate-200 shadow-xl" />

              <div className="absolute left-[15%] top-1/2 hidden h-[230px] w-[170px] -translate-y-1/2 animate-pulse rounded-2xl bg-slate-200 opacity-60 sm:block" />

              <div className="absolute right-[15%] top-1/2 hidden h-[230px] w-[170px] -translate-y-1/2 animate-pulse rounded-2xl bg-slate-200 opacity-60 sm:block" />

            </div>
          </div>
        )}

        {/* =========================================
            ERROR STATE
        ========================================== */}
        {!isLoading && isError && (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 px-6 py-14 text-center">
            <Users
              className="mx-auto text-red-400"
              size={38}
            />

            <p className="mt-4 text-sm font-semibold text-red-700">
              Office bearers are unavailable
              right now.
            </p>
          </div>
        )}

        {/* =========================================
            EMPTY STATE
        ========================================== */}
        {!isLoading &&
          !isError &&
          members.length === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <Users
                className="mx-auto text-slate-400"
                size={38}
              />

              <p className="mt-4 text-sm font-semibold text-slate-600">
                No office bearers have been
                published yet.
              </p>
            </div>
          )}

        {/* =========================================
            CAROUSEL
        ========================================== */}
        {!isLoading &&
          !isError &&
          members.length > 0 && (
            <div
              className="relative mt-8 sm:mt-10"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >

              {/* =====================================
                  CAROUSEL STAGE
              ====================================== */}
              <div className="relative mx-auto h-[475px] w-full max-w-[1100px] overflow-hidden sm:h-[510px] lg:h-[540px]">

                {/* Subtle background glow */}
                <div className="pointer-events-none absolute left-1/2 top-[42%] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4b06a]/10 blur-3xl sm:h-[360px] sm:w-[360px]" />

                {visibleMembers.map(
                  ({
                    member,
                    index,
                    position,
                  }) => {

                    /*
                     * Cards farther than +/- 2 are hidden.
                     */
                    const isVisible =
                      Math.abs(position) <= 2;

                    if (!isVisible) {
                      return null;
                    }

                    const isActive =
                      position === 0;

                    /*
                     * Position configuration.
                     *
                     * Center:
                     *   x = 0
                     *   scale = 1
                     *
                     * Left/right:
                     *   smaller
                     *   slightly rotated
                     *   lower z-index
                     */
                    let x = "0%";
                    let scale = 1;
                    let rotate = 0;
                    let opacity = 1;
                    let zIndex = 30;
                    let blur = 0;

                    if (position === -1) {
                      x = "-78%";
                      scale = 0.78;
                      rotate = -7;
                      opacity = 0.68;
                      zIndex = 20;
                      blur = 0.3;
                    }

                    if (position === 1) {
                      x = "78%";
                      scale = 0.78;
                      rotate = 7;
                      opacity = 0.68;
                      zIndex = 20;
                      blur = 0.3;
                    }

                    if (position === -2) {
                      x = "-138%";
                      scale = 0.62;
                      rotate = -11;
                      opacity = 0.32;
                      zIndex = 10;
                      blur = 1;
                    }

                    if (position === 2) {
                      x = "138%";
                      scale = 0.62;
                      rotate = 11;
                      opacity = 0.32;
                      zIndex = 10;
                      blur = 1;
                    }

                    return (
                      <motion.div
                        key={member._id}
                        initial={false}
                        animate={{
                          x,
                          scale,
                          rotate,
                          opacity,
                          filter:
                            blur > 0
                              ? `blur(${blur}px)`
                              : "blur(0px)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 28,
                          mass: 0.8,
                        }}
                        style={{
                          zIndex,
                        }}
                        className="absolute left-1/2 top-[37%] w-[210px] -translate-x-1/2 -translate-y-1/2 sm:w-[250px] lg:w-[280px]"
                      >

                        {/* =================================
                            MEMBER CARD
                        ================================== */}
                        <button
                          type="button"
                          onClick={() =>
                            setActiveIndex(index)
                          }
                          aria-label={`View ${member.fullName}`}
                          className={`group block w-full text-left ${
                            isActive
                              ? "cursor-default"
                              : "cursor-pointer"
                          }`}
                        >

                          {/* IMAGE */}
                          <div
                            className={`relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-200 ${
                              isActive
                                ? "shadow-[0_25px_60px_rgba(15,23,42,0.22)] ring-1 ring-black/5"
                                : "shadow-lg"
                            }`}
                          >

                            {member.photo ? (
                              <Image
                                src={member.photo}
                                alt={member.fullName}
                                fill
                                priority={isActive}
                                sizes="(min-width: 1024px) 280px, (min-width: 640px) 250px, 210px"
                                className={`object-cover transition-transform duration-700 ${
                                  isActive
                                    ? "group-hover:scale-[1.03]"
                                    : ""
                                }`}
                              />
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#edf2f7] to-[#f7f2e6] text-[#9a7631]">
                                <Users
                                  size={52}
                                  strokeWidth={1.4}
                                />

                                <span className="mt-3 text-3xl font-bold">
                                  {member.fullName?.charAt(
                                    0
                                  )}
                                </span>
                              </div>
                            )}

                            {/* Dark gradient at bottom */}
                            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/35 to-transparent" />

                            {/* Active card accent */}
                            {isActive && (
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#d4b06a]" />
                            )}
                          </div>

                          {/* =================================
                              ACTIVE MEMBER INFORMATION
                          ================================== */}
                          <motion.div
                            animate={{
                              opacity: isActive
                                ? 1
                                : 0,
                              y: isActive
                                ? 0
                                : 8,
                            }}
                            transition={{
                              duration: 0.25,
                            }}
                            className="pointer-events-none mt-5 text-center"
                          >
                            <h3 className="text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
                              {member.fullName}
                            </h3>

                            <div className="mx-auto mt-2 flex items-center justify-center gap-3">
                              <span className="h-px w-8 bg-[#9a7631]" />

                              <p className="text-sm font-semibold uppercase tracking-wide text-[#9a7631]">
                                {member.designation ||
                                  "GNPC Member"}
                              </p>

                              <span className="h-px w-8 bg-[#9a7631]" />
                            </div>

                            {(member.organization ||
                              member.state) && (
                              <p className="mt-2 text-xs text-slate-500">
                                {[
                                  member.organization,
                                  member.state,
                                ]
                                  .filter(Boolean)
                                  .join(
                                    " · "
                                  )}
                              </p>
                            )}
                          </motion.div>
                        </button>

                        {/* =================================
                            CLICK / OPEN DETAILS LINK
                        ================================== */}
                        {isActive && (
                          <a
                            href={`/office-bearers/${member._id}`}
                            className="absolute left-1/2 top-[calc(100%+76px)] -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-slate-500 transition hover:text-[#9a7631]"
                          >
                            View Profile
                          </a>
                        )}
                      </motion.div>
                    );
                  }
                )}

                {/* =====================================
                    LEFT ARROW
                ====================================== */}
                {members.length > 1 && (
                  <button
                    type="button"
                    onClick={previous}
                    aria-label="Previous office bearer"
                    className="absolute left-1 top-[37%] z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition-all duration-200 hover:border-[#d4b06a] hover:bg-[#d4b06a] hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#d4b06a]/30 sm:left-4 sm:h-11 sm:w-11 lg:left-10"
                  >
                    <ChevronLeft
                      size={20}
                      strokeWidth={2}
                    />
                  </button>
                )}

                {/* =====================================
                    RIGHT ARROW
                ====================================== */}
                {members.length > 1 && (
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next office bearer"
                    className="absolute right-1 top-[37%] z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition-all duration-200 hover:border-[#d4b06a] hover:bg-[#d4b06a] hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#d4b06a]/30 sm:right-4 sm:h-11 sm:w-11 lg:right-10"
                  >
                    <ChevronRight
                      size={20}
                      strokeWidth={2}
                    />
                  </button>
                )}
              </div>

              {/* =========================================
                  PAGINATION DOTS
              ========================================== */}
              {members.length > 1 && (
                <div className="relative z-50 mt-2 flex items-center justify-center gap-2">
                  {members.map((member, index) => {
                    const active =
                      index === activeIndex;

                    return (
                      <button
                        key={member._id}
                        type="button"
                        onClick={() =>
                          setActiveIndex(index)
                        }
                        aria-label={`Go to ${member.fullName}`}
                        aria-current={
                          active
                            ? "true"
                            : undefined
                        }
                        className="group flex h-5 w-5 items-center justify-center"
                      >
                        <span
                          className={`block rounded-full transition-all duration-300 ${
                            active
                              ? "h-2.5 w-6 bg-[#9a7631]"
                              : "h-2 w-2 bg-slate-300 group-hover:bg-[#d4b06a]"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* =========================================
                  MOBILE SWIPE HINT
              ========================================== */}
              {members.length > 1 && (
                <p className="mt-4 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400 sm:hidden">
                  Tap a member to view
                </p>
              )}
            </div>
          )}
      </div>
    </section>
  );
}
