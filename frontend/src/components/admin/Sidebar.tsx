"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/hooks/useSidebar";
import {
  adminNavigation,
  type AdminNavItem,
} from "@/data/adminNavigation";
import {
  ChevronDown,
  LogOut,
} from "@/data/adminNavigation";
import { useEffect, useState } from "react";

function SidebarLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  const { collapsed } = useSidebar();

  return (
    <AnimatePresence initial={false}>
      {!collapsed && (
        <motion.span
          initial={{
            opacity: 0,
            width: 0,
          }}
          animate={{
            opacity: 1,
            width: "auto",
          }}
          exit={{
            opacity: 0,
            width: 0,
          }}
          className="overflow-hidden whitespace-nowrap text-sm font-medium"
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function isItemActive(
  pathname: string,
  item: AdminNavItem
) {
  if (item.href) {
    return (
      pathname === item.href ||
      pathname.startsWith(`${item.href}/`)
    );
  }

  if (item.children) {
    return item.children.some((child) =>
      child.href
        ? pathname === child.href ||
          pathname.startsWith(`${child.href}/`)
        : false
    );
  }

  return false;
}

function SidebarLink({
  item,
  pathname,
}: {
  item: AdminNavItem;
  pathname: string;
}) {
  const { collapsed } = useSidebar();

  if (!item.href) {
    return null;
  }

  const Icon = item.icon;

  const active =
    pathname === item.href ||
    pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      title={collapsed ? item.name : undefined}
      className={`group relative flex h-12 items-center rounded-xl transition ${
        collapsed
          ? "justify-center"
          : "gap-3 px-3"
      } ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
          : "text-slate-400 hover:bg-slate-900 hover:text-white"
      }`}
    >
      <Icon
        size={18}
        className="shrink-0"
      />

      <SidebarLabel>
        {item.name}
      </SidebarLabel>
    </Link>
  );
}

function SidebarGroup({
  item,
  pathname,
}: {
  item: AdminNavItem;
  pathname: string;
}) {
  const { collapsed } = useSidebar();

  const active = isItemActive(
    pathname,
    item
  );

  const [open, setOpen] = useState(active);

  useEffect(() => {
    if (active) {
      setOpen(true);
    }
  }, [active]);

  const Icon = item.icon;

  if (!item.children?.length) {
    return (
      <SidebarLink
        item={item}
        pathname={pathname}
      />
    );
  }

  if (collapsed) {
    return (
      <div className="relative group">
        <button
          type="button"
          title={item.name}
          className={`flex h-12 w-full items-center justify-center rounded-xl transition ${
            active
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
              : "text-slate-400 hover:bg-slate-900 hover:text-white"
          }`}
        >
          <Icon
            size={18}
            className="shrink-0"
          />
        </button>

        <div className="pointer-events-none absolute left-[calc(100%+10px)] top-0 z-50 hidden w-52 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl group-hover:pointer-events-auto group-hover:block">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {item.name}
          </p>

          <div className="space-y-1">
            {item.children.map((child) => {
              if (!child.href) {
                return null;
              }

              const ChildIcon = child.icon;

              const childActive =
                pathname === child.href ||
                pathname.startsWith(
                  `${child.href}/`
                );

              return (
                <Link
                  key={child.name}
                  href={child.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    childActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <ChildIcon size={16} />
                  <span>{child.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`flex h-12 w-full items-center gap-3 rounded-xl px-3 transition ${
          active
            ? "bg-slate-900 text-white"
            : "text-slate-400 hover:bg-slate-900 hover:text-white"
        }`}
      >
        <Icon
          size={18}
          className="shrink-0"
        />

        <span className="flex-1 text-left text-sm font-medium">
          {item.name}
        </span>

        <motion.span
          animate={{
            rotate: open ? 180 : 0,
          }}
          transition={{
            duration: 0.2,
          }}
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            className="overflow-hidden"
          >
            <div className="ml-4 space-y-1 border-l border-slate-800 pl-3">
              {item.children.map((child) => {
                if (!child.href) {
                  return null;
                }

                const ChildIcon =
                  child.icon;

                const childActive =
                  pathname === child.href ||
                  pathname.startsWith(
                    `${child.href}/`
                  );

                return (
                  <Link
                    key={child.name}
                    href={child.href}
                    className={`flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                      childActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <ChildIcon
                      size={16}
                      className="shrink-0"
                    />

                    <span>
                      {child.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  const { user, logout } = useAuth();

  const { collapsed } = useSidebar();

  const visibleItems =
    adminNavigation.filter(
      (item) =>
        !item.roles ||
        item.roles.includes(
          user?.role ?? ""
        )
    );

  return (
    <motion.aside
      animate={{
        width: collapsed ? 80 : 280,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      className="fixed inset-y-0 left-0 z-40 hidden flex-col bg-slate-950 px-3 py-5 text-white shadow-2xl lg:flex"
    >
      <div
        className={`mb-6 flex min-h-12 items-center border-b border-slate-800 pb-5 ${
          collapsed
            ? "justify-center"
            : "gap-3 px-2"
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-black">
          GN
        </div>

        <div className="min-w-0">
          <SidebarLabel>
            <span className="block font-bold">
              GN Press Club
            </span>

            <span className="block text-xs text-slate-400">
              Admin Dashboard
            </span>
          </SidebarLabel>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {visibleItems.map((item) => (
          <SidebarGroup
            key={item.name}
            item={item}
            pathname={pathname}
          />
        ))}
      </nav>

      <div className="border-t border-slate-800 pt-4">
        {!collapsed && (
          <div className="mb-3 px-2">
            <p className="text-sm font-semibold text-white">
              {user?.name || "Admin"}
            </p>

            <p className="text-xs text-slate-500">
              {user?.role ||
                "Administrator"}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={logout}
          className={`flex h-11 w-full items-center rounded-xl text-slate-400 transition hover:bg-red-500/10 hover:text-red-400 ${
            collapsed
              ? "justify-center"
              : "gap-3 px-3"
          }`}
        >
          <LogOut size={18} />

          {!collapsed && (
            <span className="text-sm font-medium">
              Logout
            </span>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
