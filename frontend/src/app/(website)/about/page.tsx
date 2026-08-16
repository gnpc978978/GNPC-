"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  ArrowRight,
  Eye,
  Images,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import {
  motion,
  type Variants,
} from "framer-motion";

import Link from "next/link";

import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import AboutCTA from "@/components/about/AboutCTA";

import {
  apiFetch,
  responseJson,
} from "@/services/api";

type AboutItem = {
  title: string;
  description: string;
  icon?: string;
};

type AboutSettings = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;

  image: string;

  heading: string;
  description: string;
  secondaryDescription: string;

  commitmentTitle: string;
  commitmentDescription: string;

  foundationEyebrow: string;
  foundationTitle: string;
  foundationDescription: string;

  missionTitle: string;
  missionDescription: string;

  visionTitle: string;
  visionDescription: string;

  objectivesEyebrow: string;
  objectivesTitle: string;
  objectivesDescription: string;
  objectives: AboutItem[];

  presidentName: string;
  presidentDesignation: string;
  presidentMessage: string;
  presidentPhoto: string;

  whyChooseUsEyebrow: string;
  whyChooseUsTitle: string;
  whyChooseUsDescription: string;
  reasons: AboutItem[];

  ctaTitle: string;
  ctaDescription: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
};

type AboutResponse = {
  success?: boolean;
  message?: string;
  data?: Partial<AboutSettings>;
};

const EMPTY_ABOUT: AboutSettings = {
  heroEyebrow: "",
  heroTitle: "",
  heroDescription: "",

  image: "",

  heading: "",
  description: "",
  secondaryDescription: "",

  commitmentTitle: "",
  commitmentDescription: "",

  foundationEyebrow: "",
  foundationTitle: "",
  foundationDescription: "",

  missionTitle: "",
  missionDescription: "",

  visionTitle: "",
  visionDescription: "",

  objectivesEyebrow: "",
  objectivesTitle: "",
  objectivesDescription: "",
  objectives: [],

  presidentName: "",
  presidentDesignation: "",
  presidentMessage: "",
  presidentPhoto: "",

  whyChooseUsEyebrow: "",
  whyChooseUsTitle: "",
  whyChooseUsDescription: "",
  reasons: [],

  ctaTitle: "",
  ctaDescription: "",
  ctaPrimaryLabel: "",
  ctaSecondaryLabel: "",
  ctaSecondaryHref: "/office-bearers",
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
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

function normalizeItems(
  value: unknown
): AboutItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(
    (item) => ({
      title:
        typeof item?.title ===
        "string"
          ? item.title
          : "",

      description:
        typeof item?.description ===
        "string"
          ? item.description
          : "",

      icon:
        typeof item?.icon ===
        "string"
          ? item.icon
          : "",
    })
  );
}

function normalizeAbout(
  data?: Partial<AboutSettings>
): AboutSettings {
  return {
    ...EMPTY_ABOUT,
    ...(data || {}),

    objectives:
      normalizeItems(
        data?.objectives
      ),

    reasons:
      normalizeItems(
        data?.reasons
      ),

    image:
      typeof data?.image ===
      "string"
        ? data.image
        : "",

    presidentPhoto:
      typeof data?.presidentPhoto ===
      "string"
        ? data.presidentPhoto
        : "",

    ctaSecondaryHref:
      typeof data?.ctaSecondaryHref ===
      "string" &&
      data.ctaSecondaryHref.trim()
        ? data.ctaSecondaryHref
        : "/office-bearers",
  };
}

