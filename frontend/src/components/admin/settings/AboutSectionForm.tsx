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
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "";

type ListItem = {
  title: string;
  description: string;
  icon: string;
};

type ListField = "objectives" | "reasons";

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
};

const emptyItem = (): ListItem => ({
  title: "",
  description: "",
  icon: "",
});

const defaultForm: AboutSettings = {
  heroEyebrow: "About Greater Noida Press Club",

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

  commitmentTitle: "Our Commitment",

  commitmentDescription:
    "We are committed to protecting journalistic values, encouraging transparency, and building a stronger media community through education, collaboration, and innovation.",

  foundationEyebrow: "Our Foundation",

  foundationTitle: "Mission & Vision",

  foundationDescription:
    "We are committed to ethical journalism, professional excellence, and empowering media professionals through collaboration and innovation.",

  missionTitle: "Our Mission",

  missionDescription:
    "To support journalists with professional development, transparency, ethical reporting, and a strong platform that protects press freedom.",

  visionTitle: "Our Vision",

  visionDescription:
    "To build a trusted community where journalists collaborate, innovate, and contribute to an informed and democratic society.",

  objectivesEyebrow: "Our Objectives",

  objectivesTitle: "What We Aim To Achieve",

  objectivesDescription:
    "Our primary objective is to strengthen journalism through education, collaboration, innovation, and ethical reporting.",

  objectives: [],

  presidentName: "",
  presidentDesignation: "",
  presidentMessage: "",
  presidentPhoto: "",

  whyChooseUsEyebrow: "Why Choose Us",

  whyChooseUsTitle:
    "Why Greater Noida Press Club Matters",

  whyChooseUsDescription:
    "We provide a trusted platform for journalists to connect, collaborate, and grow while maintaining the highest standards of journalism.",

  reasons: [],

  ctaTitle:
    "Become a Part of Our Greater Noida Press Club",

  ctaDescription:
    "Join a community dedicated to ethical journalism, professional growth, networking, and media excellence. Together we build a stronger voice for journalists.",

  ctaPrimaryLabel: "Become a Member",

  ctaSecondaryLabel: "Meet Our Office Bearers",
};

const getAuthHeaders = () => ({
  Authorization: `Bearer ${
    typeof window !== "undefined"
      ? localStorage.getItem("token") || ""
      : ""
  }`,
});

