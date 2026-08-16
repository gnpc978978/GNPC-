"use client";

import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Users,
  Sparkles,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  type Variants,
} from "framer-motion";

import {
  usePublicMembers,
} from "@/hooks/useMembers";

import OfficeBearerCard from "@/components/office-bearers/OfficeBearerCard";
import OfficeBearersSkeleton from "@/components/office-bearers/OfficeBearersSkeleton";

import {
  useWebsiteSettings,
} from "@/context/WebsiteSettingsContext";

import {
  mergeHomeSettings,
} from "@/types/homeSettings";

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.55,
      ease: [
        0.22,
        1,
        0.36,
        1,
      ],
    },
  },
};

export default function OfficeBearersSection() {
  const {
    settings,
  } = useWebsiteSettings();

  const home =
    mergeHomeSettings(
      settings.home
    );

  const section =
    home.officeBearers;

  /*
   * ==========================================================
   * CMS CONTROLLED VALUES
   * ==========================================================
   */

  const displayCount =
    Math.max(
      1,
      Math.min(
        12,
        Number(
          section.displayCount
        ) || 3
      )
    );

  const title =
    section.title ||
    "Office Bearers";

  const description =
    section.description ||
    "";

  const eyebrow =
    section.eyebrow ||
    "Our People";

  const buttonLabel =
    section.buttonLabel ||
    "View All";

  const buttonHref =
    section.buttonHref ||
    "/office-bearers";

  const showViewAll =
    section.showViewAll;

  /*
   * ==========================================================
   * MEMBERS
   * ==========================================================
   *
   * The actual people and their photographs still come from
   * the Office Bearers/member CMS.
   *
   * Website Settings → Home only controls presentation,
   * count and CTA.
   */

  const {
    data,
    isLoading,
    isError,
  } = usePublicMembers(
    1,
    displayCount
  );

  /*
   * ==========================================================
   * CAROUSEL
   * ==========================================================
   */

  const carouselRef =
    useRef<HTMLDivElement>(
      null
    );

  const [
    canGoBack,
    setCanGoBack,
  ] = useState(false);

  const [
    canGoForward,
    setCanGoForward,
  ] = useState(true);

  const updateControls =
    useCallback(() => {
      const node =
        carouselRef.current;

      if (!node) {
        return;
      }

      setCanGoBack(
        node.scrollLeft > 4
      );

      setCanGoForward(
        node.scrollLeft +
          node.clientWidth <
          node.scrollWidth - 4
      );
    }, []);

  useEffect(() => {
    updateControls();

    const node =
      carouselRef.current;

    if (!node) {
      return;
    }

    const resizeObserver =
      new ResizeObserver(
        updateControls
      );

    resizeObserver.observe(
      node
    );

    return () =>
      resizeObserver.disconnect();
  }, [
    updateControls,
    data?.data?.length,
  ]);

  const move = (
    direction: 1 | -1
  ) => {
    const node =
      carouselRef.current;

    if (!node) {
      return;
    }

    const amount =
      Math.max(
        node.clientWidth *
          0.82,
        260
      );

    node.scrollBy({
      left:
        direction *
        amount,
      behavior:
        "smooth",
    });

    window.setTimeout(
      updateControls,
      450
    );
  };

  return (
    <section className="relative overflow-hidden bg-[#171717] py-16 text-white sm:py-24 lg:py-28">
      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-white/[0.045] blur-3xl" />

        <div className="absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-[#b8a68d]/10 blur-3xl" />

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

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* ===================================================
            CMS HEADER
            =================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
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
          className="mx-auto max-w-[900px] text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-white/25 sm:w-12" />

            <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-white/45 sm:text-[10px]">
              <Sparkles
                size={11}
              />

              {eyebrow}
            </span>

            <span className="h-px w-8 bg-white/25 sm:w-12" />
          </div>

          <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-[4.5rem]">
            {title}
          </h2>

          {description && (
            <p className="mx-auto mt-5 max-w-[700px] text-sm leading-6 text-white/45 sm:text-base sm:leading-7">
              {description}
            </p>
          )}
        </motion.div>

        {/* ===================================================
            CAROUSEL
            =================================================== */}

        <div className="mt-12 sm:mt-16">
          {isLoading ? (
            <div className="overflow-hidden">
              <OfficeBearersSkeleton
                count={Math.min(
                  displayCount,
                  4
                )}
              />
            </div>
          ) : isError ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-14 text-center">
              <Users
                size={34}
                className="mx-auto text-white/30"
              />

              <p className="mt-4 text-sm text-white/45">
                Office bearers are
                unavailable right now.
              </p>
            </div>
          ) : data?.data?.length ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.15,
              }}
              variants={{
                hidden: {},

                visible: {
                  transition: {
                    staggerChildren:
                      0.08,
                  },
                },
              }}
            >
              {/* =================================================
                  CAROUSEL
                  ================================================= */}

              <div
                ref={carouselRef}
                onScroll={
                  updateControls
                }
                className="-mx-4 grid snap-x snap-mandatory grid-flow-col auto-cols-[calc((100%_-_0.75rem)/2)] gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:auto-cols-[calc((100%_-_1.5rem)/3)] md:gap-4 lg:-mx-0 lg:auto-cols-[calc((100%_-_3.75rem)/4)] lg:gap-5 lg:px-0 [&::-webkit-scrollbar]:hidden"
                tabIndex={
                  0
                }
                aria-label="Office bearers"
              >
                {data.data.map(
                  (
                    member,
                    index
                  ) => (
                    <motion.div
                      key={
                        member._id
                      }
                      variants={
                        itemVariants
                      }
                      className="snap-start"
                    >
                      <div className="group relative h-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#242424] p-1 transition duration-300 hover:-translate-y-1 hover:border-white/20">
                        {/* Number */}

                        <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[9px] font-black tracking-[0.15em] text-white/40 backdrop-blur-md">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </div>

                        {/* Existing member CMS card */}

                        <div className="overflow-hidden rounded-[1.5rem]">
                          <OfficeBearerCard
                            member={
                              member
                            }
                          />
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </div>

              {/* =================================================
                  CAROUSEL CONTROLS
                  ================================================= */}

              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      move(-1)
                    }
                    disabled={
                      !canGoBack
                    }
                    aria-label="Previous office bearers"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25"
                  >
                    <ChevronLeft
                      size={
                        18
                      }
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      move(1)
                    }
                    disabled={
                      !canGoForward
                    }
                    aria-label="Next office bearers"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25"
                  >
                    <ChevronRight
                      size={
                        18
                      }
                    />
                  </button>
                </div>

                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/25">
                  Swipe to explore
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-14 text-center">
              <Users
                size={34}
                className="mx-auto text-white/30"
              />

              <p className="mt-4 text-sm text-white/40">
                No office bearers have
                been published yet.
              </p>
            </div>
          )}
        </div>

        {/* ===================================================
            BOTTOM CMS CTA
            =================================================== */}

        {showViewAll &&
          buttonLabel && (
            <motion.div
              initial={{
                opacity: 0,
                y: 16,
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
              <a
                href={
                  buttonHref
                }
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-black text-[#171717] shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f4ede2]"
              >
                {buttonLabel}

                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </motion.div>
          )}
      </div>
    </section>
  );
}
