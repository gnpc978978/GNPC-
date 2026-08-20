"use client";

import Link from "next/link";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import { usePathname } from "next/navigation";

import {
  HiArrowRight,
  HiXMark,
} from "react-icons/hi2";

import { navigation } from "@/data/navigation";

import {
  useWebsiteSettings,
} from "@/context/WebsiteSettingsContext";

import Logo from "./Logo";

export default function MobileMenu({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}) {
  const pathname = usePathname();

  const { settings } =
    useWebsiteSettings();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}

          <motion.button
            type="button"
            aria-label="Close navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            className={[
              "fixed",
              "inset-0",
              "z-[998]",
              "cursor-default",
              "bg-[#03111d]/60",
              "backdrop-blur-md",
              "xl:hidden",
            ].join(" ")}
          />

          {/* DRAWER */}

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
              damping: 30,
              stiffness: 280,
            }}
            className={[
              "fixed",
              "bottom-0",
              "right-0",
              "top-0",
              "z-[999]",
              "flex",
              "w-full",
              "max-w-[430px]",
              "flex-col",
              "overflow-hidden",
              "border-l",
              "border-white/10",
              "bg-white",
              "shadow-[-20px_0_60px_rgba(0,0,0,0.18)]",
              "xl:hidden",
            ].join(" ")}
          >
            {/* Top accent */}

            <div
              aria-hidden="true"
              className={[
                "absolute",
                "left-0",
                "right-0",
                "top-0",
                "h-1",
                "bg-gradient-to-r",
                "from-[#0f4c81]",
                "via-[#155eef]",
                "to-[#155eef]",
              ].join(" ")}
            />

            {/* HEADER */}

            <div
              className={[
                "flex",
                "items-center",
                "justify-between",
                "border-b",
                "border-slate-200",
                "px-5",
                "pb-5",
                "pt-6",
                "sm:px-7",
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
                  "group/close",
                  "flex",
                  "h-11",
                  "w-11",
                  "items-center",
                  "justify-center",
                  "rounded-xl",
                  "border",
                  "border-slate-200",
                  "bg-slate-50",
                  "text-[#0f4c81]",
                  "transition-all",
                  "duration-300",
                  "hover:rotate-90",
                  "hover:border-[#155eef]/30",
                  "hover:bg-blue-50",
                  "hover:text-[#155eef]",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-[#155eef]",
                  "focus-visible:ring-offset-2",
                ].join(" ")}
              >
                <HiXMark
                  size={24}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* INTRO */}

            <div
              className={[
                "border-b",
                "border-slate-100",
                "bg-gradient-to-br",
                "from-[#f5f9ff]",
                "via-white",
                "to-[#fff8f8]",
                "px-5",
                "py-5",
                "sm:px-7",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-[#155eef]"
                />

                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#155eef]">
                  Greater Noida Press Club
                </span>
              </div>

              <p className="mt-2 max-w-sm text-sm font-semibold leading-6 text-slate-500">
                Journalism, media and community —
                connected through GNPC.
              </p>
            </div>

            {/* NAVIGATION */}

            <nav
              aria-label="Mobile navigation"
              className={[
                "flex-1",
                "overflow-y-auto",
                "px-5",
                "py-6",
                "sm:px-7",
              ].join(" ")}
            >
              <div className="mb-4 px-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Explore
                </p>
              </div>

              <div className="space-y-2">
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
                        key={item.name}
                        initial={{
                          opacity: 0,
                          x: 24,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          delay:
                            0.05 +
                            index * 0.045,
                          ease: "easeOut",
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={() =>
                            setOpen(false)
                          }
                          aria-current={
                            active
                              ? "page"
                              : undefined
                          }
                          className={[
                            "group/item",
                            "relative",
                            "flex",
                            "items-center",
                            "justify-between",
                            "overflow-hidden",
                            "rounded-xl",
                            "border",
                            "px-4",
                            "py-4",
                            "transition-all",
                            "duration-300",
                            active
                              ? [
                                  "border-blue-100",
                                  "bg-[#f0f6ff]",
                                  "text-[#0f4c81]",
                                  "shadow-[0_6px_20px_rgba(21,94,239,0.08)]",
                                ].join(" ")
                              : [
                                  "border-transparent",
                                  "text-slate-700",
                                  "hover:-translate-x-1",
                                  "hover:border-slate-200",
                                  "hover:bg-slate-50",
                                  "hover:text-[#0f4c81]",
                                ].join(" "),
                            "focus-visible:outline-none",
                            "focus-visible:ring-2",
                            "focus-visible:ring-[#155eef]",
                            "focus-visible:ring-offset-2",
                          ].join(" ")}
                        >
                          {/* Active left rail */}

                          <span
                            aria-hidden="true"
                            className={[
                              "absolute",
                              "bottom-2",
                              "left-0",
                              "top-2",
                              "w-1",
                              "rounded-r-full",
                              "bg-[#155eef]",
                              "transition-all",
                              "duration-300",
                              active
                                ? "opacity-100"
                                : "opacity-0 group-hover/item:opacity-100",
                            ].join(" ")}
                          />

                          <span className="relative z-10 text-[15px] font-bold">
                            {item.name}
                          </span>

                          <HiArrowRight
                            size={17}
                            className={[
                              "relative",
                              "z-10",
                              "text-slate-300",
                              "transition-all",
                              "duration-300",
                              "group-hover/item:translate-x-1",
                              "group-hover/item:text-[#155eef]",
                              active
                                ? "text-[#155eef]"
                                : "",
                            ].join(" ")}
                            aria-hidden="true"
                          />
                        </Link>
                      </motion.div>
                    );
                  }
                )}
              </div>
            </nav>

            {/* FOOTER */}

            <div
              className={[
                "border-t",
                "border-slate-200",
                "bg-slate-50/80",
                "p-5",
                "sm:p-7",
              ].join(" ")}
            >
              <Link
                href="/admin/login"
                onClick={() =>
                  setOpen(false)
                }
                className={[
                  "group/admin",
                  "relative",
                  "flex",
                  "h-12",
                  "w-full",
                  "items-center",
                  "justify-center",
                  "gap-2",
                  "overflow-hidden",
                  "rounded-xl",
                  "bg-[#0f4c81]",
                  "text-sm",
                  "font-extrabold",
                  "text-white",
                  "shadow-[0_8px_24px_rgba(15,76,129,0.18)]",
                  "transition-all",
                  "duration-300",
                  "hover:-translate-y-0.5",
                  "hover:bg-[#0b3d68]",
                  "hover:shadow-[0_12px_30px_rgba(15,76,129,0.25)]",
                ].join(" ")}
              >
                <span className="relative z-10">
                  Admin Login
                </span>

                <HiArrowRight
                  size={16}
                  className={[
                    "relative",
                    "z-10",
                    "transition-transform",
                    "duration-300",
                    "group-hover/admin:translate-x-1",
                  ].join(" ")}
                  aria-hidden="true"
                />
              </Link>

              <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
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
