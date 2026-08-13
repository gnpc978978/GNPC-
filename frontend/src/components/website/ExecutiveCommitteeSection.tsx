"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  SearchX,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getPublicExecutiveCommittee,
} from "@/services/executiveCommitteeService";
import type {
  ExecutiveCommittee,
} from "@/types/executiveCommittee";

type Props = {
  limit?: number;
  showViewAll?: boolean;
  title?: string;
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
          (member) => member[field]
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

export default function ExecutiveCommitteeSection({
  limit,
  showViewAll = false,
  title = "Executive Committee",
}: Props) {
  const [members, setMembers] =
    useState<ExecutiveCommittee[]>(
      []
    );

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [designation, setDesignation] =
    useState("");

  const [organization, setOrganization] =
    useState("");

  const [state, setState] =
    useState("");

  const filters = useMemo(
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

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        const params =
          new URLSearchParams();

        Object.entries(filters).forEach(
          ([key, value]) => {
            if (value) {
              params.set(key, value);
            }
          }
        );

        if (limit) {
          params.set(
            "limit",
            String(limit)
          );
        }

        setLoading(true);

        void getPublicExecutiveCommittee(
          params
        )
          .then(setMembers)
          .catch(() => setMembers([]))
          .finally(() =>
            setLoading(false)
          );
      }, 0);

    return () =>
      window.clearTimeout(timer);
  }, [filters, limit]);

  const filterOptions = {
    designation: values(
      members,
      "designation"
    ),
    organization: values(
      members,
      "organization"
    ),
    state: values(
      members,
      "state"
    ),
  };

  /*
   * Full directory page = no limit.
   *
   * The public route already has PageHero,
   * so we intentionally do NOT render another
   * title/eyebrow section here.
   *
   * When this component is used with a limit
   * elsewhere, its original heading remains.
   */
  const isDirectory = !limit;

  return (
    <section className="bg-slate-50 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Only show this heading for limited/embedded sections */}
        {!isDirectory && (
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">
              Our Strength
            </p>

            <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              {title}
            </h1>
          </div>
        )}

        {/* Directory filters */}
        {isDirectory && (
          <div className="mb-10 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search by name, designation, or organization"
              className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <select
                value={designation}
                onChange={(event) =>
                  setDesignation(
                    event.target.value
                  )
                }
                className="rounded-xl border border-slate-200 bg-white p-3"
              >
                <option value="">
                  All designations
                </option>

                {filterOptions.designation.map(
                  (value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {value}
                    </option>
                  )
                )}
              </select>

              <select
                value={organization}
                onChange={(event) =>
                  setOrganization(
                    event.target.value
                  )
                }
                className="rounded-xl border border-slate-200 bg-white p-3"
              >
                <option value="">
                  All organizations
                </option>

                {filterOptions.organization.map(
                  (value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {value}
                    </option>
                  )
                )}
              </select>

              <select
                value={state}
                onChange={(event) =>
                  setState(
                    event.target.value
                  )
                }
                className="rounded-xl border border-slate-200 bg-white p-3"
              >
                <option value="">
                  All states
                </option>

                {filterOptions.state.map(
                  (value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {value}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from(
              {
                length:
                  limit || 8,
              },
              (_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-2xl bg-slate-200"
                />
              )
            )}
          </div>
        ) : members.length === 0 ? (
          /* Empty */
          <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
            <SearchX className="mx-auto h-12 w-12 text-blue-600" />

            <p className="mt-4 text-xl font-bold text-slate-800">
              No Results Found
            </p>

            <p className="mt-2 text-slate-600">
              Try changing your search or
              filters.
            </p>
          </div>
        ) : (
          /* Members */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {members.map((member) => (
              <article
                key={member._id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-square bg-slate-100">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-blue-100 text-5xl font-bold text-blue-700">
                      {member.name.charAt(
                        0
                      )}
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    {member.name}
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-blue-700">
                    {member.designation}
                  </p>

                  {member.organization && (
                    <p className="mt-1 text-sm text-slate-600">
                      {member.organization}
                    </p>
                  )}

                  {member.state && (
                    <p className="mt-1 text-sm text-slate-500">
                      {member.state}
                    </p>
                  )}

                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-2 hover:text-blue-700"
                      >
                        <Mail
                          size={15}
                        />
                        {member.email}
                      </a>
                    )}

                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="flex items-center gap-2 hover:text-blue-700"
                      >
                        <Phone
                          size={15}
                        />
                        {member.phone}
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* View all */}
        {showViewAll && (
          <div className="mt-10 text-center">
            <Link
              href="/committee"
              className="inline-flex rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              View All Executive Committee
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