function PageSkeleton() {
  return (
    <main className="min-h-screen bg-[#f4ede2]">
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-4 w-48 rounded bg-black/5" />

          <div className="mt-5 h-14 max-w-3xl rounded-2xl bg-black/5" />

          <div className="mt-5 h-5 max-w-2xl rounded bg-black/5" />
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div className="h-[420px] animate-pulse rounded-[2rem] bg-black/5" />

          <div className="space-y-5">
            <div className="h-12 w-4/5 rounded-2xl bg-black/5" />
            <div className="h-5 rounded bg-black/5" />
            <div className="h-5 w-11/12 rounded bg-black/5" />
            <div className="h-5 w-4/5 rounded bg-black/5" />
          </div>
        </div>
      </section>
    </main>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-[#f4ede2] px-4 py-16 sm:px-6">
      <div className="w-full max-w-xl rounded-[2rem] border border-black/10 bg-white/65 p-7 text-center shadow-[0_20px_55px_rgba(38,32,23,0.08)] backdrop-blur-md sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#171717] text-white">
          <RefreshCw
            size={24}
            aria-hidden="true"
          />
        </div>

        <h1 className="mt-5 text-2xl font-black tracking-[-0.03em] text-[#171717]">
          About page content unavailable
        </h1>

        <p className="mt-3 text-sm leading-6 text-black/50">
          {message}
        </p>

        <Button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-full !bg-white !text-[#171717] !shadow-[0_12px_30px_rgba(38,32,23,0.12)]"
        >
          <RefreshCw
            size={16}
            aria-hidden="true"
          />

          Try Again
        </Button>
      </div>
    </main>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div
      className={
        centered
          ? "mx-auto max-w-4xl text-center"
          : "max-w-3xl"
      }
    >
      {eyebrow && (
        <div
          className={[
            "flex items-center gap-3",
            centered
              ? "justify-center"
              : "justify-start",
          ].join(" ")}
        >
          <span className="h-px w-8 bg-black/20 sm:w-12" />

          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-black/45 sm:text-[10px]">
            {eyebrow}
          </span>

          <span className="h-px w-8 bg-black/20 sm:w-12" />
        </div>
      )}

      <h2 className="mt-5 text-3xl font-black leading-[1.02] tracking-[-0.045em] text-[#171717] sm:text-4xl lg:text-[3.8rem]">
        {title}
      </h2>

      {description && (
        <p className="mt-5 text-sm leading-7 text-black/50 sm:text-base sm:leading-8">
          {description}
        </p>
      )}
    </div>
  );
}

function CMSImage({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <div
        className={[
          "flex items-center justify-center rounded-[2rem] border border-black/10 bg-white/55",
          className,
        ].join(" ")}
      >
        <div className="text-center text-black/35">
          <Images
            size={42}
            className="mx-auto"
          />

          <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em]">
            Image coming soon
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        "relative overflow-hidden rounded-[2rem] border-[7px] border-white bg-white shadow-[0_30px_80px_rgba(38,32,23,0.16)]",
        className,
      ].join(" ")}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover transition duration-700 hover:scale-[1.025]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5" />
    </div>
  );
}

function ItemIcon({
  index,
}: {
  index: number;
}) {
  const icons = [
    ShieldCheck,
    Users,
    MessageCircle,
    Target,
    Eye,
    Images,
  ];

  const Icon =
    icons[index % icons.length];

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f4ede2] text-[#171717]">
      <Icon
        size={20}
        strokeWidth={2}
      />
    </div>
  );
}