export default function AboutSectionForm() {
  const [form, setForm] =
    useState<AboutSettings>(defaultForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] =
    useState(false);
  const [uploadingPresident, setUploadingPresident] =
    useState(false);

  const loadSettings = async () => {
    try {
      setLoading(true);

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

      const data = response.data?.data || {};

      setForm({
        ...defaultForm,
        ...data,

        objectives: Array.isArray(data.objectives)
          ? data.objectives
          : [],

        reasons: Array.isArray(data.reasons)
          ? data.reasons
          : [],
      });
    } catch (error) {
      console.error(
        "Failed to load About settings:",
        error
      );

      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ||
              "Unable to load About settings."
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
    (field: keyof AboutSettings) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
    ) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  /*
   * IMPORTANT:
   *
   * ListEditor expects:
   *
   * onUpdate(property)(event)
   *
   * Therefore updateListItem must return a function
   * that receives the property first, and then returns
   * the actual input change handler.
   */
  const updateListItem =
    (field: ListField, index: number) =>
    (property: keyof ListItem) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
    ) => {
      const value = event.target.value;

      setForm((current) => ({
        ...current,
        [field]: current[field].map(
          (item, itemIndex) =>
            itemIndex === index
              ? {
                  ...item,
                  [property]: value,
                }
              : item
        ),
      }));
    };

  const addItem = (field: ListField) => {
    setForm((current) => ({
      ...current,
      [field]: [
        ...current[field],
        emptyItem(),
      ],
    }));
  };

  const removeItem = (
    field: ListField,
    index: number
  ) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  const saveSettings = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);

      if (!API_URL) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not configured."
        );
      }

      const payload = {
        ...form,

        objectives: form.objectives.map(
          (item) => ({
            title: item.title.trim(),
            description:
              item.description.trim(),
            icon: item.icon.trim(),
          })
        ),

        reasons: form.reasons.map(
          (item) => ({
            title: item.title.trim(),
            description:
              item.description.trim(),
            icon: item.icon.trim(),
          })
        ),
      };

      const response = await axios.put(
        `${API_URL}/settings/about`,
        payload,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          withCredentials: true,
          timeout: 15000,
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Unable to save About settings."
        );
      }

      const savedData = response.data?.data;

      if (savedData) {
        setForm({
          ...defaultForm,
          ...savedData,

          objectives:
            Array.isArray(
              savedData.objectives
            )
              ? savedData.objectives
              : [],

          reasons:
            Array.isArray(savedData.reasons)
              ? savedData.reasons
              : [],
        });
      }

      window.dispatchEvent(
        new Event("about-settings-updated")
      );

      toast.success(
        "About page saved successfully."
      );
    } catch (error) {
      console.error(
        "Failed to save About settings:",
        error
      );

      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ||
              "Unable to save About settings."
          : error instanceof Error
            ? error.message
            : "Unable to save About settings."
      );
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (
    field: "image" | "presidentPhoto",
    file: File
  ) => {
    try {
      if (!API_URL) {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not configured."
        );
      }

      if (!file.type.startsWith("image/")) {
        toast.error(
          "Please select an image file."
        );
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error(
          "Image must be smaller than 10 MB."
        );
        return;
      }

      if (field === "image") {
        setUploadingImage(true);
      } else {
        setUploadingPresident(true);
      }

      const payload = new FormData();

      payload.append(field, file);

      const response = await axios.post(
        `${API_URL}/settings/about/upload`,
        payload,
        {
          headers: {
            ...getAuthHeaders(),
          },
          withCredentials: true,
          timeout: 30000,
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Unable to upload image."
        );
      }

      const updated = response.data?.data;

      if (updated) {
        setForm((current) => ({
          ...current,
          ...updated,
        }));
      }

      window.dispatchEvent(
        new Event("about-settings-updated")
      );

      toast.success(
        field === "image"
          ? "About image uploaded."
          : "President photo uploaded."
      );
    } catch (error) {
      console.error(
        "About image upload failed:",
        error
      );

      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message ||
              "Unable to upload image."
          : error instanceof Error
            ? error.message
            : "Unable to upload image."
      );
    } finally {
      setUploadingImage(false);
      setUploadingPresident(false);
    }
  };

  const handleImageChange =
    (
      field: "image" | "presidentPhoto"
    ) =>
    (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      void uploadImage(field, file);

      event.target.value = "";
    };

  if (loading) {
    return (
      <div className="space-y-5 rounded-xl bg-white p-6 shadow">
        <div className="h-8 w-1/3 animate-pulse rounded bg-slate-200" />

        <div className="h-12 animate-pulse rounded bg-slate-200" />

        <div className="h-28 animate-pulse rounded bg-slate-200" />

        <div className="h-28 animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  return (
    <form
      onSubmit={saveSettings}
      className="space-y-8"
    >
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="rounded-2xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-900">
          Hero Section
        </h2>

        <div className="mt-6 grid gap-5">
          <Field
            label="Eyebrow"
            value={form.heroEyebrow}
            onChange={updateField(
              "heroEyebrow"
            )}
          />

          <Field
            label="Title"
            value={form.heroTitle}
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
      </section>

      {/* =====================================================
          INTRO
      ====================================================== */}
      <section className="rounded-2xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold">
          About Introduction
        </h2>

        <div className="mt-6 grid gap-5">
          <Field
            label="Heading"
            value={form.heading}
            onChange={updateField(
              "heading"
            )}
          />

          <TextArea
            label="Description"
            value={form.description}
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
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold">
            About Image
          </h3>

          {form.image && (
            <img
              src={form.image}
              alt="Current About"
              className="mt-4 h-40 w-full rounded-lg object-cover"
            />
          )}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange(
              "image"
            )}
            className="mt-4 block w-full rounded-lg border p-3"
          />

          {uploadingImage && (
            <p className="mt-2 text-sm text-blue-600">
              Uploading image...
            </p>
          )}
        </div>
      </section>

      {/* =====================================================
          MISSION / VISION
      ====================================================== */}
      <section className="rounded-2xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold">
          Mission & Vision
        </h2>

        <div className="mt-6 grid gap-5">
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
      </section>

      {/* =====================================================
          OBJECTIVES
      ====================================================== */}
      <section className="rounded-2xl bg-white p-6 shadow">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold">
              Objectives
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              These values appear on the public About page.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              addItem("objectives")
            }
            className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800"
          >
            Add Objective
          </button>
        </div>

        <div className="mt-6 grid gap-5">
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
            (item, index) => (
              <ListEditor
                key={index}
                index={index}
                item={item}
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
      </section>

      {/* =====================================================
          PRESIDENT
      ====================================================== */}
      <section className="rounded-2xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold">
          President
        </h2>

        <div className="mt-6 grid gap-5">
          <Field
            label="Name"
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
          />
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold">
            President Photo
          </h3>

          {form.presidentPhoto && (
            <img
              src={
                form.presidentPhoto
              }
              alt={
                form.presidentName ||
                "President"
              }
              className="mt-4 h-40 w-40 rounded-full object-cover"
            />
          )}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange(
              "presidentPhoto"
            )}
            className="mt-4 block w-full rounded-lg border p-3"
          />

          {uploadingPresident && (
            <p className="mt-2 text-sm text-blue-600">
              Uploading president photo...
            </p>
          )}
        </div>
      </section>

      {/* =====================================================
          WHY CHOOSE US
      ====================================================== */}
      <section className="rounded-2xl bg-white p-6 shadow">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold">
              Why Choose Us
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              These values appear on the public About page.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              addItem("reasons")
            }
            className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800"
          >
            Add Reason
          </button>
        </div>

        <div className="mt-6 grid gap-5">
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
            (item, index) => (
              <ListEditor
                key={index}
                index={index}
                item={item}
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
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="rounded-2xl border-2 border-blue-100 bg-blue-50 p-6 shadow">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            Public About Page
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            Call To Action
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Every field below is rendered directly
            in the public About page CTA.
          </p>
        </div>

        <div className="mt-6 grid gap-5">
          <Field
            label="CTA Title"
            value={form.ctaTitle}
            onChange={updateField(
              "ctaTitle"
            )}
            placeholder="Become a Part of Our Greater Noida Press Club"
          />

          <TextArea
            label="CTA Description"
            value={
              form.ctaDescription
            }
            onChange={updateField(
              "ctaDescription"
            )}
            placeholder="CTA description shown on the public About page"
          />

          <Field
            label="Primary Button Label"
            value={
              form.ctaPrimaryLabel
            }
            onChange={updateField(
              "ctaPrimaryLabel"
            )}
            placeholder="Become a Member"
          />

          <Field
            label="Secondary Button Label"
            value={
              form.ctaSecondaryLabel
            }
            onChange={updateField(
              "ctaSecondaryLabel"
            )}
            placeholder="Meet Our Office Bearers"
          />
        </div>

        <div className="mt-6 rounded-xl bg-white p-5 ring-1 ring-blue-100">
          <p className="text-sm font-semibold text-slate-900">
            Button routing
          </p>

          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <p>
              Primary button → CMS membership
              form endpoint.
            </p>

            <p>
              Secondary button →{" "}
              <span className="font-semibold text-slate-900">
                /office-bearers
              </span>
            </p>

            <p>
              Button labels themselves are
              controlled by the CMS fields above.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          SAVE
      ====================================================== */}
      <div className="sticky bottom-4 z-20 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-blue-700 px-8 py-3.5 font-bold text-white shadow-xl transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : "Save About Settings"}
        </button>
      </div>
    </form>
  );
}

/* =========================================================
   REUSABLE FIELD
========================================================= */

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
    <div>
      <label className="block text-sm font-semibold text-slate-800">
        {label}
      </label>

      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

/* =========================================================
   REUSABLE TEXTAREA
========================================================= */

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-800">
        {label}
      </label>

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={5}
        className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

/* =========================================================
   OBJECTIVE / REASON EDITOR
========================================================= */

function ListEditor({
  index,
  item,
  onUpdate,
  onRemove,
}: {
  index: number;
  item: ListItem;

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
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-bold text-slate-900">
          Item {index + 1}
        </h3>

        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          Remove
        </button>
      </div>

      <div className="mt-4 grid gap-4">
        <div>
          <label className="block text-sm font-semibold">
            Icon Name
          </label>

          <input
            value={item.icon}
            onChange={onUpdate("icon")}
            placeholder="Target"
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">
            Title
          </label>

          <input
            value={item.title}
            onChange={onUpdate("title")}
            placeholder="Objective title"
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">
            Description
          </label>

          <textarea
            value={item.description}
            onChange={onUpdate("description")}
            rows={4}
            placeholder="Objective description"
            className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3"
          />
        </div>
      </div>
    </div>
  );
}
