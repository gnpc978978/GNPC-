import {
  BadgeDollarSign,
  CalendarDays,
  ChevronDown,
  Images,
  LayoutDashboard,
  Mail,
  Megaphone,
  Newspaper,
  Presentation,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  name: string;
  icon: LucideIcon;
  href?: string;
  roles?: string[];
  children?: AdminNavItem[];
};

export const adminNavigation: AdminNavItem[] = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },

  {
    name: "Latest Updates",
    icon: Newspaper,
    children: [
      {
        name: "Press Releases",
        icon: Newspaper,
        href: "/admin/press-releases",
      },
      {
        name: "Announcements",
        icon: Megaphone,
        href: "/admin/announcements",
      },
      {
        name: "Events",
        icon: CalendarDays,
        href: "/admin/events",
      },
    ],
  },

  {
    name: "Press Conferences",
    icon: Presentation,
    href: "/admin/press-conferences",
  },

  {
    name: "Gallery",
    icon: Images,
    href: "/admin/gallery",
  },

  {
    name: "Homepage Banners",
    icon: Images,
    href: "/admin/banners",
  },

  {
    name: "Office Bearers",
    icon: Users,
    href: "/admin/office-bearers",
  },

  {
    name: "Members",
    icon: Users,
    href: "/admin/members",
  },

  {
    name: "Feedback & Messages",
    icon: Mail,
    href: "/admin/contact-messages",
  },

  {
    name: "Advertisements",
    icon: BadgeDollarSign,
    href: "/admin/advertisements",
  },

  {
    name: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },

  {
    name: "Admin Management",
    icon: Users,
    href: "/admin/admin-management",
    roles: ["SUPER_ADMIN"],
  },
];

export { ChevronDown };
