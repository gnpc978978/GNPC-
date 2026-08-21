"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { HiArrowRight, HiXMark } from "react-icons/hi2";
import { navigation } from "@/data/navigation";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import Logo from "./Logo";

export default function MobileMenu({open,setOpen}:{open:boolean;setOpen:React.Dispatch<React.SetStateAction<boolean>>}) {
 const pathname=usePathname(); const {settings}=useWebsiteSettings();
 return <AnimatePresence>{open&&<>
  <motion.button type="button" aria-label="Close navigation menu" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setOpen(false)} className="fixed inset-0 z-[998] bg-[#061426]/70 backdrop-blur-md xl:hidden"/>
  <motion.aside id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Navigation menu" initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{type:"spring",damping:30,stiffness:280}} className="fixed bottom-0 right-0 top-0 z-[999] flex w-full max-w-[430px] flex-col overflow-hidden border-l border-white/10 bg-[#0b1f3a] text-white shadow-[-30px_0_80px_rgba(0,0,0,.3)] xl:hidden">
   <div className="h-1 bg-gradient-to-r from-[#c9a45c] via-[#e8d7ad] to-[#c9a45c]"/>
   <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-7">
    <Link href="/" onClick={()=>setOpen(false)} className="rounded-xl bg-white p-2"><Logo/></Link>
    <button type="button" onClick={()=>setOpen(false)} aria-label="Close navigation menu" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[.06] transition hover:border-[#c9a45c] hover:bg-[#c9a45c] hover:text-[#0b1f3a]"><HiXMark size={24}/></button>
   </div>
   <div className="border-b border-white/10 bg-white/[.03] px-5 py-5 sm:px-7"><p className="text-[10px] font-black uppercase tracking-[.22em] text-[#c9a45c]">Greater Noida Press Club</p><p className="mt-2 text-sm font-semibold leading-6 text-white/55">Journalism, media and community — connected through GNPC.</p></div>
   <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto px-5 py-6 sm:px-7"><p className="mb-4 text-[10px] font-black uppercase tracking-[.2em] text-white/35">Explore</p><div className="space-y-2">
    {navigation.map((item,index)=>{const active=item.href==="/" ? pathname==="/" : pathname===item.href||pathname.startsWith(`${item.href}/`); return <motion.div key={item.name} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:.04+index*.04}}><Link href={item.href} onClick={()=>setOpen(false)} aria-current={active?"page":undefined} className={`group flex items-center justify-between rounded-2xl border px-4 py-4 transition ${active?"border-[#c9a45c]/35 bg-[#c9a45c]/10 text-[#e8d7ad]":"border-white/5 text-white/75 hover:border-white/10 hover:bg-white/[.05] hover:text-white"}`}><span className="text-[15px] font-bold">{item.name}</span><HiArrowRight size={17} className="transition group-hover:translate-x-1"/></Link></motion.div>})}
   </div></nav>
   <div className="border-t border-white/10 p-5 sm:p-7"><Link href="/admin/login" onClick={()=>setOpen(false)} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#c9a45c] text-sm font-extrabold text-[#0b1f3a] transition hover:-translate-y-0.5 hover:bg-[#e8d7ad]">Admin Login <HiArrowRight size={16}/></Link><p className="mt-4 text-center text-[10px] font-bold uppercase tracking-[.14em] text-white/30">{settings.siteName||"Greater Noida Press Club"}</p></div>
  </motion.aside>
 </>}</AnimatePresence>;
}
