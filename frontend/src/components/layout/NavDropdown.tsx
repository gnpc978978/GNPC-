"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HiChevronDown } from "react-icons/hi2";

import type { NavigationItem } from "@/data/navigation";

export default function NavDropdown({
  item,
  light = false,
}: {
  item: NavigationItem;
  light?: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname, searchParams]);

  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="true"
        aria-expanded={open}
        className={[
          "inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[12px] font-bold transition",
          "focus-visible:outline-none focus-visible:ring-2",
          light ? "focus-visible:ring-white" : "focus-visible:ring-[#d4b06a]",
          active
            ? light
              ? "bg-white/15 text-white"
              : "bg-white/15 text-slate-950"
            : light
              ? "text-white/70 hover:bg-white/10 hover:text-white"
              : "text-slate-600 hover:bg-white/10 hover:text-[#d4b06a]",
        ].join(" ")}
      >
        {item.name}
        <HiChevronDown
          size={15}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={[
          "absolute left-0 top-full z-[250] min-w-60 pt-3 transition duration-150",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100",
        ].join(" ")}
      >
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1f3a] p-2 shadow-2xl">
          {item.children?.map((child) => {
            const [targetPath, targetQuery] = child.href.split("?");
            const activeChild =
              pathname === targetPath &&
              (!targetQuery ||
                new URLSearchParams(targetQuery).get("tab") ===
                  searchParams.get("tab"));

            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => setOpen(false)}
                aria-current={activeChild ? "page" : undefined}
                className={[
                  "block rounded-xl px-4 py-3 text-sm font-semibold transition",
                  activeChild
                    ? "bg-white/10 text-[#e8d7ad]"
                    : "text-white/70 hover:bg-white/[.06] hover:text-white",
                ].join(" ")}
              >
                {child.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
