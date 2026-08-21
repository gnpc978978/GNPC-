"use client";

import { motion } from "framer-motion";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";

export type PageHeroBreadcrumb={label:string;href?:string};
export type PageHeroProps={contentKey?:string;eyebrow?:string;title:string;description?:string;breadcrumbs?:PageHeroBreadcrumb[];actions?:React.ReactNode;align?:"left"|"center";className?:string};

export default function PageHero({contentKey,eyebrow,title,description,actions,align="center",className=""}:PageHeroProps){
  const {settings}=useWebsiteSettings();
  const cmsContent=contentKey?settings.pageContent?.[contentKey]:undefined;
  const resolvedEyebrow=cmsContent?.eyebrow?.trim()||eyebrow;
  const resolvedTitle=cmsContent?.title?.trim()||title;
  const resolvedDescription=cmsContent?.description?.trim()||description;
  const centered=align==="center";
  return (
    <section aria-labelledby="page-hero-title" className={`relative overflow-hidden border-b border-black/10 bg-[#0b1f3a] text-white ${className}`}>
      <div className="absolute inset-0 opacity-30" style={{backgroundImage:"radial-gradient(circle at 15% 20%, rgba(201,164,92,.35), transparent 28%), radial-gradient(circle at 90% 70%, rgba(255,255,255,.12), transparent 25%)"}}/>
      <div className="absolute inset-0 opacity-[.07]" style={{backgroundImage:"linear-gradient(rgba(255,255,255,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.8) 1px,transparent 1px)",backgroundSize:"56px 56px"}}/>
      <div className="relative mx-auto max-w-[1320px] px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
        <div className={`flex w-full max-w-4xl flex-col ${centered?"mx-auto items-center text-center":"items-start text-left"}`}>
          {resolvedEyebrow&&<div className="flex items-center gap-3 text-[#e8d7ad]"><span className="h-px w-10 bg-[#c9a45c]"/><span className="text-[10px] font-black uppercase tracking-[.24em]">{resolvedEyebrow}</span><span className="h-px w-10 bg-[#c9a45c]"/></div>}
          <motion.h1 id="page-hero-title" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.55,ease:[.22,1,.36,1]}} className={`mt-5 text-4xl font-black leading-[.98] tracking-[-.055em] text-white sm:text-5xl lg:text-7xl ${resolvedEyebrow?"":"mt-0"}`}>{resolvedTitle}</motion.h1>
          {resolvedDescription&&<motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.55,delay:.08}} className={`mt-6 max-w-2xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8 ${centered?"text-center":"text-left"}`}>{resolvedDescription}</motion.p>}
          {actions&&<div className={`mt-8 flex flex-wrap gap-3 ${centered?"justify-center":"justify-start"}`}>{actions}</div>}
        </div>
      </div>
    </section>
  );
}
