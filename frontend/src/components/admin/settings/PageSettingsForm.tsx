"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import { toast } from "sonner";

import {
  authenticatedApiFetch,
  responseJson,
} from "@/services/api";

import {
  defaultPageSettings,
  mergePageSettings,
  type CmsPageKey,
  type PageSettings,
} from "@/types/pageSettings";

const labels: Record<CmsPageKey, string> = {
  about: "About Section",
  gallery: "Gallery Section",
  latestUpdates: "Latest Updates Section",
  pressConference: "Press Conference Section",
  officeBearers: "Office Bearers Section",
  executiveCommittee: "Executive Committee Section",
};

const managerLinks: Record<
  CmsPageKey,
  { href: string; label: string }[]
> = {
  about: [],
  gallery: [
    {
      href: "/admin/gallery",
      label: "Manage Gallery Albums & Images",
    },
  ],
  latestUpdates: [
    {
      href: "/admin/press-releases",
      label: "Manage Press Releases",
    },
    {
      href: "/admin/announcements",
      label: "Manage Announcements",
    },
    {
      href: "/admin/events",
      label: "Manage Events",
    },
  ],
  pressConference: [
    {
      href: "/admin/press-conferences",
      label: "Manage Press Conferences",
    },
  ],
  officeBearers: [
    {
      href: "/admin/members",
      label: "Manage Office Bearers",
    },
  ],
  executiveCommittee: [
    {
      href: "/admin/executive-committee",
      label: "Manage Executive Committee Members",
    },
  ],
};

type Props = {
  pageKey: CmsPageKey;
};

type FormState = PageSettings[CmsPageKey];

