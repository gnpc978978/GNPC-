"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HiArrowUpRight, HiBars3 } from "react-icons/hi2";
import { navigation } from "@/data/navigation";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import NavLink from "./NavLink";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <div className="w-full px-3 sm:px-5 lg:px-7">
        <nav aria-label="Primary navigation" className="relative z-[120] mx-auto w-full max-w-[1320px] overflow-hidden rounded-[0_0_24px_24px] border border-white/10 bg-[#0b1f3a]/95 text-white shadow-[0_18px_50px_rgba(11,31,58,.24)] backdrop-blur-2xl">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a45c] to-transparent" />
          <div className="flex min-h-[70px] items-center justify-between gap-4 px-4 sm:min-h-[78px] sm:px-6 lg:px-8">
            <Link href="/" aria-label="Greater Noida Press Club home" className="shrink-0">
              <div className="rounded-xl bg-white px-2.5 py-1.5 transition-transform duration-300 hover:-translate-y-0.5">
                <Logo variant="dark" />
              </div>
            </Link>

            <div className="hidden flex-1 items-center justify-center xl:flex">
              <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.06] p-1">
                {navigation.map((item) => (
                  <NavLink key={item.name} href={item.href} light>
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="hidden shrink-0 xl:block">
              <Button href="/admin/login" variant="outline" size="md" className="border-white/25 bg-white/[0.05] text-xs tracking-[0.06em] text-white hover:border-[#c9a45c] hover:bg-[#c9a45c] hover:text-[#0b1f3a]">
                Admin Login <HiArrowUpRight size={16} aria-hidden="true" />
              </Button>
            </div>

            <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open navigation menu" aria-expanded={menuOpen} aria-controls="mobile-navigation" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.07] text-white transition hover:border-[#c9a45c] hover:bg-[#c9a45c] hover:text-[#0b1f3a] focus-visible:outline-none xl:hidden">
              <HiBars3 size={24} aria-hidden="true" />
            </button>
          </div>
        </nav>
      </div>
      <MobileMenu open={menuOpen} setOpen={setMenuOpen} />
    </>
  );
}
