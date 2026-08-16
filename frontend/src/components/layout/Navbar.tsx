"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HiArrowUpRight, HiBars3 } from "react-icons/hi2";

import { navigation } from "@/data/navigation";

import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import NavLink from "./NavLink";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <div className="w-full px-2 sm:px-4 lg:px-6">
        <nav
          aria-label="Primary navigation"
          className="relative z-[120] mx-auto w-full max-w-[1500px] overflow-hidden rounded-b-[1.35rem] border-x border-b border-slate-200 bg-white text-slate-900 shadow-[0_12px_40px_rgba(15,23,42,0.12)] sm:rounded-b-[1.75rem]"
        >
          <div className="relative flex min-h-[68px] items-center justify-between gap-3 px-3 sm:min-h-[76px] sm:px-5 lg:px-7">
            {/* LOGO */}
            <Link
              href="/"
              aria-label="Greater Noida Press Club home"
              className="shrink-0"
            >
              <div className="transition-transform duration-300 hover:-translate-y-0.5">
                <Logo
                  variant="dark"
                />
              </div>
            </Link>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden flex-1 items-center justify-center xl:flex">
              <div
                className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100/80 p-1"
              >
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    href={item.href}
                    light={false}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* ADMIN */}
            <div className="hidden shrink-0 xl:block">
              <Link
                href="/admin/login"
                className="group/admin relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full border border-[#0f4c81] bg-[#0f4c81] px-5 text-xs font-extrabold tracking-[0.08em] text-white shadow-[0_8px_25px_rgba(15,76,129,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0b3d68] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f4c81] focus-visible:ring-offset-2"
              >
                <span className="relative z-10">
                  Admin Login
                </span>

                <HiArrowUpRight
                  size={16}
                  className="relative z-10 transition-transform duration-300 group-hover/admin:translate-x-0.5 group-hover/admin:-translate-y-0.5"
                  aria-hidden="true"
                />

                <span
                  aria-hidden="true"
                  className="absolute -left-[80%] top-0 h-full w-1/2 skew-x-[-20deg] bg-white/20 transition-all duration-700 group-hover/admin:left-[130%]"
                />
              </Link>
            </div>

            {/* MOBILE MENU */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-900 transition-all duration-300 hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f4c81] focus-visible:ring-offset-2 xl:hidden"
            >
              <HiBars3
                size={24}
                aria-hidden="true"
              />
            </button>
          </div>
        </nav>
      </div>

      <MobileMenu
        open={menuOpen}
        setOpen={setMenuOpen}
      />
    </>
  );
}
