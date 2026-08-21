"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, UserRound } from "lucide-react";

type PersonCardProps = {
  name: string;
  designation?: string;
  organization?: string;
  state?: string;
  photo?: string;
  email?: string;
  phone?: string;
  href?: string;
};

export default function PersonCard({
  name,
  designation,
  organization,
  state,
  photo,
  email,
  phone,
  href,
}: PersonCardProps) {
  const content = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-[#edf2f7]">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#edf2f7] to-[#f7f2e6] text-[#9a7631]">
            <UserRound size={44} strokeWidth={1.5} aria-hidden="true" />
            <span className="text-sm font-bold">{name.charAt(0)}</span>
          </div>
        )}
      </div>

      <div className="min-w-0 p-4 sm:p-5">
        <h3 className="line-clamp-1 text-base font-bold text-slate-950 sm:text-lg">{name}</h3>
        <p className="mt-1 line-clamp-1 text-sm font-semibold text-[#9a7631]">{designation || "GNPC Member"}</p>
        {(organization || state) && (
          <p className="mt-1 line-clamp-1 text-sm text-slate-600">
            {[organization, state].filter(Boolean).join(" · ")}
          </p>
        )}

        {(email || phone) && (
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm text-slate-600">
            {email && (
              <a href={`mailto:${email}`} className="flex min-w-0 items-center gap-2 transition hover:text-[#9a7631]">
                <Mail size={15} className="shrink-0" aria-hidden="true" />
                <span className="truncate">{email}</span>
              </a>
            )}
            {phone && (
              <a href={`tel:${phone}`} className="flex min-w-0 items-center gap-2 transition hover:text-[#9a7631]">
                <Phone size={15} className="shrink-0" aria-hidden="true" />
                <span className="truncate">{phone}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </>
  );

  const className = "group block h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#d4b06a]/60 hover:shadow-md";

  return href ? <Link href={href} className={className}>{content}</Link> : <article className={className}>{content}</article>;
}
