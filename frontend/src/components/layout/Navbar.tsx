"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HiBars3 } from "react-icons/hi2";

import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

import { navigation } from "@/data/navigation";

import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import NavLink from "./NavLink";

export default function Navbar() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  /*
   * -------------------------------------------------------
   * SCROLL STATE
   * -------------------------------------------------------
   */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(
        window.scrollY > 12
      );
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /*
   * -------------------------------------------------------
   * MOBILE MENU SCROLL LOCK
   * -------------------------------------------------------
   */

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
      <motion.nav
        aria-label="Primary navigation"
        initial={{
          opacity: 0,
          y: -8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
        className={[
          /*
           * IMPORTANT:
           *
           * Do NOT use fixed here.
           *
           * WebsiteLayout controls the fixed header.
           *
           * This navbar therefore remains in normal flow
           * directly underneath TopBar.
           */
          "relative",
          "w-full",

          "border-b",

          "transition-all",
          "duration-300",

          scrolled
            ? [
                "border-slate-200",
                "bg-white/95",
                "shadow-md",
                "backdrop-blur-xl",
              ].join(" ")
            : [
                "border-slate-100",
                "bg-white",
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

              "gap-6",

              "sm:h-[76px]",
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

            <div
              className={[
                "hidden",

                "min-w-0",
                "flex-1",

                "justify-center",

                "min-[1440px]:flex",
              ].join(" ")}
            >
              <nav
                aria-label="Desktop navigation"
                className="flex items-center gap-6 xl:gap-7"
              >
                {navigation.map(
                  (
                    item,
                    index
                  ) => (
                    <motion.div
                      key={item.name}
                      initial={{
                        opacity: 0,
                        y: -6,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.25,
                        delay:
                          index *
                          0.035,
                      }}
                    >
                      <NavLink
                        href={
                          item.href
                        }
                      >
                        {item.name}
                      </NavLink>
                    </motion.div>
                  )
                )}
              </nav>
            </div>

            {/* =================================================
                ADMIN LOGIN
                ================================================= */}

            <div
              className={[
                "hidden",
                "shrink-0",

                "min-[1440px]:block",
              ].join(" ")}
            >
              <Link
                href="/admin/login"
                className="inline-flex"
              >
                <Button
                  variant="outline"
                  size="md"
                >
                  Login
                </Button>
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
              aria-expanded={
                menuOpen
              }
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
                "hover:bg-[#eaf3fa]",

                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-[#0f4c81]",
                "focus-visible:ring-offset-2",

                "min-[1440px]:hidden",
              ].join(" ")}
            >
              <HiBars3
                size={25}
                aria-hidden="true"
              />
            </button>
          </div>
        </Container>
      </motion.nav>

      {/* ===================================================
          MOBILE NAVIGATION
          =================================================== */}

      <MobileMenu
        open={menuOpen}
        setOpen={setMenuOpen}
      />
    </>
  );
}
