"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Member } from "@/types/member";

export default function OfficeBearerCard({ member }: { member: Member }) { return <motion.article whileHover={{ y: -4 }} transition={{ duration: 0.2 }}><Link href={`/office-bearers/${member._id}`} className="group block h-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-lg"><div className="relative aspect-square bg-slate-100"><Image src={member.photo} alt={member.fullName} fill sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" /></div><div className="p-3 sm:p-4"><h3 className="line-clamp-1 text-sm font-bold text-slate-900 sm:text-base">{member.fullName}</h3><p className="mt-1 line-clamp-1 text-xs font-semibold text-blue-700 sm:text-sm">{member.designation || "Office Bearer"}</p><p className="mt-1 line-clamp-1 text-xs text-slate-500">{member.organization || "Greater Noida Press Club"}</p></div></Link></motion.article>; }
