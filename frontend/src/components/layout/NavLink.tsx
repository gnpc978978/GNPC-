"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

export default function NavLink({
  href,
  children,
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
      aria-current={
        active ? "page" : undefined
      }
      className={[
        "group/nav",
        "relative",
        "inline-flex",
        "h-[68px]",
        "items-center",
        "whitespace-nowrap",
        "px-1",
        "text-[13px]",
        "font-bold",
        "tracking-[-0.01em]",
        "transition-all",
        "duration-300",
        "ease-out",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-[#155eef]",
        "focus-visible:ring-offset-4",
        "focus-visible:ring-offset-white",
      ].join(" ")}
    >
      {/* Text */}

      <span
        className={[
          "relative",
          "z-10",
          "transition-all",
          "duration-300",
          "group-hover/nav:-translate-y-0.5",
          active
            ? "text-[#0f4c81]"
            : "text-slate-600 group-hover/nav:text-[#0f4c81]",
        ].join(" ")}
      >
        {children}
      </span>

      {/* Active / hover glow */}

      <span
        aria-hidden="true"
        className={[
          "absolute",
          "bottom-[9px]",
          "left-0",
          "h-[3px]",
          "overflow-hidden",
          "rounded-full",
          "bg-[#155eef]",
          "shadow-[0_0_12px_rgba(21,94,239,0.35)]",
          "transition-all",
          "duration-300",
          active
            ? "w-full"
            : "w-0 group-hover/nav:w-full",
        ].join(" ")}
      />

      {/* Small red editorial marker */}

      <span
        aria-hidden="true"
        className={[
          "absolute",
          "bottom-[8px]",
          "left-1/2",
          "h-1",
          "w-1",
          "-translate-x-1/2",
          "translate-y-1/2",
          "rounded-full",
          "bg-[#c8102e]",
          "opacity-0",
          "transition-all",
          "duration-300",
          active
            ? "opacity-100"
            : "group-hover/nav:opacity-100",
        ].join(" ")}
      />

      {/* Soft hover background */}

      <span
        aria-hidden="true"
        className={[
          "pointer-events-none",
          "absolute",
          "-inset-x-3",
          "inset-y-2",
          "-z-0",
          "rounded-lg",
          "bg-[#f2f7fc]",
          "opacity-0",
          "scale-95",
          "transition-all",
          "duration-300",
          "group-hover/nav:scale-100",
          "group-hover/nav:opacity-100",
          active
            ? "scale-100 opacity-100"
            : "",
        ].join(" ")}
      />
    </Link>
  );
}
