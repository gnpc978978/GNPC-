"use client";

import { useEffect, useState } from "react";
import {
  authenticatedFetch,
  responseJson,
} from "@/services/api";

type Activity = {
  _id: string;
  description?: string;
  action?: string;
  module?: string;
  createdAt: string;
};

const formatActivityTime = (
  value: string
) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  const diff =
    Date.now() - date.getTime();

  const seconds = Math.floor(
    diff / 1000
  );

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(
    seconds / 60
  );

  if (minutes < 60) {
    return `${minutes} minute${
      minutes === 1 ? "" : "s"
    } ago`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours} hour${
      hours === 1 ? "" : "s"
    } ago`;
  }

  const days = Math.floor(
    hours / 24
  );

  if (days < 30) {
    return `${days} day${
      days === 1 ? "" : "s"
    } ago`;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
};

export default function RecentActivities() {
  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showAll, setShowAll] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchActivities = async () => {
      try {
        const response =
          await authenticatedFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/activities`,
            {
              method: "GET",
            }
          );

        const result =
          await responseJson<{
            success: boolean;
            data: Activity[];
          }>(response);

        if (mounted && result.success) {
          setActivities(
            Array.isArray(result.data)
              ? result.data
              : []
          );
        }
      } catch (error) {
        console.error(
          "Activity Error:",
          error
        );

        if (mounted) {
          setActivities([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchActivities();

    const interval =
      window.setInterval(
        fetchActivities,
        60000
      );

    return () => {
      mounted = false;
      window.clearInterval(
        interval
      );
    };
  }, []);

  const visibleActivities = showAll
    ? activities
    : activities.slice(0, 7);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">
          Recent Activities
        </h2>

        {activities.length > 7 && (
          <button
            type="button"
            onClick={() =>
              setShowAll(
                (value) => !value
              )
            }
            className="text-sm font-semibold text-blue-600 transition hover:text-blue-800"
          >
            {showAll
              ? "Show Less"
              : "See More"}
          </button>
        )}
      </div>

      <div className="mt-5 space-y-4">
        {loading ? (
          <p className="text-sm text-slate-400">
            Loading activities...
          </p>
        ) : activities.length === 0 ? (
          <p className="text-sm text-slate-400">
            No recent activities.
          </p>
        ) : (
          visibleActivities.map(
            (item) => (
              <div
                key={item._id}
                className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700">
                    {item.description ||
                      "Activity"}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {item.action ||
                      "Activity"}{" "}
                    ·{" "}
                    {item.module ||
                      "System"}
                  </p>
                </div>

                <span
                  className="whitespace-nowrap text-xs text-slate-400"
                  title={new Date(
                    item.createdAt
                  ).toLocaleString(
                    "en-IN",
                    {
                      dateStyle:
                        "medium",
                      timeStyle:
                        "short",
                    }
                  )}
                >
                  {formatActivityTime(
                    item.createdAt
                  )}
                </span>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}
