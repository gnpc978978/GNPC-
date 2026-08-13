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
  process.env.NEXT_PUBLIC_API_URL || "";

type Objective = {
  title: string;
  description: string;
  icon: string;
};

type Reason = {
  title: string;
  description: string;
  icon: string;
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
  objectives: Objective[];

  presidentName: string;
  presidentDesignation: string;
  presidentMessage: string;
  presidentPhoto: string;

  whyChooseUsEyebrow: string;
  whyChooseUsTitle: string;
  whyChooseUsDescription: string;
  reasons: Reason[];

  ctaTitle: string;
  ctaDescription: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
};

const emptyObjective = (): Objective => ({
  title: "",
  description: "",
  icon: "",
});

const emptyReason = (): Reason => ({
  title: "",
  description: "",
  icon: "",
});

const defaultForm: AboutSettings = {
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
};

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const textareaClass =
  "mt-2 min-h-[120px] w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const sectionClass =
  "rounded-xl border border-slate-200 bg-white p-6 shadow-sm";

export default function AboutSettingsForm() {
  const [form, setForm] =
    useState<AboutSettings>(defaultForm);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [presidentPhotoFile, setPresidentPhotoFile] =
    useState<File | null>(null);

  const getToken = () =>
    typeof window !== "undefined"
      ? localStorage.getItem("token") || ""
      : "";

  const headers = () => ({
    Authorization: `Bearer ${getToken()}`,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/about-settings`
      );

      const data =
        response.data?.data ||
        response.data;

      setForm({
        ...defaultForm,
        ...data,
        objectives:
          Array.isArray(data?.objectives)
            ? data.objectives
            : [],
        reasons:
          Array.isArray(data?.reasons)
            ? data.reasons
            : [],
      });
    } catch (error) {
      console.error(
        "Failed to load About settings:",
        error
      );

      toast.error(
        "Unable to load About page content."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateField = (
    field: keyof AboutSettings,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateObjective = (
    index: number,
    field: keyof Objective,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      objectives: current.objectives.map(
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

  const addObjective = () => {
    setForm((current) => ({
      ...current,
      objectives: [
        ...current.objectives,
        emptyObjective(),
      ],
    }));
  };

  const removeObjective = (index: number) => {
    setForm((current) => ({
      ...current,
      objectives: current.objectives.filter(
        (_, itemIndex) =>
          itemIndex !== index
      ),
    }));
  };

  const updateReason = (
    index: number,
    field: keyof Reason,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      reasons: current.reasons.map(
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

  const addReason = () => {
    setForm((current) => ({
      ...current,
      reasons: [
        ...current.reasons,
        emptyReason(),
      ],
    }));
  };

  const removeReason = (index: number) => {
    setForm((current) => ({
      ...current,
      reasons: current.reasons.filter(
        (_, itemIndex) =>
          itemIndex !== index
      ),
    }));
  };

  const uploadImage = async (
    file: File,
    field: "image" | "presidentPhoto"
  ) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("field", field);

    const response = await axios.post(
      `${API_URL}/about-settings/upload`,
      formData,
      {
        headers: {
          ...headers(),
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return (
      response.data?.url ||
      response.data?.data?.url ||
      response.data?.data?.[field] ||
      ""
    );
  };

  const saveSettings = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (!form.heroTitle.trim()) {
      toast.error("Hero title is required.");
      return;
    }

    if (!form.heading.trim()) {
      toast.error(
        "About heading is required."
      );
      return;
    }

    try {
      setSaving(true);

      let updatedForm = {
        ...form,
      };

      /*
       * Upload About image if a new image
       * was selected.
       */
      if (imageFile) {
        setUploading(true);

        const imageUrl = await uploadImage(
          imageFile,
          "image"
        );

        if (imageUrl) {
          updatedForm = {
            ...updatedForm,
            image: imageUrl,
          };
        }

        setImageFile(null);
      }

      /*
       * Upload President photo if a new
       * photo was selected.
       */
      if (presidentPhotoFile) {
        setUploading(true);

        const photoUrl =
          await uploadImage(
            presidentPhotoFile,
            "presidentPhoto"
          );

        if (photoUrl) {
          updatedForm = {
            ...updatedForm,
            presidentPhoto: photoUrl,
          };
        }

        setPresidentPhotoFile(null);
      }

      setUploading(false);

      const response =
        await axios.put(
          `${API_URL}/about-settings`,
          updatedForm,
          {
            headers: headers(),
          }
        );

      const saved =
        response.data?.data ||
        updatedForm;

      setForm({
        ...defaultForm,
        ...saved,
        objectives:
          Array.isArray(saved.objectives)
            ? saved.objectives
            : [],
        reasons:
          Array.isArray(saved.reasons)
            ? saved.reasons
            : [],
      });

      /*
       * Tell any currently mounted public
       * page that CMS content changed.
       */
      window.dispatchEvent(
        new Event(
          "about-settings-updated"
        )
      );

      toast.success(
        "About page content saved successfully."
      );
    } catch (error) {
      console.error(
        "Failed to save About settings:",
        error
      );

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Unable to save About page content."
        );
      } else {
        toast.error(
          "Unable to save About page content."
        );
      }
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setImageFile(
      event.target.files?.[0] || null
    );
  };

  const handlePresidentPhotoChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setPresidentPhotoFile(
      event.target.files?.[0] || null
    );
  };

  if (loading) {
    return (
      <div className="space-y-5">
        {Array.from({ length: 5 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-xl bg-slate-200"
            />
          )
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={saveSettings}
      className="space-y-8"
    >
      {/* HERO */}
      <section className={sectionClass}>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            About Hero
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Everything displayed in the About page
            hero can be managed here.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold">
              Eyebrow
            </label>

            <input
              value={form.heroEyebrow}
              onChange={(event) =>
                updateField(
                  "heroEyebrow",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              Hero Title
            </label>

            <input
              value={form.heroTitle}
              onChange={(event) =>
                updateField(
                  "heroTitle",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              Hero Description
            </label>

            <textarea
              value={form.heroDescription}
              onChange={(event) =>
                updateField(
                  "heroDescription",
                  event.target.value
                )
              }
              className={textareaClass}
            />
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className={sectionClass}>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            About Introduction
          </h2>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold">
              About Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 block w-full rounded-lg border p-3"
            />

            {imageFile && (
              <p className="mt-2 text-xs text-slate-500">
                Selected: {imageFile.name}
              </p>
            )}

            {form.image && !imageFile && (
              <img
                src={form.image}
                alt="Current About image"
                className="mt-4 h-32 w-48 rounded-lg object-cover"
              />
            )}
          </div>

          <div>
            <label className="text-sm font-semibold">
              Heading
            </label>

            <input
              value={form.heading}
              onChange={(event) =>
                updateField(
                  "heading",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              Main Description
            </label>

            <textarea
              value={form.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value
                )
              }
              className={textareaClass}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              Secondary Description
            </label>

            <textarea
              value={
                form.secondaryDescription
              }
              onChange={(event) =>
                updateField(
                  "secondaryDescription",
                  event.target.value
                )
              }
              className={textareaClass}
            />
          </div>
        </div>
      </section>

      {/* COMMITMENT */}
      <section className={sectionClass}>
        <h2 className="mb-6 text-xl font-bold text-slate-900">
          Commitment
        </h2>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold">
              Title
            </label>

            <input
              value={form.commitmentTitle}
              onChange={(event) =>
                updateField(
                  "commitmentTitle",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              Description
            </label>

            <textarea
              value={
                form.commitmentDescription
              }
              onChange={(event) =>
                updateField(
                  "commitmentDescription",
                  event.target.value
                )
              }
              className={textareaClass}
            />
          </div>
        </div>
      </section>

      {/* MISSION / VISION */}
      <section className={sectionClass}>
        <h2 className="mb-6 text-xl font-bold text-slate-900">
          Mission & Vision
        </h2>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold">
              Eyebrow
            </label>

            <input
              value={
                form.foundationEyebrow
              }
              onChange={(event) =>
                updateField(
                  "foundationEyebrow",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              Section Title
            </label>

            <input
              value={
                form.foundationTitle
              }
              onChange={(event) =>
                updateField(
                  "foundationTitle",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              Section Description
            </label>

            <textarea
              value={
                form.foundationDescription
              }
              onChange={(event) =>
                updateField(
                  "foundationDescription",
                  event.target.value
                )
              }
              className={textareaClass}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold">
                Mission Title
              </label>

              <input
                value={
                  form.missionTitle
                }
                onChange={(event) =>
                  updateField(
                    "missionTitle",
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                Vision Title
              </label>

              <input
                value={
                  form.visionTitle
                }
                onChange={(event) =>
                  updateField(
                    "visionTitle",
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">
              Mission Description
            </label>

            <textarea
              value={
                form.missionDescription
              }
              onChange={(event) =>
                updateField(
                  "missionDescription",
                  event.target.value
                )
              }
              className={textareaClass}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              Vision Description
            </label>

            <textarea
              value={
                form.visionDescription
              }
              onChange={(event) =>
                updateField(
                  "visionDescription",
                  event.target.value
                )
              }
              className={textareaClass}
            />
          </div>
        </div>
      </section>

      {/* OBJECTIVES */}
      <section className={sectionClass}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Objectives
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add, edit or remove objectives shown
              publicly.
            </p>
          </div>

          <button
            type="button"
            onClick={addObjective}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + Add Objective
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold">
              Eyebrow
            </label>

            <input
              value={
                form.objectivesEyebrow
              }
              onChange={(event) =>
                updateField(
                  "objectivesEyebrow",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              Section Title
            </label>

            <input
              value={
                form.objectivesTitle
              }
              onChange={(event) =>
                updateField(
                  "objectivesTitle",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              Section Description
            </label>

            <textarea
              value={
                form.objectivesDescription
              }
              onChange={(event) =>
                updateField(
                  "objectivesDescription",
                  event.target.value
                )
              }
              className={textareaClass}
            />
          </div>

          {form.objectives.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              No objectives added yet.
            </div>
          )}

          {form.objectives.map(
            (objective, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">
                    Objective {index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      removeObjective(index)
                    }
                    className="text-sm font-semibold text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold">
                      Title
                    </label>

                    <input
                      value={
                        objective.title
                      }
                      onChange={(event) =>
                        updateObjective(
                          index,
                          "title",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold">
                      Description
                    </label>

                    <textarea
                      value={
                        objective.description
                      }
                      onChange={(event) =>
                        updateObjective(
                          index,
                          "description",
                          event.target.value
                        )
                      }
                      className={textareaClass}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold">
                      Icon Name
                    </label>

                    <input
                      value={
                        objective.icon
                      }
                      onChange={(event) =>
                        updateObjective(
                          index,
                          "icon",
                          event.target.value
                        )
                      }
                      className={inputClass}
                      placeholder="target"
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* PRESIDENT */}
      <section className={sectionClass}>
        <h2 className="mb-6 text-xl font-bold text-slate-900">
          President Message
        </h2>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold">
              President Name
            </label>

            <input
              value={
                form.presidentName
              }
              onChange={(event) =>
                updateField(
                  "presidentName",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              Designation
            </label>

            <input
              value={
                form.presidentDesignation
              }
              onChange={(event) =>
                updateField(
                  "presidentDesignation",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              President Message
            </label>

            <textarea
              value={
                form.presidentMessage
              }
              onChange={(event) =>
                updateField(
                  "presidentMessage",
                  event.target.value
                )
              }
              className="mt-2 min-h-[220px] w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              President Photo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={
                handlePresidentPhotoChange
              }
              className="mt-2 block w-full rounded-lg border p-3"
            />

            {presidentPhotoFile && (
              <p className="mt-2 text-xs text-slate-500">
                Selected:{" "}
                {presidentPhotoFile.name}
              </p>
            )}

            {form.presidentPhoto &&
              !presidentPhotoFile && (
                <img
                  src={
                    form.presidentPhoto
                  }
                  alt="Current president"
                  className="mt-4 h-32 w-32 rounded-full object-cover"
                />
              )}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className={sectionClass}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Why Choose Us
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage the heading and every public
              reason card.
            </p>
          </div>

          <button
            type="button"
            onClick={addReason}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + Add Reason
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold">
              Eyebrow
            </label>

            <input
              value={
                form.whyChooseUsEyebrow
              }
              onChange={(event) =>
                updateField(
                  "whyChooseUsEyebrow",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              Section Title
            </label>

            <input
              value={
                form.whyChooseUsTitle
              }
              onChange={(event) =>
                updateField(
                  "whyChooseUsTitle",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              Section Description
            </label>

            <textarea
              value={
                form.whyChooseUsDescription
              }
              onChange={(event) =>
                updateField(
                  "whyChooseUsDescription",
                  event.target.value
                )
              }
              className={textareaClass}
            />
          </div>

          {form.reasons.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              No reasons added yet.
            </div>
          )}

          {form.reasons.map(
            (reason, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">
                    Reason {index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      removeReason(index)
                    }
                    className="text-sm font-semibold text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold">
                      Title
                    </label>

                    <input
                      value={
                        reason.title
                      }
                      onChange={(event) =>
                        updateReason(
                          index,
                          "title",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold">
                      Description
                    </label>

                    <textarea
                      value={
                        reason.description
                      }
                      onChange={(event) =>
                        updateReason(
                          index,
                          "description",
                          event.target.value
                        )
                      }
                      className={textareaClass}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold">
                      Icon Name
                    </label>

                    <input
                      value={
                        reason.icon
                      }
                      onChange={(event) =>
                        updateReason(
                          index,
                          "icon",
                          event.target.value
                        )
                      }
                      className={inputClass}
                      placeholder="shield-check"
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* CTA */}
      <section className={sectionClass}>
        <h2 className="mb-6 text-xl font-bold text-slate-900">
          About Page CTA
        </h2>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold">
              CTA Title
            </label>

            <input
              value={form.ctaTitle}
              onChange={(event) =>
                updateField(
                  "ctaTitle",
                  event.target.value
                )
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              CTA Description
            </label>

            <textarea
              value={
                form.ctaDescription
              }
              onChange={(event) =>
                updateField(
                  "ctaDescription",
                  event.target.value
                )
              }
              className={textareaClass}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold">
                Primary Button Label
              </label>

              <input
                value={
                  form.ctaPrimaryLabel
                }
                onChange={(event) =>
                  updateField(
                    "ctaPrimaryLabel",
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                Secondary Button Label
              </label>

              <input
                value={
                  form.ctaSecondaryLabel
                }
                onChange={(event) =>
                  updateField(
                    "ctaSecondaryLabel",
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SAVE */}
      <div className="sticky bottom-4 z-20 flex justify-end">
        <button
          type="submit"
          disabled={
            saving || uploading
          }
          className="rounded-xl bg-blue-600 px-8 py-3 font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading
            ? "Uploading..."
            : saving
              ? "Saving..."
              : "Save About Page"}
        </button>
      </div>
    </form>
  );
}
