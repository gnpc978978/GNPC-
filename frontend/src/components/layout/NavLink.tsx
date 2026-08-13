"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function NavLink({
  href,
  children,
}: Props) {
  const pathname = usePathname();

  /*
   * -------------------------------------------------------
   * ACTIVE ROUTE
   * -------------------------------------------------------
   *
   * Home requires exact matching.
   *
   * Other routes also consider nested pages active:
   *
   * /events
   * /events/example-event
   */
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
        "items-center",

        "py-2",

        "whitespace-nowrap",

        "text-sm",
        "font-bold",

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

      {/*
       * GNPC Navy active indicator.
       */}
      <span
        aria-hidden="true"
        className={[
          "absolute",
          "bottom-0",
          "left-0",

          "h-0.5",

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
