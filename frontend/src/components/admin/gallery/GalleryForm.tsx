"use client";

import { useEffect, useState } from "react";

import {
  Gallery,
  GalleryFormData,
} from "@/types/gallery";

import CoverUploader from "./CoverUploader";
import ImageUploader from "./ImageUploader";

interface Props {
  selectedGallery?: Gallery | null;
  onSubmit: (data: GalleryFormData) => void;
  onCancel: () => void;
}

const initialForm: GalleryFormData = {
  title: "",
  coverImage: null,
  images: [],
  category: "",
  description: "",
  status: "active",
};

export default function GalleryForm({
  selectedGallery,
  onSubmit,
  onCancel,
}: Props) {
  const [formData, setFormData] =
    useState<GalleryFormData>(initialForm);

  useEffect(() => {
    if (selectedGallery) {
      setFormData({
        title: selectedGallery.title,

        // Existing image URL backend me hai,
        // yaha sirf nayi file upload hogi.
        coverImage: null,

        images: [],

        category: selectedGallery.category,

        description:
          selectedGallery.description,

        status: selectedGallery.status,
      });
    } else {
      setFormData(initialForm);
    }
  }, [selectedGallery]);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    await onSubmit(formData);

    setFormData(initialForm);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border p-5"
    >
      <input
        className="w-full rounded border p-2"
        placeholder="Gallery Title"
        value={formData.title}
        onChange={(e) =>
          setFormData({
            ...formData,
            title: e.target.value,
          })
        }
        required
      />

      <input
        className="w-full rounded border p-2"
        placeholder="Category"
        value={formData.category}
        onChange={(e) =>
          setFormData({
            ...formData,
            category: e.target.value,
          })
        }
        required
      />

      <textarea
        className="w-full rounded border p-2"
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({
            ...formData,
            description: e.target.value,
          })
        }
      />

      <select
        className="w-full rounded border p-2"
        value={formData.status}
        onChange={(e) =>
          setFormData({
            ...formData,
            status:
              e.target.value as
                | "active"
                | "inactive",
          })
        }
      >
        <option value="active">
          Active
        </option>

        <option value="inactive">
          Inactive
        </option>
      </select>

      <CoverUploader
        image={formData.coverImage}
        setImage={(image) =>
          setFormData({
            ...formData,
            coverImage: image,
          })
        }
      />

      <ImageUploader
        images={formData.images}
        setImages={(images) =>
          setFormData({
            ...formData,
            images,
          })
        }
      />

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded bg-blue-600 px-5 py-2 text-white"
        >
          {selectedGallery
            ? "Update Gallery"
            : "Create Gallery"}
        </button>

        <button
          type="button"
          onClick={() => {
            setFormData(initialForm);
            onCancel();
          }}
          className="rounded border px-5 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}