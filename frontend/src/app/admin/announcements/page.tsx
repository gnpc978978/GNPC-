"use client";

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

import AnnouncementFilters from "@/components/admin/announcements/AnnouncementFilters";
import AnnouncementTable from "@/components/admin/announcements/AnnouncementTable";
import AnnouncementForm, {
  AnnouncementFormData,
} from "@/components/admin/announcements/AnnouncementForm";

import { Announcement } from "@/types/announcement";

import { useAuth } from "@/context/AuthContext";

import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/services/announcementService";
export default function AnnouncementsPage() {
  const { token: contextToken } = useAuth();

const token =
  contextToken ||
  (typeof window !== "undefined"
    ? localStorage.getItem("token") || ""
    : "");

  const [announcements, setAnnouncements] =
    useState<Announcement[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editData, setEditData] =
    useState<Announcement | null>(null);

  const loadAnnouncements = async () => {
    if (!token) return;

    setLoading(true);

    const res = await getAnnouncements(
      token,
      search,
      status
    );

    if (res.success) {
      setAnnouncements(res.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadAnnouncements();
  }, [token, search, status]);

  const handleSubmit = async (
  data: AnnouncementFormData
) => {
  if (!token) return;

  try {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("content", data.content);
    formData.append("status", data.status);
    formData.append("publishDate", data.publishDate);

    if (data.image) {
      formData.append("image", data.image);
    }

    let res;

    if (editData) {
      res = await updateAnnouncement(
        editData._id,
        formData,
        token
      );
    } else {
      res = await createAnnouncement(
        formData,
        token
      );
    }

    if (res.success) {
      setShowForm(false);
      setEditData(null);

      await loadAnnouncements();
    } else {
      alert(res.message || "Failed to save announcement");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};

  const handleDelete = async (
    id: string
  ) => {
    if (!token) return;

    if (!confirm("Delete Announcement?"))
      return;

    const res =
      await deleteAnnouncement(
        id,
        token
      );

    if (res.success) {
      loadAnnouncements();
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold text-gray-800">
            Announcements
          </h1>

          <p className="text-sm text-gray-500">
            Manage press club announcements
          </p>

        </div>

        <button
          onClick={() => {
            setEditData(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          <FaPlus />
          Add Announcement
        </button>

      </div>

      {/* Form */}

      {showForm && (
        <AnnouncementForm
          initialData={
            editData
              ? {
                  title:
                    editData.title,
                  category:
                    editData.category,
                  description:
                    editData.description ||
                    "",
                  content:
                    editData.content ||
                    "",
                  status:
                    editData.status,
                  publishDate:
                    editData.publishDate ||
                    "",
                  image: null,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditData(null);
          }}
        />
      )}

      {/* Filters */}

      <AnnouncementFilters
        search={search}
        status={status}
        category={category}
        setSearch={setSearch}
        setStatus={setStatus}
        setCategory={setCategory}
        onReset={() => {
          setSearch("");
          setStatus("");
          setCategory("");
        }}
      />

      {/* Table */}

      <AnnouncementTable
        announcements={announcements}
        loading={loading}
        onView={(item) => {
          alert(item.title);
        }}
        onEdit={(item) => {
          setEditData(item);
          setShowForm(true);
        }}
        onDelete={handleDelete}
      />

    </div>
  );
}