"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  HiBars3,
  HiChevronRight,
} from "react-icons/hi2";

import Container from "@/components/ui/Container";

import { navigation } from "@/data/navigation";

import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import NavLink from "./NavLink";

export default function Navbar() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        aria-label="Primary navigation"
        className={[
          "relative",
          "z-[105]",
          "w-full",
          "border-b",
          "transition-all",
          "duration-300",
          scrolled
            ? [
                "border-slate-200/80",
                "bg-white/90",
                "shadow-[0_12px_35px_rgba(15,23,42,0.10)]",
                "backdrop-blur-xl",
              ].join(" ")
            : [
                "border-slate-100",
                "bg-white",
              ].join(" "),
        ].join(" ")}
      >
        {/* Top accent line */}

        <div
          aria-hidden="true"
          className={[
            "absolute",
            "left-0",
            "right-0",
            "top-0",
            "h-[2px]",
            "bg-gradient-to-r",
            "from-[#0f4c81]",
            "via-[#155eef]",
            "to-[#c8102e]",
          ].join(" ")}
        />

        <Container
          className={[
            "transition-all",
            "duration-300",
            scrolled
              ? "py-1"
              : "py-1.5",
          ].join(" ")}
        >
          <div
            className={[
              "flex",
              "h-[72px]",
              "items-center",
              "justify-between",
              "gap-5",
              "transition-all",
              "duration-300",
              "lg:h-[74px]",
            ].join(" ")}
          >
            {/* =================================================
                LOGO
                ================================================= */}

            <div className="min-w-0 shrink-0">
              <Logo />
            </div>

            {/* =================================================
                DESKTOP NAV
                ================================================= */}

            <div className="hidden min-w-0 flex-1 items-center justify-end xl:flex">
              <div
                className={[
                  "flex",
                  "items-center",
                  "gap-1",
                  "rounded-2xl",
                  "border",
                  "border-slate-100",
                  "bg-slate-50/70",
                  "px-2",
                  "shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]",
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

              {/* LOGIN */}

              <Link
                href="/admin/login"
                className={[
                  "group/login",
                  "relative",
                  "ml-4",
                  "inline-flex",
                  "h-11",
                  "items-center",
                  "justify-center",
                  "gap-2",
                  "overflow-hidden",
                  "rounded-xl",
                  "border",
                  "border-[#0f4c81]",
                  "bg-[#0f4c81]",
                  "px-4.5",
                  "text-xs",
                  "font-extrabold",
                  "tracking-wide",
                  "text-white",
                  "shadow-[0_7px_20px_rgba(15,76,129,0.18)]",
                  "transition-all",
                  "duration-300",
                  "hover:-translate-y-0.5",
                  "hover:bg-[#0b3d68]",
                  "hover:shadow-[0_12px_28px_rgba(15,76,129,0.28)]",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-[#155eef]",
                  "focus-visible:ring-offset-2",
                ].join(" ")}
              >
                <span className="relative z-10">
                  Admin
                </span>

                <HiChevronRight
                  size={15}
                  className={[
                    "relative",
                    "z-10",
                    "transition-transform",
                    "duration-300",
                    "group-hover/login:translate-x-1",
                  ].join(" ")}
                  aria-hidden="true"
                />

                <span
                  aria-hidden="true"
                  className={[
                    "absolute",
                    "-left-1/2",
                    "top-0",
                    "h-full",
                    "w-1/3",
                    "skew-x-[-20deg]",
                    "bg-white/15",
                    "transition-all",
                    "duration-500",
                    "group-hover/login:left-[120%]",
                  ].join(" ")}
                />
              </Link>
            </div>

            {/* =================================================
                MOBILE MENU
                ================================================= */}

            <button
              type="button"
              onClick={() =>
                setMenuOpen(true)
              }
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className={[
                "group/menu",
                "relative",
                "flex",
                "h-11",
                "w-11",
                "items-center",
                "justify-center",
                "overflow-hidden",
                "rounded-xl",
                "border",
                "border-slate-200",
                "bg-slate-50",
                "text-[#0f4c81]",
                "shadow-sm",
                "transition-all",
                "duration-300",
                "hover:-translate-y-0.5",
                "hover:border-[#155eef]/40",
                "hover:bg-[#eef5ff]",
                "hover:shadow-[0_8px_20px_rgba(21,94,239,0.12)]",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-[#155eef]",
                "focus-visible:ring-offset-2",
                "xl:hidden",
              ].join(" ")}
            >
              <HiBars3
                size={25}
                className={[
                  "transition-transform",
                  "duration-300",
                  "group-hover/menu:scale-110",
                ].join(" ")}
                aria-hidden="true"
              />

              <span
                aria-hidden="true"
                className={[
                  "absolute",
                  "bottom-1",
                  "h-0.5",
                  "w-3",
                  "rounded-full",
                  "bg-[#c8102e]",
                  "opacity-0",
                  "transition-all",
                  "duration-300",
                  "group-hover/menu:opacity-100",
                ].join(" ")}
              />
            </button>
          </div>
        </Container>

        {/* Bottom glow */}

        <div
          aria-hidden="true"
          className={[
            "pointer-events-none",
            "absolute",
            "bottom-0",
            "left-0",
            "right-0",
            "h-px",
            "bg-gradient-to-r",
            "from-transparent",
            "via-[#155eef]/20",
            "to-transparent",
          ].join(" ")}
        />
      </nav>

      <MobileMenu
        open={menuOpen}
        setOpen={setMenuOpen}
      />
    </>
  );
}
