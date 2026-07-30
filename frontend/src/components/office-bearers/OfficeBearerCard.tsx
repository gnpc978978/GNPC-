"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Member } from "@/types/member";

export default function OfficeBearerCard({ member }: { member: Member }) { return <motion.article whileHover={{ y: -5, scale: 1.015 }} transition={{ duration: 0.25 }}><Link href={`/office-bearers/${member._id}`} className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-xl"><div className="relative aspect-[4/5] sm:aspect-square bg-slate-100"><Image src={member.photo} alt={member.fullName} fill sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" /></div><div className="p-5"><h3 className="text-lg font-bold text-slate-900">{member.fullName}</h3><p className="mt-1 text-sm font-semibold text-blue-700">{member.designation || "Office Bearer"}</p><p className="mt-1 line-clamp-1 text-sm text-slate-500">{member.organization || "Greater Noida Press Club"}</p></div></Link></motion.article>; }
