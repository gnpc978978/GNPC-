"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Mail,
  Phone,
  SearchX,
  Users,
  Sparkles,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  motion,
  type Variants,
} from "framer-motion";

import {
  getPublicExecutiveCommittee,
} from "@/services/executiveCommitteeService";

import type {
  ExecutiveCommittee,
} from "@/types/executiveCommittee";

import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

import type {
  ExecutiveCommitteePageSettings,
} from "@/types/pageSettings";

import {
  mergeHomeSettings,
} from "@/types/homeSettings";

import {
  useWebsiteSettings,
} from "@/context/WebsiteSettingsContext";

type Props = {
  limit?: number;
  showViewAll?: boolean;
  title?: string;
  description?: string;
  eyebrow?: string;
  buttonLabel?: string;
  buttonHref?: string;
  settings?: ExecutiveCommitteePageSettings;
};

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

const values = (
  members: ExecutiveCommittee[],
  field:
    | "designation"
    | "organization"
    | "state"
) =>
  [
    ...new Set(
      members
        .map(
          (member) =>
            member[field]
        )
        .filter(
          (
            value
          ): value is string =>
            Boolean(value)
        )
    ),
  ].sort((a, b) =>
    a.localeCompare(b)
  );

function CommitteePhoto({
  member,
}: {
  member: ExecutiveCommittee;
}) {
  if (member.photo) {
    return (
      <Image
        src={member.photo}
        alt={member.name}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 50vw"
        className="object-cover transition duration-700 group-hover:scale-[1.04]"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#ded0bb]">
      <span className="text-6xl font-black text-black/20">
        {member.name.charAt(
          0
        )}
      </span>
    </div>
  );
}

function CommitteeCard({
  member,
  index,
}: {
  member: ExecutiveCommittee;
  index: number;
}) {
  return (
    <motion.article
      variants={
        cardVariants
      }
      className="group overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#242424] p-1 shadow-[0_20px_55px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:border-white/25"
    >
      <div className="overflow-hidden rounded-[1.5rem]">
        {/* Image */}

        <div className="relative aspect-[4/4.5] overflow-hidden bg-[#ded0bb]">
          <CommitteePhoto
            member={
              member
            }
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

          <div className="absolute right-3 top-3 flex h-7 min-w-7 items-center justify-center rounded-full border border-white/20 bg-black/35 px-2 text-[8px] font-black tracking-[0.15em] text-white backdrop-blur-md">
            {String(
              index + 1
            ).padStart(
              2,
              "0"
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="line-clamp-1 text-base font-black text-white sm:text-lg">
              {member.name}
            </h3>

            {member.designation && (
              <p className="mt-1 line-clamp-1 text-xs font-bold text-white/65">
                {
                  member.designation
                }
              </p>
            )}
          </div>
        </div>

        {/* Details */}

        <div className="space-y-2 p-4">
          {member.organization && (
            <p className="line-clamp-1 text-xs font-semibold text-white/55">
              {member.organization}
            </p>
          )}

          {member.state && (
            <p className="line-clamp-1 text-xs text-white/35">
              {member.state}
            </p>
          )}

          <div className="hidden space-y-2 pt-2 text-xs sm:block">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="flex items-center gap-2 text-white/40 transition hover:text-white"
              >
                <Mail
                  size={13}
                />

                <span className="truncate">
                  {
                    member.email
                  }
                </span>
              </a>
            )}

            {member.phone && (
              <a
                href={`tel:${member.phone}`}
                className="flex items-center gap-2 text-white/40 transition hover:text-white"
              >
                <Phone
                  size={13}
                />

                <span>
                  {
                    member.phone
                  }
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function LoadingCard() {
  return (
    <div className="h-[360px] animate-pulse rounded-[1.75rem] bg-white/10" />
  );
}

export default function ExecutiveCommitteeSection({
  limit,
  showViewAll,
  title,
  description,
  eyebrow,
  buttonLabel,
  buttonHref,
  settings,
}: Props) {
  const {
    settings:
      websiteSettings,
  } =
    useWebsiteSettings();

  const home =
    mergeHomeSettings(
      websiteSettings.home
    );

  /*
   * ==========================================================
   * HOMEPAGE CMS
   * ==========================================================
   *
   * When this component is embedded on the homepage,
   * Website Settings → Home → Executive Committee becomes
   * the source of truth.
   *
   * The props remain supported so existing callers do not break.
   */

  const homeSection =
    home.executiveCommittee;

  const isDirectory =
    !limit;

  const resolvedLimit =
    isDirectory
      ? undefined
      : limit ||
        homeSection.displayCount ||
        3;

  const resolvedEyebrow =
    isDirectory
      ? settings?.pageEyebrow ||
        eyebrow ||
        "Our Strength"
      : eyebrow ||
        homeSection.eyebrow ||
        "Our Strength";

  const resolvedTitle =
    isDirectory
      ? settings?.pageTitle ||
        title ||
        "Executive Committee"
      : title ||
        homeSection.title ||
        "Executive Committee";

  const resolvedDescription =
    isDirectory
      ? settings?.pageDescription ||
        description ||
        "Meet the Executive Committee of Greater Noida Press Club."
      : description ||
        homeSection.description ||
        "Meet the Executive Committee of Greater Noida Press Club.";

  const resolvedButtonLabel =
    isDirectory
      ? "View All"
      : buttonLabel ||
        homeSection.buttonLabel ||
        "View All";

  const resolvedButtonHref =
    isDirectory
      ? "/committee"
      : buttonHref ||
        homeSection.buttonHref ||
        "/committee";

  const resolvedShowButton =
    isDirectory
      ? false
      : showViewAll ??
        homeSection.showViewAll;

  const [
    members,
    setMembers,
  ] = useState<
    ExecutiveCommittee[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    designation,
    setDesignation,
  ] = useState("");

  const [
    organization,
    setOrganization,
  ] = useState("");

  const [
    state,
    setState,
  ] = useState("");

  const [
    page,
    setPage,
  ] = useState(1);

  const pageSize =
    Math.max(
      1,
      Math.min(
        100,
        Number(
          settings?.pageSize
        ) ||
          resolvedLimit ||
          8
      )
    );

  const filters =
    useMemo(
      () => ({
        search,
        designation,
        organization,
        state,
      }),
      [
        search,
        designation,
        organization,
        state,
      ]
    );

  /*
   * ==========================================================
   * API
   * ==========================================================
   */

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          setPage(1);
          setLoading(
            true
          );

          const params =
            new URLSearchParams();

          Object.entries(
            filters
          ).forEach(
            ([
              key,
              value,
            ]) => {
              if (value) {
                params.set(
                  key,
                  value
                );
              }
            }
          );

          if (
            resolvedLimit
          ) {
            params.set(
              "limit",
              String(
                resolvedLimit
              )
            );
          }

          void getPublicExecutiveCommittee(
            params
          )
            .then(
              setMembers
            )
            .catch(() =>
              setMembers(
                []
              )
            )
            .finally(
              () =>
                setLoading(
                  false
                )
            );
        },
        0
      );

    return () =>
      window.clearTimeout(
        timer
      );
  }, [
    filters,
    resolvedLimit,
  ]);

  /*
   * ==========================================================
   * PAGINATION
   * ==========================================================
   */

  const visibleMembers =
    members.slice(
      (page - 1) *
        pageSize,
      page *
        pageSize
    );

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        members.length /
          pageSize
      )
    );

  /*
   * ==========================================================
   * FILTER OPTIONS
   * ==========================================================
   */

  const filterOptions =
    {
      designation:
        values(
          members,
          "designation"
        ),

      organization:
        values(
          members,
          "organization"
        ),

      state:
        values(
          members,
          "state"
        ),
    };

  /*
   * ==========================================================
   * FULL DIRECTORY
   * ==========================================================
   */

  if (isDirectory) {
    return (
      <section className="bg-[#f4ede2] py-12 text-[#171717] sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page intro */}

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
            }}
            transition={{
              duration: 0.6,
            }}
            className="mx-auto mb-10 max-w-3xl text-center"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-black/20 sm:w-12" />

              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-black/40 sm:text-[10px]">
                {resolvedEyebrow}
              </span>

              <span className="h-px w-8 bg-black/20 sm:w-12" />
            </div>

            <h1 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-[4rem]">
              {resolvedTitle}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-black/50 sm:text-base">
              {
                resolvedDescription
              }
            </p>
          </motion.div>

          {/* Filters */}

          <div className="mb-10 rounded-[2rem] border border-black/10 bg-white/60 p-4 shadow-sm backdrop-blur-md sm:p-5">
            {settings?.showSearch !==
              false && (
              <input
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event
                      .target
                      .value
                  )
                }
                placeholder="Search by name, designation, or organization"
                className="w-full rounded-xl border border-black/10 bg-white p-3 text-sm outline-none focus:border-black/30 focus:ring-4 focus:ring-black/5"
              />
            )}

            {settings?.showFilters !==
              false && (
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <select
                  value={
                    designation
                  }
                  onChange={(
                    event
                  ) =>
                    setDesignation(
                      event
                        .target
                        .value
                    )
                  }
                  className="rounded-xl border border-black/10 bg-white p-3 text-sm"
                >
                  <option value="">
                    All designations
                  </option>

                  {filterOptions.designation.map(
                    (
                      value
                    ) => (
                      <option
                        key={
                          value
                        }
                        value={
                          value
                        }
                      >
                        {
                          value
                        }
                      </option>
                    )
                  )}
                </select>

                <select
                  value={
                    organization
                  }
                  onChange={(
                    event
                  ) =>
                    setOrganization(
                      event
                        .target
                        .value
                    )
                  }
                  className="rounded-xl border border-black/10 bg-white p-3 text-sm"
                >
                  <option value="">
                    All organizations
                  </option>

                  {filterOptions.organization.map(
                    (
                      value
                    ) => (
                      <option
                        key={
                          value
                        }
                        value={
                          value
                        }
                      >
                        {
                          value
                        }
                      </option>
                    )
                  )}
                </select>

                <select
                  value={
                    state
                  }
                  onChange={(
                    event
                  ) =>
                    setState(
                      event
                        .target
                        .value
                    )
                  }
                  className="rounded-xl border border-black/10 bg-white p-3 text-sm"
                >
                  <option value="">
                    All states
                  </option>

                  {filterOptions.state.map(
                    (
                      value
                    ) => (
                      <option
                        key={
                          value
                        }
                        value={
                          value
                        }
                      >
                        {
                          value
                        }
                      </option>
                    )
                  )}
                </select>
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from(
                {
                  length: 8,
                },
                (
                  _,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                    className="h-[360px] animate-pulse rounded-[1.75rem] bg-black/5"
                  />
                )
              )}
            </div>
          ) : members.length ===
            0 ? (
            <div className="rounded-[2rem] border border-dashed border-black/15 bg-white/50 px-6 py-16 text-center">
              <SearchX className="mx-auto h-12 w-12 text-black/20" />

              <p className="mt-4 text-xl font-black text-black/70">
                No Results
                Found
              </p>

              <p className="mt-2 text-sm text-black/45">
                Try changing your
                search or filters.
              </p>
            </div>
          ) : (
            <>
              <motion.div
                variants={{
                  hidden: {},
                  visible: {
                    transition:
                      {
                        staggerChildren:
                          0.06,
                      },
                  },
                }}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
              >
                {visibleMembers.map(
                  (
                    member,
                    index
                  ) => (
                    <CommitteeCard
                      key={
                        member._id
                      }
                      member={
                        member
                      }
                      index={
                        index
                      }
                    />
                  )
                )}
              </motion.div>

              {totalPages >
                1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.max(
                            1,
                            current -
                              1
                          )
                      )
                    }
                    disabled={
                      page ===
                      1
                    }
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold disabled:opacity-30"
                  >
                    Previous
                  </button>

                  <span className="text-xs font-bold text-black/45">
                    Page{" "}
                    {page}{" "}
                    of{" "}
                    {
                      totalPages
                    }
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.min(
                            totalPages,
                            current +
                              1
                          )
                      )
                    }
                    disabled={
                      page ===
                      totalPages
                    }
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    );
  }

  /*
   * ==========================================================
   * HOMEPAGE SECTION
   * ==========================================================
   */

  return (
    <section className="relative overflow-hidden bg-[#59684e] py-16 text-white sm:py-24 lg:py-28">
      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-white/[0.05] blur-3xl" />

        <div className="absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-black/10 blur-3xl" />

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
        {/* =================================================
            CMS HEADING
            ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 22,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.7,
          }}
          className="mx-auto max-w-[850px] text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-white/25 sm:w-12" />

            <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-white/45 sm:text-[10px]">
              <Sparkles
                size={11}
              />

              {
                resolvedEyebrow
              }
            </span>

            <span className="h-px w-8 bg-white/25 sm:w-12" />
          </div>

          <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl lg:text-[4.5rem]">
            {
              resolvedTitle
            }
          </h2>

          {resolvedDescription && (
            <p className="mx-auto mt-5 max-w-[680px] text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
              {
                resolvedDescription
              }
            </p>
          )}
        </motion.div>

        {/* =================================================
            MEMBERS
            ================================================= */}

        <div className="mt-12 sm:mt-16">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from(
                {
                  length:
                    resolvedLimit ||
                    4,
                },
                (
                  _,
                  index
                ) => (
                  <LoadingCard
                    key={
                      index
                    }
                  />
                )
              )}
            </div>
          ) : members.length ===
            0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-14 text-center">
              <Users
                size={38}
                className="mx-auto text-white/25"
              />

              <p className="mt-4 text-sm text-white/45">
                No executive committee
                members are currently
                available.
              </p>
            </div>
          ) : (
            <motion.div
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren:
                      0.07,
                  },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.12,
              }}
              className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
            >
              {visibleMembers.map(
                (
                  member,
                  index
                ) => (
                  <CommitteeCard
                    key={
                      member._id
                    }
                    member={
                      member
                    }
                    index={
                      index
                    }
                  />
                )
              )}
            </motion.div>
          )}
        </div>

        {/* =================================================
            BOTTOM CTA
            ================================================= */}

        {resolvedShowButton &&
          resolvedButtonLabel && (
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
                duration:
                  0.6,
              }}
              className="mt-10 flex justify-center sm:mt-12"
            >
              <Link
                href={
                  resolvedButtonHref
                }
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-black text-[#38452f] shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f4ede2]"
              >
                {
                  resolvedButtonLabel
                }

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
