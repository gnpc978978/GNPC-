"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HiArrowUpRight, HiBars3 } from "react-icons/hi2";

import Container from "@/components/ui/Container";
import { navigation } from "@/data/navigation";

import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import NavLink from "./NavLink";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    document.body.style.overflow = menuOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        aria-label="Primary navigation"
        className={[
          "relative z-[101] w-full",
          "border-b border-slate-300/80",
          "bg-[#e4e7ea]",
          "text-slate-900",
          "transition-all duration-300",
          scrolled
            ? "shadow-[0_12px_35px_rgba(15,23,42,0.16)]"
            : "shadow-[0_5px_18px_rgba(15,23,42,0.08)]",
        ].join(" ")}
      >
        {/* TOP EDGE */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#c8102e] via-[#d6a928] to-[#0f4c81]"
        />

        <Container>
          <div
            className={[
              "flex items-center justify-between gap-5",
              "transition-all duration-300",
              scrolled
                ? "h-[68px]"
                : "h-[76px]",
            ].join(" ")}
          >
            {/* =================================================
                BRAND
                ================================================= */}

            <div
              className={[
                "min-w-0 shrink-0",
                "transition-transform duration-300",
                "hover:-translate-y-0.5",
              ].join(" ")}
            >
              <Logo variant="dark" />
            </div>

            {/* =================================================
                DESKTOP NAVIGATION
                ================================================= */}

            <div className="hidden min-w-0 flex-1 items-center justify-end xl:flex">
              <div
                className={[
                  "flex items-center gap-1",
                  "rounded-2xl",
                  "border border-slate-300",
                  "bg-[#eef0f2]",
                  "p-1.5",
                  "shadow-[0_8px_24px_rgba(15,23,42,0.08)]",
                  "transition-all duration-300",
                  "hover:border-slate-400",
                  "hover:shadow-[0_12px_32px_rgba(15,23,42,0.12)]",
                ].join(" ")}
              >
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    href={item.href}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>

              {/* =================================================
                  ADMIN
                  ================================================= */}

              <Link
                href="/admin/login"
                className={[
                  "group/admin relative ml-3",
                  "inline-flex h-11",
                  "items-center justify-center gap-2",
                  "overflow-hidden",
                  "rounded-xl",
                  "border border-[#b80f2a]",
                  "bg-[#c8102e]",
                  "px-5",
                  "text-[12px]",
                  "font-extrabold",
                  "uppercase",
                  "tracking-[0.12em]",
                  "text-white",
                  "shadow-[0_8px_22px_rgba(200,16,46,0.20)]",
                  "transition-all duration-300",
                  "hover:-translate-y-1",
                  "hover:bg-[#a90d27]",
                  "hover:shadow-[0_14px_30px_rgba(200,16,46,0.30)]",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-[#c8102e]",
                  "focus-visible:ring-offset-2",
                ].join(" ")}
              >
                <span className="relative z-10">
                  Admin
                </span>

                <HiArrowUpRight
                  size={15}
                  className={[
                    "relative z-10",
                    "transition-transform duration-300",
                    "group-hover/admin:translate-x-1",
                    "group-hover/admin:-translate-y-1",
                  ].join(" ")}
                  aria-hidden="true"
                />

                {/* Animated shine */}
                <span
                  aria-hidden="true"
                  className={[
                    "absolute -left-[80%] top-0",
                    "h-full w-1/2",
                    "skew-x-[-20deg]",
                    "bg-white/20",
                    "transition-all duration-700",
                    "group-hover/admin:left-[130%]",
                  ].join(" ")}
                />
              </Link>
            </div>

            {/* =================================================
                MOBILE MENU
                ================================================= */}

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className={[
                "group/menu relative flex",
                "h-11 w-11 shrink-0",
                "items-center justify-center",
                "overflow-hidden",
                "rounded-xl",
                "border border-slate-300",
                "bg-[#eef0f2]",
                "text-slate-800",
                "shadow-sm",
                "transition-all duration-300",
                "hover:-translate-y-1",
                "hover:border-slate-400",
                "hover:bg-white",
                "hover:shadow-[0_8px_20px_rgba(15,23,42,0.12)]",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-[#0f4c81]",
                "focus-visible:ring-offset-2",
                "xl:hidden",
              ].join(" ")}
            >
              <HiBars3
                size={25}
                className="transition-transform duration-300 group-hover/menu:scale-110"
                aria-hidden="true"
              />

              <span
                aria-hidden="true"
                className={[
                  "absolute bottom-1.5",
                  "h-[2px] w-0",
                  "rounded-full",
                  "bg-[#c8102e]",
                  "transition-all duration-300",
                  "group-hover/menu:w-5",
                ].join(" ")}
              />
            </button>
          </div>
        </Container>

        {/* Bottom highlight */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-400/50 to-transparent"
        />
      </nav>

      <MobileMenu
        open={menuOpen}
        setOpen={setMenuOpen}
      />
    </>
  );
}
