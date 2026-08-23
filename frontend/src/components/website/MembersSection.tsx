"use client";

import {
  ArrowRight,
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
  getPublicMembers,
} from "@/services/membersService";

import type {
  Member,
} from "@/types/member";

import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import PersonCard from "@/components/ui/PersonCard";

import type {
  MembersPageSettings,
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
  settings?: MembersPageSettings;
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
  members: Member[],
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

function MemberCard({
  member,
}: {
  member: Member;
}) {
  return (
    <motion.article
      variants={
        cardVariants
      }
      className="h-full"
    >
      <PersonCard {...member} />
    </motion.article>
  );
}

function LoadingCard() {
  return (
    <div className="h-[330px] animate-pulse rounded-xl bg-slate-200" />
  );
}

export default function MembersSection({
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
   * Website Settings → Home → Members becomes
   * the source of truth.
   *
   * The props remain supported so existing callers do not break.
   */

  const homeSection =
    home.members;

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
        "Members"
      : title ||
        homeSection.title ||
        "Members";

  const resolvedDescription =
    isDirectory
      ? settings?.pageDescription ||
        description ||
        "Meet the Members of Greater Noida Press Club."
      : description ||
        homeSection.description ||
        "Meet the Members of Greater Noida Press Club.";

  const rawButtonLabel =
    isDirectory
      ? "View All"
      : buttonLabel ||
        homeSection.buttonLabel ||
        "View All";

  const resolvedButtonLabel =
    rawButtonLabel.trim().toLowerCase() === "explore"
      ? "View All Members"
      : rawButtonLabel;

  const resolvedButtonHref =
    isDirectory
      ? "/members"
      : buttonHref ||
        homeSection.buttonHref ||
        "/members";

  const resolvedShowButton =
    isDirectory
      ? false
      : showViewAll ??
        homeSection.showViewAll;

  const [
    members,
    setMembers,
  ] = useState<
    Member[]
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

          void getPublicMembers(
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
      <section className="bg-[#f4f7fb] py-12 text-slate-900 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filters */}

          <div className="mb-10 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
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
                className="w-full border p-3 text-sm"
              />
            )}

            {settings?.showFilters !==
              false && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                  className="border p-3 text-sm"
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
                  className="border p-3 text-sm"
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
                  className="border p-3 text-sm"
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
                    className="h-[330px] animate-pulse rounded-xl bg-slate-200"
                  />
                )
              )}
            </div>
          ) : members.length ===
            0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <SearchX className="mx-auto h-12 w-12 text-slate-400" />

              <p className="mt-4 text-xl font-bold text-slate-900">
                No Results
                Found
              </p>

              <p className="mt-2 text-sm text-slate-600">
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
                  (member) => (
                    <MemberCard
                      key={
                        member._id
                      }
                      member={
                        member
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
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 disabled:opacity-30"
                  >
                    Previous
                  </button>

                  <span className="text-xs font-bold text-slate-500">
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
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 disabled:opacity-30"
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
    <section className="relative overflow-hidden bg-[#f4f7fb] py-16 text-slate-900 sm:py-20 lg:py-24">
      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-[#f0e5c9]/70 blur-3xl" />

        <div className="absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-[#f7f2e6] blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(21,94,239,0.18) 1px, transparent 1px)",
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
            <span className="h-px w-8 bg-blue-200 sm:w-12" />

            <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-[#d4b06a] sm:text-[10px]">
              <Sparkles
                size={11}
              />

              {
                resolvedEyebrow
              }
            </span>

            <span className="h-px w-8 bg-blue-200 sm:w-12" />
          </div>

          <h2 className="mt-5 text-4xl font-black leading-[1.04] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
            {
              resolvedTitle
            }
          </h2>

          {resolvedDescription && (
            <p className="mx-auto mt-4 max-w-[680px] text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
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
            <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center">
              <Users
                size={38}
                className="mx-auto text-slate-400"
              />

              <p className="mt-4 text-sm text-slate-600">
                No members
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
                (member) => (
                  <MemberCard
                    key={
                      member._id
                    }
                    member={
                      member
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
              className="mt-6 flex justify-center sm:mt-8"
            >
              <Button
                href={resolvedButtonHref}
                variant="outline"
                size="md"
              >
                {resolvedButtonLabel}
                <ArrowRight size={17} />
              </Button>
            </motion.div>
          )}
      </div>
    </section>
  );
}
