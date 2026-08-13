"use client";

import axios from "axios";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(
    /\/+$/,
    ""
  );

const stringFields = [
  "heroEyebrow",
  "heroTitle",
  "heroDescription",
  "heading",
  "description",
  "secondaryDescription",
  "commitmentTitle",
  "commitmentDescription",
  "foundationEyebrow",
  "foundationTitle",
  "foundationDescription",
  "missionTitle",
  "missionDescription",
  "visionTitle",
  "visionDescription",
  "objectivesEyebrow",
  "objectivesTitle",
  "objectivesDescription",
  "presidentName",
  "presidentDesignation",
  "presidentMessage",
  "whyChooseUsEyebrow",
  "whyChooseUsTitle",
  "whyChooseUsDescription",
  "ctaTitle",
  "ctaDescription",
  "ctaPrimaryLabel",
  "ctaSecondaryLabel",
] as const;

type Item = {
  title: string;
  description: string;
  icon?: string;
};

type AboutSettings = Record<
  (typeof stringFields)[number],
  string
> & {
  image?: string;
  presidentPhoto?: string;
  objectives: Item[];
  reasons: Item[];
};

const empty: AboutSettings = {
  heroEyebrow: "",
  heroTitle: "",
  heroDescription: "",

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

  presidentName: "",
  presidentDesignation: "",
  presidentMessage: "",

  whyChooseUsEyebrow: "",
  whyChooseUsTitle: "",
  whyChooseUsDescription: "",

  ctaTitle: "",
  ctaDescription: "",
  ctaPrimaryLabel: "",
  ctaSecondaryLabel: "",

  image: "",
  presidentPhoto: "",

  objectives: [],
  reasons: [],
};

