"use client";

import { useEffect, useState } from "react";

import GalleryTable from "@/components/admin/gallery/GalleryTable";
import GalleryForm from "@/components/admin/gallery/GalleryForm";

import {
  getGallery,
  createGallery,
  updateGallery,
  deleteGallery,
} from "@/services/galleryService";

import {
  Gallery,
  GalleryFormData,
} from "@/types/gallery";

import { toast } from "sonner";

export default function GalleryPage() {
  const [galleries, setGalleries] =
    useState<Gallery[]>([]);

  const [selectedGallery, setSelectedGallery] =
    useState<Gallery | null>(null);

  const [loading, setLoading] =
    useState(true);

  // GET GALLERY

  const fetchGallery = async () => {
    try {
      const data = await getGallery();

      setGalleries(data);
    } catch (error) {
      console.log(error);

      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // CREATE / UPDATE

  const handleSubmit = async (
    data: GalleryFormData
  ) => {
    try {
      // Frontend Validation

      if (!data.title.trim()) {
        toast.error("Title is required");
        return;
      }

      if (!data.category.trim()) {
        toast.error("Category is required");
        return;
      }

      if (!data.coverImage) {
        toast.error("Please select a cover image");
        return;
      }

      if (data.images.length === 0) {
        toast.error(
          "Please select at least one gallery image"
        );
        return;
      }

      if (selectedGallery) {
        const res = await updateGallery(
          selectedGallery._id,
          data
        ) as { success: boolean; message?: string };

        if (!res.success) {
          toast.error(
            res.message ||
              "Failed to update gallery"
          );
          return;
        }

        toast.success(
          "Gallery updated successfully"
        );
      } else {
        const res = await createGallery(
          data
        ) as { success: boolean; message?: string };

        if (!res.success) {
          toast.error(
            res.message ||
              "Failed to create gallery"
          );
          return;
        }

        toast.success(
          "Gallery created successfully"
        );
      }

      setSelectedGallery(null);

      fetchGallery();
    } catch (error) {
      console.log(error);

      toast.error(
        "Gallery operation failed"
      );
    }
  };

  // DELETE

  const handleDelete = async (
    id: string
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this gallery?"
      );

    if (!confirmDelete) return;

    try {
      const res = await deleteGallery(id) as { success: boolean; message?: string };

      if (!res.success) {
        toast.error(
          res.message ||
            "Failed to delete gallery"
        );
        return;
      }

      toast.success(
        "Gallery deleted successfully"
      );

      fetchGallery();
    } catch (error) {
      console.log(error);

      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading gallery...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Gallery Management
        </h1>

        <p className="mt-1 text-gray-500">
          Manage gallery albums,
          images and categories.
        </p>
      </div>

      <GalleryForm
        selectedGallery={
          selectedGallery
        }
        onSubmit={handleSubmit}
        onCancel={() =>
          setSelectedGallery(null)
        }
      />

      <GalleryTable
        galleries={galleries}
        onEdit={(gallery) =>
          setSelectedGallery(gallery)
        }
        onDelete={handleDelete}
      />
    </div>
  );
}