export default function AboutPage() {
  const [content, setContent] =
    useState<AboutSettings | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null
    );

  const loadAboutContent =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError(null);

          const response =
            await apiFetch(
              "/settings/about"
            );

          const payload =
            await responseJson<AboutResponse>(
              response
            );

          if (
            payload.success ===
            false
          ) {
            throw new Error(
              payload.message ||
                "About CMS returned an unsuccessful response."
            );
          }

          if (
            !payload.data
          ) {
            throw new Error(
              "About CMS returned no content."
            );
          }

          setContent(
            normalizeAbout(
              payload.data
            )
          );
        } catch (
          requestError
        ) {
          console.error(
            "[About CMS] Failed to load content:",
            requestError
          );

          setContent(null);

          setError(
            requestError instanceof
              Error
              ? requestError.message
              : "Unable to load About page content."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    void loadAboutContent();
  }, [
    loadAboutContent,
  ]);

  useEffect(() => {
    const handleUpdate =
      () => {
        void loadAboutContent();
      };

    window.addEventListener(
      "about-settings-updated",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "about-settings-updated",
        handleUpdate
      );
    };
  }, [
    loadAboutContent,
  ]);

  if (loading) {
    return <PageSkeleton />;
  }

  if (
    error ||
    !content
  ) {
    return (
      <ErrorState
        message={
          error ||
          "The About CMS did not return any content."
        }
        onRetry={() => {
          void loadAboutContent();
        }}
      />
    );
  }

  return (
    <main className="bg-[#f4ede2] text-[#171717]">
      {/* =====================================================
          PAGE HERO
          ===================================================== */}

      <PageHero
        contentKey="about"
        eyebrow={
          content.heroEyebrow ||
          "About Greater Noida Press Club"
        }
        title={
          content.heroTitle ||
          "About Us"
        }
        description={
          content.heroDescription ||
          "Learn about Greater Noida Press Club, our mission, vision and commitment towards ethical journalism."
        }
        breadcrumbs={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "About Us",
          },
        ]}
      />

      {/* =====================================================
          INTRO
          ===================================================== */}

      <section className="relative overflow-hidden bg-[#f4ede2] px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-0 h-[26rem] w-[26rem] rounded-full bg-white/70 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 right-0 h-[26rem] w-[26rem] rounded-full bg-[#d8c7af]/30 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1.03fr_0.97fr] lg:gap-16">
            <motion.div
              initial={{
                opacity: 0,
                x: -30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.75,
              }}
              className="relative min-w-0"
            >
              <span className="inline-flex rounded-full border border-black/10 bg-white/55 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-black/50 backdrop-blur-md">
                Our Story
              </span>

              <h2 className="mt-5 text-3xl font-black leading-[1.02] tracking-[-0.045em] sm:text-4xl lg:text-[3.7rem]">
                {
                  content.heading
                }
              </h2>

              {content.description && (
                <p className="mt-6 max-w-2xl text-sm leading-7 text-black/55 sm:text-base sm:leading-8">
                  {
                    content.description
                  }
                </p>
              )}

              {content.secondaryDescription && (
                <p className="mt-4 max-w-2xl text-sm leading-7 text-black/50 sm:text-base sm:leading-8">
                  {
                    content.secondaryDescription
                  }
                </p>
              )}

              {content.commitmentTitle && (
                <div className="mt-8 rounded-[1.75rem] border border-black/10 bg-white/60 p-5 backdrop-blur-md sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#171717] text-white">
                      <ShieldCheck
                        size={19}
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-black tracking-[-0.025em]">
                        {
                          content.commitmentTitle
                        }
                      </h3>

                      {content.commitmentDescription && (
                        <p className="mt-2 text-sm leading-7 text-black/50">
                          {
                            content.commitmentDescription
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                x: 30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.75,
                delay: 0.08,
              }}
              className="relative"
            >
              <div className="absolute -bottom-5 -left-5 h-full w-full rounded-[2rem] bg-[#d8c7af]/45" />

              <CMSImage
                src={
                  content.image
                }
                alt={
                  content.heading ||
                  "Greater Noida Press Club"
                }
                priority
                className="aspect-[6/5] min-h-[350px] sm:min-h-[450px]"
              />

              <div className="absolute -bottom-5 right-4 z-20 rounded-2xl border border-black/10 bg-white/85 px-4 py-3 shadow-xl backdrop-blur-md sm:right-7">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-black/40">
                  GNPC
                </p>

                <p className="mt-1 text-xs font-black sm:text-sm">
                  Journalism • Community
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MISSION / VISION
          ===================================================== */}

      <section className="relative overflow-hidden bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="relative mx-auto max-w-7xl">
          <SectionIntro
            eyebrow={
              content.foundationEyebrow
            }
            title={
              content.foundationTitle ||
              "Mission & Vision"
            }
            description={
              content.foundationDescription
            }
            centered
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.12,
            }}
            variants={{
              hidden: {},

              visible: {
                transition: {
                  staggerChildren:
                    0.1,
                },
              },
            }}
            className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-16"
          >
            <motion.article
              variants={itemVariants}
              className="group relative overflow-hidden rounded-[2rem] border border-black/10 bg-[#f4ede2] p-6 sm:p-8"
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/70 blur-2xl transition group-hover:scale-125" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#171717] text-white">
                  <Target
                    size={23}
                  />
                </div>

                <h3 className="mt-6 text-2xl font-black tracking-[-0.035em]">
                  {
                    content.missionTitle
                  }
                </h3>

                <p className="mt-4 text-sm leading-7 text-black/50 sm:text-base">
                  {
                    content.missionDescription
                  }
                </p>
              </div>
            </motion.article>

            <motion.article
              variants={itemVariants}
              className="group relative overflow-hidden rounded-[2rem] border border-black/10 bg-[#59684e] p-6 text-white sm:p-8"
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl transition group-hover:scale-125" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                  <Eye
                    size={23}
                  />
                </div>

                <h3 className="mt-6 text-2xl font-black tracking-[-0.035em]">
                  {
                    content.visionTitle
                  }
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
                  {
                    content.visionDescription
                  }
                </p>
              </div>
            </motion.article>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          OBJECTIVES
          ===================================================== */}

      {content.objectives
        .length > 0 && (
        <section className="relative overflow-hidden bg-[#f4ede2] px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="relative mx-auto max-w-7xl">
            <SectionIntro
              eyebrow={
                content.objectivesEyebrow
              }
              title={
                content.objectivesTitle ||
                "Our Objectives"
              }
              description={
                content.objectivesDescription
              }
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.1,
              }}
              variants={{
                hidden: {},

                visible: {
                  transition: {
                    staggerChildren:
                      0.07,
                  },
                },
              }}
              className="mt-12 grid gap-4 sm:mt-16 md:grid-cols-2 lg:grid-cols-3"
            >
              {content.objectives.map(
                (
                  objective,
                  index
                ) => (
                  <motion.article
                    key={`${objective.title}-${index}`}
                    variants={
                      itemVariants
                    }
                    className="group relative overflow-hidden rounded-[1.75rem] border border-black/10 bg-white/65 p-5 shadow-[0_18px_45px_rgba(38,32,23,0.06)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white sm:p-6"
                  >
                    <div className="relative z-10 flex items-start gap-4">
                      <ItemIcon
                        index={
                          index
                        }
                      />

                      <div className="min-w-0">
                        {objective.title && (
                          <h3 className="text-lg font-black leading-tight tracking-[-0.025em]">
                            {
                              objective.title
                            }
                          </h3>
                        )}

                        {objective.description && (
                          <p className="mt-3 text-sm leading-6 text-black/50">
                            {
                              objective.description
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="absolute -bottom-12 -right-12 h-28 w-28 rounded-full bg-[#d8c7af]/20 blur-2xl transition duration-500 group-hover:scale-125" />
                  </motion.article>
                )
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* =====================================================
          PRESIDENT MESSAGE
          ===================================================== */}

      {(content.presidentName ||
        content.presidentMessage ||
        content.presidentPhoto) && (
        <section className="relative overflow-hidden bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="relative mx-auto max-w-7xl">
            <motion.div
              initial={{
                opacity: 0,
                y: 24,
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
                duration: 0.7,
              }}
              className="overflow-hidden rounded-[2rem] border border-black/10 bg-[#171717] text-white shadow-[0_30px_75px_rgba(38,32,23,0.16)]"
            >
              <div className="grid items-center lg:grid-cols-[0.42fr_0.58fr]">
                <div className="relative min-h-[360px] overflow-hidden bg-[#262626] sm:min-h-[450px] lg:min-h-[520px]">
                  {content.presidentPhoto ? (
                    <Image
                      src={
                        content.presidentPhoto
                      }
                      alt={
                        content.presidentName ||
                        "President"
                      }
                      fill
                      sizes="(min-width: 1024px) 42vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-4xl font-black text-white/60">
                        {content.presidentName
                          ?.charAt(
                            0
                          )
                          ?.toUpperCase() ||
                          "P"}
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r" />

                  <div className="absolute bottom-6 left-6 right-6 z-10 sm:bottom-8 sm:left-8 sm:right-8">
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/45">
                      President
                    </p>

                    {content.presidentName && (
                      <p className="mt-1 text-xl font-black tracking-[-0.03em]">
                        {
                          content.presidentName
                        }
                      </p>
                    )}

                    {content.presidentDesignation && (
                      <p className="mt-1 text-xs text-white/50">
                        {
                          content.presidentDesignation
                        }
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6 sm:p-9 lg:p-14">
                  <div className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-white/45">
                    President's Message
                  </div>

                  {content.presidentMessage && (
                    <blockquote className="mt-6 text-xl font-black leading-[1.18] tracking-[-0.035em] text-white sm:text-2xl lg:text-[2.5rem]">
                      “
                      {
                        content.presidentMessage
                      }
                      ”
                    </blockquote>
                  )}

                  <div className="mt-8 h-px w-12 bg-white/20" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* =====================================================
          WHY CHOOSE US
          ===================================================== */}

      {content.reasons
        .length > 0 && (
        <section className="relative overflow-hidden bg-[#f4ede2] px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="relative mx-auto max-w-7xl">
            <SectionIntro
              eyebrow={
                content.whyChooseUsEyebrow
              }
              title={
                content.whyChooseUsTitle ||
                "Why Choose Us"
              }
              description={
                content.whyChooseUsDescription
              }
              centered
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.1,
              }}
              variants={{
                hidden: {},

                visible: {
                  transition: {
                    staggerChildren:
                      0.07,
                  },
                },
              }}
              className="mt-12 grid gap-4 sm:mt-16 md:grid-cols-2 lg:grid-cols-3"
            >
              {content.reasons.map(
                (
                  reason,
                  index
                ) => (
                  <motion.article
                    key={`${reason.title}-${index}`}
                    variants={
                      itemVariants
                    }
                    className="group rounded-[1.75rem] border border-black/10 bg-white/65 p-5 shadow-[0_18px_45px_rgba(38,32,23,0.06)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white sm:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#171717] text-white transition duration-300 group-hover:scale-105">
                        <ShieldCheck
                          size={19}
                        />
                      </div>

                      <div className="min-w-0">
                        {reason.title && (
                          <h3 className="text-lg font-black leading-tight tracking-[-0.025em]">
                            {
                              reason.title
                            }
                          </h3>
                        )}

                        {reason.description && (
                          <p className="mt-3 text-sm leading-6 text-black/50">
                            {
                              reason.description
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.article>
                )
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* =====================================================
          CTA
          ===================================================== */}

      <AboutCTA
        title={
          content.ctaTitle
        }
        description={
          content.ctaDescription
        }
        primaryLabel={
          content.ctaPrimaryLabel
        }
        secondaryLabel={
          content.ctaSecondaryLabel
        }
        secondaryHref={
          content.ctaSecondaryHref
        }
      />

      {/* =====================================================
          ACCESSIBILITY / FALLBACK NAV
          ===================================================== */}

      <div className="sr-only">
        <Link href="/">
          Home
        </Link>

        <Link href="/office-bearers">
          Office Bearers
        </Link>

        <Link href="/committee">
          Executive Committee
        </Link>
      </div>
    </main>
  );
}
