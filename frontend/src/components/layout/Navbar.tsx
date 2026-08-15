"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  HiArrowRight,
  HiBars3,
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
      setScrolled(window.scrollY > 12);
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
          "w-full",
          "border-b",
          "transition-all",
          "duration-300",
          scrolled
            ? [
                "border-slate-200/90",
                "bg-white/95",
                "shadow-[0_12px_35px_rgba(15,23,42,0.10)]",
                "backdrop-blur-xl",
              ].join(" ")
            : [
                "border-slate-200",
                "bg-white",
              ].join(" "),
        ].join(" ")}
      >
        <Container>
          <div
            className={[
              "flex",
              "h-[78px]",
              "items-center",
              "justify-between",
              "gap-5",
              "lg:h-[82px]",
            ].join(" ")}
          >
            {/* =================================================
                LOGO
                ================================================= */}

            <Link
              href="/"
              aria-label="Greater Noida Press Club home"
              className={[
                "group",
                "relative",
                "flex",
                "min-w-0",
                "shrink-0",
                "items-center",
                "rounded-lg",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-[#155eef]",
                "focus-visible:ring-offset-4",
              ].join(" ")}
            >
              <Logo />

              {/* Small editorial underline */}

              <span
                aria-hidden="true"
                className={[
                  "absolute",
                  "-bottom-2",
                  "left-0",
                  "h-0.5",
                  "w-0",
                  "bg-[#c8102e]",
                  "transition-all",
                  "duration-300",
                  "group-hover:w-10",
                ].join(" ")}
              />
            </Link>

            {/* =================================================
                DESKTOP NAV
                ================================================= */}

            <div
              className={[
                "hidden",
                "min-w-0",
                "flex-1",
                "items-center",
                "justify-end",
                "xl:flex",
              ].join(" ")}
            >
              <nav
                aria-label="Desktop navigation"
                className={[
                  "flex",
                  "items-center",
                  "gap-1",
                  "2xl:gap-2",
                ].join(" ")}
              >
                {navigation.map(
                  (item) => (
                    <NavLink
                      key={item.name}
                      href={item.href}
                    >
                      {item.name}
                    </NavLink>
                  )
                )}
              </nav>

              {/* =================================================
                  DIVIDER
                  ================================================= */}

              <div
                aria-hidden="true"
                className={[
                  "mx-4",
                  "h-8",
                  "w-px",
                  "bg-slate-200",
                  "2xl:mx-5",
                ].join(" ")}
              />

              {/* =================================================
                  ADMIN / LOGIN
                  ================================================= */}

              <Link
                href="/admin/login"
                className={[
                  "group",
                  "inline-flex",
                  "h-11",
                  "items-center",
                  "justify-center",
                  "gap-2",
                  "rounded-lg",
                  "border",
                  "border-[#0f4c81]",
                  "bg-[#0f4c81]",
                  "px-4.5",
                  "text-[13px]",
                  "font-extrabold",
                  "tracking-wide",
                  "text-white",
                  "shadow-[0_5px_16px_rgba(15,76,129,0.14)]",
                  "transition-all",
                  "duration-200",
                  "hover:-translate-y-0.5",
                  "hover:bg-[#0b3d68]",
                  "hover:shadow-[0_9px_22px_rgba(15,76,129,0.22)]",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-[#0f4c81]",
                  "focus-visible:ring-offset-2",
                ].join(" ")}
              >
                Login

                <HiArrowRight
                  size={15}
                  aria-hidden="true"
                  className={[
                    "transition-transform",
                    "duration-200",
                    "group-hover:translate-x-0.5",
                  ].join(" ")}
                />
              </Link>
            </div>

            {/* =================================================
                MOBILE MENU BUTTON
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
                "group",
                "flex",
                "h-11",
                "w-11",
                "shrink-0",
                "items-center",
                "justify-center",
                "rounded-lg",
                "border",
                "border-slate-200",
                "bg-white",
                "text-[#0f4c81]",
                "shadow-[0_2px_8px_rgba(15,23,42,0.04)]",
                "transition-all",
                "duration-200",
                "hover:-translate-y-0.5",
                "hover:border-[#0f4c81]",
                "hover:bg-[#eef4ff]",
                "hover:shadow-[0_6px_15px_rgba(15,76,129,0.10)]",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-[#0f4c81]",
                "focus-visible:ring-offset-2",
                "xl:hidden",
              ].join(" ")}
            >
              <HiBars3
                size={25}
                aria-hidden="true"
                className={[
                  "transition-transform",
                  "duration-200",
                  "group-hover:scale-105",
                ].join(" ")}
              />
            </button>
          </div>
        </Container>

        {/* =====================================================
            BOTTOM ACCENT
            ===================================================== */}

        <div
          aria-hidden="true"
          className={[
            "pointer-events-none",
            "absolute",
            "bottom-0",
            "left-0",
            "h-[2px]",
            "w-0",
            "bg-[#c8102e]",
            "transition-all",
            "duration-500",
            scrolled
              ? "w-16"
              : "w-10",
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
