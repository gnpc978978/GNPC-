"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { toast } from "sonner";

import {
  authenticatedApiFetch,
  responseJson,
} from "@/services/api";

import BannerManager from "@/components/admin/BannerManager";

import {
  defaultHomeSettings,
  HomeCard,
  HomeSectionKey,
  HomeSettings,
  mergeHomeSettings,
} from "@/types/homeSettings";

const sectionLabels: Record<
  HomeSectionKey,
  string
> = {
  hero: "Hero",
  about: "About",
  objectives: "Objectives",
  latestUpdates: "Latest Updates",
  gallery: "Gallery",
  pressConferences:
    "Press Conferences",
  executiveCommittee:
    "Executive Committee",
  officeBearers:
    "Office Bearers",
  membership: "Membership CTA",
};

const sectionOrder: HomeSectionKey[] =
  [
    "hero",
    "about",
    "objectives",
    "latestUpdates",
    "gallery",
    "pressConferences",
    "executiveCommittee",
    "officeBearers",
    "membership",
  ];

type WebsiteResponse = {
  data?: {
    home?: Partial<HomeSettings>;
    heroImage?: string;
    aboutImage?: string;
  };
};

type EditableSettings = {
  home: HomeSettings;
  heroImage: string;
  aboutImage: string;
};

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min = 1,
  max = 24,
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
        onChange={(event) =>
          onChange(
            Math.max(
              min,
              Math.min(
                max,
                Number(
                  event.target.value
                ) || min
              )
            )
          )
        }
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />
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
  onChange: (
    value: boolean
  ) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-sm font-semibold text-slate-700">
        {label}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(
            event.target.checked
          )
        }
        className="h-5 w-5 accent-blue-600"
      />
    </label>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}

