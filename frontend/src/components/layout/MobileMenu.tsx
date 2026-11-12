"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { HiArrowRight, HiChevronDown, HiXMark } from "react-icons/hi2";

import { navigation, type NavigationItem } from "@/data/navigation";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import Logo from "./Logo";

function isActive(pathname: string, href: string) {
  const [targetPath, targetQuery] = href.split("?");
  // Query-tab destinations share a pathname; keep their parent active
  // without marking every child tab as selected.
  return pathname === targetPath && !targetQuery;
}

function MobileNavigationItem({
  item,
  pathname,
  setOpen,
}: {
  item: NavigationItem;
  pathname: string;
  setOpen: (value: boolean) => void;
}) {
  const active = item.children?.length
    ? item.children.some((child) => isActive(pathname, child.href)) ||
      pathname === item.href
    : isActive(pathname, item.href);

  const [expanded, setExpanded] = useState(active);

  useEffect(() => {
    if (active) setExpanded(true);
  }, [active]);

  if (!item.children?.length) {
    return (
      <Link
        href={item.href}
        onClick={() => setOpen(false)}
        aria-current={active ? "page" : undefined}
        className={[
          "group flex items-center justify-between rounded-2xl border px-4 py-4 transition",
          active
            ? "border-[#c9a45c]/35 bg-[#c9a45c]/10 text-[#e8d7ad]"
            : "border-white/5 text-white/75 hover:border-white/10 hover:bg-white/[.05] hover:text-white",
        ].join(" ")}
      >
        <span className="text-[15px] font-bold">{item.name}</span>
        <HiArrowRight size={17} className="transition group-hover:translate-x-1" />
      </Link>
    );
  }

  return (
    <div className="rounded-2xl border border-white/5">
      <div className="flex items-center gap-2 px-4">
        <Link
          href={item.href}
          onClick={() => setOpen(false)}
          className={[
            "min-w-0 flex-1 py-4 text-[15px] font-bold",
            active ? "text-[#e8d7ad]" : "text-white/80",
          ].join(" ")}
        >
          {item.name}
        </Link>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-label={`${expanded ? "Collapse" : "Expand"} ${item.name} links`}
          aria-expanded={expanded}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white/65 hover:bg-white/[.06] hover:text-white"
        >
          <HiChevronDown
            size={19}
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mx-4 mb-3 space-y-1 border-l border-white/10 pl-3">
              {item.children.map((child) => {
                const childActive = isActive(pathname, child.href);
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setOpen(false)}
                    aria-current={childActive ? "page" : undefined}
                    className={[
                      "block rounded-xl px-3 py-3 text-sm font-semibold transition",
                      childActive
                        ? "bg-[#c9a45c]/10 text-[#e8d7ad]"
                        : "text-white/60 hover:bg-white/[.05] hover:text-white",
                    ].join(" ")}
                  >
                    {child.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MobileMenu({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const pathname = usePathname();
  const { settings } = useWebsiteSettings();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[998] bg-[#061426]/70 backdrop-blur-md xl:hidden"
          />

          <motion.aside
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed bottom-0 right-0 top-0 z-[999] flex w-full max-w-[430px] flex-col overflow-hidden border-l border-white/10 bg-[#0b1f3a] text-white shadow-[-30px_0_80px_rgba(0,0,0,.3)] xl:hidden"
          >
            <div className="h-1 bg-gradient-to-r from-[#c9a45c] via-[#e8d7ad] to-[#c9a45c]" />

            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-7">
              <Logo variant="gold" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[.06] transition hover:border-[#c9a45c] hover:bg-[#c9a45c] hover:text-[#0b1f3a]"
              >
                <HiXMark size={24} />
              </button>
            </div>

            <div className="border-b border-white/10 bg-white/[.03] px-5 py-5 sm:px-7">
              <p className="text-[10px] font-black uppercase tracking-[.22em] text-[#c9a45c]">
                Greater Noida Press Club
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-white/55">
                Journalism, media and community — connected through GNPC.
              </p>
            </div>

            <nav
              aria-label="Mobile navigation"
              className="flex-1 space-y-2 overflow-y-auto px-5 py-6 sm:px-7"
            >
              <p className="mb-4 text-[10px] font-black uppercase tracking-[.2em] text-white/35">
                Explore
              </p>

              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: .04 + index * .04 }}
                >
                  <MobileNavigationItem
                    item={item}
                    pathname={pathname}
                    setOpen={setOpen}
                  />
                </motion.div>
              ))}
            </nav>

            <div className="border-t border-white/10 p-5 sm:p-7">
              <p className="text-center text-[10px] font-bold uppercase tracking-[.14em] text-white/30">
                {settings.siteName || "Greater Noida Press Club"}
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
