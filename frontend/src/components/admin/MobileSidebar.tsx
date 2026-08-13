"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  ChevronDown,
  LogOut,
  X,
} from "lucide-react";

import {
  adminNavigation,
  type AdminNavItem,
} from "@/data/adminNavigation";

interface MobileSidebarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
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

function MobileNavGroup({
  item,
  pathname,
  setOpen,
}: {
  item: AdminNavItem;
  pathname: string;
  setOpen: (value: boolean) => void;
}) {
  const active = isItemActive(
    pathname,
    item
  );

  const [expanded, setExpanded] =
    useState(active);

  if (!item.children?.length) {
    if (!item.href) {
      return null;
    }

    const Icon = item.icon;

    const itemActive =
      pathname === item.href ||
      pathname.startsWith(`${item.href}/`);

    return (
      <Link
        href={item.href}
        onClick={() => setOpen(false)}
        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
          itemActive
            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`}
      >
        <Icon
          size={20}
          className="shrink-0"
        />

        <span>{item.name}</span>
      </Link>
    );
  }

  const Icon = item.icon;

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() =>
          setExpanded((value) => !value)
        }
        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
          active
            ? "bg-slate-800 text-white"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`}
      >
        <Icon
          size={20}
          className="shrink-0"
        />

        <span className="flex-1">
          {item.name}
        </span>

        <ChevronDown
          size={18}
          className={`transition-transform ${
            expanded
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="ml-4 space-y-1 border-l border-slate-700 pl-3">
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
                onClick={() =>
                  setOpen(false)
                }
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                  childActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <ChildIcon
                  size={17}
                  className="shrink-0"
                />

                <span>
                  {child.name}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MobileSidebar({
  open,
  setOpen,
}: MobileSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { user } = useAuth();

  const [loggingOut, setLoggingOut] =
    useState(false);

  const visibleItems =
    adminNavigation.filter(
      (item) =>
        !item.roles ||
        item.roles.includes(
          user?.role ?? ""
        )
    );

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    const confirmLogout =
      window.confirm(
        "Do you want to logout?"
      );

    if (!confirmLogout) {
      return;
    }

    try {
      setLoggingOut(true);

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      localStorage.removeItem("user");

      setOpen(false);

      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      console.error(
        "Logout Error:",
        error
      );
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-slate-950 p-5 text-white shadow-2xl transition-transform duration-300 lg:hidden ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
        aria-label="Admin navigation"
      >
        <div className="mb-8 flex items-center justify-between border-b border-slate-800 pb-5">
          <div>
            <h2 className="text-xl font-bold">
              GN Press Club
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Admin Dashboard
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Close navigation"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
          {visibleItems.map((item) => (
            <MobileNavGroup
              key={item.name}
              item={item}
              pathname={pathname}
              setOpen={setOpen}
            />
          ))}
        </nav>

        <div className="border-t border-slate-800 pt-5">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl bg-slate-800 px-4 py-3 text-sm text-slate-300 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={20} />

            {loggingOut
              ? "Logging out..."
              : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
