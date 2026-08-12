"use client";

import Link from "next/link";
import {
  CalendarPlus,
  ImagePlus,
  Megaphone,
  Presentation,
} from "lucide-react";

const actions = [
  {
    label: "Create Press Conference",
    href: "/admin/press-conferences/create",
    icon: Presentation,
  },
  {
    label: "Add Announcement",
    href: "/admin/announcements",
    icon: Megaphone,
  },
  {
    label: "Upload Gallery",
    href: "/admin/gallery/upload",
    icon: ImagePlus,
  },
  {
    label: "Add Event",
    href: "/admin/events/create",
    icon: CalendarPlus,
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">
        Quick Actions
      </h2>

      <div className="mt-5 space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 rounded-xl bg-slate-100 px-5 py-4 font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
            >
              <Icon size={19} />

              {action.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
