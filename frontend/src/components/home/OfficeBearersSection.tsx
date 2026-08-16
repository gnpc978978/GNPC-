"use client";

import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Users,
} from "lucide-react";
import {
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
import Button from "@/components/ui/Button";

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
    data,
    isLoading,
    isError,
  } = usePublicMembers(1, 3);

  const carouselRef =
    useRef<HTMLDivElement>(null);

  const [
    canGoBack,
    setCanGoBack,
  ] = useState(false);

  const [
    canGoForward,
    setCanGoForward,
  ] = useState(true);

  const updateControls =
    () => {
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
    };

  const move = (
    direction: 1 | -1
  ) => {
    const node =
      carouselRef.current;

    if (!node) {
      return;
    }

    node.scrollBy({
      left:
        direction *
        Math.max(
          node.clientWidth *
            0.84,
          260
        ),
      behavior: "smooth",
    });

    window.setTimeout(
      updateControls,
      450
    );
  };

  return (
    <section className="relative overflow-hidden bg-[#171717] py-16 text-white sm:py-24 lg:py-28">
      {/* =====================================================
          DECORATIVE BACKGROUND
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
            HEADER
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
          className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-[760px]">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-white/25 sm:w-12" />

              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/45 sm:text-[10px]">
                Our People
              </span>
            </div>

            <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-[4.5rem]">
              The people
              <br />
              behind the club.
            </h2>

            <p className="mt-5 max-w-[620px] text-sm leading-6 text-white/45 sm:text-base sm:leading-7">
              Meet the office bearers leading
              Greater Noida Press Club and
              representing the interests of its
              members.
            </p>
          </div>

          {/* =================================================
              DESKTOP CONTROLS
              ================================================= */}

          <div className="flex items-center gap-2">
            <Button
              href="/office-bearers"
              variant="outline"
              size="lg"
              className="rounded-full border-white/15 bg-white/[0.06] text-white hover:bg-white/10"
            >
              View All

              <ArrowRight
                size={17}
              />
            </Button>

            <button
              type="button"
              onClick={() =>
                move(-1)
              }
              disabled={
                !canGoBack
              }
              aria-label="Previous office bearers"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ChevronLeft
                size={19}
                aria-hidden="true"
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
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ChevronRight
                size={19}
                aria-hidden="true"
              />
            </button>
          </div>
        </motion.div>

        {/* ===================================================
            CAROUSEL
            =================================================== */}

        <div className="mt-12 sm:mt-16">
          {isLoading ? (
            <div className="overflow-hidden">
              <OfficeBearersSkeleton
                count={4}
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
                    staggerChildren: 0.08,
                  },
                },
              }}
            >
              <div
                ref={carouselRef}
                onScroll={
                  updateControls
                }
                className="-mx-4 grid snap-x snap-mandatory grid-flow-col auto-cols-[calc((100%_-_0.75rem)/2)] gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:auto-cols-[calc((100%_-_1.5rem)/3)] md:gap-4 lg:-mx-0 lg:auto-cols-[calc((100%_-_3.75rem)/4)] lg:gap-5 lg:px-0 [&::-webkit-scrollbar]:hidden"
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
                            index +
                              1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </div>

                        {/* Existing CMS card */}

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

              {/* Mobile hint */}

              <div className="mt-4 flex items-center justify-between lg:hidden">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/30">
                  Swipe to explore
                </p>

                <div className="h-px flex-1 bg-white/10 ml-4" />
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
            BOTTOM ACCENT
            =================================================== */}

        <motion.div
          initial={{
            scaleX: 0,
            opacity: 0,
          }}
          whileInView={{
            scaleX: 1,
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.9,
            delay: 0.2,
          }}
          className="mt-10 h-px origin-left bg-gradient-to-r from-white/20 via-white/10 to-transparent sm:mt-14"
        />
      </div>
    </section>
  );
}
