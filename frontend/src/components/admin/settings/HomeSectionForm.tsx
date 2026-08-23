"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

import BannerManager from "@/components/admin/BannerManager";
import HomeMediaManager from "@/components/admin/settings/HomeMediaManager";
import {
  authenticatedApiFetch,
  responseJson,
} from "@/services/api";
import {
  defaultHomeSettings,
  type HomeCard,
  type HomeSectionKey,
  type HomeSettings,
  mergeHomeSettings,
} from "@/types/homeSettings";

const sectionLabels: Record<HomeSectionKey, string> = {
  hero: "Hero",
  about: "About",
  objectives: "Objectives",
  latestUpdates: "Latest Updates",
  gallery: "Gallery",
  pressConferences: "Press Conferences",
  members: "Members",
  officeBearers: "Office Bearers",
  membership: "Membership CTA",
};

const sectionOrder: HomeSectionKey[] = [
  "hero",
  "about",
  "objectives",
  "latestUpdates",
  "gallery",
  "pressConferences",
  "members",
  "officeBearers",
  "membership",
];

type WebsiteResponse = {
  success?: boolean;
  data?: {
    home?: Partial<HomeSettings>;
    aboutImage?: string;
  };
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
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
        className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
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
        onChange={(event) => {
          const raw = Number(
            event.target.value
          );

          onChange(
            Number.isFinite(raw)
              ? Math.max(
                  min,
                  Math.min(max, raw)
                )
              : min
          );
        }}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
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
  onChange: (value: boolean) => void;
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
        className="h-5 w-5 accent-slate-900"
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
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6">
        <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
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
          Objective Card {index + 1}
        </h3>

        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
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
  const [home, setHome] =
    useState<HomeSettings>(
      defaultHomeSettings
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

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

      setHome(
        mergeHomeSettings(
          payload.data?.home
        )
      );
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
        [
          ...sectionOrder,
        ].sort(
          (a, b) =>
            home.sections[a]
              .order -
            home.sections[b]
              .order
        ),
      [home.sections]
    );

  const updateSection = (
    key: HomeSectionKey,
    patch: Partial<
      HomeSettings["sections"][HomeSectionKey]
    >
  ) => {
    setHome(
      (current) => ({
        ...current,
        sections: {
          ...current.sections,
          [key]: {
            ...current.sections[
              key
            ],
            ...patch,
          },
        },
      })
    );
  };

  const moveSection = (
    key: HomeSectionKey,
    direction: -1 | 1
  ) => {
    const index =
      sortedSections.indexOf(key);

    const nextIndex =
      index + direction;

    if (
      nextIndex < 0 ||
      nextIndex >=
        sortedSections.length
    ) {
      return;
    }

    const nextKey =
      sortedSections[nextIndex];

    const currentOrder =
      home.sections[key]
        .order;

    const nextOrder =
      home.sections[nextKey]
        .order;

    setHome(
      (current) => ({
        ...current,
        sections: {
          ...current.sections,
          [key]: {
            ...current.sections[
              key
            ],
            order: nextOrder,
          },
          [nextKey]: {
            ...current.sections[
              nextKey
            ],
            order: currentOrder,
          },
        },
      })
    );
  };

  const updateNested = <
    K extends Exclude<
      HomeSectionKey,
      "hero"
    >
  >(
    section: K,
    patch: Partial<HomeSettings[K]>
  ) => {
    setHome(
      (current) => ({
        ...current,
        [section]: {
          ...current[section],
          ...patch,
        },
      })
    );
  };

  const updateHero = (
    patch: Partial<HomeSettings["hero"]>
  ) => {
    setHome(
      (current) => ({
        ...current,
        hero: {
          ...current.hero,
          ...patch,
        },
      })
    );
  };

  const addQuickLink = () => {
    updateHero({
      quickLinks: [
        ...home.hero
          .quickLinks,
        {
          label: "New Link",
          href: "/",
        },
      ],
    });
  };

  const removeQuickLink = (
    index: number
  ) => {
    updateHero({
      quickLinks:
        home.hero.quickLinks.filter(
          (_, itemIndex) =>
            itemIndex !== index
        ),
    });
  };

  const updateQuickLink = (
    index: number,
    patch: Partial<{
      label: string;
      href: string;
    }>
  ) => {
    updateHero({
      quickLinks:
        home.hero.quickLinks.map(
          (
            item,
            itemIndex
          ) =>
            itemIndex === index
              ? {
                  ...item,
                  ...patch,
                }
              : item
        ),
    });
  };

  const addFeature = () => {
    updateNested("about", {
      features: [
        ...home.about
          .features,
        "New feature",
      ],
    });
  };

  const removeFeature = (
    index: number
  ) => {
    updateNested("about", {
      features:
        home.about.features.filter(
          (_, itemIndex) =>
            itemIndex !== index
        ),
    });
  };

  const updateFeature = (
    index: number,
    value: string
  ) => {
    updateNested("about", {
      features:
        home.about.features.map(
          (
            item,
            itemIndex
          ) =>
            itemIndex === index
              ? value
              : item
        ),
    });
  };

  const addObjective = () => {
    updateNested(
      "objectives",
      {
        cards: [
          ...home.objectives
            .cards,
          {
            icon: "Star",
            title: "New objective",
            description:
              "Describe this objective.",
          },
        ],
      }
    );
  };

  const removeObjective = (
    index: number
  ) => {
    updateNested(
      "objectives",
      {
        cards:
          home.objectives.cards.filter(
            (_, itemIndex) =>
              itemIndex !== index
          ),
      }
    );
  };

  const updateObjective = (
    index: number,
    key: keyof HomeCard,
    value: string
  ) => {
    updateNested(
      "objectives",
      {
        cards:
          home.objectives.cards.map(
            (
              card,
              itemIndex
            ) =>
              itemIndex ===
              index
                ? {
                    ...card,
                    [key]: value,
                  }
                : card
          ),
      }
    );
  };

  const save = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    try {
      setSaving(true);

      const response =
        await authenticatedApiFetch(
          "/settings",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              home,
            }),
          }
        );

      await responseJson(response);

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
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="h-8 w-1/3 animate-pulse rounded bg-slate-200" />
        <div className="mt-5 h-32 animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  const Media = ({
    section,
  }: {
    section: Exclude<
      HomeSectionKey,
      "hero"
    >;
  }) => (
    <HomeMediaManager
      section={section}
      media={home[section].media}
      onChange={(media) =>
        updateNested(
          section,
          { media }
        )
      }
      max={4}
    />
  );

  return (
    <form
      onSubmit={save}
      className="space-y-6"
    >
      <Panel
        title="Homepage Section Manager"
        description="Control the visibility, order and background treatment of every homepage section. The content and media editors below remain attached to the same CMS source."
      >
        <div className="space-y-3">
          {sortedSections.map(
            (key, index) => {
              const config =
                home.sections[key];

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
                      Order {config.order}
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
                            event.target
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
        description="Hero content is CMS controlled. Hero carousel photos remain managed separately through the multi-photo banner manager."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={home.hero.eyebrow}
            onChange={(event) =>
              updateHero({
                eyebrow:
                  event.target.value,
              })
            }
          />

          <Field
            label="Identity Label"
            value={
              home.hero
                .identityLabel
            }
            onChange={(event) =>
              updateHero({
                identityLabel:
                  event.target.value,
              })
            }
          />

          <div className="md:col-span-2">
            <Field
              label="Title"
              value={home.hero.title}
              onChange={(event) =>
                updateHero({
                  title:
                    event.target.value,
                })
              }
            />
          </div>

          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={
                home.hero
                  .description
              }
              onChange={(event) =>
                updateHero({
                  description:
                    event.target.value,
                })
              }
            />
          </div>

          <Field
            label="Primary Button Label"
            value={
              home.hero
                .primaryLabel
            }
            onChange={(event) =>
              updateHero({
                primaryLabel:
                  event.target.value,
              })
            }
          />

          <Field
            label="Secondary Button Label"
            value={
              home.hero
                .secondaryLabel
            }
            onChange={(event) =>
              updateHero({
                secondaryLabel:
                  event.target.value,
              })
            }
          />
        </div>

        <div className="mt-7 rounded-2xl border border-slate-200 p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="font-bold text-slate-900">
              Hero Quick Links
            </h3>

            <button
              type="button"
              onClick={addQuickLink}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"
            >
              Add Link
            </button>
          </div>

          <div className="space-y-4">
            {home.hero.quickLinks.map(
              (
                link,
                index
              ) => (
                <div
                  key={`${link.label}-${index}`}
                  className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
                >
                  <Field
                    label={`Label ${index + 1}`}
                    value={link.label}
                    onChange={(
                      event
                    ) =>
                      updateQuickLink(
                        index,
                        {
                          label:
                            event.target
                              .value,
                        }
                      )
                    }
                  />

                  <Field
                    label="Route / Href"
                    value={link.href}
                    onChange={(
                      event
                    ) =>
                      updateQuickLink(
                        index,
                        {
                          href:
                            event.target
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
                    className="self-end rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600"
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="font-bold text-slate-900">
            Hero Carousel Photos
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            The hero carousel is already complete. Use this manager to add, replace, hide, delete and reorder its CMS photos.
          </p>

          <div className="mt-5">
            <BannerManager />
          </div>
        </div>
      </Panel>

      <Panel
        title="About Section"
        description="The redesigned About block uses these CMS fields and the section-specific photo collection."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={
              home.about.eyebrow
            }
            onChange={(event) =>
              updateNested(
                "about",
                {
                  eyebrow:
                    event.target.value,
                }
              )
            }
          />

          <Field
            label="Title"
            value={home.about.title}
            onChange={(event) =>
              updateNested(
                "about",
                {
                  title:
                    event.target.value,
                }
              )
            }
          />

          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={
                home.about.description
              }
              onChange={(event) =>
                updateNested(
                  "about",
                  {
                    description:
                      event.target
                        .value,
                  }
                )
              }
            />
          </div>

          <Field
            label="Button Label"
            value={
              home.about.buttonLabel
            }
            onChange={(event) =>
              updateNested(
                "about",
                {
                  buttonLabel:
                    event.target.value,
                }
              )
            }
          />

          <Field
            label="Button Route / Href"
            value={
              home.about.buttonHref
            }
            onChange={(event) =>
              updateNested(
                "about",
                {
                  buttonHref:
                    event.target.value,
                }
              )
            }
          />

          <Toggle
            label="Show Statistics"
            checked={
              home.about.showStats
            }
            onChange={(value) =>
              updateNested(
                "about",
                {
                  showStats:
                    value,
                }
              )
            }
          />

          <div className="md:col-span-2 grid gap-5 sm:grid-cols-3">
            {home.about.statsLabels.map(
              (
                label,
                index
              ) => (
                <Field
                  key={index}
                  label={`Statistic ${
                    index + 1
                  } Label`}
                  value={label}
                  onChange={(
                    event
                  ) =>
                    updateNested(
                      "about",
                      {
                        statsLabels:
                          home.about.statsLabels.map(
                            (
                              item,
                              itemIndex
                            ) =>
                              itemIndex ===
                              index
                                ? event
                                    .target
                                    .value
                                : item
                          ) as [
                            string,
                            string,
                            string
                          ],
                      }
                    )
                  }
                />
              )
            )}
          </div>
        </div>

        <div className="mt-7 rounded-2xl border border-slate-200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold">
              About Features
            </h3>

            <button
              type="button"
              onClick={addFeature}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"
            >
              Add Feature
            </button>
          </div>

          <div className="space-y-3">
            {home.about.features.map(
              (
                feature,
                index
              ) => (
                <div
                  key={index}
                  className="grid gap-3 md:grid-cols-[1fr_auto]"
                >
                  <Field
                    label={`Feature ${
                      index + 1
                    }`}
                    value={feature}
                    onChange={(
                      event
                    ) =>
                      updateFeature(
                        index,
                        event.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeFeature(
                        index
                      )
                    }
                    className="self-end rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600"
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        <div className="mt-7">
          <HomeMediaManager
            section="about"
            label="About Photos"
            media={
              home.about.media
            }
            onChange={(media) =>
              updateNested(
                "about",
                { media }
              )
            }
            max={4}
          />
        </div>
      </Panel>

      <Panel
        title="Objectives Section"
        description="Control the section heading, CTA, number of cards and every objective card. You can also upload up to four editorial photos for the visual layout."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={
              home.objectives
                .eyebrow
            }
            onChange={(event) =>
              updateNested(
                "objectives",
                {
                  eyebrow:
                    event.target.value,
                }
              )
            }
          />

          <Field
            label="Title"
            value={
              home.objectives
                .title
            }
            onChange={(event) =>
              updateNested(
                "objectives",
                {
                  title:
                    event.target.value,
                }
              )
            }
          />

          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={
                home.objectives
                  .description
              }
              onChange={(event) =>
                updateNested(
                  "objectives",
                  {
                    description:
                      event.target.value,
                  }
                )
              }
            />
          </div>

          <Field
            label="Button Label"
            value={
              home.objectives
                .buttonLabel
            }
            onChange={(event) =>
              updateNested(
                "objectives",
                {
                  buttonLabel:
                    event.target.value,
                }
              )
            }
          />

          <Field
            label="Button Route / Href"
            value={
              home.objectives
                .buttonHref
            }
            onChange={(event) =>
              updateNested(
                "objectives",
                {
                  buttonHref:
                    event.target.value,
                }
              )
            }
          />

          <NumberField
            label="Cards shown"
            value={
              home.objectives
                .displayCount
            }
            min={1}
            max={
              home.objectives
                .cards.length || 1
            }
            onChange={(value) =>
              updateNested(
                "objectives",
                {
                  displayCount:
                    value,
                }
              )
            }
          />
        </div>

        <div className="mt-7 space-y-4">
          {home.objectives.cards.map(
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
                  updateObjective(
                    index,
                    key,
                    value
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
          onClick={addObjective}
          className="mt-4 rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50"
        >
          Add Objective Card
        </button>

        <div className="mt-7">
          <HomeMediaManager
            section="objectives"
            label="Objectives Photos"
            media={
              home.objectives
                .media
            }
            onChange={(media) =>
              updateNested(
                "objectives",
                { media }
              )
            }
            max={4}
          />
        </div>
      </Panel>

      <Panel
        title="Latest Updates Section"
        description="The actual press releases, announcements and events remain in their own CMS modules. These settings control the homepage editorial presentation, CTA and optional section photos."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={
              home.latestUpdates
                .eyebrow
            }
            onChange={(event) =>
              updateNested(
                "latestUpdates",
                {
                  eyebrow:
                    event.target.value,
                }
              )
            }
          />

          <Field
            label="Title"
            value={
              home.latestUpdates
                .title
            }
            onChange={(event) =>
              updateNested(
                "latestUpdates",
                {
                  title:
                    event.target.value,
                }
              )
            }
          />

          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={
                home.latestUpdates
                  .description
              }
              onChange={(event) =>
                updateNested(
                  "latestUpdates",
                  {
                    description:
                      event.target.value,
                  }
                )
              }
            />
          </div>

          <Field
            label="Button Label"
            value={
              home.latestUpdates
                .buttonLabel
            }
            onChange={(event) =>
              updateNested(
                "latestUpdates",
                {
                  buttonLabel:
                    event.target.value,
                }
              )
            }
          />

          <Field
            label="Button Route / Href"
            value={
              home.latestUpdates
                .buttonHref
            }
            onChange={(event) =>
              updateNested(
                "latestUpdates",
                {
                  buttonHref:
                    event.target.value,
                }
              )
            }
          />

          <NumberField
            label="Cards shown"
            value={
              home.latestUpdates
                .displayCount
            }
            min={1}
            max={12}
            onChange={(value) =>
              updateNested(
                "latestUpdates",
                {
                  displayCount:
                    value,
                }
              )
            }
          />
        </div>

        <div className="mt-7">
          <HomeMediaManager
            section="latestUpdates"
            label="Latest Updates Photos"
            media={
              home.latestUpdates
                .media
            }
            onChange={(media) =>
              updateNested(
                "latestUpdates",
                { media }
              )
            }
            max={4}
          />
        </div>
      </Panel>

      <Panel
        title="Gallery Section"
        description="The real gallery images remain managed through the Gallery CMS. The section-level photos below are optional editorial images used by the redesigned homepage layout."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={
              home.gallery.eyebrow
            }
            onChange={(event) =>
              updateNested(
                "gallery",
                {
                  eyebrow:
                    event.target.value,
                }
              )
            }
          />

          <Field
            label="Title"
            value={
              home.gallery.title
            }
            onChange={(event) =>
              updateNested(
                "gallery",
                {
                  title:
                    event.target.value,
                }
              )
            }
          />

          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={
                home.gallery
                  .description
              }
              onChange={(event) =>
                updateNested(
                  "gallery",
                  {
                    description:
                      event.target.value,
                  }
                )
              }
            />
          </div>

          <Field
            label="Button Label"
            value={
              home.gallery
                .buttonLabel
            }
            onChange={(event) =>
              updateNested(
                "gallery",
                {
                  buttonLabel:
                    event.target.value,
                }
              )
            }
          />

          <Field
            label="Button Route / Href"
            value={
              home.gallery
                .buttonHref
            }
            onChange={(event) =>
              updateNested(
                "gallery",
                {
                  buttonHref:
                    event.target.value,
                }
              )
            }
          />

          <NumberField
            label="Images shown from Gallery CMS"
            value={
              home.gallery
                .displayCount
            }
            min={1}
            max={24}
            onChange={(value) =>
              updateNested(
                "gallery",
                {
                  displayCount:
                    value,
                }
              )
            }
          />
        </div>

        <div className="mt-7">
          <HomeMediaManager
            section="gallery"
            label="Gallery Editorial Photos"
            media={
              home.gallery
                .media
            }
            onChange={(media) =>
              updateNested(
                "gallery",
                { media }
              )
            }
            max={4}
          />
        </div>
      </Panel>

      <Panel
        title="Press Conferences Section"
        description="The real conference records and their own featured images remain managed in Press Conferences CMS. These settings control the homepage section and optional editorial photos."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={
              home.pressConferences
                .eyebrow
            }
            onChange={(event) =>
              updateNested(
                "pressConferences",
                {
                  eyebrow:
                    event.target.value,
                }
              )
            }
          />

          <Field
            label="Title"
            value={
              home.pressConferences
                .title
            }
            onChange={(event) =>
              updateNested(
                "pressConferences",
                {
                  title:
                    event.target.value,
                }
              )
            }
          />

          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={
                home.pressConferences
                  .description
              }
              onChange={(event) =>
                updateNested(
                  "pressConferences",
                  {
                    description:
                      event.target.value,
                  }
                )
              }
            />
          </div>

          <Field
            label="Button Label"
            value={
              home.pressConferences
                .buttonLabel
            }
            onChange={(event) =>
              updateNested(
                "pressConferences",
                {
                  buttonLabel:
                    event.target.value,
                }
              )
            }
          />

          <Field
            label="Button Route / Href"
            value={
              home.pressConferences
                .buttonHref
            }
            onChange={(event) =>
              updateNested(
                "pressConferences",
                {
                  buttonHref:
                    event.target.value,
                }
              )
            }
          />

          <NumberField
            label="Cards shown"
            value={
              home.pressConferences
                .displayCount
            }
            min={1}
            max={12}
            onChange={(value) =>
              updateNested(
                "pressConferences",
                {
                  displayCount:
                    value,
                }
              )
            }
          />
        </div>

        <div className="mt-7">
          <HomeMediaManager
            section="pressConferences"
            label="Press Conference Photos"
            media={
              home.pressConferences
                .media
            }
            onChange={(media) =>
              updateNested(
                "pressConferences",
                { media }
              )
            }
            max={4}
          />
        </div>
      </Panel>

      <Panel
        title="Members Section"
        description="Member records remain in the Members CMS. This controls the homepage section heading, count, CTA and optional editorial photos."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={
              home.members
                .eyebrow
            }
            onChange={(event) =>
              updateNested(
                "members",
                {
                  eyebrow:
                    event.target.value,
                }
              )
            }
          />

          <Field
            label="Title"
            value={
              home.members
                .title
            }
            onChange={(event) =>
              updateNested(
                "members",
                {
                  title:
                    event.target.value,
                }
              )
            }
          />

          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={
                home.members
                  .description
              }
              onChange={(event) =>
                updateNested(
                  "members",
                  {
                    description:
                      event.target.value,
                  }
                )
              }
            />
          </div>

          <Field
            label="Button Label"
            value={
              home.members
                .buttonLabel
            }
            onChange={(event) =>
              updateNested(
                "members",
                {
                  buttonLabel:
                    event.target.value,
                }
              )
            }
          />

          <Field
            label="Button Route / Href"
            value={
              home.members
                .buttonHref
            }
            onChange={(event) =>
              updateNested(
                "members",
                {
                  buttonHref:
                    event.target.value,
                }
              )
            }
          />

          <NumberField
            label="Cards shown"
            value={
              home.members
                .displayCount
            }
            min={1}
            max={12}
            onChange={(value) =>
              updateNested(
                "members",
                {
                  displayCount:
                    value,
                }
              )
            }
          />

          <Toggle
            label="Show View All button"
            checked={
              home.members
                .showViewAll
            }
            onChange={(value) =>
              updateNested(
                "members",
                {
                  showViewAll:
                    value,
                }
              )
            }
          />
        </div>

        <div className="mt-7">
          <HomeMediaManager
            section="members"
            label="Members Photos"
            media={
              home.members
                .media
            }
            onChange={(media) =>
              updateNested(
                "members",
                { media }
              )
            }
            max={4}
          />
        </div>
      </Panel>

      <Panel
        title="Office Bearers Section"
        description="Office bearer records and member photos remain in their own CMS. This controls the homepage section, CTA, card count and optional editorial photos."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={
              home.officeBearers
                .eyebrow
            }
            onChange={(event) =>
              updateNested(
                "officeBearers",
                {
                  eyebrow:
                    event.target.value,
                }
              )
            }
          />

          <Field
            label="Title"
            value={
              home.officeBearers
                .title
            }
            onChange={(event) =>
              updateNested(
                "officeBearers",
                {
                  title:
                    event.target.value,
                }
              )
            }
          />

          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={
                home.officeBearers
                  .description
              }
              onChange={(event) =>
                updateNested(
                  "officeBearers",
                  {
                    description:
                      event.target.value,
                  }
                )
              }
            />
          </div>

          <Field
            label="Button Label"
            value={
              home.officeBearers
                .buttonLabel
            }
            onChange={(event) =>
              updateNested(
                "officeBearers",
                {
                  buttonLabel:
                    event.target.value,
                }
              )
            }
          />

          <Field
            label="Button Route / Href"
            value={
              home.officeBearers
                .buttonHref
            }
            onChange={(event) =>
              updateNested(
                "officeBearers",
                {
                  buttonHref:
                    event.target.value,
                }
              )
            }
          />

          <NumberField
            label="Cards shown"
            value={
              home.officeBearers
                .displayCount
            }
            min={1}
            max={12}
            onChange={(value) =>
              updateNested(
                "officeBearers",
                {
                  displayCount:
                    value,
                }
              )
            }
          />

          <Toggle
            label="Show View All button"
            checked={
              home.officeBearers
                .showViewAll
            }
            onChange={(value) =>
              updateNested(
                "officeBearers",
                {
                  showViewAll:
                    value,
                }
              )
            }
          />
        </div>

        <div className="mt-7">
          <HomeMediaManager
            section="officeBearers"
            label="Office Bearers Photos"
            media={
              home.officeBearers
                .media
            }
            onChange={(media) =>
              updateNested(
                "officeBearers",
                { media }
              )
            }
            max={4}
          />
        </div>
      </Panel>

      <Panel
        title="Membership CTA Section"
        description="Control the final homepage call-to-action, both routes and the optional editorial photos used in the redesigned CTA."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Eyebrow"
            value={
              home.membership
                .eyebrow
            }
            onChange={(event) =>
              updateNested(
                "membership",
                {
                  eyebrow:
                    event.target.value,
                }
              )
            }
          />

          <Field
            label="Title"
            value={
              home.membership
                .title
            }
            onChange={(event) =>
              updateNested(
                "membership",
                {
                  title:
                    event.target.value,
                }
              )
            }
          />

          <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={
                home.membership
                  .description
              }
              onChange={(event) =>
                updateNested(
                  "membership",
                  {
                    description:
                      event.target.value,
                  }
                )
              }
            />
          </div>

          <Field
            label="Primary Button Label"
            value={
              home.membership
                .primaryLabel
            }
            onChange={(event) =>
              updateNested(
                "membership",
                {
                  primaryLabel:
                    event.target.value,
                }
              )
            }
          />

          <Field
            label="Primary Button Route / Href"
            value={
              home.membership
                .primaryHref
            }
            onChange={(event) =>
              updateNested(
                "membership",
                {
                  primaryHref:
                    event.target.value,
                }
              )
            }
          />

          <Field
            label="Secondary Button Label"
            value={
              home.membership
                .secondaryLabel
            }
            onChange={(event) =>
              updateNested(
                "membership",
                {
                  secondaryLabel:
                    event.target.value,
                }
              )
            }
          />

          <Field
            label="Secondary Button Route / Href"
            value={
              home.membership
                .secondaryHref
            }
            onChange={(event) =>
              updateNested(
                "membership",
                {
                  secondaryHref:
                    event.target.value,
                }
              )
            }
          />
        </div>

        <div className="mt-7">
          <HomeMediaManager
            section="membership"
            label="Membership CTA Photos"
            media={
              home.membership
                .media
            }
            onChange={(media) =>
              updateNested(
                "membership",
                { media }
              )
            }
            max={4}
          />
        </div>
      </Panel>

      <div className="sticky bottom-4 z-30 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[#171717] px-7 py-3.5 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving Home Settings..."
            : "Save Home Settings"}
        </button>
      </div>
    </form>
  );
}