function Field({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      {textarea ? (
        <textarea
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          rows={4}
          className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
        />
      ) : (
        <input
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
        />
      )}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-sm font-semibold text-slate-700">
        {label}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="h-5 w-5 accent-blue-600"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min = 1,
  max = 100,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => {
          const next = Number(event.target.value);
          onChange(
            Number.isFinite(next)
              ? Math.max(min, Math.min(max, next))
              : min
          );
        }}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

export default function PageSettingsForm({
  pageKey,
}: Props) {
  const [form, setForm] = useState<FormState>(
    defaultPageSettings[pageKey]
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const title = labels[pageKey];

  const managerItems = useMemo(
    () => managerLinks[pageKey],
    [pageKey]
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);

        const response = await authenticatedApiFetch(
          "/settings",
          { method: "GET" }
        );

        const payload =
          await responseJson<{
            data?: {
              pageSettings?: Partial<PageSettings>;
            };
          }>(response);

        if (cancelled) return;

        const merged = mergePageSettings(
          payload.data?.pageSettings
        );

        setForm(merged[pageKey]);
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load page settings."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [pageKey]);

  const update = (key: string, value: unknown) => {
    setForm((current) =>
      ({
        ...current,
        [key]: value,
      }) as FormState
    );
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await authenticatedApiFetch(
        "/settings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pageSettings: {
              [pageKey]: form,
            },
          }),
        }
      );

      await responseJson(response);

      window.dispatchEvent(
        new Event("website-settings-updated")
      );

      toast.success(`${title} saved successfully.`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save page settings."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="h-8 w-1/3 animate-pulse rounded bg-slate-200" />
        <div className="h-12 animate-pulse rounded bg-slate-200" />
        <div className="h-28 animate-pulse rounded bg-slate-200" />
        <div className="h-28 animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  const pageForm = form as any;

  const common = form as {
    pageEyebrow: string;
    pageTitle: string;
    pageDescription: string;
  };

  return (
    <form
      onSubmit={save}
      className="space-y-6"
    >
      {pageKey !== "about" && (
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <h2 className="text-2xl font-black text-slate-900">
          Page Header
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          These values control the public page heading and description.
        </p>

        <div className="mt-6 grid gap-5">
          <Field
            label="Eyebrow"
            value={common.pageEyebrow}
            onChange={(value) =>
              update("pageEyebrow", value)
            }
          />

          <Field
            label="Page Title"
            value={common.pageTitle}
            onChange={(value) =>
              update("pageTitle", value)
            }
          />

          <Field
            label="Page Description"
            value={common.pageDescription}
            textarea
            onChange={(value) =>
              update("pageDescription", value)
            }
          />
        </div>
      </section>

      )}

      {pageKey === "gallery" && (
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h2 className="text-2xl font-black text-slate-900">
            Gallery Display
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <NumberField
              label="Images per page"
              value={pageForm.pageSize}
              onChange={(value) =>
                update("pageSize", value)
              }
            />

            <Toggle
              label="Show category filter"
              checked={pageForm.showCategoryFilter}
              onChange={(value) =>
                update("showCategoryFilter", value)
              }
            />

            <Toggle
              label="Show pagination"
              checked={pageForm.showPagination}
              onChange={(value) =>
                update("showPagination", value)
              }
            />
          </div>
        </section>
      )}

      {pageKey === "latestUpdates" && (
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h2 className="text-2xl font-black text-slate-900">
            Latest Updates Display
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <NumberField
              label="Maximum cards to show"
              value={pageForm.pageSize}
              onChange={(value) =>
                update("pageSize", value)
              }
            />

            <Toggle
              label="Show search"
              checked={pageForm.showSearch}
              onChange={(value) =>
                update("showSearch", value)
              }
            />

            <Toggle
              label="Show calendar"
              checked={pageForm.showCalendar}
              onChange={(value) =>
                update("showCalendar", value)
              }
            />

            <Toggle
              label="Show sort control"
              checked={pageForm.showSort}
              onChange={(value) =>
                update("showSort", value)
              }
            />
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field
              label="All tab label"
              value={pageForm.allTabLabel}
              onChange={(value) =>
                update("allTabLabel", value)
              }
            />
            <Field
              label="Press Releases tab label"
              value={pageForm.pressReleasesTabLabel}
              onChange={(value) =>
                update("pressReleasesTabLabel", value)
              }
            />
            <Field
              label="Announcements tab label"
              value={pageForm.announcementsTabLabel}
              onChange={(value) =>
                update("announcementsTabLabel", value)
              }
            />
            <Field
              label="Events tab label"
              value={pageForm.eventsTabLabel}
              onChange={(value) =>
                update("eventsTabLabel", value)
              }
            />
            <Field
              label="Search placeholder"
              value={pageForm.searchPlaceholder}
              onChange={(value) =>
                update("searchPlaceholder", value)
              }
            />
            <Field
              label="Read more label"
              value={pageForm.readMoreLabel}
              onChange={(value) =>
                update("readMoreLabel", value)
              }
            />
          </div>
        </section>
      )}

      {pageKey === "pressConference" && (
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h2 className="text-2xl font-black text-slate-900">
            Press Conference Display
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <NumberField
              label="Maximum cards to show"
              value={pageForm.pageSize}
              onChange={(value) =>
                update("pageSize", value)
              }
            />

            <Toggle
              label="Show pagination"
              checked={pageForm.showPagination}
              onChange={(value) =>
                update("showPagination", value)
              }
            />
          </div>
        </section>
      )}

      {(pageKey === "officeBearers" ||
        pageKey === "executiveCommittee") && (
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h2 className="text-2xl font-black text-slate-900">
            Directory Display
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <NumberField
              label="Cards per page"
              value={pageForm.pageSize}
              max={100}
              onChange={(value) =>
                update("pageSize", value)
              }
            />

            <Toggle
              label="Show search"
              checked={pageForm.showSearch}
              onChange={(value) =>
                update("showSearch", value)
              }
            />

            <Toggle
              label="Show filters"
              checked={pageForm.showFilters}
              onChange={(value) =>
                update("showFilters", value)
              }
            />
          </div>
        </section>
      )}

      {pageKey === "about" && (
        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-900">
            About Content
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The complete About page content, including mission, vision,
            objectives, president message, reasons to join and CTA, is managed
            in the About CMS editor below this page settings panel.
          </p>
        </section>
      )}

      {managerItems.length > 0 && (
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h2 className="text-xl font-black text-slate-900">
            Content Managers
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Use these existing CMS managers to create, edit, delete and upload
            the actual records displayed on the page. The page settings above
            control how those records are presented publicly.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {managerItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {saving ? "Saving..." : `Save ${title}`}
      </button>
    </form>
  );
}
