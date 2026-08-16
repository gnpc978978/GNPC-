"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

import {
  authenticatedApiFetch,
  apiFetch,
  responseJson,
} from "@/services/api";

type ListItem = {
  title: string;
  description: string;
  icon: string;
};

type ListField =
  | "objectives"
  | "reasons";

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
  objectives: ListItem[];

  presidentName: string;
  presidentDesignation: string;
  presidentMessage: string;
  presidentPhoto: string;

  whyChooseUsEyebrow: string;
  whyChooseUsTitle: string;
  whyChooseUsDescription: string;
  reasons: ListItem[];

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

const emptyItem =
  (): ListItem => ({
    title: "",
    description: "",
    icon: "",
  });

const defaultForm: AboutSettings =
  {
    heroEyebrow:
      "About Greater Noida Press Club",

    heroTitle: "About Us",

    heroDescription:
      "Learn about Greater Noida Press Club, our mission, vision and commitment towards ethical journalism.",

    image: "",

    heading:
      "Empowering Journalists & Strengthening Independent Media",

    description:
      "Greater Noida Press Club is a professional organization dedicated to supporting journalists, promoting ethical journalism, and providing a strong platform for media professionals.",

    secondaryDescription:
      "We believe in freedom of expression, responsible reporting, and creating opportunities that help journalists grow, collaborate, and contribute to society.",

    commitmentTitle:
      "Our Commitment",

    commitmentDescription:
      "We are committed to protecting journalistic values, encouraging transparency, and building a stronger media community through education, collaboration, and innovation.",

    foundationEyebrow:
      "Our Foundation",

    foundationTitle:
      "Mission & Vision",

    foundationDescription:
      "We are committed to ethical journalism, professional excellence, and empowering media professionals through collaboration and innovation.",

    missionTitle:
      "Our Mission",

    missionDescription:
      "To support journalists with professional development, transparency, ethical reporting, and a strong platform that protects press freedom.",

    visionTitle:
      "Our Vision",

    visionDescription:
      "To build a trusted community where journalists collaborate, innovate, and contribute to an informed and democratic society.",

    objectivesEyebrow:
      "Our Objectives",

    objectivesTitle:
      "What We Aim To Achieve",

    objectivesDescription:
      "Our primary objective is to strengthen journalism through education, collaboration, innovation, and ethical reporting.",

    objectives: [],

    presidentName: "",
    presidentDesignation: "",
    presidentMessage: "",
    presidentPhoto: "",

    whyChooseUsEyebrow:
      "Why Choose Us",

    whyChooseUsTitle:
      "Why Greater Noida Press Club Matters",

    whyChooseUsDescription:
      "We provide a trusted platform for journalists to connect, collaborate, and grow while maintaining the highest standards of journalism.",

    reasons: [],

    ctaTitle:
      "Become a Part of Our Greater Noida Press Club",

    ctaDescription:
      "Join a community dedicated to ethical journalism, professional growth, networking, and media excellence. Together we build a stronger voice for journalists.",

    ctaPrimaryLabel:
      "Become a Member",

    ctaSecondaryLabel:
      "Meet Our Office Bearers",

    ctaSecondaryHref:
      "/office-bearers",
  };

function normalizeForm(
  data?: Partial<AboutSettings>
): AboutSettings {
  return {
    ...defaultForm,
    ...(data || {}),

    objectives:
      Array.isArray(
        data?.objectives
      )
        ? data.objectives.map(
            (item) => ({
              title:
                item?.title || "",
              description:
                item?.description ||
                "",
              icon:
                item?.icon || "",
            })
          )
        : [],

    reasons:
      Array.isArray(
        data?.reasons
      )
        ? data.reasons.map(
            (item) => ({
              title:
                item?.title || "",
              description:
                item?.description ||
                "",
              icon:
                item?.icon || "",
            })
          )
        : [],
  };
}

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
        type="text"
        value={value}
        onChange={onChange}
        placeholder={
          placeholder
        }
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 5,
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