const getAuthHeaders = () => {
  if (typeof window === "undefined") {
    return {};
  }

  const token =
    localStorage.getItem("token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

function normalize(
  data: Partial<AboutSettings> | undefined
): AboutSettings {
  return {
    ...empty,
    ...(data || {}),
    objectives:
      Array.isArray(data?.objectives)
        ? data.objectives
        : [],
    reasons:
      Array.isArray(data?.reasons)
        ? data.reasons
        : [],
  };
}

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      fallback
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export default function AboutSectionForm() {
  const [form, setForm] =
    useState<AboutSettings>(empty);

  const [image, setImage] =
    useState<File | null>(null);

  const [presidentPhoto, setPresidentPhoto] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const load = async () => {
    if (!API_URL) {
      throw new Error(
        "NEXT_PUBLIC_API_URL is not configured."
      );
    }

    const response = await axios.get(
      `${API_URL}/settings/about`,
      {
        timeout: 10000,
      }
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Unable to load About settings."
      );
    }

    setForm(
      normalize(response.data?.data)
    );
  };

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        await load();
      } catch (error) {
        console.error(
          "Failed to load About settings:",
          error
        );

        if (mounted) {
          toast.error(
            getErrorMessage(
              error,
              "Unable to load About settings."
            )
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      mounted = false;
    };
  }, []);

  const update = (
    field: (typeof stringFields)[number],
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateItem = (
    key: "objectives" | "reasons",
    index: number,
    field: keyof Item,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [key]: current[key].map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                [field]: value,
              }
            : item
      ),
    }));
  };

  const addItem = (
    key: "objectives" | "reasons"
  ) => {
    setForm((current) => ({
      ...current,
      [key]: [
        ...current[key],
        {
          title: "",
          description: "",
          icon: "",
        },
      ],
    }));
  };

  const removeItem = (
    key: "objectives" | "reasons",
    index: number
  ) => {
    setForm((current) => ({
      ...current,
      [key]: current[key].filter(
        (_, itemIndex) =>
          itemIndex !== index
      ),
    }));
  };

  const uploadMedia = async () => {
    if (!API_URL) {
      throw new Error(
        "NEXT_PUBLIC_API_URL is not configured."
      );
    }

    if (!image && !presidentPhoto) {
      return;
    }

    const formData = new FormData();

    if (image) {
      formData.append(
        "image",
        image
      );
    }

    if (presidentPhoto) {
      formData.append(
        "presidentPhoto",
        presidentPhoto
      );
    }

    const response = await axios.post(
      `${API_URL}/settings/about/upload`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
        },
        withCredentials: true,
        timeout: 60000,
      }
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Unable to upload About media."
      );
    }

    return response.data;
  };

  const submit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (!API_URL) {
      toast.error(
        "NEXT_PUBLIC_API_URL is not configured."
      );
      return;
    }

    setSaving(true);

    try {
      /*
       * =====================================================
       * STEP 1
       * Save CMS text/content as JSON.
       * =====================================================
       */
      const payload = {
        ...Object.fromEntries(
          stringFields.map((field) => [
            field,
            form[field],
          ])
        ),

        objectives: form.objectives,
        reasons: form.reasons,
      };

      const contentResponse =
        await axios.put(
          `${API_URL}/settings/about`,
          payload,
          {
            headers: {
              ...getAuthHeaders(),
              "Content-Type":
                "application/json",
            },
            withCredentials: true,
            timeout: 15000,
          }
        );

      if (
        !contentResponse.data?.success
      ) {
        throw new Error(
          contentResponse.data?.message ||
            "Unable to save About content."
        );
      }

      /*
       * =====================================================
       * STEP 2
       * Upload images separately.
       * =====================================================
       */
      await uploadMedia();

      /*
       * Clear selected files after successful upload.
       */
      setImage(null);
      setPresidentPhoto(null);

      /*
       * =====================================================
       * STEP 3
       * Reload the actual database values.
       * =====================================================
       */
      await load();

      /*
       * Notify any open public About component.
       */
      window.dispatchEvent(
        new Event(
          "about-settings-updated"
        )
      );

      toast.success(
        "About section saved successfully."
      );
    } catch (error) {
      console.error(
        "Failed to save About settings:",
        error
      );

      toast.error(
        getErrorMessage(
          error,
          "Unable to save About settings."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6 text-slate-500">
        Loading About settings…
      </div>
    );
  }

  const sections = [
    [
      "Hero",
      [
        "heroEyebrow",
        "heroTitle",
        "heroDescription",
      ],
    ],
    [
      "Introduction",
      [
        "heading",
        "description",
        "secondaryDescription",
        "commitmentTitle",
        "commitmentDescription",
      ],
    ],
    [
      "Mission & Vision",
      [
        "foundationEyebrow",
        "foundationTitle",
        "foundationDescription",
        "missionTitle",
        "missionDescription",
        "visionTitle",
        "visionDescription",
      ],
    ],
    [
      "Objectives",
      [
        "objectivesEyebrow",
        "objectivesTitle",
        "objectivesDescription",
      ],
    ],
    [
      "President",
      [
        "presidentName",
        "presidentDesignation",
        "presidentMessage",
      ],
    ],
    [
      "Why Choose Us",
      [
        "whyChooseUsEyebrow",
        "whyChooseUsTitle",
        "whyChooseUsDescription",
      ],
    ],
    [
      "CTA",
      [
        "ctaTitle",
        "ctaDescription",
        "ctaPrimaryLabel",
        "ctaSecondaryLabel",
      ],
    ],
  ] as const;

  return (
    <form
      onSubmit={submit}
      className="space-y-8"
    >
      {sections.map(
        ([title, fields]) => (
          <section
            key={title}
            className="rounded-xl border bg-white p-6 shadow-sm"
          >
            <h2 className="mb-5 text-xl font-semibold text-slate-900">
              {title}
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              {fields.map((field) => {
                const label =
                  field
                    .replace(
                      /[A-Z]/g,
                      (match) =>
                        ` ${match}`
                    )
                    .replace(
                      /^./,
                      (match) =>
                        match.toUpperCase()
                    );

                const isLongText =
                  field
                    .toLowerCase()
                    .includes(
                      "description"
                    ) ||
                  field
                    .toLowerCase()
                    .includes(
                      "message"
                    );

                return (
                  <label
                    key={field}
                    className="space-y-2"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {label}
                    </span>

                    {isLongText ? (
                      <textarea
                        value={
                          form[field]
                        }
                        onChange={(event) =>
                          update(
                            field,
                            event
                              .target
                              .value
                          )
                        }
                        rows={4}
                        className="w-full rounded-lg border px-3 py-2 outline-none focus:border-slate-500"
                      />
                    ) : (
                      <input
                        value={
                          form[field]
                        }
                        onChange={(event) =>
                          update(
                            field,
                            event
                              .target
                              .value
                          )
                        }
                        className="w-full rounded-lg border px-3 py-2 outline-none focus:border-slate-500"
                      />
                    )}
                  </label>
                );
              })}
            </div>
          </section>
        )
      )}

      {(
        [
          "objectives",
          "reasons",
        ] as const
      ).map((key) => (
        <section
          key={key}
          className="rounded-xl border bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold capitalize">
              {key}
            </h2>

            <button
              type="button"
              onClick={() =>
                addItem(key)
              }
              className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
            >
              Add item
            </button>
          </div>

          <div className="space-y-4">
            {form[key].map(
              (item, index) => (
                <div
                  key={`${key}-${index}`}
                  className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_1fr_160px_auto]"
                >
                  <input
                    value={
                      item.title
                    }
                    onChange={(event) =>
                      updateItem(
                        key,
                        index,
                        "title",
                        event.target
                          .value
                      )
                    }
                    placeholder="Title"
                    className="rounded-lg border px-3 py-2"
                  />

                  <input
                    value={
                      item.description
                    }
                    onChange={(event) =>
                      updateItem(
                        key,
                        index,
                        "description",
                        event.target
                          .value
                      )
                    }
                    placeholder="Description"
                    className="rounded-lg border px-3 py-2"
                  />

                  <input
                    value={
                      item.icon || ""
                    }
                    onChange={(event) =>
                      updateItem(
                        key,
                        index,
                        "icon",
                        event.target
                          .value
                      )
                    }
                    placeholder="Icon"
                    className="rounded-lg border px-3 py-2"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(
                        key,
                        index
                      )
                    }
                    className="rounded-lg border px-3 py-2 text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>
        </section>
      ))}

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold">
          Media
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium">
              About image
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(
                event: ChangeEvent<HTMLInputElement>
              ) => {
                setImage(
                  event.target.files?.[0] ||
                    null
                );
              }}
              className="block w-full"
            />

            {form.image && (
              <img
                src={form.image}
                alt="Current About"
                className="h-32 w-full rounded-lg object-cover"
              />
            )}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">
              President photo
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(
                event: ChangeEvent<HTMLInputElement>
              ) => {
                setPresidentPhoto(
                  event.target.files?.[0] ||
                    null
                );
              }}
              className="block w-full"
            />

            {form.presidentPhoto && (
              <img
                src={
                  form.presidentPhoto
                }
                alt="Current president"
                className="h-32 w-full rounded-lg object-cover"
              />
            )}
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-slate-900 px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving…"
            : "Save About Section"}
        </button>
      </div>
    </form>
  );
}
