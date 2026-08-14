"use client";

import Link from "next/link";
import { authenticatedApiFetch, responseJson } from "@/services/api";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  FaArrowLeft,
  FaEdit,
} from "react-icons/fa";

import StatusBadge from "@/components/admin/press-releases/StatusBadge";

type PressRelease = {
  _id: string;
  title: string;
  content: string;
  category: string;
  status: string;
  image?: string;
  createdAt?: string;
  createdBy?: {
    name?: string;
    email?: string;
  };
};

export default function ViewPressReleasePage() {
  const { id } =
    useParams<{ id: string }>();

  const [pressRelease, setPressRelease] =
    useState<PressRelease | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    if (!id) return;

    authenticatedApiFetch(
      `/press-releases/${encodeURIComponent(id)}`,
      { method: "GET" }
    )
      .then((response) =>
        responseJson<{ data?: PressRelease; message?: string }>(response)
      )
      .then((data) => {
        setPressRelease(data.data);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        Loading Press Release...
      </div>
    );
  }

  if (error || !pressRelease) {
    return (
      <div className="rounded-xl bg-white p-8 shadow">

        <h1 className="text-xl font-bold">
          Press Release Not Found
        </h1>

        <Link
          href="/admin/press-releases"
          className="mt-4 inline-block text-blue-600"
        >
          ← Back to Press Releases
        </Link>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            View Press Release
          </h1>

          <p className="text-gray-500">
            Press release details
          </p>
        </div>

        <div className="flex gap-3">

          <Link
            href="/admin/press-releases"
            className="flex items-center gap-2 rounded-lg border px-5 py-3 hover:bg-gray-100"
          >
            <FaArrowLeft />
            Back
          </Link>

          <Link
            href={`/admin/press-releases/edit/${pressRelease._id}`}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            <FaEdit />
            Edit
          </Link>

        </div>

      </div>

      <div className="rounded-xl bg-white p-8 shadow">

        {pressRelease.image && (
          <img
            src={pressRelease.image}
            alt={pressRelease.title}
            className="mb-8 max-h-[400px] w-full rounded-xl object-cover"
          />
        )}

        <h2 className="text-2xl font-bold text-gray-900">
          {pressRelease.title}
        </h2>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">

          <span>
            Category:{" "}
            {pressRelease.category}
          </span>

          <span>
            Author:{" "}
            {pressRelease.createdBy?.name ||
              "Admin"}
          </span>

          {pressRelease.createdAt && (
            <span>
              Date:{" "}
              {new Date(
                pressRelease.createdAt
              ).toLocaleDateString("en-IN")}
            </span>
          )}

          <StatusBadge
            status={pressRelease.status}
          />

        </div>

        <hr className="my-6" />

        <div>

          <h3 className="mb-3 text-lg font-semibold">
            Content
          </h3>

          <div className="whitespace-pre-line leading-7 text-gray-700">
            {pressRelease.content}
          </div>

        </div>

      </div>

    </div>
  );
}