function ListEditor({
  item,
  index,
  onUpdate,
  onRemove,
}: {
  item: ListItem;
  index: number;
  onUpdate: (
    property: keyof ListItem
  ) => (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="font-bold text-slate-900">
          Item {index + 1}
        </h3>

        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          Remove
        </button>
      </div>

      <div className="grid gap-5">
        <Field
          label="Title"
          value={item.title}
          onChange={onUpdate(
            "title"
          )}
        />

        <TextArea
          label="Description"
          value={
            item.description
          }
          onChange={onUpdate(
            "description"
          )}
          rows={4}
        />

        <Field
          label="Icon Name"
          value={item.icon}
          onChange={onUpdate(
            "icon"
          )}
          placeholder="Example: Target"
        />
      </div>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
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

export default function AboutSectionForm() {
  const [
    form,
    setForm,
  ] = useState<AboutSettings>(
    defaultForm
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    uploadingImage,
    setUploadingImage,
  ] = useState(false);

  const [
    uploadingPresident,
    setUploadingPresident,
  ] = useState(false);

  const loadSettings =
    async () => {
      try {
        setLoading(true);

        const response =
          await apiFetch(
            "/settings/about"
          );

        const payload =
          await responseJson<AboutResponse>(
            response
          );

        setForm(
          normalizeForm(
            payload.data
          )
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load About settings."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    void loadSettings();
  }, []);

  const updateField =
    (
      field: keyof AboutSettings
    ) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
    ) => {
      setForm(
        (current) => ({
          ...current,
          [field]:
            event.target.value,
        })
      );
    };

  const updateListItem =
    (
      field: ListField,
      index: number
    ) =>
    (
      property: keyof ListItem
    ) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
    ) => {
      const value =
        event.target.value;

      setForm(
        (current) => ({
          ...current,

          [field]:
            current[field].map(
              (
                item,
                itemIndex
              ) =>
                itemIndex ===
                index
                  ? {
                      ...item,
                      [property]:
                        value,
                    }
                  : item
            ),
        })
      );
    };

  const addItem = (
    field: ListField
  ) => {
    setForm(
      (current) => ({
        ...current,

        [field]: [
          ...current[field],
          emptyItem(),
        ],
      })
    );
  };

  const removeItem = (
    field: ListField,
    index: number
  ) => {
    setForm(
      (current) => ({
        ...current,

        [field]:
          current[field].filter(
            (
              _,
              itemIndex
            ) =>
              itemIndex !==
              index
          ),
      })
    );
  };

  const saveSettings =
    async (
      event: FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      try {
        setSaving(true);

        const payload = {
          ...form,

          objectives:
            form.objectives.map(
              (item) => ({
                title:
                  item.title.trim(),
                description:
                  item.description.trim(),
                icon:
                  item.icon.trim(),
              })
            ),

          reasons:
            form.reasons.map(
              (item) => ({
                title:
                  item.title.trim(),
                description:
                  item.description.trim(),
                icon:
                  item.icon.trim(),
              })
            ),
        };

        const response =
          await authenticatedApiFetch(
            "/settings/about",
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Accept:
                  "application/json",
              },

              body: JSON.stringify(
                payload
              ),
            }
          );

        const result =
          await responseJson<AboutResponse>(
            response
          );

        setForm(
          normalizeForm(
            result.data
          )
        );

        window.dispatchEvent(
          new Event(
            "about-settings-updated"
          )
        );

        toast.success(
          result.message ||
            "About page saved successfully."
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to save About settings."
        );
      } finally {
        setSaving(false);
      }
    };

  const uploadImage =
    async (
      field:
        | "image"
        | "presidentPhoto",
      file: File
    ) => {
      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        toast.error(
          "Please select an image file."
        );

        return;
      }

      if (
        file.size >
        10 * 1024 * 1024
      ) {
        toast.error(
          "Image must be smaller than 10 MB."
        );

        return;
      }

      try {
        if (
          field ===
          "image"
        ) {
          setUploadingImage(
            true
          );
        } else {
          setUploadingPresident(
            true
          );
        }

        const body =
          new FormData();

        body.append(
          field,
          file
        );

        const response =
          await authenticatedApiFetch(
            "/settings/about/upload",
            {
              method: "POST",
              body,
            }
          );

        const result =
          await responseJson<AboutResponse>(
            response
          );

        if (
          result.data
        ) {
          setForm(
            normalizeForm(
              result.data
            )
          );
        }

        window.dispatchEvent(
          new Event(
            "about-settings-updated"
          )
        );

        toast.success(
          field ===
            "image"
            ? "About image uploaded successfully."
            : "President photo uploaded successfully."
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to upload image."
        );
      } finally {
        setUploadingImage(
          false
        );

        setUploadingPresident(
          false
        );
      }
    };

  const handleImageChange =
    (
      field:
        | "image"
        | "presidentPhoto"
    ) =>
    (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        event.target.files?.[0];

      event.target.value = "";

      if (!file) {
        return;
      }

      void uploadImage(
        field,
        file
      );
    };

  if (loading) {
    return (
      <div className="space-y-5">
        {Array.from(
          { length: 5 }
        ).map(
          (_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl bg-slate-200"
            />
          )
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={
        saveSettings
      }
      className="space-y-6"
    >
      <Section title="Hero Section">
        <div className="grid gap-5">
          <Field
            label="Eyebrow"
            value={
              form.heroEyebrow
            }
            onChange={updateField(
              "heroEyebrow"
            )}
          />

          <Field
            label="Title"
            value={
              form.heroTitle
            }
            onChange={updateField(
              "heroTitle"
            )}
          />

          <TextArea
            label="Description"
            value={
              form.heroDescription
            }
            onChange={updateField(
              "heroDescription"
            )}
          />
        </div>
      </Section>

      <Section title="About Introduction">
        <div className="grid gap-5">
          <Field
            label="Heading"
            value={
              form.heading
            }
            onChange={updateField(
              "heading"
            )}
          />

          <TextArea
            label="Description"
            value={
              form.description
            }
            onChange={updateField(
              "description"
            )}
          />

          <TextArea
            label="Secondary Description"
            value={
              form.secondaryDescription
            }
            onChange={updateField(
              "secondaryDescription"
            )}
          />

          <Field
            label="Commitment Title"
            value={
              form.commitmentTitle
            }
            onChange={updateField(
              "commitmentTitle"
            )}
          />

          <TextArea
            label="Commitment Description"
            value={
              form.commitmentDescription
            }
            onChange={updateField(
              "commitmentDescription"
            )}
          />

          <MediaUpload
            title="About Image"
            value={
              form.image
            }
            loading={
              uploadingImage
            }
            onChange={handleImageChange(
              "image"
            )}
          />
        </div>
      </Section>

      <Section title="Mission & Vision">
        <div className="grid gap-5">
          <Field
            label="Foundation Eyebrow"
            value={
              form.foundationEyebrow
            }
            onChange={updateField(
              "foundationEyebrow"
            )}
          />

          <Field
            label="Foundation Title"
            value={
              form.foundationTitle
            }
            onChange={updateField(
              "foundationTitle"
            )}
          />

          <TextArea
            label="Foundation Description"
            value={
              form.foundationDescription
            }
            onChange={updateField(
              "foundationDescription"
            )}
          />

          <Field
            label="Mission Title"
            value={
              form.missionTitle
            }
            onChange={updateField(
              "missionTitle"
            )}
          />

          <TextArea
            label="Mission Description"
            value={
              form.missionDescription
            }
            onChange={updateField(
              "missionDescription"
            )}
          />

          <Field
            label="Vision Title"
            value={
              form.visionTitle
            }
            onChange={updateField(
              "visionTitle"
            )}
          />

          <TextArea
            label="Vision Description"
            value={
              form.visionDescription
            }
            onChange={updateField(
              "visionDescription"
            )}
          />
        </div>
      </Section>

      <Section
        title="Objectives"
        description="Manage the objective cards displayed on the About page."
      >
        <div className="grid gap-5">
          <Field
            label="Eyebrow"
            value={
              form.objectivesEyebrow
            }
            onChange={updateField(
              "objectivesEyebrow"
            )}
          />

          <Field
            label="Title"
            value={
              form.objectivesTitle
            }
            onChange={updateField(
              "objectivesTitle"
            )}
          />

          <TextArea
            label="Description"
            value={
              form.objectivesDescription
            }
            onChange={updateField(
              "objectivesDescription"
            )}
          />
        </div>

        <div className="mt-6 space-y-5">
          {form.objectives.map(
            (
              item,
              index
            ) => (
              <ListEditor
                key={index}
                item={item}
                index={index}
                onUpdate={updateListItem(
                  "objectives",
                  index
                )}
                onRemove={() =>
                  removeItem(
                    "objectives",
                    index
                  )
                }
              />
            )
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            addItem(
              "objectives"
            )
          }
          className="mt-5 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          Add Objective
        </button>
      </Section>

      <Section title="President Message">
        <div className="grid gap-5">
          <Field
            label="President Name"
            value={
              form.presidentName
            }
            onChange={updateField(
              "presidentName"
            )}
          />

          <Field
            label="Designation"
            value={
              form.presidentDesignation
            }
            onChange={updateField(
              "presidentDesignation"
            )}
          />

          <TextArea
            label="Message"
            value={
              form.presidentMessage
            }
            onChange={updateField(
              "presidentMessage"
            )}
            rows={8}
          />

          <MediaUpload
            title="President Photo"
            value={
              form.presidentPhoto
            }
            loading={
              uploadingPresident
            }
            circular
            onChange={handleImageChange(
              "presidentPhoto"
            )}
          />
        </div>
      </Section>

      <Section
        title="Why Choose Us"
        description="Manage the reasons displayed on the About page."
      >
        <div className="grid gap-5">
          <Field
            label="Eyebrow"
            value={
              form.whyChooseUsEyebrow
            }
            onChange={updateField(
              "whyChooseUsEyebrow"
            )}
          />

          <Field
            label="Title"
            value={
              form.whyChooseUsTitle
            }
            onChange={updateField(
              "whyChooseUsTitle"
            )}
          />

          <TextArea
            label="Description"
            value={
              form.whyChooseUsDescription
            }
            onChange={updateField(
              "whyChooseUsDescription"
            )}
          />
        </div>

        <div className="mt-6 space-y-5">
          {form.reasons.map(
            (
              item,
              index
            ) => (
              <ListEditor
                key={index}
                item={item}
                index={index}
                onUpdate={updateListItem(
                  "reasons",
                  index
                )}
                onRemove={() =>
                  removeItem(
                    "reasons",
                    index
                  )
                }
              />
            )
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            addItem("reasons")
          }
          className="mt-5 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          Add Reason
        </button>
      </Section>

      <Section
        title="About CTA"
        description="The labels are CMS-controlled. The actual destinations remain controlled by the application so an editor cannot accidentally create a broken route."
      >
        <div className="grid gap-5">
          <Field
            label="CTA Title"
            value={
              form.ctaTitle
            }
            onChange={updateField(
              "ctaTitle"
            )}
          />

          <TextArea
            label="CTA Description"
            value={
              form.ctaDescription
            }
            onChange={updateField(
              "ctaDescription"
            )}
          />

          <Field
            label="Primary Button Label"
            value={
              form.ctaPrimaryLabel
            }
            onChange={updateField(
              "ctaPrimaryLabel"
            )}
          />

          <Field
            label="Secondary Button Label"
            value={
              form.ctaSecondaryLabel
            }
            onChange={updateField(
              "ctaSecondaryLabel"
            )}
          />

          <Field
            label="Secondary Button Route"
            value={
              form.ctaSecondaryHref
            }
            onChange={updateField(
              "ctaSecondaryHref"
            )}
            placeholder="/office-bearers"
          />
        </div>
      </Section>

      <div className="sticky bottom-4 z-20 flex justify-end rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur">
        <button
          type="submit"
          disabled={saving}
          className="min-w-44 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : "Save About Settings"}
        </button>
      </div>
    </form>
  );
}

function MediaUpload({
  title,
  value,
  loading,
  circular = false,
  onChange,
}: {
  title: string;
  value: string;
  loading: boolean;
  circular?: boolean;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {value ? (
          <img
            src={value}
            alt={title}
            className={`h-32 w-32 shrink-0 object-cover ${
              circular
                ? "rounded-full"
                : "rounded-2xl"
            }`}
          />
        ) : (
          <div
            className={`flex h-32 w-32 shrink-0 items-center justify-center bg-slate-200 text-center text-xs text-slate-500 ${
              circular
                ? "rounded-full"
                : "rounded-2xl"
            }`}
          >
            No image
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            JPG, PNG or WebP. Maximum 10 MB.
          </p>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onChange}
            disabled={loading}
            className="mt-4 block w-full rounded-xl border border-slate-300 bg-white p-3 text-sm"
          />

          {loading && (
            <p className="mt-2 text-sm font-medium text-blue-700">
              Uploading...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
