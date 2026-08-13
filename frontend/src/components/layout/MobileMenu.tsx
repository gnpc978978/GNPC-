"use client";

import Link from "next/link";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import { usePathname } from "next/navigation";

import {
  HiXMark,
} from "react-icons/hi2";

import { navigation } from "@/data/navigation";

import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";

import Logo from "./Logo";

import Button from "@/components/ui/Button";

export default function MobileMenu({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}) {
  const pathname =
    usePathname();

  const { settings } =
    useWebsiteSettings();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* -------------------------------------------
              BACKDROP
             ------------------------------------------- */}
          <motion.button
            type="button"
            aria-label="Close navigation menu"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            onClick={() =>
              setOpen(false)
            }
            className={[
              "fixed",
              "inset-0",

              "z-[998]",

              "cursor-default",

              "bg-slate-950/45",

              "backdrop-blur-sm",

              "min-[1440px]:hidden",
            ].join(" ")}
          />

          {/* -------------------------------------------
              MOBILE DRAWER
             ------------------------------------------- */}
          <motion.aside
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{
              opacity: 0,
              x: "100%",
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: "100%",
            }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 320,
            }}
            className={[
              "fixed",
              "bottom-0",
              "right-0",
              "top-0",

              "z-[999]",

              "flex",
              "w-full",
              "max-w-sm",
              "flex-col",

              "bg-white",

              "shadow-2xl",

              "min-[1440px]:hidden",
            ].join(" ")}
          >
            {/* -----------------------------------------
                HEADER
               ----------------------------------------- */}
            <div
              className={[
                "flex",
                "items-center",
                "justify-between",

                "border-b",
                "border-slate-200",

                "px-5",
                "py-4",
              ].join(" ")}
            >
              <Logo />

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                aria-label="Close navigation menu"
                className={[
                  "flex",
                  "h-10",
                  "w-10",

                  "items-center",
                  "justify-center",

                  "rounded-xl",

                  "border",
                  "border-slate-200",

                  "text-[#0f4c81]",

                  "transition-colors",
                  "duration-200",

                  "hover:border-[#0f4c81]",
                  "hover:bg-[#eaf3fa]",

                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-[#0f4c81]",
                  "focus-visible:ring-offset-2",
                ].join(" ")}
              >
                <HiXMark
                  size={24}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* -----------------------------------------
                NAVIGATION
               ----------------------------------------- */}
            <nav
              aria-label="Mobile navigation"
              className={[
                "flex-1",
                "overflow-y-auto",

                "px-5",
                "py-6",
              ].join(" ")}
            >
              <p className="mb-3 px-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                Navigation
              </p>

              <div className="space-y-1">
                {navigation.map(
                  (item, index) => {
                    const active =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname ===
                            item.href ||
                          pathname.startsWith(
                            `${item.href}/`
                          );

                    return (
                      <motion.div
                        key={
                          item.name
                        }
                        initial={{
                          opacity: 0,
                          x: 12,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          duration: 0.2,
                          delay:
                            index *
                            0.035,
                        }}
                      >
                        <Link
                          href={
                            item.href
                          }
                          onClick={() =>
                            setOpen(
                              false
                            )
                          }
                          aria-current={
                            active
                              ? "page"
                              : undefined
                          }
                          className={[
                            "flex",
                            "items-center",
                            "justify-between",

                            "rounded-xl",

                            "px-4",
                            "py-3.5",

                            "text-[15px]",
                            "font-bold",

                            "transition-all",
                            "duration-200",

                            active
                              ? [
                                  "bg-[#eaf3fa]",
                                  "text-[#0f4c81]",
                                ].join(
                                  " "
                                )
                              : [
                                  "text-slate-700",
                                  "hover:bg-slate-50",
                                  "hover:text-[#0f4c81]",
                                ].join(
                                  " "
                                ),

                            "focus-visible:outline-none",
                            "focus-visible:ring-2",
                            "focus-visible:ring-[#0f4c81]",
                            "focus-visible:ring-offset-2",
                          ].join(" ")}
                        >
                          <span>
                            {item.name}
                          </span>

                          {active && (
                            <span
                              aria-hidden="true"
                              className="h-2 w-2 rounded-full bg-[#0f4c81]"
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  }
                )}
              </div>
            </nav>

            {/* -----------------------------------------
                BOTTOM ACTION
               ----------------------------------------- */}
            <div
              className={[
                "border-t",
                "border-slate-200",

                "p-5",
              ].join(" ")}
            >
              <Link
                href="/admin/login"
                onClick={() =>
                  setOpen(false)
                }
                className="block"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Admin Login
                </Button>
              </Link>

              <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                {settings.siteName ||
                  "Greater Noida Press Club"}
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
