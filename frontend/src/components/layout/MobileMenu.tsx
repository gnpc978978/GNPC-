"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { HiXMark } from "react-icons/hi2";
import { navigation } from "@/data/navigation";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";

type Props = { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> };

export default function MobileMenu({ open, setOpen }: Props) {
  const pathname = usePathname();
  const { settings } = useWebsiteSettings();

  return <AnimatePresence>{open && <>
    <motion.button type="button" aria-label="Close navigation menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setOpen(false)} className="fixed inset-0 z-[998] cursor-default bg-slate-950/35 backdrop-blur-sm min-[1440px]:hidden" />
    <motion.aside id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Navigation menu" initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 320 }} className="fixed bottom-0 right-0 top-0 z-[999] flex w-full max-w-sm flex-col bg-white shadow-2xl min-[1440px]:hidden">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5"><div><p className="text-base font-bold text-slate-900">{settings.siteName || "Press Club"}</p><p className="mt-0.5 text-sm text-slate-500">Navigation</p></div><button type="button" onClick={() => setOpen(false)} aria-label="Close navigation menu" className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><HiXMark size={26} aria-hidden="true" /></button></div>
      <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto px-5 py-5">{navigation.map((item, index) => { const active = pathname === item.href; return <motion.div key={item.name} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: index * 0.035 }}><Link href={item.href} onClick={() => setOpen(false)} className={`mb-1.5 flex rounded-xl px-4 py-3 text-base font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${active ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-100 hover:text-blue-700"}`}>{item.name}</Link></motion.div>; })}</nav>
      <div className="border-t border-slate-200 p-5"><motion.div whileTap={{ scale: 0.98 }}><Link href="/admin/login" onClick={() => setOpen(false)} className="flex h-[46px] items-center justify-center rounded-[14px] border border-blue-600 bg-white px-6 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">Login</Link></motion.div></div>
    </motion.aside>
  </>}</AnimatePresence>;
}
