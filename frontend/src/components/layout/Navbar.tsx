"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HiArrowUpRight, HiBars3 } from "react-icons/hi2";
import { usePathname } from "next/navigation";

import { navigation } from "@/data/navigation";

import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import NavLink from "./NavLink";

export default function Navbar() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
          className={[
            "relative z-[120] mx-auto w-full max-w-[1500px]",
            "overflow-hidden",
            "rounded-b-[1.35rem] sm:rounded-b-[1.75rem]",
            "border-x border-b",
            "transition-all duration-300 ease-out",
            isHomePage
              ? scrolled
                ? [
                    "border-white/15",
                    "bg-slate-950/92",
                    "text-white",
                    "shadow-[0_16px_50px_rgba(0,0,0,0.30)]",
                    "backdrop-blur-2xl",
                  ].join(" ")
                : [
                    "border-white/20",
                    "bg-slate-950/55",
                    "text-white",
                    "shadow-[0_12px_40px_rgba(0,0,0,0.18)]",
                    "backdrop-blur-xl",
                  ].join(" ")
              : [
                  "border-slate-200",
                  "bg-white/96",
                  "text-slate-900",
                  "shadow-[0_12px_40px_rgba(15,23,42,0.12)]",
                  "backdrop-blur-2xl",
                ].join(" "),
          ].join(" ")}
        >
          {/* Subtle top highlight */}
          <div
            aria-hidden="true"
            className={[
              "pointer-events-none absolute inset-x-0 top-0 h-px",
              isHomePage
                ? "bg-gradient-to-r from-transparent via-white/40 to-transparent"
                : "bg-gradient-to-r from-transparent via-blue-500/30 to-transparent",
            ].join(" ")}
          />

          {/* Background glow */}
          <div
            aria-hidden="true"
            className={[
              "pointer-events-none absolute inset-0",
              isHomePage
                ? "bg-gradient-to-r from-white/[0.06] via-transparent to-blue-400/[0.04]"
                : "bg-gradient-to-r from-blue-50/50 via-transparent to-slate-50/70",
            ].join(" ")}
          />

          <div className="relative flex min-h-[68px] items-center justify-between gap-3 px-3 sm:min-h-[76px] sm:px-5 lg:px-7">
            {/* LOGO */}
            <Link
              href="/"
              aria-label="Greater Noida Press Club home"
              className="shrink-0"
            >
              <div className="transition-transform duration-300 hover:-translate-y-0.5">
                <Logo
                  variant={
                    isHomePage && !scrolled
                      ? "light"
                      : "dark"
                  }
                />
              </div>
            </Link>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden flex-1 items-center justify-center xl:flex">
              <div
                className={[
                  "flex items-center gap-1",
                  "rounded-full",
                  "border",
                  "p-1",
                  "backdrop-blur-xl",
                  isHomePage
                    ? "border-white/10 bg-black/10"
                    : "border-slate-200 bg-slate-100/80",
                ].join(" ")}
              >
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    href={item.href}
                    light={
                      isHomePage && !scrolled
                    }
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
                className={[
                  "group/admin relative inline-flex",
                  "h-11 items-center justify-center gap-2",
                  "overflow-hidden",
                  "rounded-full",
                  "border px-5",
                  "text-xs font-extrabold",
                  "tracking-[0.08em]",
                  "transition-all duration-300",
                  "hover:-translate-y-0.5",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-offset-2",
                  isHomePage && !scrolled
                    ? [
                        "border-white/25",
                        "bg-white",
                        "text-slate-950",
                        "shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
                        "hover:bg-slate-50",
                        "focus-visible:ring-white",
                      ].join(" ")
                    : [
                        "border-slate-200",
                        "bg-slate-950",
                        "text-white",
                        "shadow-[0_8px_25px_rgba(15,23,42,0.18)]",
                        "hover:bg-slate-800",
                        "focus-visible:ring-slate-900",
                      ].join(" "),
                ].join(" ")}
              >
                <span className="relative z-10">
                  Admin
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
              className={[
                "flex h-11 w-11 shrink-0 items-center justify-center",
                "rounded-full border",
                "transition-all duration-300",
                "xl:hidden",
                isHomePage && !scrolled
                  ? [
                      "border-white/20",
                      "bg-white/10",
                      "text-white",
                      "backdrop-blur-xl",
                      "hover:bg-white/20",
                    ].join(" ")
                  : [
                      "border-slate-200",
                      "bg-slate-100",
                      "text-slate-900",
                      "hover:bg-white",
                    ].join(" "),
              ].join(" ")}
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
