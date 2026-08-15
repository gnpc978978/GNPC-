"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HiBars3 } from "react-icons/hi2";

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
      setScrolled(window.scrollY > 8);
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
          "sticky",
          "top-0",
          "z-40",
          "w-full",
          "border-b",
          "transition-all",
          "duration-300",
          scrolled
            ? [
                "border-slate-200/80",
                "bg-white/95",
                "shadow-[0_8px_30px_rgba(15,23,42,0.07)]",
                "backdrop-blur-xl",
              ].join(" ")
            : [
                "border-slate-200/70",
                "bg-white",
                "shadow-[0_1px_2px_rgba(15,23,42,0.02)]",
              ].join(" "),
        ].join(" ")}
      >
        <Container>
          <div
            className={[
              "flex",
              "h-[72px]",
              "items-center",
              "justify-between",
              "gap-5",
              "transition-[height]",
              "duration-300",
              "lg:h-[78px]",
              scrolled
                ? "lg:h-[70px]"
                : "",
            ].join(" ")}
          >
            {/* =================================================
                LOGO
                ================================================= */}

            <div
              className={[
                "min-w-0",
                "shrink-0",
                "transition-transform",
                "duration-300",
                scrolled
                  ? "scale-[0.97]"
                  : "scale-100",
              ].join(" ")}
            >
              <Logo />
            </div>

            {/* =================================================
                DESKTOP NAVIGATION
                ================================================= */}

            <div className="hidden min-w-0 flex-1 items-center justify-end xl:flex">
              <nav
                aria-label="Desktop navigation"
                className={[
                  "flex",
                  "items-center",
                  "gap-1",
                  "2xl:gap-2",
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
              </nav>

              {/* =================================================
                  LOGIN
                  ================================================= */}

              <Link
                href="/admin/login"
                className={[
                  "group",
                  "ml-4",
                  "inline-flex",
                  "h-10",
                  "items-center",
                  "justify-center",
                  "gap-2",
                  "rounded-lg",
                  "border",
                  "border-[#0f4c81]",
                  "bg-[#0f4c81]",
                  "px-4",
                  "text-[13px]",
                  "font-bold",
                  "tracking-[0.01em]",
                  "text-white",
                  "shadow-[0_4px_14px_rgba(15,76,129,0.14)]",
                  "transition-all",
                  "duration-200",
                  "hover:-translate-y-0.5",
                  "hover:bg-[#0b3d68]",
                  "hover:shadow-[0_8px_20px_rgba(15,76,129,0.20)]",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-[#0f4c81]",
                  "focus-visible:ring-offset-2",
                ].join(" ")}
              >
                <span>Login</span>

                <span
                  aria-hidden="true"
                  className={[
                    "text-white/60",
                    "transition-transform",
                    "duration-200",
                    "group-hover:translate-x-0.5",
                  ].join(" ")}
                >
                  →
                </span>
              </Link>
            </div>

            {/* =================================================
                MOBILE MENU BUTTON
                ================================================= */}

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className={[
                "group",
                "flex",
                "h-11",
                "w-11",
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
                "hover:shadow-[0_6px_16px_rgba(15,76,129,0.10)]",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-[#0f4c81]",
                "focus-visible:ring-offset-2",
                "xl:hidden",
              ].join(" ")}
            >
              <HiBars3
                size={24}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:scale-105"
              />
            </button>
          </div>
        </Container>

        {/* Subtle bottom highlight */}
        <div
          aria-hidden="true"
          className={[
            "pointer-events-none",
            "absolute",
            "bottom-0",
            "left-0",
            "h-px",
            "w-full",
            "bg-gradient-to-r",
            "from-transparent",
            "via-[#155eef]/10",
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
