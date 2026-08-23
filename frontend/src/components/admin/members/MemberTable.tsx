"use client";

import Link from "next/link";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import StatusBadge from "./StatusBadge";
import type { Member } from "@/types/member";

interface Props { members: Member[]; onDelete: (id: string) => void; onEdit: (member: Member) => void; }

export default function MemberTable({ members, onDelete, onEdit }: Props) {
  if (!members.length) return <div className="rounded-lg bg-white p-10 text-center text-gray-500 shadow">No Members Found.</div>;
  return <div className="overflow-x-auto rounded-lg bg-white shadow"><table className="min-w-[1050px] w-full text-sm"><thead className="bg-gray-100"><tr>{["Photo", "Name", "Designation", "Email", "Phone Number", "Display Order", "Status", "Created Date", "Actions"].map((heading) => <th key={heading} className="p-3 text-left">{heading}</th>)}</tr></thead><tbody>{members.map((member) => <tr key={member._id} className="border-b"><td className="p-3">{member.photo ? <img src={member.photo} alt={member.name} className="h-12 w-12 rounded-full object-cover" /> : <span className="text-gray-400">No photo</span>}</td><td className="p-3 font-medium">{member.name}</td><td className="p-3">{member.designation}</td><td className="p-3">{member.email}</td><td className="p-3">{member.phone}</td><td className="p-3">{member.displayOrder}</td><td className="p-3"><StatusBadge status={member.status === "active" ? "Active" : "Inactive"} /></td><td className="p-3">{new Date(member.createdAt).toLocaleDateString("en-IN")}</td><td className="flex gap-3 p-3"><Link href={`/admin/members/${member._id}`} className="text-slate-700"><FaEye /></Link><button onClick={() => onEdit(member)} className="text-blue-600"><FaEdit /></button><button onClick={() => onDelete(member._id)} className="text-red-600"><FaTrash /></button></td></tr>)}</tbody></table></div>;
}
