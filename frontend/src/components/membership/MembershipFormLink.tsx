"use client";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";
import { API_BASE_URL, apiUrl } from "@/services/api";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>,"href"|"children"> & {children:ReactNode; unavailableLabel?:string; unavailableClassName?:string; className?:string};
const available=["gnpc-btn","gnpc-btn-primary","group","inline-flex","max-w-full","min-h-11","items-center","justify-center","gap-2","whitespace-nowrap","rounded-[0.9rem]","border","px-5","py-3","text-sm","font-bold","leading-none","transition-all","duration-200","hover:-translate-y-0.5","focus-visible:outline-none","focus-visible:ring-2","focus-visible:ring-[#d4b06a]","focus-visible:ring-offset-2","[&_svg]:shrink-0","[&_svg]:transition-transform","duration-200","hover:[&_svg]:translate-x-0.5"].join(" ");
const unavailable=["gnpc-btn","inline-flex","max-w-full","min-h-11","items-center","justify-center","gap-2","whitespace-nowrap","rounded-[0.9rem]","border","border-slate-300","bg-slate-100","px-5","py-3","text-sm","font-bold","leading-none","text-slate-500","opacity-70"].join(" ");
const clamp=(c:string)=>[c,"[&>span]:inline-flex","[&>span]:min-w-0","[&>span]:max-w-full","[&>span]:items-center","[&>span]:gap-2","[&>span]:overflow-hidden","[&>span]:text-ellipsis","[&>span]:whitespace-nowrap","[&_svg]:shrink-0"].join(" ");
export default function MembershipFormLink({children,unavailableLabel="Membership Form Coming Soon",unavailableClassName,className,...props}:Props){
 const {settings,loading,error}=useWebsiteSettings();
 if(loading)return <span aria-disabled="true" className={clamp([unavailable,unavailableClassName].filter(Boolean).join(" "))}>Loading membership form...</span>;
 const ok=Boolean(settings.membershipPdf&&API_BASE_URL);
 if(error||!ok)return <span aria-disabled="true" className={clamp([unavailable,unavailableClassName].filter(Boolean).join(" "))}>{unavailableLabel}</span>;
 let href:string; try{href=apiUrl("/settings/membership-form");}catch{return <span aria-disabled="true" className={clamp([unavailable,unavailableClassName].filter(Boolean).join(" "))}>{unavailableLabel}</span>;}
 return <a href={href} target="_blank" rel="noopener noreferrer" className={clamp([available,className].filter(Boolean).join(" "))} {...props}><span className="truncate">{children}</span></a>;
}
