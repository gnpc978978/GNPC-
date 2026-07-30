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

  const active = pathname === href;

  return (
    <Link
      href={href}
      className="group relative py-2 text-base font-semibold whitespace-nowrap transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      <span
        className={`transition-colors duration-300 ${
          active
            ? "text-blue-700"
            : "text-slate-700 group-hover:text-blue-700"
        }`}
      >
        {children}
      </span>

      <span
        className={`absolute bottom-0 left-0 h-0.5 rounded-full bg-blue-700 transition-all duration-300 ${
          active
            ? "w-full"
            : "w-0 group-hover:w-full"
        }`}
      />
    </Link>
  );
}
