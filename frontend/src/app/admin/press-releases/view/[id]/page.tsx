"use client";

import Link from "next/link";
import {
  authenticatedApiFetch,
  responseJson,
} from "@/services/api";
import {
  useEffect,
  useState,
} from "react";
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

type PressReleaseResponse = {
  data?: PressRelease;
  message?: string;
};

export default function ViewPressReleasePage() {
  const { id } =
    useParams<{ id: string }>();

  const [
    pressRelease,
    setPressRelease,
  ] = useState<PressRelease | null>(
    null
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError(true);
      return;
    }

    const loadPressRelease =
      async () => {
        try {
          setLoading(true);
          setError(false);

          const response =
            await authenticatedApiFetch(
              `/press-releases/${encodeURIComponent(
                id
              )}`,
              {
                method: "GET",
              }
            );

          const data =
            await responseJson<PressReleaseResponse>(
              response
            );

          if (data.data) {
            setPressRelease(
              data.data
            );
          } else {
            setPressRelease(null);
            setError(true);
          }
        } catch (requestError) {
          console.error(
            "Failed to load press release:",
            requestError
          );

          setPressRelease(null);
          setError(true);
        } finally {
          setLoading(false);
        }
      };

    void loadPressRelease();
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            View Press Release
          </h1>

          <p className="text-gray-500">
            Press release details
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/press-releases"
            className="flex items-center gap-2 rounded-lg border px-5 py-3 hover:bg-gray-100"
          >
            <FaArrowLeft
              aria-hidden="true"
            />
            Back
          </Link>

          <Link
            href={`/admin/press-releases/edit/${pressRelease._id}`}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            <FaEdit
              aria-hidden="true"
            />
            Edit
          </Link>
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow sm:p-8">
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
              ).toLocaleDateString(
                "en-IN"
              )}
            </span>
          )}

          <StatusBadge
            status={
              pressRelease.status
            }
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
