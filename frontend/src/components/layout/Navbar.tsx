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
          "relative",
          "w-full",
          "border-b",
          "border-slate-200",
          "bg-white",
          "transition-shadow",
          "duration-200",
          scrolled
            ? "shadow-[0_4px_18px_rgba(15,76,129,0.08)]"
            : "shadow-none",
        ].join(" ")}
      >
        <Container>
          <div
            className={[
              "flex",
              "h-[74px]",
              "items-center",
              "justify-between",
              "gap-5",
              "lg:h-[76px]",
            ].join(" ")}
          >
            {/* =================================================
                LOGO
                ================================================= */}

            <div className="min-w-0 shrink-0">
              <Logo />
            </div>

            {/* =================================================
                DESKTOP NAVIGATION
                ================================================= */}

            <div className="hidden min-w-0 flex-1 items-center justify-end xl:flex">
              <nav
                aria-label="Desktop navigation"
                className="flex items-center gap-4 2xl:gap-6"
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
                  "ml-5",
                  "inline-flex",
                  "h-11",
                  "items-center",
                  "justify-center",
                  "rounded-xl",
                  "border",
                  "border-[#0f4c81]",
                  "bg-white",
                  "px-5",
                  "text-sm",
                  "font-bold",
                  "text-[#0f4c81]",
                  "transition-all",
                  "duration-200",
                  "hover:bg-[#0f4c81]",
                  "hover:text-white",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-[#0f4c81]",
                  "focus-visible:ring-offset-2",
                ].join(" ")}
              >
                Login
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
                "flex",
                "h-11",
                "w-11",
                "items-center",
                "justify-center",
                "rounded-xl",
                "border",
                "border-slate-200",
                "bg-white",
                "text-[#0f4c81]",
                "transition-all",
                "duration-200",
                "hover:border-[#0f4c81]",
                "hover:bg-[#eef6fc]",
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
              />
            </button>
          </div>
        </Container>
      </nav>

      <MobileMenu
        open={menuOpen}
        setOpen={setMenuOpen}
      />
    </>
  );
}
