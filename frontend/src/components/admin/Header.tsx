"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, CheckCheck, Home, Menu, Search } from "lucide-react";
import MobileSidebar from "./MobileSidebar";
import { useSidebar } from "@/hooks/useSidebar";
import { usePathname } from "next/navigation";

type Activity = { _id: string; description?: string; createdAt?: string; action?: string; module?: string };
const readStorageKey = "read-notification-ids";

export default function Header() {
  const { collapsed, toggle } = useSidebar();
  const pathname = usePathname();
  const pageTitle = pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ") || "Dashboard";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [readIds, setReadIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(readStorageKey) || "[]");
    } catch {
      localStorage.removeItem(readStorageKey);
      return [];
    }
  });

useEffect(() => {
  const loadActivities = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/activities`,
        {
          credentials: "include",
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );

      const data = await response.json();

      if (response.ok) {
        setActivities(Array.isArray(data.data) ? data.data : []);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error(error);
      setActivities([]);
    }
  };

  loadActivities();
}, []);

  const saveReadIds = (ids: string[]) => {
    const uniqueIds = [...new Set(ids)];
    setReadIds(uniqueIds);
    localStorage.setItem(readStorageKey, JSON.stringify(uniqueIds));
  };
  const unread = activities.filter((activity) => !readIds.includes(activity._id));

  return (
    <>
      <header className="flex h-20 items-center justify-between bg-white px-4 shadow-sm sm:px-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <button onClick={toggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-pressed={collapsed} className="hidden rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 lg:inline-flex"><Menu size={22} /></button>
          <button onClick={() => setSidebarOpen(true)} aria-label="Open navigation" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 lg:hidden"><Menu size={24} /></button>
          <h1 className="hidden text-base font-bold capitalize text-slate-800 sm:block">{pageTitle}</h1>
          <div className="hidden items-center gap-3 rounded-xl bg-slate-100 px-4 py-2 md:flex"><Search size={20} className="text-slate-400" /><input type="text" placeholder="Search..." className="w-60 bg-transparent text-sm outline-none" /></div>
        </div>

        <div className="flex items-center gap-2 sm:gap-5">
          <Link href="/" aria-label="View website home" title="View website" className="inline-flex items-center gap-2 rounded-lg p-2 text-slate-600 hover:bg-slate-100"><Home size={21} /><span className="hidden text-sm font-medium sm:inline">Website</span></Link>
          <div className="relative">
            <button onClick={() => setNotificationsOpen((open) => !open)} aria-expanded={notificationsOpen} aria-label="Notifications" className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100"><Bell size={22} />{unread.length > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-500 px-1 text-center text-xs font-bold leading-5 text-white">{unread.length > 9 ? "9+" : unread.length}</span>}</button>
            {notificationsOpen && <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><div><p className="font-semibold text-slate-900">Notifications</p><p className="text-xs text-slate-500">{unread.length} unread</p></div><button onClick={() => saveReadIds(activities.map(({ _id }) => _id))} disabled={!unread.length} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 disabled:opacity-40"><CheckCheck size={15} /> Mark all read</button></div>
              <div className="max-h-80 overflow-y-auto">{activities.length === 0 ? <p className="p-5 text-sm text-slate-500">No notifications yet.</p> : activities.map((activity) => <button key={activity._id} onClick={() => saveReadIds([...readIds, activity._id])} className={`block w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50 ${readIds.includes(activity._id) ? "" : "bg-blue-50/60"}`}><p className="text-sm text-slate-700">{activity.description || `${activity.action || "New"} ${activity.module || "activity"}`}</p><p className="mt-1 text-xs text-slate-400">{activity.createdAt ? new Date(activity.createdAt).toLocaleString() : "Just now"}</p></button>)}</div>
            </div>}
          </div>
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white sm:h-11 sm:w-11">A</div><div className="hidden md:block"><p className="text-sm font-semibold text-slate-800">Admin</p><p className="text-xs text-slate-500">Dashboard</p></div></div>
        </div>
      </header>
      <MobileSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
    </>
  );
}
