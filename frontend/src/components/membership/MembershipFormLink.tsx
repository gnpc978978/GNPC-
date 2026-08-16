"use client";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import { API_BASE_URL, apiUrl } from "@/services/api";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>,"href"|"children"> & {children:ReactNode; unavailableLabel?:string; unavailableClassName?:string; className?:string};
const available=["inline-flex","min-h-12","min-w-[11.5rem]","items-center","justify-center","gap-2","whitespace-nowrap","shrink-0","rounded-full","border","border-white","bg-white","px-6","py-3.5","text-sm","font-extrabold","leading-none","text-[#171717]","shadow-[0_10px_28px_rgba(23,23,23,0.10)]","transition-all","duration-300","hover:-translate-y-0.5","hover:bg-[#f7f2e9]","focus-visible:outline-none","focus-visible:ring-2","focus-visible:ring-[#839669]","focus-visible:ring-offset-2"].join(" ");
const unavailable=["inline-flex","min-h-12","min-w-[11.5rem]","items-center","justify-center","whitespace-nowrap","shrink-0","rounded-full","border","border-black/10","bg-white","px-6","py-3.5","text-sm","font-extrabold","leading-none","text-[#171717]","opacity-60"].join(" ");
const clamp=(c:string)=>[c,"[&>span]:min-w-0","[&>span]:max-w-full","[&>span]:overflow-hidden","[&>span]:text-ellipsis","[&>span]:whitespace-nowrap"].join(" ");
export default function MembershipFormLink({children,unavailableLabel="Membership Form Coming Soon",unavailableClassName,className,...props}:Props){
 const {settings,loading,error}=useWebsiteSettings();
 if(loading)return <span aria-disabled="true" className={clamp(unavailableClassName||unavailable)}>Loading membership form...</span>;
 const ok=Boolean(settings.membershipPdf&&API_BASE_URL);
 if(error||!ok)return <span aria-disabled="true" className={clamp(unavailableClassName||unavailable)}>{unavailableLabel}</span>;
 let href:string; try{href=apiUrl("/settings/membership-form");}catch{return <span aria-disabled="true" className={clamp(unavailableClassName||unavailable)}>{unavailableLabel}</span>;}
 return <a href={href} target="_blank" rel="noopener noreferrer" className={clamp(className||available)} {...props}><span className="truncate">{children}</span></a>;
}
