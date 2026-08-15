"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
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
      aria-current={active ? "page" : undefined}
      className={[
        "group relative inline-flex h-[58px] items-center",
        "px-3.5 2xl:px-4",
        "whitespace-nowrap",
        "text-[13px] 2xl:text-[14px]",
        "font-extrabold uppercase",
        "tracking-[0.075em]",
        "transition-all duration-300 ease-out",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-[#c8102e]",
        "focus-visible:ring-offset-2",
        active
          ? "text-[#172033]"
          : "text-slate-500 hover:-translate-y-0.5 hover:text-[#172033]",
      ].join(" ")}
    >
      {/* Hover background */}
      <span
        aria-hidden="true"
        className={[
          "absolute inset-x-1 top-2 bottom-2 -z-10 rounded-xl",
          "bg-slate-100",
          "opacity-0 scale-95",
          "transition-all duration-300",
          "group-hover:scale-100 group-hover:opacity-100",
          active ? "scale-100 opacity-100" : "",
        ].join(" ")}
      />

      {/* Text */}
      <span className="relative z-10">
        {children}
      </span>

      {/* Animated underline */}
      <span
        aria-hidden="true"
        className={[
          "absolute bottom-[7px] left-1/2 h-[3px]",
          "-translate-x-1/2 rounded-full",
          "bg-[#c8102e]",
          "transition-all duration-300 ease-out",
          active
            ? "w-[24px]"
            : "w-0 group-hover:w-[24px]",
        ].join(" ")}
      />

      {/* Small active dot */}
      <span
        aria-hidden="true"
        className={[
          "absolute right-1 top-1/2 h-1.5 w-1.5",
          "-translate-y-1/2 rounded-full",
          "bg-[#c8102e]",
          "transition-all duration-300",
          active
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0",
        ].join(" ")}
      />
    </Link>
  );
}