function CardEditor({
  card,
  index,
  onChange,
  onRemove,
}: {
  card: HomeCard;
  index: number;
  onChange: (
    key: keyof HomeCard,
    value: string
  ) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="font-bold text-slate-900">
          Card {index + 1}
        </h3>

        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          Remove
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Field
          label="Icon Name"
          value={card.icon}
          onChange={(event) =>
            onChange(
              "icon",
              event.target.value
            )
          }
          placeholder="Newspaper"
        />

        <Field
          label="Title"
          value={card.title}
          onChange={(event) =>
            onChange(
              "title",
              event.target.value
            )
          }
        />

        <div className="md:col-span-3">
          <TextArea
            label="Description"
            value={card.description}
            onChange={(event) =>
              onChange(
                "description",
                event.target.value
              )
            }
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}

export default function HomeSectionForm() {
  const [form, setForm] =
    useState<EditableSettings>({
      home: defaultHomeSettings,
      heroImage: "",
      aboutImage: "",
    });

  const [files, setFiles] =
    useState<
      Record<string, File | null>
    >({});

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const load = async () => {
    try {
      setLoading(true);

      const response =
        await authenticatedApiFetch(
          "/settings",
          {
            method: "GET",
          }
        );

      const payload =
        await responseJson<WebsiteResponse>(
          response
        );

      setForm({
        home: mergeHomeSettings(
          payload.data?.home
        ),

        heroImage:
          payload.data?.heroImage ||
          "",

        aboutImage:
          payload.data?.aboutImage ||
          "",
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load Home settings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const sortedSections =
    useMemo(
      () =>
        [...sectionOrder].sort(
          (a, b) =>
            form.home.sections[a]
              .order -
            form.home.sections[b]
              .order
        ),
      [form.home.sections]
    );

  const updateSection = (
    key: HomeSectionKey,
    patch: Partial<
      HomeSettings["sections"][HomeSectionKey]
    >
  ) => {
    setForm((current) => ({
      ...current,

      home: {
        ...current.home,

        sections: {
          ...current.home.sections,

          [key]: {
            ...current.home.sections[
              key
            ],

            ...patch,
          },
        },
      },
    }));
  };

  const moveSection = (
    key: HomeSectionKey,
    direction: -1 | 1
  ) => {
    const ordered =
      sortedSections;

    const index =
      ordered.indexOf(key);

    const nextIndex =
      index + direction;

    if (
      nextIndex < 0 ||
      nextIndex >=
        ordered.length
    ) {
      return;
    }

    const nextKey =
      ordered[nextIndex];

    const currentOrder =
      form.home.sections[key]
        .order;

    const nextOrder =
      form.home.sections[nextKey]
        .order;

    updateSection(key, {
      order: nextOrder,
    });

    updateSection(nextKey, {
      order: currentOrder,
    });
  };

  const updateNested = (
    section: keyof HomeSettings,
    field: string,
    value: unknown
  ) => {
    setForm((current) => ({
      ...current,

      home: {
        ...current.home,

        [section]: {
          ...(current.home[
            section
          ] as Record<
            string,
            unknown
          >),

          [field]: value,
        },
      },
    }));
  };

  const updateArrayItem = (
    section:
      | "hero"
      | "about"
      | "objectives",
    field:
      | "quickLinks"
      | "features"
      | "cards",
    index: number,
    value: unknown
  ) => {
    const currentSection =
      form.home[
        section
      ] as Record<
        string,
        unknown
      >;

    const list =
      Array.isArray(
        currentSection[field]
      )
        ? [
            ...(currentSection[
              field
            ] as unknown[]),
          ]
        : [];

    list[index] = value;

    updateNested(
      section,
      field,
      list
    );
  };

  const addQuickLink = () => {
    updateNested(
      "hero",
      "quickLinks",
      [
        ...form.home.hero
          .quickLinks,

        {
          label: "New Link",
          href: "/",
        },
      ]
    );
  };

  const removeQuickLink = (
    index: number
  ) => {
    updateNested(
      "hero",
      "quickLinks",
      form.home.hero.quickLinks.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  };

  const addFeature = () => {
    updateNested(
      "about",
      "features",
      [
        ...form.home.about
          .features,

        "New feature",
      ]
    );
  };

  const removeFeature = (
    index: number
  ) => {
    updateNested(
      "about",
      "features",
      form.home.about.features.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  };

  const addObjective = () => {
    updateNested(
      "objectives",
      "cards",
      [
        ...form.home.objectives
          .cards,

        {
          icon: "Star",
          title:
            "New objective",
          description:
            "Describe this objective.",
        },
      ]
    );
  };

  const removeObjective = (
    index: number
  ) => {
    updateNested(
      "objectives",
      "cards",
      form.home.objectives.cards.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  };

  const setFile =
    (field: string) =>
    (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      setFiles(
        (current) => ({
          ...current,

          [field]:
            event.target
              .files?.[0] ||
            null,
        })
      );
    };

  const save = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    try {
      setSaving(true);

      const settingsResponse =
        await authenticatedApiFetch(
          "/settings",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              home: form.home,
            }),
          }
        );

      await responseJson(
        settingsResponse
      );

      if (
        Object.values(files).some(
          Boolean
        )
      ) {
        const upload =
          new FormData();

        Object.entries(files).forEach(
          ([field, file]) => {
            if (file) {
              upload.append(
                field,
                file
              );
            }
          }
        );

        const uploadResponse =
          await authenticatedApiFetch(
            "/settings/upload",
            {
              method: "PUT",
              body: upload,
            }
          );

        await responseJson(
          uploadResponse
        );
      }

      setFiles({});

      window.dispatchEvent(
        new Event(
          "website-settings-updated"
        )
      );

      toast.success(
        "Home settings saved successfully."
      );

      await load();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save Home settings."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow">
        <div className="h-8 w-1/3 animate-pulse rounded bg-slate-200" />

        <div className="mt-5 h-32 animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  return (
    <form
      onSubmit={save}
      className="space-y-6"
    >
      <Panel
        title="Homepage Section Manager"
        description="Turn sections on/off, change their order, and choose the background used for each section."
      >
        <div className="space-y-3">
          {sortedSections.map(
            (key, index) => {
              const config =
                form.home.sections[
                  key
                ];

              return (
                <div
                  key={key}
                  className="grid gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-[1fr_auto_auto_auto] md:items-center"
                >
                  <div>
                    <p className="font-bold text-slate-900">
                      {index + 1}.{" "}
                      {
                        sectionLabels[
                          key
                        ]
                      }
                    </p>

                    <p className="text-xs text-slate-500">
                      Order{" "}
                      {
                        config.order
                      }
                    </p>
                  </div>

                  <Toggle
                    label="Visible"
                    checked={
                      config.enabled
                    }
                    onChange={(
                      value
                    ) =>
                      updateSection(
                        key,
                        {
                          enabled:
                            value,
                        }
                      )
                    }
                  />

                  <select
                    value={
                      config.background
                    }
                    onChange={(
                      event
                    ) =>
                      updateSection(
                        key,
                        {
                          background:
                            event
                              .target
                              .value as
                              | "white"
                              | "slate",
                        }
                      )
                    }
                    className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm"
                  >
                    <option value="white">
                      White background
                    </option>

                    <option value="slate">
                      Light slate background
                    </option>
                  </select>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        moveSection(
                          key,
                          -1
                        )
                      }
                      disabled={
                        index === 0
                      }
                      className="rounded-lg border px-3 py-2 text-sm disabled:opacity-30"
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        moveSection(
                          key,
                          1
                        )
                      }
                      disabled={
                        index ===
                        sortedSections.length -
                          1
                      }
                      className="rounded-lg border px-3 py-2 text-sm disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </Panel>

      <Panel
        title="Hero Section"
        description="Edit the homepage hero content and quick links, then manage all carousel photos directly below. The carousel photos are separate CMS-managed media and can be added, reordered, replaced, hidden or deleted."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={
              form.home.hero.eyebrow
            }
            onChange={(event) =>
              updateNested(
                "hero",
                "eyebrow",
                event.target.value
              )
            }
          />

          <Field
            label="Identity Label"
            value={
              form.home.hero
                .identityLabel
            }
            onChange={(event) =>
              updateNested(
                "hero",
                "identityLabel",
                event.target.value
              )
            }
          />

          <div className="md:col-span-2">
            <Field
              label="Title"
              value={
                form.home.hero
                  .title
              }
              onChange={(event) =>
                updateNested(
                  "hero",
                  "title",
                  event.target.value
                )
              }
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={
                form.home.hero
                  .description
              }
              onChange={(event) =>
                updateNested(
                  "hero",
                  "description",
                  event.target.value
                )
              }
              rows={4}
            />
          </div>

          <Field
            label="Primary Button Label"
            value={
              form.home.hero
                .primaryLabel
            }
            onChange={(event) =>
              updateNested(
                "hero",
                "primaryLabel",
                event.target.value
              )
            }
          />

          <Field
            label="Secondary Button Label"
            value={
              form.home.hero
                .secondaryLabel
            }
            onChange={(event) =>
              updateNested(
                "hero",
                "secondaryLabel",
                event.target.value
              )
            }
          />
        </div>

        <div className="mt-7 rounded-2xl border border-slate-200 p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="font-bold">
              Hero Quick Links
            </h3>

            <button
              type="button"
              onClick={
                addQuickLink
              }
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
            >
              Add Link
            </button>
          </div>

          <div className="space-y-3">
            {form.home.hero.quickLinks.map(
              (
                link,
                index
              ) => (
                <div
                  key={index}
                  className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
                >
                  <Field
                    label={`Label ${
                      index + 1
                    }`}
                    value={
                      link.label
                    }
                    onChange={(
                      event
                    ) =>
                      updateArrayItem(
                        "hero",
                        "quickLinks",
                        index,
                        {
                          ...link,
                          label:
                            event
                              .target
                              .value,
                        }
                      )
                    }
                  />

                  <Field
                    label="Href"
                    value={
                      link.href
                    }
                    onChange={(
                      event
                    ) =>
                      updateArrayItem(
                        "hero",
                        "quickLinks",
                        index,
                        {
                          ...link,
                          href:
                            event
                              .target
                              .value,
                        }
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeQuickLink(
                        index
                      )
                    }
                    className="self-end rounded-lg border border-red-200 px-3 py-3 text-sm font-semibold text-red-600"
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-900">
              Hero Carousel Photos
            </h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
              Add multiple photos for the new homepage hero carousel.
              Upload several images at once, reorder them, replace an image,
              temporarily hide a slide, or delete it. Only active photos are
              displayed on the public homepage.
            </p>
          </div>

          <BannerManager />
        </div>

        <div className="mt-7 rounded-2xl border border-slate-200 p-5">
          <div className="mb-4">
            <h3 className="font-bold text-slate-900">
              About Section Image
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              This image remains separate from the hero carousel and is used by the homepage About section.
            </p>
          </div>

          <div>
            <input
              type="file"
              accept="image/*"
              onChange={setFile(
                "aboutImage"
              )}
              className="block w-full rounded-xl border border-slate-300 bg-white p-3"
            />

            {files.aboutImage && (
              <p className="mt-2 text-xs text-slate-500">
                Selected: {files.aboutImage.name}
              </p>
            )}

            {form.aboutImage && (
              <img
                src={form.aboutImage}
                alt="Current about"
                className="mt-3 h-32 w-full rounded-xl object-cover"
              />
            )}
          </div>
        </div>
      </Panel>

      <Panel
        title="About Section"
        description="These values control the About block shown on the homepage."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={
              form.home.about
                .eyebrow
            }
            onChange={(event) =>
              updateNested(
                "about",
                "eyebrow",
                event.target.value
              )
            }
          />

          <Field
            label="Title"
            value={
              form.home.about
                .title
            }
            onChange={(event) =>
              updateNested(
                "about",
                "title",
                event.target.value
              )
            }
          />

          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={
                form.home.about
                  .description
              }
              onChange={(event) =>
                updateNested(
                  "about",
                  "description",
                  event.target.value
                )
              }
            />
          </div>

          <Field
            label="Button Label"
            value={
              form.home.about
                .buttonLabel
            }
            onChange={(event) =>
              updateNested(
                "about",
                "buttonLabel",
                event.target.value
              )
            }
          />

          <Field
            label="Button Href"
            value={
              form.home.about
                .buttonHref
            }
            onChange={(event) =>
              updateNested(
                "about",
                "buttonHref",
                event.target.value
              )
            }
          />
        </div>

        <div className="mt-5">
          <Toggle
            label="Show statistics row"
            checked={
              form.home.about
                .showStats
            }
            onChange={(value) =>
              updateNested(
                "about",
                "showStats",
                value
              )
            }
          />
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {form.home.about.statsLabels.map(
            (label, index) => (
              <Field
                key={index}
                label={`Statistic ${
                  index + 1
                } Label`}
                value={label}
                onChange={(event) => {
                  const next =
                    [
                      ...form.home
                        .about
                        .statsLabels,
                    ] as [
                      string,
                      string,
                      string
                    ];

                  next[index] =
                    event.target.value;

                  updateNested(
                    "about",
                    "statsLabels",
                    next
                  );
                }}
              />
            )
          )}
        </div>

        <div className="mt-7 rounded-2xl border border-slate-200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold">
              Homepage About Features
            </h3>

            <button
              type="button"
              onClick={
                addFeature
              }
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
            >
              Add Feature
            </button>
          </div>

          <div className="space-y-3">
            {form.home.about.features.map(
              (
                feature,
                index
              ) => (
                <div
                  key={index}
                  className="flex gap-3"
                >
                  <input
                    value={
                      feature
                    }
                    onChange={(event) =>
                      updateArrayItem(
                        "about",
                        "features",
                        index,
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeFeature(
                        index
                      )
                    }
                    className="rounded-lg border border-red-200 px-3 text-sm text-red-600"
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </Panel>

      <Panel
        title="Objectives Section"
        description="Edit objective cards, icon names, section copy and exactly how many cards appear on the homepage."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={
              form.home
                .objectives
                .eyebrow
            }
            onChange={(event) =>
              updateNested(
                "objectives",
                "eyebrow",
                event.target.value
              )
            }
          />

          <Field
            label="Title"
            value={
              form.home
                .objectives
                .title
            }
            onChange={(event) =>
              updateNested(
                "objectives",
                "title",
                event.target.value
              )
            }
          />

          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={
                form.home
                  .objectives
                  .description
              }
              onChange={(event) =>
                updateNested(
                  "objectives",
                  "description",
                  event.target.value
                )
              }
            />
          </div>

          <Field
            label="Button Label"
            value={
              form.home
                .objectives
                .buttonLabel
            }
            onChange={(event) =>
              updateNested(
                "objectives",
                "buttonLabel",
                event.target.value
              )
            }
          />

          <Field
            label="Button Href"
            value={
              form.home
                .objectives
                .buttonHref
            }
            onChange={(event) =>
              updateNested(
                "objectives",
                "buttonHref",
                event.target.value
              )
            }
          />

          <NumberField
            label="Cards shown on homepage"
            value={
              form.home
                .objectives
                .displayCount
            }
            onChange={(value) =>
              updateNested(
                "objectives",
                "displayCount",
                value
              )
            }
            min={1}
            max={
              form.home
                .objectives
                .cards
                .length || 1
            }
          />
        </div>

        <div className="mt-7 space-y-4">
          {form.home.objectives.cards.map(
            (
              card,
              index
            ) => (
              <CardEditor
                key={index}
                card={card}
                index={index}
                onChange={(
                  key,
                  value
                ) =>
                  updateArrayItem(
                    "objectives",
                    "cards",
                    index,
                    {
                      ...card,
                      [key]:
                        value,
                    }
                  )
                }
                onRemove={() =>
                  removeObjective(
                    index
                  )
                }
              />
            )
          )}
        </div>

        <button
          type="button"
          onClick={
            addObjective
          }
          className="mt-4 rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
        >
          Add Objective Card
        </button>
      </Panel>

      <Panel
        title="Latest Updates Section"
        description="The actual update records remain managed in Latest Updates. These settings control the homepage presentation and card count."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={
              form.home
                .latestUpdates
                .eyebrow
            }
            onChange={(event) =>
              updateNested(
                "latestUpdates",
                "eyebrow",
                event.target.value
              )
            }
          />

          <Field
            label="Title"
            value={
              form.home
                .latestUpdates
                .title
            }
            onChange={(event) =>
              updateNested(
                "latestUpdates",
                "title",
                event.target.value
              )
            }
          />

          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={
                form.home
                  .latestUpdates
                  .description
              }
              onChange={(event) =>
                updateNested(
                  "latestUpdates",
                  "description",
                  event.target.value
                )
              }
            />
          </div>

          <Field
            label="Button Label"
            value={
              form.home
                .latestUpdates
                .buttonLabel
            }
            onChange={(event) =>
              updateNested(
                "latestUpdates",
                "buttonLabel",
                event.target.value
              )
            }
          />

          <Field
            label="Button Href"
            value={
              form.home
                .latestUpdates
                .buttonHref
            }
            onChange={(event) =>
              updateNested(
                "latestUpdates",
                "buttonHref",
                event.target.value
              )
            }
          />

          <NumberField
            label="Cards shown"
            value={
              form.home
                .latestUpdates
                .displayCount
            }
            onChange={(value) =>
              updateNested(
                "latestUpdates",
                "displayCount",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        title="Gallery Section"
        description="The actual gallery items remain managed in Gallery. Choose the homepage heading and number of images displayed here."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={
              form.home
                .gallery.eyebrow
            }
            onChange={(event) =>
              updateNested(
                "gallery",
                "eyebrow",
                event.target.value
              )
            }
          />

          <Field
            label="Title"
            value={
              form.home
                .gallery.title
            }
            onChange={(event) =>
              updateNested(
                "gallery",
                "title",
                event.target.value
              )
            }
          />

          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={
                form.home
                  .gallery
                  .description
              }
              onChange={(event) =>
                updateNested(
                  "gallery",
                  "description",
                  event.target.value
                )
              }
            />
          </div>

          <Field
            label="Button Label"
            value={
              form.home
                .gallery
                .buttonLabel
            }
            onChange={(event) =>
              updateNested(
                "gallery",
                "buttonLabel",
                event.target.value
              )
            }
          />

          <Field
            label="Button Href"
            value={
              form.home
                .gallery
                .buttonHref
            }
            onChange={(event) =>
              updateNested(
                "gallery",
                "buttonHref",
                event.target.value
              )
            }
          />

          <NumberField
            label="Images shown"
            value={
              form.home
                .gallery
                .displayCount
            }
            onChange={(value) =>
              updateNested(
                "gallery",
                "displayCount",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        title="Press Conferences Section"
        description="The actual press conference records remain in the Press Conferences CMS. This controls the homepage presentation and count."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={
              form.home
                .pressConferences
                .eyebrow
            }
            onChange={(event) =>
              updateNested(
                "pressConferences",
                "eyebrow",
                event.target.value
              )
            }
          />

          <Field
            label="Title"
            value={
              form.home
                .pressConferences
                .title
            }
            onChange={(event) =>
              updateNested(
                "pressConferences",
                "title",
                event.target.value
              )
            }
          />

          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={
                form.home
                  .pressConferences
                  .description
              }
              onChange={(event) =>
                updateNested(
                  "pressConferences",
                  "description",
                  event.target.value
                )
              }
            />
          </div>

          <Field
            label="Button Label"
            value={
              form.home
                .pressConferences
                .buttonLabel
            }
            onChange={(event) =>
              updateNested(
                "pressConferences",
                "buttonLabel",
                event.target.value
              )
            }
          />

          <Field
            label="Button Href"
            value={
              form.home
                .pressConferences
                .buttonHref
            }
            onChange={(event) =>
              updateNested(
                "pressConferences",
                "buttonHref",
                event.target.value
              )
            }
          />

          <NumberField
            label="Cards shown"
            value={
              form.home
                .pressConferences
                .displayCount
            }
            onChange={(value) =>
              updateNested(
                "pressConferences",
                "displayCount",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        title="Executive Committee Section"
        description="The committee records remain in their own CMS. Control the homepage heading, CTA, visibility and card count here."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={
              form.home
                .executiveCommittee
                .eyebrow
            }
            onChange={(event) =>
              updateNested(
                "executiveCommittee",
                "eyebrow",
                event.target.value
              )
            }
          />

          <Field
            label="Title"
            value={
              form.home
                .executiveCommittee
                .title
            }
            onChange={(event) =>
              updateNested(
                "executiveCommittee",
                "title",
                event.target.value
              )
            }
          />

          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={
                form.home
                  .executiveCommittee
                  .description
              }
              onChange={(event) =>
                updateNested(
                  "executiveCommittee",
                  "description",
                  event.target.value
                )
              }
            />
          </div>

          <Field
            label="Button Label"
            value={
              form.home
                .executiveCommittee
                .buttonLabel
            }
            onChange={(event) =>
              updateNested(
                "executiveCommittee",
                "buttonLabel",
                event.target.value
              )
            }
          />

          <Field
            label="Button Href"
            value={
              form.home
                .executiveCommittee
                .buttonHref
            }
            onChange={(event) =>
              updateNested(
                "executiveCommittee",
                "buttonHref",
                event.target.value
              )
            }
          />

          <NumberField
            label="Cards shown"
            value={
              form.home
                .executiveCommittee
                .displayCount
            }
            onChange={(value) =>
              updateNested(
                "executiveCommittee",
                "displayCount",
                value
              )
            }
          />

          <Toggle
            label="Show View All button"
            checked={
              form.home
                .executiveCommittee
                .showViewAll
            }
            onChange={(value) =>
              updateNested(
                "executiveCommittee",
                "showViewAll",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        title="Office Bearers Section"
        description="Control the homepage office bearer heading, CTA, visibility and card count."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={
              form.home
                .officeBearers
                .eyebrow
            }
            onChange={(event) =>
              updateNested(
                "officeBearers",
                "eyebrow",
                event.target.value
              )
            }
          />

          <Field
            label="Title"
            value={
              form.home
                .officeBearers
                .title
            }
            onChange={(event) =>
              updateNested(
                "officeBearers",
                "title",
                event.target.value
              )
            }
          />

          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={
                form.home
                  .officeBearers
                  .description
              }
              onChange={(event) =>
                updateNested(
                  "officeBearers",
                  "description",
                  event.target.value
                )
              }
            />
          </div>

          <Field
            label="Button Label"
            value={
              form.home
                .officeBearers
                .buttonLabel
            }
            onChange={(event) =>
              updateNested(
                "officeBearers",
                "buttonLabel",
                event.target.value
              )
            }
          />

          <Field
            label="Button Href"
            value={
              form.home
                .officeBearers
                .buttonHref
            }
            onChange={(event) =>
              updateNested(
                "officeBearers",
                "buttonHref",
                event.target.value
              )
            }
          />

          <NumberField
            label="Cards shown"
            value={
              form.home
                .officeBearers
                .displayCount
            }
            onChange={(value) =>
              updateNested(
                "officeBearers",
                "displayCount",
                value
              )
            }
          />

          <Toggle
            label="Show View All button"
            checked={
              form.home
                .officeBearers
                .showViewAll
            }
            onChange={(value) =>
              updateNested(
                "officeBearers",
                "showViewAll",
                value
              )
            }
          />
        </div>
      </Panel>

      <Panel
        title="Membership CTA Section"
        description="Edit the final call-to-action shown at the bottom of the homepage."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={
              form.home
                .membership
                .eyebrow
            }
            onChange={(event) =>
              updateNested(
                "membership",
                "eyebrow",
                event.target.value
              )
            }
          />

          <Field
            label="Title"
            value={
              form.home
                .membership
                .title
            }
            onChange={(event) =>
              updateNested(
                "membership",
                "title",
                event.target.value
              )
            }
          />

          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={
                form.home
                  .membership
                  .description
              }
              onChange={(event) =>
                updateNested(
                  "membership",
                  "description",
                  event.target.value
                )
              }
            />
          </div>

          <Field
            label="Primary Button Label"
            value={
              form.home
                .membership
                .primaryLabel
            }
            onChange={(event) =>
              updateNested(
                "membership",
                "primaryLabel",
                event.target.value
              )
            }
          />

          <Field
            label="Secondary Button Label"
            value={
              form.home
                .membership
                .secondaryLabel
            }
            onChange={(event) =>
              updateNested(
                "membership",
                "secondaryLabel",
                event.target.value
              )
            }
          />

          <Field
            label="Secondary Button Href"
            value={
              form.home
                .membership
                .secondaryHref
            }
            onChange={(event) =>
              updateNested(
                "membership",
                "secondaryHref",
                event.target.value
              )
            }
          />
        </div>
      </Panel>

      <div className="sticky bottom-4 z-20 flex items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-white/95 p-4 shadow-xl backdrop-blur">
        <p className="hidden text-sm text-slate-500 sm:block">
          Save once to publish all homepage CMS changes.
        </p>

        <button
          type="submit"
          disabled={saving}
          className="ml-auto rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : "Save Home Settings"}
        </button>
      </div>
    </form>
  );
}
