"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <><motion.header initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className={`fixed inset-x-0 top-0 z-[100] border-b transition-[background-color,box-shadow,border-color] duration-300 ${scrolled ? "border-slate-200 bg-white/95 shadow-md backdrop-blur-xl" : "border-slate-100 bg-white"}`}><Container><div className="grid h-16 grid-cols-[1fr_auto] items-center sm:h-[76px] min-[1440px]:grid-cols-[minmax(210px,1fr)_auto_minmax(210px,1fr)]"><div className="min-w-0"><Logo /></div><nav aria-label="Primary navigation" className="hidden items-center justify-center gap-7 min-[1440px]:flex">{navigation.map((item, index) => <motion.div key={item.name} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.035 }}><NavLink href={item.href}>{item.name}</NavLink></motion.div>)}</nav><div className="hidden items-center justify-end min-[1440px]:flex"><motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}><Link href="/admin/login" className="inline-flex h-[46px] items-center rounded-[14px] border border-blue-600 bg-white px-6 text-sm font-semibold text-blue-700 transition-colors duration-300 hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">Login</Link></motion.div></div><button type="button" onClick={() => setMenuOpen(true)} aria-label="Open navigation menu" aria-expanded={menuOpen} aria-controls="mobile-navigation" className="justify-self-end rounded-xl p-2.5 text-3xl text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-[1440px]:hidden"><HiBars3 aria-hidden="true" /></button></div></Container></motion.header><MobileMenu open={menuOpen} setOpen={setMenuOpen} /></>;
}
