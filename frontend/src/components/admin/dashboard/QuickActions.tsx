"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  Eye,
  Users,
  TrendingUp,
  X,
} from "lucide-react";

import {
  authenticatedFetch,
  responseJson,
} from "@/services/api";

interface TrafficData {
  onlineNow: number;
  todayVisits: number;
  totalVisits: number;
  peakOnline: number;
  peakAt: string | null;
}

const actions = [
  {
    title: "Create Press Conference",
    href: "/admin/press-releases/create",
  },
  {
    title: "Add Announcement",
    href: "/admin/announcements",
  },
  {
    title: "Upload Gallery",
    href: "/admin/gallery/upload",
  },
  {
    title: "Add Event",
    href: "/admin/events/create",
  },
];

export default function QuickActions() {
  const [traffic, setTraffic] =
    useState<TrafficData>({
      onlineNow: 0,
      todayVisits: 0,
      totalVisits: 0,
      peakOnline: 0,
      peakAt: null,
    });

  const [showDetails, setShowDetails] =
    useState(false);

  const fetchTraffic = async () => {
    try {
      const response =
        await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard/traffic`,
          {
            method: "GET",
          }
        );

      const result =
        await responseJson<{
          success: boolean;
          traffic: TrafficData;
        }>(response);

      if (result.success) {
        setTraffic(result.traffic);
      }
    } catch (error) {
      console.error(
        "Traffic Analytics Error:",
        error
      );
    }
  };

  useEffect(() => {
    fetchTraffic();

    const interval = setInterval(
      fetchTraffic,
      15000
    );

    return () => clearInterval(interval);
  }, []);

  const formatPeakTime = (
    value: string | null
  ) => {
    if (!value) {
      return "No peak recorded yet";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "No peak recorded yet";
    }

    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Quick Actions
        </h2>

        <div className="mt-5 grid gap-3">
          {actions.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-600 hover:text-white"
            >
              {item.title}
            </Link>
          ))}
        </div>

        {/* Traffic Overview */}
        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity
                size={18}
                className="text-blue-600"
              />

              <h3 className="text-sm font-bold text-slate-900">
                Website Traffic
              </h3>
            </div>

            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Live
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white p-3">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Users size={14} />

                <span className="text-xs">
                  Online
                </span>
              </div>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {traffic.onlineNow}
              </p>
            </div>

            <div className="rounded-xl bg-white p-3">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Eye size={14} />

                <span className="text-xs">
                  Today
                </span>
              </div>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {traffic.todayVisits}
              </p>
            </div>

            <div className="rounded-xl bg-white p-3">
              <div className="flex items-center gap-1.5 text-slate-400">
                <TrendingUp size={14} />

                <span className="text-xs">
                  Peak
                </span>
              </div>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {traffic.peakOnline}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowDetails(true)
            }
            className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Detailed Analytics
          </button>
        </div>
      </div>

      {/* Detailed Traffic Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Website Traffic Analytics
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Live website traffic overview
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowDetails(false)
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">
                  Currently Online
                </p>

                <p className="mt-2 text-3xl font-bold text-emerald-600">
                  {traffic.onlineNow}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">
                  Today's Visits
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {traffic.todayVisits}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">
                  Total Visits
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {traffic.totalVisits}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">
                  Peak Online
                </p>

                <p className="mt-2 text-3xl font-bold text-purple-600">
                  {traffic.peakOnline}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-100 p-5">
              <p className="text-sm text-slate-500">
                Peak Traffic Time
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {formatPeakTime(
                  traffic.peakAt
                )}
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setShowDetails(false)
                }
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
