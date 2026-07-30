"use client";

import { useState } from "react";
import RichTextEditor from "./RichTextEditor";
import FileUpload from "./FileUpload";
import { PressConference, PressConferenceFormData } from "@/types/pressConference";

interface PressConferenceFormProps {
  initialData?: PressConference;
  onSubmit: (data: PressConferenceFormData) => Promise<void>;
  submitting?: boolean;
}

export default function PressConferenceForm({
  initialData,
  onSubmit,
  submitting = false,
}: PressConferenceFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    venue: initialData?.venue || "",
    date: initialData?.date ? initialData.date.slice(0, 10) : "",
    description: initialData?.description || "",
    content: initialData?.content || "",
  });

  const [featuredImage, setFeaturedImage] =
    useState<File | null>(null);

  const [pdfFile, setPdfFile] =
    useState<File | null>(null);


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const data = {
      ...formData,
      featuredImage,
      pdfFile,
    };

    await onSubmit(data);
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border bg-white p-6"
    >

      <div>
        <label className="mb-2 block text-sm font-medium">
          Title
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full rounded-md border p-2"
          required
        />
      </div>


      <div>
        <label className="mb-2 block text-sm font-medium">
          Venue
        </label>

        <input
          type="text"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          className="w-full rounded-md border p-2"
          required
        />
      </div>


      <div>
        <label className="mb-2 block text-sm font-medium">
          Date
        </label>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full rounded-md border p-2"
          required
        />
      </div>


      <div>
        <label className="mb-2 block text-sm font-medium">
          Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-md border p-2"
        />
      </div>


      <div>
        <label className="mb-2 block text-sm font-medium">
          Content
        </label>

        <RichTextEditor
          value={formData.content}
          onChange={(value) =>
            setFormData({
              ...formData,
              content: value,
            })
          }
        />
      </div>


      <FileUpload
        type="image"
        value={initialData?.featuredImage}
        onChange={setFeaturedImage}
      />


      <FileUpload
        type="pdf"
        value={initialData?.pdfFile}
        onChange={setPdfFile}
      />


      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        {initialData
          ? "Updating..."
          : initialData ? "Update Press Conference" : "Save Press Conference"}
      </button>

    </form>
  );
}
