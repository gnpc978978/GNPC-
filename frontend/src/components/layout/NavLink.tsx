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
      aria-current={
        active ? "page" : undefined
      }
      className={[
        "group",
        "relative",
        "inline-flex",
        "h-[76px]",
        "items-center",
        "whitespace-nowrap",
        "text-[14px]",
        "font-semibold",
        "tracking-[-0.01em]",
        "transition-colors",
        "duration-200",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-[#0f4c81]",
        "focus-visible:ring-offset-4",
      ].join(" ")}
    >
      <span
        className={[
          "transition-colors",
          "duration-200",
          active
            ? "text-[#0f4c81]"
            : [
                "text-slate-700",
                "group-hover:text-[#0f4c81]",
              ].join(" "),
        ].join(" ")}
      >
        {children}
      </span>

      {/* Active indicator */}

      <span
        aria-hidden="true"
        className={[
          "absolute",
          "bottom-[18px]",
          "left-0",
          "h-[2px]",
          "rounded-full",
          "bg-[#0f4c81]",
          "transition-all",
          "duration-200",
          active
            ? "w-full"
            : "w-0 group-hover:w-full",
        ].join(" ")}
      />
    </Link>
  );
}
