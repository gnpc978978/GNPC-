"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/hooks/useSidebar";
import { BadgeDollarSign, CalendarDays, Images, LayoutDashboard, LogOut, Mail, Megaphone, Newspaper, Presentation, Settings, Users } from "lucide-react";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" }, { name: "Press Releases", icon: Newspaper, href: "/admin/press-releases" }, { name: "Announcements", icon: Megaphone, href: "/admin/announcements" }, { name: "Press Conferences", icon: Presentation, href: "/admin/press-conferences" }, { name: "Events", icon: CalendarDays, href: "/admin/events" }, { name: "Gallery", icon: Images, href: "/admin/gallery" }, { name: "Homepage Banners", icon: Images, href: "/admin/banners" }, { name: "Office Bearers", icon: Users, href: "/admin/members" }, { name: "Executive Committee", icon: Users, href: "/admin/executive-committee" }, { name: "Messages", icon: Mail, href: "/admin/contact-messages" }, { name: "Advertisements", icon: BadgeDollarSign, href: "/admin/advertisements" }, { name: "Settings", icon: Settings, href: "/admin/settings" }, { name: "Admin Management", icon: Users, href: "/admin/admin-management", roles: ["SUPER_ADMIN"] },
];

function SidebarLabel({ children }: { children: React.ReactNode }) { const { collapsed } = useSidebar(); return <AnimatePresence initial={false}>{!collapsed && <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="overflow-hidden whitespace-nowrap text-sm font-medium">{children}</motion.span>}</AnimatePresence>; }

export default function Sidebar() {
  const pathname = usePathname(); const router = useRouter(); const { user, logout } = useAuth(); const { collapsed } = useSidebar();
  const visibleItems = menu.filter((item) => !item.roles || item.roles.includes(user?.role ?? ""));
  return <motion.aside animate={{ width: collapsed ? 80 : 280 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="fixed inset-y-0 left-0 z-40 hidden flex-col bg-slate-950 px-3 py-5 text-white shadow-2xl lg:flex">
    <div className={`mb-6 flex min-h-12 items-center border-b border-slate-800 pb-5 ${collapsed ? "justify-center" : "gap-3 px-2"}`}><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-black">GN</div><div className="min-w-0"><SidebarLabel><span className="block font-bold">GN Press Club</span><span className="block text-xs text-slate-400">Admin Dashboard</span></SidebarLabel></div></div>
    <nav className="flex-1 space-y-1.5 overflow-y-auto">{visibleItems.map((item) => { const Icon = item.icon; const active = pathname === item.href || pathname.startsWith(`${item.href}/`); return <Link key={item.name} href={item.href} title={collapsed ? item.name : undefined} className={`group relative flex h-12 items-center rounded-xl transition ${collapsed ? "justify-center" : "gap-3 px-3"} ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}><Icon size={21} className="shrink-0" /><SidebarLabel>{item.name}</SidebarLabel>{collapsed && <span role="tooltip" className="pointer-events-none absolute left-[calc(100%+12px)] z-50 hidden whitespace-nowrap rounded-md bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white shadow-lg group-hover:block">{item.name}</span>}</Link>; })}</nav>
    <div className="mt-4 border-t border-slate-800 pt-4"><div className={`mb-3 flex items-center ${collapsed ? "justify-center" : "gap-3 px-2"}`}><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-bold">{user?.name?.charAt(0).toUpperCase() || "A"}</div><div className="min-w-0"><SidebarLabel><span className="block truncate text-sm font-semibold">{user?.name || "Admin"}</span><span className="block text-xs text-slate-400">{user?.role || "Administrator"}</span></SidebarLabel></div></div><button onClick={logout} title={collapsed ? "Logout" : undefined} className={`group relative flex h-12 w-full items-center rounded-xl bg-slate-800 text-slate-300 transition hover:bg-red-600 hover:text-white ${collapsed ? "justify-center" : "gap-3 px-3"}`}><LogOut size={21} /><SidebarLabel>Logout</SidebarLabel>{collapsed && <span role="tooltip" className="pointer-events-none absolute left-[calc(100%+12px)] hidden whitespace-nowrap rounded-md bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white shadow-lg group-hover:block">Logout</span>}</button></div>
  </motion.aside>;
}
