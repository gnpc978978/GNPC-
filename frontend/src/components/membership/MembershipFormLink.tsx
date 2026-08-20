"use client";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import { API_BASE_URL, apiUrl } from "@/services/api";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>,"href"|"children"> & {children:ReactNode; unavailableLabel?:string; unavailableClassName?:string; className?:string};
const available=["gnpc-btn","inline-flex","max-w-full","min-h-11","items-center","justify-center","gap-2","whitespace-nowrap","rounded-lg","border","border-[#155eef]","bg-[#155eef]","px-5","py-3","text-sm","font-extrabold","leading-none","text-white","shadow-[0_6px_18px_rgba(15,23,42,0.10)]","transition-all","duration-300","hover:-translate-y-0.5","hover:bg-[#004eeb]","focus-visible:outline-none","focus-visible:ring-2","focus-visible:ring-[#155eef]","focus-visible:ring-offset-2"].join(" ");
const unavailable=["inline-flex","max-w-full","min-h-11","items-center","justify-center","gap-2","whitespace-nowrap","rounded-lg","border","border-slate-300","bg-slate-100","px-5","py-3","text-sm","font-extrabold","leading-none","text-slate-500","opacity-70"].join(" ");
const clamp=(c:string)=>[c,"[&>span]:inline-flex","[&>span]:min-w-0","[&>span]:max-w-full","[&>span]:items-center","[&>span]:gap-2","[&>span]:overflow-hidden","[&>span]:text-ellipsis","[&>span]:whitespace-nowrap","[&_svg]:shrink-0"].join(" ");
export default function MembershipFormLink({children,unavailableLabel="Membership Form Coming Soon",unavailableClassName,className,...props}:Props){
 const {settings,loading,error}=useWebsiteSettings();
 if(loading)return <span aria-disabled="true" className={clamp(unavailableClassName||unavailable)}>Loading membership form...</span>;
 const ok=Boolean(settings.membershipPdf&&API_BASE_URL);
 if(error||!ok)return <span aria-disabled="true" className={clamp(unavailableClassName||unavailable)}>{unavailableLabel}</span>;
 let href:string; try{href=apiUrl("/settings/membership-form");}catch{return <span aria-disabled="true" className={clamp(unavailableClassName||unavailable)}>{unavailableLabel}</span>;}
 return <a href={href} target="_blank" rel="noopener noreferrer" className={clamp(className||available)} {...props}><span className="truncate">{children}</span></a>;
}
