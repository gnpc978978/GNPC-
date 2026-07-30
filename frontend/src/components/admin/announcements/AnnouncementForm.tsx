"use client";

import { useState } from "react";

export interface AnnouncementFormData {
  title: string;
  category: string;
  description: string;
  content: string;
  status: "Draft" | "Published";
  publishDate: string;
  image: File | null;
}

interface AnnouncementFormProps {
  initialData?: AnnouncementFormData;
  onSubmit: (data: AnnouncementFormData) => void;
  onCancel?: () => void;
}

export default function AnnouncementForm({
  initialData,
  onSubmit,
  onCancel,
}: AnnouncementFormProps) {
  const [formData, setFormData] =
    useState<AnnouncementFormData>({
      title: initialData?.title || "",
      category: initialData?.category || "",
      description: initialData?.description || "",
      content: initialData?.content || "",
      status: initialData?.status || "Draft",
      publishDate: initialData?.publishDate || "",
      image: null,
    });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.length) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files![0],
      }));
    }
  };

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          {initialData
            ? "Edit Announcement"
            : "Create Announcement"}
        </h2>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Title
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Announcement title"
          className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
          >
            <option value="">
              Select Category
            </option>

            <option value="Event">
              Event
            </option>

            <option value="Notice">
              Notice
            </option>

            <option value="General">
              General
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
          >
            <option value="Draft">
              Draft
            </option>

            <option value="Published">
              Published
            </option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Publish Date
        </label>

        <input
          type="datetime-local"
          name="publishDate"
          value={formData.publishDate}
          onChange={handleChange}
          className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Announcement Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full rounded-lg border px-4 py-2"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Short Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Short announcement description"
          className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Content
        </label>

        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={8}
          placeholder="Full announcement content"
          className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Save Announcement
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-gray-100 px-6 py-2 font-semibold text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}