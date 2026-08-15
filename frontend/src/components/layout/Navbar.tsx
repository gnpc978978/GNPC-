"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  HiBars3,
  HiChevronRight,
  HiArrowUpRight,
} from "react-icons/hi2";

import Container from "@/components/ui/Container";
import { navigation } from "@/data/navigation";

import Logo from "./Logo";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
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
      <nav
        className={[
          "fixed left-0 right-0 top-0 z-[105] w-full",
          "text-white",
          "transition-all duration-500 ease-out",
          scrolled
            ? "bg-[#050b14]/95 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
            : "bg-[#07111f]/98",
        ].join(" ")}
      >
        {/* TOP ACCENT LINE */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-0 h-[3px] overflow-hidden"
        >
          <div className="h-full w-full bg-gradient-to-r from-[#c8102e] via-[#155eef] to-[#f5b942]" />
        </div>

        {/* SUBTLE BACKGROUND GLOW */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -left-32 top-0 h-40 w-72 rounded-full bg-[#155eef]/10 blur-3xl" />
          <div className="absolute right-0 top-0 h-32 w-64 rounded-full bg-[#c8102e]/10 blur-3xl" />
        </div>

        <Container
          className={[
            "relative transition-all duration-500",
            scrolled ? "py-2" : "py-3",
          ].join(" ")}
        >
          <div
            className={[
              "flex items-center justify-between gap-6",
              "transition-all duration-500",
              scrolled
                ? "h-[64px] lg:h-[68px]"
                : "h-[76px] lg:h-[82px]",
            ].join(" ")}
          >
            {/* LOGO AREA */}
            <Link
              href="/"
              aria-label="Greater Noida Press Club home"
              className={[
                "group relative flex shrink-0 items-center",
                "transition-transform duration-300",
                "hover:-translate-y-0.5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5b942]",
              ].join(" ")}
            >
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-2xl bg-white/[0.03] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
              />

              <div className="relative">
                <Logo />
              </div>
            </Link>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden min-w-0 flex-1 items-center justify-end xl:flex">
              <div
                className={[
                  "flex items-center",
                  "rounded-2xl border border-white/[0.10]",
                  "bg-white/[0.035]",
                  "px-1.5 py-1.5",
                  "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_40px_rgba(0,0,0,0.16)]",
                  "backdrop-blur-xl",
                ].join(" ")}
              >
                {navigation.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" &&
                      pathname.startsWith(`${item.href}/`));

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={[
                        "group relative flex h-11 items-center px-4",
                        "text-[11px] font-bold uppercase tracking-[0.11em]",
                        "transition-all duration-300",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5b942]",
                        isActive
                          ? "text-white"
                          : "text-white/60 hover:text-white",
                      ].join(" ")}
                    >
                      {/* ACTIVE / HOVER BACKGROUND */}
                      <span
                        aria-hidden="true"
                        className={[
                          "absolute inset-0 rounded-xl transition-all duration-300",
                          isActive
                            ? "bg-white/[0.09] opacity-100"
                            : "bg-white/[0.06] opacity-0 group-hover:opacity-100",
                        ].join(" ")}
                      />

                      {/* TEXT */}
                      <span className="relative z-10">
                        {item.name}
                      </span>

                      {/* ACTIVE INDICATOR */}
                      <span
                        aria-hidden="true"
                        className={[
                          "absolute bottom-1.5 left-1/2 h-[2px] -translate-x-1/2 rounded-full",
                          "bg-[#f5b942]",
                          "transition-all duration-300",
                          isActive
                            ? "w-5 opacity-100"
                            : "w-0 opacity-0 group-hover:w-5 group-hover:opacity-100",
                        ].join(" ")}
                      />
                    </Link>
                  );
                })}
              </div>

              {/* ADMIN BUTTON */}
              <Link
                href="/admin/login"
                className={[
                  "group/admin relative ml-3 inline-flex h-12 items-center justify-center gap-2 overflow-hidden",
                  "rounded-xl border border-[#c8102e]/70",
                  "bg-[#c8102e]",
                  "px-5",
                  "text-[11px] font-black uppercase tracking-[0.14em] text-white",
                  "shadow-[0_10px_30px_rgba(200,16,46,0.20)]",
                  "transition-all duration-300",
                  "hover:-translate-y-1",
                  "hover:border-[#e11d48]",
                  "hover:bg-[#a80d26]",
                  "hover:shadow-[0_16px_38px_rgba(200,16,46,0.34)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5b942] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111f]",
                ].join(" ")}
              >
                <span className="relative z-10">Admin</span>

                <HiArrowUpRight
                  size={15}
                  className="relative z-10 transition-transform duration-300 group-hover/admin:translate-x-1 group-hover/admin:-translate-y-1"
                  aria-hidden="true"
                />

                {/* SHINE */}
                <span
                  aria-hidden="true"
                  className="absolute -left-[80%] top-0 h-full w-1/2 skew-x-[-20deg] bg-white/20 transition-all duration-700 group-hover/admin:left-[130%]"
                />
              </Link>
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className={[
                "group/menu relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl",
                "border border-white/[0.14]",
                "bg-white/[0.06]",
                "text-white",
                "shadow-[0_10px_30px_rgba(0,0,0,0.2)]",
                "backdrop-blur-xl",
                "transition-all duration-300",
                "hover:-translate-y-1",
                "hover:border-[#f5b942]/50",
                "hover:bg-white/[0.10]",
                "hover:shadow-[0_14px_34px_rgba(0,0,0,0.3)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5b942]",
                "xl:hidden",
              ].join(" ")}
            >
              <HiBars3
                size={26}
                className="relative z-10 transition-transform duration-300 group-hover/menu:scale-110"
                aria-hidden="true"
              />

              <span
                aria-hidden="true"
                className="absolute bottom-1.5 h-[2px] w-0 rounded-full bg-[#f5b942] transition-all duration-300 group-hover/menu:w-5"
              />
            </button>
          </div>
        </Container>

        {/* BOTTOM GLOW / BORDER */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
        />
      </nav>

      {/* Spacer because navbar is fixed */}
      <div
        aria-hidden="true"
        className={scrolled ? "h-[84px]" : "h-[98px]"}
      />

      <MobileMenu
        open={menuOpen}
        setOpen={setMenuOpen}
      />
    </>
  );
}
