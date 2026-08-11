"use client";

import { useEffect, useState } from "react";
import {
  authenticatedFetch,
  responseJson,
} from "@/services/api";

interface Activity {
  _id: string;
  action: string;
  module: string;
  description: string;
  createdAt: string;
  user?: {
    name?: string;
    email?: string;
  };
}

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const difference = now.getTime() - date.getTime();

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/activities`,
        {
          method: "GET",
        }
      );

      const result = await responseJson<{
        success: boolean;
        data: Activity[];
      }>(response);

      if (result.success) {
        setActivities(result.data);
      }
    } catch (error) {
      console.error("Activity Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();

    const interval = setInterval(() => {
      fetchActivities();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="
        rounded-2xl
        bg-white
        p-6
        shadow-sm
      "
    >
      <h2
        className="
          text-lg
          font-bold
          text-slate-900
        "
      >
        Recent Activities
      </h2>

      <div
        className="
          mt-5
          space-y-4
        "
      >
        {loading ? (
          <p className="text-sm text-slate-400">
            Loading activities...
          </p>
        ) : activities.length === 0 ? (
          <p className="text-sm text-slate-400">
            No recent activities.
          </p>
        ) : (
          activities.map((item) => (
            <div
              key={item._id}
              className="
                flex
                items-start
                justify-between
                gap-4
                border-b
                border-slate-100
                pb-4
              "
            >
              <div>
                <p
                  className="
                    text-sm
                    font-medium
                    text-slate-700
                  "
                >
                  {item.description}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {item.action} · {item.module}
                </p>
              </div>

              <span
                className="
                  whitespace-nowrap
                  text-xs
                  text-slate-400
                "
                title={new Date(item.createdAt).toLocaleString("en-IN")}
              >
                {formatRelativeTime(item.createdAt)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
