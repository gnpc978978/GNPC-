"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  light?: boolean;
}

export default function NavLink({
  href,
  children,
  light = false,
}: NavLinkProps) {
  const pathname = usePathname();

  const active =
    href === "/"
      ? pathname === "/"
      : pathname === href ||
        pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "group relative inline-flex h-10 items-center",
        "rounded-full px-4",
        "whitespace-nowrap",
        "text-[12px] font-bold",
        "transition-all duration-300",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-offset-2",
        light
          ? "focus-visible:ring-white"
          : "focus-visible:ring-[#155eef]",
        active
          ? light
            ? "text-white"
            : "text-slate-950"
          : light
            ? "text-white/70 hover:text-white"
            : "text-slate-600 hover:text-[#155eef]",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "absolute inset-0 -z-10 rounded-full",
          "transition-all duration-300",
          light
            ? "bg-white/15"
            : "bg-blue-50 shadow-sm",
          active || "group-hover:opacity-100",
          active
            ? "scale-100 opacity-100"
            : "scale-90 opacity-0",
        ].join(" ")}
      />

      <span className="relative z-10">
        {children}
      </span>

      {active && (
        <span
          aria-hidden="true"
          className={[
            "absolute bottom-1 left-1/2",
            "h-1 w-1",
            "-translate-x-1/2",
            "rounded-full",
            light
              ? "bg-white"
              : "bg-[#155eef]",
          ].join(" ")}
        />
      )}
    </Link>
  );
}
